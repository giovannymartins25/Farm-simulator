import { TILE } from './serverPhysics.js';

function getAutoDriveAxis(heading) {
    return Math.abs(Math.cos(heading)) >= 0.5 ? 'horizontal' : 'vertical';
}

function snapAngleToCardinal(angle) {
    const CARDINAL_HEADINGS = [0, Math.PI / 2, Math.PI, -Math.PI / 2, Math.PI * 2];
    return CARDINAL_HEADINGS.reduce((closest, candidate) => {
        let closestDiff = Math.abs((angle - closest) % (Math.PI*2));
        if (closestDiff > Math.PI) closestDiff = Math.PI*2 - closestDiff;
        let candidateDiff = Math.abs((angle - candidate) % (Math.PI*2));
        if (candidateDiff > Math.PI) candidateDiff = Math.PI*2 - candidateDiff;
        return candidateDiff < closestDiff ? candidate : closest;
    }, CARDINAL_HEADINGS[0]);
}

function getOwnedFieldAtPoint(room, CATALOG, x, y) {
    for (const fid of room.farm.unlockedLands) {
        const land = CATALOG.lands[fid];
        if (land && x >= land.x && x <= land.x + land.w && y >= land.y && y <= land.y + land.h) {
            return { id: fid, land };
        }
    }
    return null;
}

function shouldWorkTile(veh, room, CATALOG, tx, ty) {
    const soilKey = `${tx},${ty}`;
    const soil = room.farm.soil[soilKey];
    const st = typeof soil === 'object' ? soil.state : (soil || 'normal');

    let inField = false;
    for (const fid of room.farm.unlockedLands) {
        const f = CATALOG.lands[fid];
        if (f && tx >= f.x && (tx + 64) <= (f.x + f.w) && ty >= f.y && (ty + 64) <= (f.y + f.h)) {
            inField = true;
            break;
        }
    }
    if (!inField) return false;

    if (veh.autoDriveEnabled && veh.autoDriveState?.workedTiles?.has(soilKey)) return false;

    if (veh.modelId.includes('harvester')) {
        const crop = room.farm.plantedCrops.find(c => Math.abs(c.x - tx) < 5 && Math.abs(c.y - ty) < 5);
        return crop && crop.isReady && !crop.isDead;
    }

    if (!veh.attachedImplementId) return false;
    const imp = room.implements[veh.attachedImplementId];
    if (!imp) return false;
    const model = CATALOG.implements[imp.modelId];
    if (!model) return false;

    const type = model.type;
    if (type === 'plow') return st !== 'plowed';
    if (type === 'harrow') return st === 'plowed';
    if (type === 'seeder') return st === 'harrowed';

    return false;
}

function triggerAutoDriveFallback(veh, room, CATALOG) {
    if (!veh.autoDriveState) return;
    const state = veh.autoDriveState;
    state.recoveryAttempts = (state.recoveryAttempts || 0) + 1;
    if (state.recoveryAttempts >= 5) {
        veh.autoDriveEnabled = false;
        veh.velocity = 0;
        veh.inputs = { up: false, down: false, left: false, right: false, shift: false, space: false };
        return;
    }

    const fieldInfo = getOwnedFieldAtPoint(room, CATALOG, veh.x, veh.y);
    if (!fieldInfo) {
        veh.autoDriveEnabled = false;
        veh.velocity = 0;
        return;
    }

    let targetTile = null;
    let maxScore = -Infinity;
    const startX = Math.floor(fieldInfo.land.x / TILE) * TILE;
    const startY = Math.floor(fieldInfo.land.y / TILE) * TILE;
    const endX = startX + fieldInfo.land.w;
    const endY = startY + fieldInfo.land.h;

    for (let y = startY; y < endY; y += TILE) {
        for (let x = startX; x < endX; x += TILE) {
            if (shouldWorkTile(veh, room, CATALOG, x, y)) {
                const dist = Math.hypot(x - veh.x, y - veh.y);
                let score = 10000 - dist;
                if (score > maxScore) {
                    maxScore = score;
                    targetTile = { x: x + TILE / 2, y: y + TILE / 2 };
                }
            }
        }
    }

    if (targetTile) {
        state.mode = 'recovery';
        state.targetTile = targetTile;
        if (veh.modelId.includes('harvester')) veh.toolOn = false;
        else if (veh.attachedImplementId) room.implements[veh.attachedImplementId].isOn = false;
    } else {
        veh.autoDriveEnabled = false;
        veh.velocity = 0;
    }
}

export function updateAutoDriveServer(veh, room, CATALOG) {
    if (!veh.autoDriveEnabled || !veh.autoDriveState) return;

    const state = veh.autoDriveState;
    const activeField = getOwnedFieldAtPoint(room, CATALOG, veh.x, veh.y);

    if (!activeField || activeField.id !== state.fieldId) {
        veh.autoDriveEnabled = false;
        veh.velocity = 0;
        return;
    }

    if (state.mode === 'working') {
        const field = state.field || activeField.land;
        const axis = state.axis || getAutoDriveAxis(snapAngleToCardinal(veh.rotation));
        
        const forwardBounds = axis === 'horizontal'
            ? { min: field.x, max: field.x + field.w }
            : { min: field.y, max: field.y + field.h };

        const forwardValue = axis === 'horizontal' ? veh.x : veh.y;
        const movingPositive = axis === 'horizontal'
            ? Math.cos(veh.rotation) >= 0
            : Math.sin(veh.rotation) >= 0;

        const remaining = movingPositive ? forwardBounds.max - forwardValue : forwardValue - forwardBounds.min;

        if (remaining <= TILE * 0.2) {
            triggerAutoDriveFallback(veh, room, CATALOG);
            return;
        }

        // Steer to center lane
        const crossValue = axis === 'horizontal' ? veh.y : veh.x;
        const targetCross = state.laneCenter || crossValue;
        
        const targetAngle = axis === 'horizontal' ? (movingPositive ? 0 : Math.PI) : (movingPositive ? Math.PI/2 : -Math.PI/2);
        let angleDiff = targetAngle - veh.rotation;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

        veh.inputs.up = true;
        veh.inputs.down = false;

        const crossDiff = targetCross - crossValue;
        if (Math.abs(crossDiff) > 2) {
             const neededTurn = axis === 'horizontal' ? (movingPositive ? crossDiff : -crossDiff) : (movingPositive ? -crossDiff : crossDiff);
             veh.inputs.left = neededTurn < 0;
             veh.inputs.right = neededTurn > 0;
        } else {
             veh.inputs.left = angleDiff > 0.05;
             veh.inputs.right = angleDiff < -0.05;
        }

        // Work the tile
        const tx = Math.floor(veh.x / TILE) * TILE;
        const ty = Math.floor(veh.y / TILE) * TILE;
        
        if (veh.modelId.includes('harvester') && veh.toolOn) {
            const cropIdx = room.farm.plantedCrops.findIndex(c => Math.abs(c.x - tx) < 5 && Math.abs(c.y - ty) < 5);
            if (cropIdx !== -1) {
                const c = room.farm.plantedCrops[cropIdx];
                if ((c.isReady && !c.isDead) || c.isDead) {
                    if (c.isReady && !c.isDead) room.farm.harvesterStorage = (room.farm.harvesterStorage || 0) + 1;
                    room.farm.plantedCrops.splice(cropIdx, 1);
                    room.farm.soil[`${tx},${ty}`] = { state: 'normal', dir: null };
                    state.workedTiles.add(`${tx},${ty}`);
                }
            }
        } else if (veh.attachedImplementId) {
            const imp = room.implements[veh.attachedImplementId];
            if (imp && imp.isOn) {
                 const model = CATALOG.implements[imp.modelId];
                 const type = model?.type;
                 const key = `${tx},${ty}`;
                 const curSt = typeof room.farm.soil[key] === 'object' ? room.farm.soil[key].state : (room.farm.soil[key] || 'normal');
                 
                 if (type === 'plow' && curSt !== 'plowed') {
                     room.farm.soil[key] = { state: 'plowed', dir: axis === 'horizontal' ? 'h' : 'v' };
                     state.workedTiles.add(key);
                 } else if (type === 'harrow' && curSt === 'plowed') {
                     room.farm.soil[key] = { state: 'harrowed', dir: axis === 'horizontal' ? 'h' : 'v' };
                     state.workedTiles.add(key);
                 } else if (type === 'seeder' && curSt === 'harrowed' && imp.seedStorage > 0 && room.weather !== '🔥 Seca') {
                     imp.seedStorage--;
                     room.farm.soil[key] = { state: 'planted', dir: axis === 'horizontal' ? 'h' : 'v' };
                     room.farm.plantedCrops.push({ x: tx, y: ty, time: room.time, growthStage: 0, isReady: false, isDead: false });
                     state.workedTiles.add(key);
                 }
            }
        }

    } else if (state.mode === 'recovery') {
        const target = state.targetTile;
        if (!target) {
            triggerAutoDriveFallback(veh, room, CATALOG);
            return;
        }

        const dist = Math.hypot(target.x - veh.x, target.y - veh.y);
        if (dist < TILE) {
            state.mode = 'working';
            state.recoveryAttempts = 0;
            if (veh.modelId.includes('harvester')) veh.toolOn = true;
            else if (veh.attachedImplementId) room.implements[veh.attachedImplementId].isOn = true;
            
            const targetAngle = snapAngleToCardinal(veh.rotation);
            state.axis = getAutoDriveAxis(targetAngle);
            const crossValue = state.axis === 'horizontal' ? veh.y : veh.x;
            state.laneCenter = crossValue; // simplify lane center logic
        } else {
            const targetAngle = Math.atan2(target.y - veh.y, target.x - veh.x);
            let angleDiff = targetAngle - veh.rotation;
            angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

            veh.inputs.up = true;
            veh.inputs.down = false;
            if (Math.abs(angleDiff) > 0.1) {
                veh.inputs.left = angleDiff < 0;
                veh.inputs.right = angleDiff > 0;
            } else {
                veh.inputs.left = false;
                veh.inputs.right = false;
            }
        }
    }
}

import { updateAutoDriveServer } from './serverAutodrive.js';

export const RATIOS_4 = [0, 0.25, 0.50, 0.75, 1.0];
export const RATIOS_6 = [0, 0.15, 0.28, 0.42, 0.58, 0.74, 0.88];
export const TILE = 64;

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }
function lerp(p0, p1, t) { return p0 + (p1 - p0) * t; }
function rotateAngleToward(currentAngle, targetAngle, maxRotation) {
    let diff = targetAngle - currentAngle;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    if (Math.abs(diff) <= maxRotation) return targetAngle;
    return currentAngle + Math.sign(diff) * maxRotation;
}
function normalizeAngle(angle) {
    angle = angle % (Math.PI * 2);
    if (angle < 0) angle += Math.PI * 2;
    return angle;
}

export function updateVehiclePhysicsServer(veh, room, CATALOG, delta = 50, io = null, roomId = null) {
    const m = CATALOG.vehicles[veh.modelId];
    if (!m) return;

    const dtSec = delta / 1000;
    const frameMult = dtSec * 60; // 1 at 60fps

    // Inputs (from server stored inputs)
    const inputs = veh.inputs || { up: false, down: false, left: false, right: false, shift: false, space: false };
    veh.inputs = inputs;

    if (veh.autoDriveEnabled) {
        updateAutoDriveServer(veh, room, CATALOG);
    }

    const throttleForward = inputs.up;
    const throttleReverse = inputs.down;
    const clutchPressed = inputs.shift;
    const braking = inputs.space;

    const engineOn = veh.engineOn;
    const maxSpeed = m.speed;
    const ratios = m.gears === 6 ? RATIOS_6 : RATIOS_4;
    
    // Iniciar marcha
    if (!veh.gear) veh.gear = 1;
    
    // Auto gear shifting
    const transMode = veh.autoShift ? 'auto' : 'manual';
    if (transMode === 'auto' && engineOn && !clutchPressed) {
        if (veh.gear === 0) veh.gear = 1;
        const upShiftRPM = 2400;
        const downShiftRPM = (veh.gear >= 5) ? 1600 : 1300;
        const isMoving = Math.abs(veh.velocity) > 0.1;

        if (veh.rpm > upShiftRPM && veh.gear < (m.gears || 4) && isMoving) {
            veh.gear++;
            veh.rpm -= 800;
        } else if (veh.rpm < downShiftRPM && veh.gear > 1) {
            veh.gear--;
            veh.rpm += 600;
        }
    }

    let gearMaxSpeed = maxSpeed * (ratios[veh.gear] || 0.25);

    // Gearbox logic
    let activeGearbox = veh.gearbox || 'simples';
    let speedMult = 1.0;
    let torqueMult = 1.0;
    if (activeGearbox === 'reduzida') {
        speedMult = 0.5;
        torqueMult = 1.5;
    }

    gearMaxSpeed *= speedMult;
    
    // Check implement
    const imp = veh.attachedImplementId ? room.implements[veh.attachedImplementId] : null;
    const impModel = imp ? CATALOG.implements[imp.modelId] : null;
    const isToolOn = (veh.toolOn) || (imp && imp.isOn);

    if (isToolOn) gearMaxSpeed = Math.min(gearMaxSpeed, maxSpeed * 0.35);

    // Steering
    if (engineOn && veh.rpm > 500) {
        const baseTurnSpeed = m.turnSpeedBase || 0.10;
        const speedFraction = Math.min(Math.abs(veh.velocity) / Math.max(0.1, gearMaxSpeed), 1);
        const turnModifier = 1 - (speedFraction * 0.15);

        if (inputs.left) veh.rotation -= baseTurnSpeed * turnModifier;
        if (inputs.right) veh.rotation += baseTurnSpeed * turnModifier;
    }
    veh.rotation = normalizeAngle(veh.rotation || 0);

    // Physics
    let totalLoad = m.weight || 3000;
    let resistance = 0;
    if (impModel) {
        totalLoad += impModel.weight || 1000;
        if (isToolOn) resistance = impModel.drag || 0.05;
    }

    const baseWeight = m.weight || 3000;
    let engineBonus = 0;
    if (veh.upgrades?.engineLevel === 2) engineBonus = 0.35;
    else if (veh.upgrades?.engineLevel === 3) engineBonus = 0.70;

    const engineCondition = veh.condition?.engine || 1.0;
    const tiresCondition = veh.condition?.tires || 1.0;

    let finalPower = clamp(baseWeight / totalLoad, 0.15, 1.0);
    finalPower *= (1 + engineBonus);
    finalPower *= torqueMult;
    finalPower *= (0.4 + (engineCondition * 0.6));

    if (impModel && impModel.requiredHp) {
        const currentHp = (m.power || 50) * (1 + engineBonus);
        const hpRatio = currentHp / impModel.requiredHp;
        if (hpRatio < 1) finalPower *= Math.pow(hpRatio, 2);
    }
    finalPower = Math.max(0.05, finalPower);

    let tireSpeedMod = 1.0;
    const tireType = veh.upgrades?.tireType || 'standard';
    if (tireType === 'agriculture') tireSpeedMod = 0.85;
    else if (tireType === 'road') tireSpeedMod = 1.35;
    else if (tireType === 'wide') tireSpeedMod = 0.92;

    const loadPenalty = clamp(baseWeight / totalLoad, 0.25, 1.0);
    const finalMaxSpeed = gearMaxSpeed * loadPenalty * tireSpeedMod * (0.75 + (tiresCondition * 0.25));

    const weightDrag = totalLoad * 0.000002;

    // Turbo
    let ownedTurbo = veh.upgrades?.turboLevel || 0;
    if (m.gears === 6 && ownedTurbo < 1) ownedTurbo = 1;

    let activeTurbo = (veh.upgrades?.activeTurboLevel !== undefined) ? veh.upgrades.activeTurboLevel : (ownedTurbo);
    
    if (engineOn && activeTurbo > 0) {
        const boostCap = activeTurbo === 1 ? 0.40 : 0.85; // Limita o boost real dependendo do nível ativo
        veh.turboPressure = veh.turboPressure || 0;
        const targetBoost = (throttleForward || throttleReverse) ? 1.0 : 0.0;
        const spoolRate = targetBoost > veh.turboPressure ? 0.08 : 0.12;
        veh.turboPressure += (targetBoost - veh.turboPressure) * spoolRate;
        const rpmFactor = Math.max(0, Math.min(1, ((veh.rpm||800) - 800) / 2000));
        veh.turboBoost = veh.turboPressure * rpmFactor;
    } else {
        veh.turboBoost = 0;
        veh.turboPressure = 0;
    }

    const isAutoTrans = (veh.gearbox === 'auto');
    if (engineOn && (veh.rpm||800) > 500 && (!clutchPressed || isAutoTrans) && veh.gear > 0) {
        let baseAccel = (m.acceleration || 0.08) * 0.35;
        const accelRatios = m.gears === 6 ? [1.8, 1.4, 1.1, 0.9, 0.75, 0.6] : [1.6, 1.2, 0.9, 0.7];
        let gearMult = accelRatios[veh.gear - 1] || 1.0;

        let accel = baseAccel * gearMult * finalPower;

        if (activeTurbo > 0) {
            const currentBoostCap = activeTurbo === 1 ? 0.40 : 0.85;
            const boost = currentBoostCap * (veh.turboBoost||0);
            accel *= (1 + boost);
        }

        let tireGrip = 1.0;
        if (tireType === 'agriculture') tireGrip = 1.3;
        else if (tireType === 'road') tireGrip = 0.8;
        else if (tireType === 'wide') tireGrip = 1.15;
        accel *= tireGrip;

        // O servidor não verifica isOnRoad para simplificar (assumimos que o cliente fará a predição similar, 
        // mas para evitar que o cliente seja mais rápido, deixaremos sem isOnRoad, o cliente fará lerp se divergir)
        if (resistance > 0) accel *= (1 - resistance);
        accel = Math.max(0.005, accel);

        if (throttleForward) {
            veh.velocity += accel * frameMult;
        }
        if (throttleReverse) {
            veh.velocity -= (accel * 0.6) * frameMult;
        }

        if (!throttleForward && !throttleReverse) {
            const drag = 0.992;
            veh.velocity *= Math.pow(drag, frameMult);
        }
    } else {
        const drag = 0.992;
        veh.velocity *= Math.pow(drag, frameMult);
    }

    if (veh.velocity > 0) {
        veh.velocity = Math.max(0, veh.velocity - weightDrag * frameMult);
    } else if (veh.velocity < 0) {
        veh.velocity = Math.min(0, veh.velocity + weightDrag * frameMult);
    }

    if (!throttleForward && !throttleReverse && Math.abs(veh.velocity) < 0.05) veh.velocity = 0;

    let brakeF = m.brakeForce || 0.2;
    if (braking) {
        if (veh.velocity > 0) veh.velocity = Math.max(0, veh.velocity - (brakeF * frameMult));
        else if (veh.velocity < 0) veh.velocity = Math.min(0, veh.velocity + (brakeF * frameMult));
    }

    if (finalPower <= 0.2 && throttleForward) {
        veh.velocity = Math.max(veh.velocity, 0.15);
    }

    veh.velocity = clamp(veh.velocity, -finalMaxSpeed, finalMaxSpeed);

    // RPM
    const targetRpmIdle = engineOn ? 900 : 0;
    if (engineOn) {
        const loadIntensity = Math.min(1, Math.abs(veh.velocity) / Math.max(0.1, finalMaxSpeed));
        let targetRpm = 900 + (loadIntensity * 2100);
        if (throttleForward || throttleReverse) targetRpm += 300;
        if (clutchPressed) targetRpm = throttleForward ? 3000 : 900;
        veh.rpm = clamp(lerp(veh.rpm || 0, targetRpm, 0.1 * frameMult), 800, 3000);
        
        veh.fuel = Math.max(0, (veh.fuel || 0) - (0.0005 + (veh.rpm / 3000) * 0.0015));
        if (veh.fuel <= 0) veh.engineOn = false;
    } else {
        veh.rpm = clamp(lerp(veh.rpm || 0, 0, 0.05 * frameMult), 0, 3000);
    }

    // Move
    const vx = Math.cos(veh.rotation) * veh.velocity;
    const vy = Math.sin(veh.rotation) * veh.velocity;
    
    // Bounds check (simplified to W/H = 10000)
    veh.x = clamp((veh.x || 4480) + vx, 64, 10000 - 64);
    veh.y = clamp((veh.y || 5696) + vy, 64, 10000 - 64);

    // Sync Implement position
    if (imp) {
        // Trailing implement
        const dist = 60; // hitch offset
        const targetX = veh.x - Math.cos(veh.rotation) * dist;
        const targetY = veh.y - Math.sin(veh.rotation) * dist;

        imp.x = imp.x || targetX;
        imp.y = imp.y || targetY;

        const impAngle = Math.atan2(veh.y - imp.y, veh.x - imp.x);
        const lerpFactor = clamp(Math.abs(veh.velocity) * 0.2, 0.1, 0.5);
        imp.x = lerp(imp.x, targetX, lerpFactor);
        imp.y = lerp(imp.y, targetY, lerpFactor);
        imp.rotation = impAngle;
    }

    // Processar solo autoritativo
    if (isToolOn) {
        let workX, workY;
        if (veh.modelId.includes('harvester')) {
            workX = veh.x; workY = veh.y;
        } else if (imp) {
            workX = imp.x; workY = imp.y;
        }

        if (workX !== undefined && workY !== undefined) {
            const tx = Math.floor(workX / TILE) * TILE;
            const ty = Math.floor(workY / TILE) * TILE;

            // Verificar se a tile está dentro de uma terra desbloqueada
            let tileInField = false;
            if (room.farm.unlockedLands && CATALOG.lands) {
                for (const fid of room.farm.unlockedLands) {
                    const f = CATALOG.lands[fid];
                    if (f && tx >= f.x && (tx + TILE) <= (f.x + f.w) && ty >= f.y && (ty + TILE) <= (f.y + f.h)) {
                        tileInField = true;
                        break;
                    }
                }
            }
            if (!tileInField) return; // Não permite ações fora dos campos desbloqueados

            const axis = Math.abs(Math.cos(veh.rotation)) >= 0.5 ? 'h' : 'v';
            
            if (veh.modelId.includes('harvester')) {
                const cropIdx = room.farm.plantedCrops.findIndex(c => Math.abs(c.x - tx) < 5 && Math.abs(c.y - ty) < 5);
                if (cropIdx !== -1) {
                    const c = room.farm.plantedCrops[cropIdx];
                    if ((c.isReady && !c.isDead) || c.isDead) {
                        if (c.isReady && !c.isDead) room.farm.harvesterStorage = (room.farm.harvesterStorage || 0) + 1;
                        room.farm.plantedCrops.splice(cropIdx, 1);
                        room.farm.soil[`${tx},${ty}`] = { state: 'normal', dir: null };
                        
                        // Notify clients
                        if (io && roomId) {
                            io.to(roomId).emit('cropHarvested', { x: tx, y: ty });
                            io.to(roomId).emit('soilUpdated', { key: `${tx},${ty}`, state: 'normal', dir: null });
                        }
                    }
                }
            } else if (impModel) {
                const type = impModel.type;
                const key = `${tx},${ty}`;
                const curSt = typeof room.farm.soil[key] === 'object' ? room.farm.soil[key].state : (room.farm.soil[key] || 'normal');
                
                let changed = false;
                let newState = curSt;
                if (type === 'plow' && curSt !== 'plowed') {
                    newState = 'plowed'; changed = true;
                } else if (type === 'harrow' && curSt === 'plowed') {
                    newState = 'harrowed'; changed = true;
                } else if (type === 'seeder' && curSt === 'harrowed' && imp.seedStorage > 0 && room.weather !== '🔥 Seca') {
                    imp.seedStorage--;
                    newState = 'planted'; changed = true;
                    room.farm.plantedCrops.push({ x: tx, y: ty, time: room.time, growthStage: 0, isReady: false, isDead: false });
                    
                    if (io && roomId) {
                        io.to(roomId).emit('cropPlanted', { x: tx, y: ty, time: room.time });
                        io.to(roomId).emit('implementStorageUpdated', { id: imp.id, seedStorage: imp.seedStorage });
                    }
                }

                if (changed) {
                    room.farm.soil[key] = { state: newState, dir: axis };
                    if (io && roomId) {
                        io.to(roomId).emit('soilUpdated', { key, state: newState, dir: axis });
                    }
                }
            }
        }
    }
}

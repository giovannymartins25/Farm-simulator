import re

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

events_to_add = """
    socket.on('roomStateSynced', (room) => {
        const myInv = room.playerInventories[socket.id] || { vehicles: [], implements: [], hasCellphone: false };
        lastState = {
            time: room.time, weather: room.weather, economy: room.economy,
            farm: {
                ...room.farm,
                inventory: myInv,
                hasCellphone: myInv.hasCellphone
            }
        };
        isHydrated = true;
        updateHUD(lastState);
        updateSoil(room.farm.soil);
        updateCrops(room.farm.plantedCrops);
        updateFields();
        renderLandZones();
        renderWorldMap();
    });

    socket.on('tick', (data) => {
        if (!lastState) return;
        lastState.time = data.time;
        lastState.weather = data.weather;
        lastState.farm.plantedCrops = data.crops;
        updateHUD(lastState);
        updateCrops(data.crops);
    });

    socket.on('soilUpdated', ({ key, state, dir }) => {
        if (!lastState) return;
        lastState.farm.soil[key] = { state, dir };
        updateSoil(lastState.farm.soil);
    });

    socket.on('cropPlanted', ({ x, y, time }) => {
        if (!lastState) return;
        lastState.farm.plantedCrops.push({ x, y, plantedTime: time, growthStage: 0, isReady: false, isDead: false });
        updateCrops(lastState.farm.plantedCrops);
    });

    socket.on('cropHarvested', ({ x, y }) => {
        if (!lastState) return;
        const idx = lastState.farm.plantedCrops.findIndex(c => c.x === x && c.y === y);
        if (idx !== -1) {
            lastState.farm.plantedCrops.splice(idx, 1);
            lastState.farm.soil[`${x},${y}`] = { state: 'normal', dir: null };
            updateCrops(lastState.farm.plantedCrops);
            updateSoil(lastState.farm.soil);
        }
    });

    socket.on('implementStorageUpdated', ({ id, seedStorage }) => {
        const imp = implementSprites.find(i => i.id === id);
        if (imp) {
            imp.seedStorage = seedStorage;
        }
    });

    socket.on('vehicleOccupantsUpdated', (data) => {
        const veh = vehicleSprites.find(v => v.id === data.vehicleId);
        if (veh) {
            veh.driverId = data.driverId;
            veh.passengers = data.passengers || [];
            
            // Controle local vs passageiro
            if (veh.driverId !== socket.id && activeVehIdx === vehicleSprites.indexOf(veh)) {
                 veh.isMyDriver = false; // flag manual
            } else if (veh.driverId === socket.id && activeVehIdx === vehicleSprites.indexOf(veh)) {
                 veh.isMyDriver = true;
            }
        }
    });

    socket.on('implementAttached', ({ vehicleId, implementId }) => {
        const veh = vehicleSprites.find(v => v.id === vehicleId);
        const imp = implementSprites.find(i => i.id === implementId);
        if (veh && imp) {
            imp.hitchedTo = veh.id;
        }
    });

    socket.on('implementDetached', ({ vehicleId, implementId }) => {
        const imp = implementSprites.find(i => i.id === implementId);
        if (imp) {
            imp.hitchedTo = null;
            imp.isOn = false;
        }
    });
"""

# Insert right after socket.on('disconnect', ...);
target = r"    socket.on\('disconnect', \(reason\) => \{\n        console.log\(\"Socket desconectado\. Motivo:\", reason\);\n    \}\);"

content = re.sub(target, "    socket.on('disconnect', (reason) => {\n        console.log(\"Socket desconectado. Motivo:\", reason);\n    });\n" + events_to_add, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Pass 2 done")

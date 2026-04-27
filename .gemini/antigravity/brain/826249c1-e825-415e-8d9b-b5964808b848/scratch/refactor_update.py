import re

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Inside function update():
#     if (!isHydrated) return;
#     
#     let moved = false;
#     ...
#     for (let i = 0; i < vehicleSprites.length; i++) {
#         const v = vehicleSprites[i];
#         const isControlled = (activeVehIdx === i);
#         runVehicleLogic(v, isControlled);
#     }
# Let's change `const isControlled = (activeVehIdx === i);` to `const isControlled = (activeVehIdx === i) && (!multiplayerMode || v.driverId === socket?.id);`
# And add `socket.emit('vehicleUpdate')`

r_update_veh = r"const isControlled = \(activeVehIdx === i\);\n        runVehicleLogic\(v, isControlled\);"
r_update_veh_new = r"""const isControlled = (activeVehIdx === i) && (!multiplayerMode || !v.driverId || v.driverId === socket?.id);
        
        // Se eu não sou o driver no multiplayer, não aplico a lógica de física se não for o driver
        if (multiplayerMode && v.driverId && v.driverId !== socket?.id) {
            // physics and movement will be set by socket.on('vehicleUpdated')
        } else {
            runVehicleLogic(v, isControlled);
        }

        if (multiplayerMode && isControlled && v.engineOn) {
            // Emite o estado do veiculo apenas se for o driver
            if (socket && socket.connected) {
                // Rate limit (enviar a cada 2 frames ou quando mudar a velocidade/pos)
                if (!v.lastSync || Date.now() - v.lastSync > 50) {
                    socket.emit('vehicleUpdate', {
                        id: v.id,
                        x: v.sprite.x,
                        y: v.sprite.y,
                        angle: v.sprite.rotation,
                        velocity: v.velocity,
                        isOn: v.engineOn
                    });
                    v.lastSync = Date.now();
                }
            }
        }"""
content = re.sub(r_update_veh, r_update_veh_new, content)

# Also player movement emission
# if (moved && multiplayerMode && socket && socket.connected) {
#     socket.emit('playerMove', { x: player.x, y: player.y, angle: player.rotation, vehicleId: null });
# }
r_move = r"if \(moved\) \{\n        if \(multiplayerMode\) \{\n            // Emitir movimento via socket no futuro\n        \}\n    \}"
r_move_new = r"""if (moved && multiplayerMode && socket && socket.connected) {
        // Enviar apenas posição fora de veiculos (activeVehIdx < 0)
        socket.emit('playerMove', { x: player.x, y: player.y, angle: player.rotation, vehicleId: null });
    }"""
content = re.sub(r_move, r_move_new, content)

# Wait, if activeVehIdx >= 0, the player's sprite is updated to match the active vehicle
r_sync_player = r"if \(activeVehIdx >= 0\) \{\n        const v = getActiveVehicle\(\);\n        if \(v\) \{\n            player\.x = v\.sprite\.x;\n            player\.y = v\.sprite\.y;\n            player\.rotation = v\.sprite\.rotation;\n        \}\n    \}"
r_sync_player_new = r"""if (activeVehIdx >= 0) {
        const v = getActiveVehicle();
        if (v) {
            player.x = v.sprite.x;
            player.y = v.sprite.y;
            player.rotation = v.sprite.rotation;
            if (multiplayerMode && socket && socket.connected) {
                // Rate limit player move inside vehicle
                if (!player.lastSync || Date.now() - player.lastSync > 100) {
                    socket.emit('playerMove', { x: player.x, y: player.y, angle: player.rotation, vehicleId: v.id });
                    player.lastSync = Date.now();
                }
            }
        }
    }"""
content = re.sub(r_sync_player, r_sync_player_new, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Pass 5 done")

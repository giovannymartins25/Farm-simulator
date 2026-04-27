import re

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

r_toggle = r"""function doToggleVehicle() {
    if (shopOpen) return;

    if (activeVehIdx >= 0) {
        // Saindo do veículo
        const veh = getActiveVehicle();
        if (multiplayerMode && socket && socket.connected) {
            socket.emit('exitVehicle');
        }
        activeVehIdx = -1;
        player.setVisible(true);
        refreshStatusHUD();
        refreshGearHUD();
        showToast('Você saiu do veículo');
    } else {
        // Tentando entrar em um veículo próximo
        for (let i = 0; i < vehicleSprites.length; i++) {
            const v = vehicleSprites[i];
            if (near(player, v.sprite, 80)) {
                activeVehIdx = i;
                player.setVisible(false);
                
                if (multiplayerMode && socket && socket.connected) {
                    socket.emit('enterVehicle', { vehicleId: v.id });
                }

                // Auto-ativar monitor de campo para máquinas avançadas
                const m = getVehicleModel(v);
                if (m && Number(m.gears) === 6 && m.autoDrive) {
                    console.log("Auto-ativando monitor para:", m.name, "Gears:", m.gears);
                    monitorVisible = true;
                }
                
                refreshStatusHUD();
                refreshGearHUD();
                showToast(`Entrou em: ${m ? m.name : 'Veículo'}`);
                return;
            }
        }
    }
}
"""

content = re.sub(r"function doToggleVehicle\(\) \{[\s\S]*?\}\n\n", r_toggle + "\n", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Pass 3 done")

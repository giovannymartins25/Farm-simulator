import re

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

r_hitch = r"""function doToggleHitch() {
    if (activeVehIdx < 0) return;
    const veh = getActiveVehicle();
    if (!veh || veh.type !== 'tractor') return;

    if (multiplayerMode && veh.driverId !== socket.id) {
       showToast('Somente o motorista pode engatar!', 'error');
       return;
    }

    const hitched = implementSprites.find(i => i.hitchedTo === veh.id);
    if (hitched) {
        if (multiplayerMode && socket && socket.connected) {
            socket.emit('detachImplement', { vehicleId: veh.id });
        } else {
            hitched.hitchedTo = null;
            hitched.isOn = false;
            showToast('Implemento desengatado', 'warning');
        }
    } else {
        const nearImpl = implementSprites.find(i => !i.hitchedTo && near(veh.sprite, i.sprite, 60));
        if (nearImpl) {
            if (multiplayerMode && socket && socket.connected) {
                socket.emit('attachImplement', { vehicleId: veh.id, implementId: nearImpl.id });
            } else {
                nearImpl.hitchedTo = veh.id;
                showToast('Implemento engatado!', 'success');
            }
        }
    }
}
"""

content = re.sub(r"function doToggleHitch\(\) \{[\s\S]*?\}\n\n", r_hitch + "\n", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Pass 4 done")

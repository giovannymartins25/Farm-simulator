import re
import codecs

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

def replace_block(pattern, replacer):
    global content
    if re.search(pattern, content):
        content = re.sub(pattern, replacer, content)
    else:
        print(f"Pattern not found: {pattern[:50]}...")

# 1. fetchState
p_fetch = r"async function fetchState\(\) \{[\s\S]*?isHydrated = true;\n    \} catch \(e\) \{[\s\S]*?\}\n\}"
r_fetch = r"""async function fetchState() {
    if (multiplayerMode) return; // Em multiplayer, o state vem por socket (roomStateSynced)
    try {
        const s = normalizeState(await apiJson('/state'));
        lastState = s;
        updateHUD(s); updateSoil(s.farm.soil); updateCrops(s.farm.plantedCrops);
        updateFields(); renderLandZones(); ensureVehicles(); ensureImplements(); renderWorldMap();
        isHydrated = true;
    } catch (e) {
        console.warn("Estado não atualizado:", e.message);
    }
}"""
replace_block(p_fetch, r_fetch)

# 2. forceTick
p_tick = r"async function forceTick\(\) \{[\s\S]*?\}"
r_tick = r"""async function forceTick() {
    if (multiplayerMode) return;
    try { await apiJson('/tick', { method: 'POST' }); fetchState(); } catch (e) { }
}"""
replace_block(p_tick, r_tick)

# 3. syncFuel
p_sync = r"async function syncFuel\(\) \{[\s\S]*?\n\}"
r_sync = r"""async function syncFuel() {
    if (!isHydrated || !catalog) return;
    const vehFuelData = vehicleSprites.map(v => ({ id: v.id, fuel: v.fuel || 0 }));
    if (vehFuelData.length === 0) return;
    if (multiplayerMode) {
       if (socket && socket.connected) socket.emit('syncFuel', { vehicles: vehFuelData });
    } else {
       try {
           await apiJson('/action/sync-fuel', {
               method: 'POST', headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ vehicles: vehFuelData })
           });
       } catch (e) { }
    }
}"""
replace_block(p_sync, r_sync)

# 4. doRefuel
p_refuel = r"async function doRefuel\(\) \{[\s\S]*?Erro no refuel[\s\S]*?\}"
r_refuel = r"""async function doRefuel() {
    if (activeVehIdx < 0) return;
    const ent = getEntity();
    if (!near(ent, GAS_STATION_POS, 150)) return;
    const activeVehicle = getActiveVehicle();
    if (!activeVehicle) return;

    if (multiplayerMode) {
        if (activeVehicle.driverId !== socket.id) return showToast('Apenas o motorista pode abastecer', 'warning');
        socket.emit('refuel', { vehicleId: activeVehicle.id });
        return;
    }

    try {
        const d = await apiJson('/action/refuel', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicleId: activeVehicle.id })
        });
        if (d.success && d.newFuel !== undefined) {
            activeVehicle.fuel = d.newFuel;
            await fetchState();
            console.log("Refuel efetuado:", d.message);
        }
    } catch (e) {
        console.error("Erro no refuel:", e);
    }
}"""
replace_block(p_refuel, r_refuel)

# 5. buyItem
p_buy = r"async function buyItem\(cat, id\) \{[\s\S]*?\}\n\}"
r_buy = r"""async function buyItem(cat, id) {
    if (multiplayerMode) {
        socket.emit('shopBuy', { category: cat, itemId: id });
        return;
    }
    try {
        const d = await apiJson('/shop/buy', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) {
            await fetchState();
            renderShop(shopTab);
            ensureVehicles();
            ensureImplements();
            if (cat === 'items' && id === 'cellphone') {
                showToast('Celular comprado! Aperte Z para acessar a Loja Rápida.', 'success');
            }
        }
    } catch (e) { }
}"""
replace_block(p_buy, r_buy)

# 6. sellItem
p_sell = r"async function sellItem\(cat, id\) \{[\s\S]*?Erro ao vender[\s\S]*?\}\n\}"
r_sell = r"""async function sellItem(cat, id) {
    if (cat === 'implements') {
        const isHitched = implementSprites.some(i => i.id === id && i.hitchedTo);
        if (isHitched) {
            showToast('Desengate o implemento antes de vender', 'error');
            return;
        }
    }
    if (multiplayerMode) {
        socket.emit('shopSell', { category: cat, itemId: id });
        return;
    }
    try {
        const d = await apiJson('/shop/sell', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) {
            await fetchState();
            renderShop('sell');
            ensureVehicles();
            ensureImplements();
            updateHUD(lastState);
        } else {
            alert('Erro ao vender: ' + (d.message || 'Desconhecido'));
        }
    } catch (e) {
        console.error('Erro ao vender:', e);
    }
}"""
replace_block(p_sell, r_sell)

# 7. cellphone items
p_cbuy = r"async function buyCellphoneItem\(cat, id\) \{[\s\S]*?\}\n\}"
r_cbuy = r"""async function buyCellphoneItem(cat, id) {
    if (multiplayerMode) {
        socket.emit('shopBuy', { category: cat, itemId: id });
        return;
    }
    try {
        const d = await apiJson('/shop/buy', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) { await fetchState(); renderCellphoneMenu(cat); ensureVehicles(); ensureImplements(); }
    } catch (e) { }
}"""
replace_block(p_cbuy, r_cbuy)

p_csell = r"async function sellCellphoneItem\(cat, id\) \{[\s\S]*?\}\n\}"
r_csell = r"""async function sellCellphoneItem(cat, id) {
    if (cat === 'implements') {
        const isHitched = implementSprites.some(i => i.id === id && i.hitchedTo);
        if (isHitched) {
            showToast('Desengate o implemento antes de vender', 'error');
            return;
        }
    }
    if (multiplayerMode) {
        socket.emit('shopSell', { category: cat, itemId: id });
        return;
    }
    try {
        const d = await apiJson('/shop/sell', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) { await fetchState(); renderCellphoneMenu('sell'); ensureVehicles(); ensureImplements(); }
    } catch (e) { }
}"""
replace_block(p_csell, r_csell)

# 8. Action Plow, Harrow, Plant, Harvest
# These are within game loop, let's look at `function performFieldAction()` and `function performAction()`
# Actually, the user says "Sincronizar movemento e implements via sockets". 
# The actions are in `performAction()` which does `apiJson('/action/plow', etc)`
p_plow = r"apiJson\('/action/plow', \{ method: 'POST', body: JSON\.stringify\(\{ x: tileX, y: tileY \}\) \}\)"
r_plow = r"multiplayerMode ? socket.emit('actionPlow', { x: tileX, y: tileY }) : apiJson('/action/plow', { method: 'POST', body: JSON.stringify({ x: tileX, y: tileY }) })"
content = re.sub(p_plow, r_plow, content)

p_harrow = r"apiJson\('/action/harrow', \{ method: 'POST', body: JSON\.stringify\(\{ x: tileX, y: tileY, dir \}\) \}\)"
r_harrow = r"multiplayerMode ? socket.emit('actionHarrow', { x: tileX, y: tileY, dir }) : apiJson('/action/harrow', { method: 'POST', body: JSON.stringify({ x: tileX, y: tileY, dir }) })"
content = re.sub(p_harrow, r_harrow, content)

# Wait, `action/plant` takes `implementId`. We need the ID of the implement.
# The code currently does: `apiJson('/action/plant', { method: 'POST', body: JSON.stringify({ x: tileX, y: tileY }) })`
# We need to change it.
# Let's see the context of performAction:
# if (implType === 'seeder') {
#    apiJson('/action/plant', { method: 'POST', body: JSON.stringify({ x: tileX, y: tileY }) })
# }
# Actually, let's use a bigger regex for `if (implType === 'seeder')` block.
p_plant = r"if \(implType === 'seeder'\) \{[\s\S]*?\}"
r_plant = r"""if (implType === 'seeder') {
        const impData = implementSprites.find(i => i.hitchedTo === veh.id);
        if (multiplayerMode) {
            socket.emit('actionPlant', { x: tileX, y: tileY, implementId: impData ? impData.id : null });
        } else {
            apiJson('/action/plant', { method: 'POST', body: JSON.stringify({ x: tileX, y: tileY, implementId: impData ? impData.id : null }) })
                .then(d => { if (d && d.success) fetchState(); })
                .catch(e => {});
        }
    }"""
content = re.sub(p_plant, r_plant, content)

p_harv = r"if \(veh\.type === 'harvester'\) \{[\s\S]*?\}\n        \}"
r_harv = r"""if (veh.type === 'harvester') {
            if (multiplayerMode) {
                socket.emit('actionHarvest', { x: tileX, y: tileY });
            } else {
                apiJson('/action/harvest', { method: 'POST', body: JSON.stringify({ x: tileX, y: tileY }) })
                    .then(d => { if (d && d.success) fetchState(); })
                    .catch(e => {});
            }
        }"""
content = re.sub(p_harv, r_harv, content)


with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)
print("Pass 1 python done")

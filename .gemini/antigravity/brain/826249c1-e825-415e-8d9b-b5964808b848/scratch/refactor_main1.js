const fs = require('fs');
const path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js';
let content = fs.readFileSync(path, 'utf8');

function replaceBlock(regex, replacer) {
    if (regex.test(content)) {
        content = content.replace(regex, replacer);
    } else {
        console.warn('Regex not found:', regex);
    }
}

// 1. fetchState: No multiplayer it shouldn't call apiJson('/state') if we want sockets, but actually we can just let it early return in multiplayer mode
replaceBlock(/async function fetchState\(\) \{[\s\S]*?isHydrated = true;\n    \} catch \(e\) \{[\s\S]*?\}\n\}/, 
`async function fetchState() {
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
}`);

// 2. forceTick:
replaceBlock(/async function forceTick\(\) \{[\s\S]*?\}/,
`async function forceTick() {
    if (multiplayerMode) return;
    try { await apiJson('/tick', { method: 'POST' }); fetchState(); } catch (e) { }
}`);

// 3. syncFuel
replaceBlock(/async function syncFuel\(\) \{[\s\S]*?\n\}/,
`async function syncFuel() {
    if (!isHydrated || !catalog) return;
    const vehFuelData = vehicleSprites.map(v => ({ id: v.id, fuel: v.fuel || 0 }));
    if (vehFuelData.length === 0) return;
    if (multiplayerMode) {
       socket.emit('syncFuel', { vehicles: vehFuelData });
    } else {
       try {
           await apiJson('/action/sync-fuel', {
               method: 'POST', headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ vehicles: vehFuelData })
           });
       } catch (e) { }
    }
}`);

// 4. doRefuel
replaceBlock(/async function doRefuel\(\) \{[\s\S]*?Erro no refuel[\s\S]*?\}/,
`async function doRefuel() {
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
        } else {
            console.log("Refuel falhou/negado:", d.message);
        }
    } catch (e) {
        console.error("Erro no refuel:", e);
    }
}`);

// 5. buyItem and sellItem
replaceBlock(/async function buyItem\(cat, id\) \{[\s\S]*?\}\n\}/,
`async function buyItem(cat, id) {
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
}`);

replaceBlock(/async function sellItem\(cat, id\) \{[\s\S]*?Erro ao vender[\s\S]*?\}\n\}/,
`async function sellItem(cat, id) {
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
}`);

// 6. Cellphone shop functions
replaceBlock(/async function buyCellphoneItem\(cat, id\) \{[\s\S]*?\}\n\}/,
`async function buyCellphoneItem(cat, id) {
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
}`);

replaceBlock(/async function sellCellphoneItem\(cat, id\) \{[\s\S]*?\}\n\}/,
`async function sellCellphoneItem(cat, id) {
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
}`);

// 7. Context actions
replaceBlock(/async function doContextAction\(\) \{[\s\S]*?return;\n    \}\n\}/,
`async function doContextAction() {
    if (!lastState) return;
    const ent = getEntity();

    // Shop
    if (near(ent, SHOP_POS, 100)) { openShop(); return; }
    
    // Harvester + silo
    if (isInHarvester() && near(ent, SILO_POS, 80)) {
        if (multiplayerMode) { socket.emit('actionUnload'); return; }
        try { const d = await apiJson('/action/unload', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
    }
    // Truck + silo
    if (isInTruck() && near(ent, SILO_POS, 80)) {
        if (multiplayerMode) { socket.emit('actionTruckLoadSilo'); return; }
        try { const d = await apiJson('/action/truck/load-silo', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
    }
    // Truck + house (load seeds from depot)
    if (isInTruck() && near(ent, HOUSE_POS, 100)) {
        if (multiplayerMode) { socket.emit('actionTruckLoadDepot'); return; }
        try { const d = await apiJson('/action/truck/load-depot', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
    }
    // Truck + sell
    if (isInTruck() && near(ent, SELL_POS, 100)) {
        if (multiplayerMode) { socket.emit('actionTruckSell'); return; }
        try { const d = await apiJson('/action/truck/sell', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
    }
    // Truck + seeder (transfer seeds)
    if (isInTruck()) {
        for (const impl of implementSprites) {
            if (impl.type === 'seeder' && near(ent, impl.sprite, 80)) {
                if (multiplayerMode) { socket.emit('actionTruckTransferSeeds', { implementId: impl.id }); return; }
                try { const d = await apiJson('/action/truck/transfer-seeds', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
            }
        }
    }
}`);

// We write back to test if these simple replaces worked. I will add the more complex ones in a second pass.
fs.writeFileSync(path, content, 'utf8');
console.log('Pass 1 done');

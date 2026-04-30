// ============================================================
//  CONFIG — Fullscreen FIT
// ============================================================
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#2c3e50',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 960, height: 640 },
    scene: { preload, create, update }
};
const game = new Phaser.Game(config);

const TILE = 64;
const IS_LOCALHOST = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.');
const API = IS_LOCALHOST ? `http://${window.location.hostname}:3000` : 'https://farm-simulator.onrender.com';
const LOCAL_CATALOG = {
    vehicles: {
        tractor_mf275: { name: 'MF 275', brand: 'Massey Ferguson', type: 'tractor', power: 50, weight: 3500, brakeForce: 0.15, hp: 50, speed: 5, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.12, friction: 0.965, turnSpeedBase: 0.12, fuelCapacity: 50, price: 0 },
        tractor_valtra: { name: 'A850', brand: 'Valtra', type: 'tractor', power: 85, weight: 4200, brakeForce: 0.15, hp: 85, speed: 6, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.15, friction: 0.970, turnSpeedBase: 0.11, fuelCapacity: 80, price: 800 },
        tractor_nh: { name: 'T6.110', brand: 'New Holland', type: 'tractor', power: 120, weight: 5500, brakeForce: 0.2, hp: 120, speed: 7, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.19, friction: 0.975, turnSpeedBase: 0.09, fuelCapacity: 120, price: 1800 },
        tractor_jd: { name: 'JD 6130J', brand: 'John Deere', type: 'tractor', power: 150, weight: 6500, brakeForce: 0.25, hp: 150, speed: 8, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.23, friction: 0.980, turnSpeedBase: 0.08, fuelCapacity: 150, price: 3000 },
        tractor_case: { name: 'Magnum 310', brand: 'Case IH', type: 'tractor', power: 220, weight: 11000, brakeForce: 0.35, hp: 220, speed: 9, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.28, friction: 0.985, turnSpeedBase: 0.07, fuelCapacity: 220, price: 5000 },
        harvester_mf5650: { name: 'MF 5650', brand: 'Massey Ferguson', type: 'harvester', power: 60, weight: 8000, brakeForce: 0.15, hp: 60, capacity: 50, speed: 4, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.10, friction: 0.960, turnSpeedBase: 0.06, fuelCapacity: 100, price: 0 },
        harvester_nh: { name: 'TC5090', brand: 'New Holland', type: 'harvester', power: 100, weight: 11000, brakeForce: 0.2, hp: 100, capacity: 120, speed: 5, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.13, friction: 0.965, turnSpeedBase: 0.05, fuelCapacity: 200, price: 2000 },
        harvester_jd: { name: 'S680', brand: 'John Deere', type: 'harvester', power: 120, weight: 14000, brakeForce: 0.3, hp: 120, capacity: 250, speed: 6, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.16, friction: 0.970, turnSpeedBase: 0.04, fuelCapacity: 350, price: 4500 },
        truck_vw: { name: 'Constellation', brand: 'Volkswagen', type: 'truck', power: 120, weight: 6000, brakeForce: 0.2, hp: 120, capacity: 30, speed: 7, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.18, friction: 0.975, turnSpeedBase: 0.05, fuelCapacity: 150, price: 0 },
        truck_mb: { name: 'Atego 2430', brand: 'Mercedes-Benz', type: 'truck', power: 160, weight: 8000, brakeForce: 0.25, hp: 160, capacity: 80, speed: 8, gears: 6, gearType: 'auto', autoDrive: false, acceleration: 0.22, friction: 0.980, turnSpeedBase: 0.04, fuelCapacity: 250, price: 1500 },
        truck_scania: { name: 'R450', brand: 'Scania', type: 'truck', power: 200, weight: 10000, brakeForce: 0.35, hp: 200, capacity: 150, speed: 9, gears: 6, gearType: 'auto', autoDrive: false, acceleration: 0.26, friction: 0.985, turnSpeedBase: 0.04, fuelCapacity: 400, price: 3000 }
    },
    implements: {
        plow_small: { name: 'Tombador Pequeno', type: 'plow', requiredHp: 30, weight: 800, drag: 0.05, width: 1, price: 0 },
        plow_medium: { name: 'Tombador Medio', type: 'plow', requiredHp: 80, weight: 1500, drag: 0.08, width: 2, price: 300 },
        plow_large: { name: 'Tombador Grande', type: 'plow', requiredHp: 150, weight: 3000, drag: 0.15, width: 3, price: 700 },
        harrow_small: { name: 'Gradao 4 Linhas', type: 'harrow', requiredHp: 30, weight: 600, drag: 0.03, width: 1, lines: 4, price: 0 },
        harrow_medium: { name: 'Gradao 8 Linhas', type: 'harrow', requiredHp: 80, weight: 1200, drag: 0.06, width: 2, lines: 8, price: 400 },
        harrow_large: { name: 'Gradao 12 Linhas', type: 'harrow', requiredHp: 150, weight: 2500, drag: 0.10, width: 3, lines: 12, price: 800 },
        seeder_small: { name: 'Plantadeira Pequena', type: 'seeder', requiredHp: 30, weight: 1000, drag: 0.04, width: 1, capacity: 20, price: 0 },
        seeder_medium: { name: 'Plantadeira Media', type: 'seeder', requiredHp: 80, weight: 2000, drag: 0.08, width: 2, capacity: 50, price: 450 },
        seeder_large: { name: 'Plantadeira Grande', type: 'seeder', requiredHp: 150, weight: 4000, drag: 0.14, width: 3, capacity: 100, price: 900 }
    },
    seeds: {
        seed_10: { name: '10 Sementes', amount: 10, price: 30 },
        seed_25: { name: '25 Sementes', amount: 25, price: 65 },
        seed_50: { name: '50 Sementes', amount: 50, price: 110 }
    },
    items: {
        cellphone: { name: 'Celular Smartphone', type: 'item', price: 500 }
    },
    lands: {
        field_1: { name: 'Vale Esmeralda', x: 4992, y: 5952, w: 1024, h: 832, price: 0 },
        field_2: { name: 'Colinas do Sol', x: 6144, y: 5952, w: 1216, h: 832, price: 15000 },
        field_3: { name: 'Planicie Alta', x: 4992, y: 6976, w: 1024, h: 1024, price: 20000 },
        field_4: { name: 'Campos do Rio', x: 6144, y: 6976, w: 1536, h: 1024, price: 35000 },
        field_5: { name: 'Latifundio', x: 4992, y: 8192, w: 2560, h: 1216, price: 80000 }
    }
};
let localState = null;
let localCounters = { vehicle: 4, implement: 4 };
let localSunStreak = 0;
let localFallbackLogged = false;
const W = 10000, H = 10000;

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function createDefaultLocalState() {
    return {
        time: 0,
        weather: 'Ensolarado',
        economy: { pricePerCrop: 10, totalMarketDemand: 50 },
        farm: {
            money: 999999,
            seedDepot: 0,
            harvestedCrops: 0,
            harvesterStorage: 0,
            harvesterCapacity: 50,
            truckStorage: 0,
            truckCapacity: 30,
            truckCargoType: null,
            seederStorage: 0,
            seederCapacity: 20,
            soil: {},
            plantedCrops: [],
            inventory: {
                vehicles: [
                    { id: 'veh_1', modelId: 'tractor_mf275', isOn: false, fuel: 50, x: 4480, y: 5888 },
                    { id: 'veh_2', modelId: 'harvester_mf5650', isOn: false, fuel: 100, x: 4544, y: 5888 },
                    { id: 'veh_3', modelId: 'truck_vw', isOn: false, fuel: 150, x: 4608, y: 5888 }
                ],
                implements: [
                    { id: 'imp_1', modelId: 'plow_small', isOn: false, x: 3968, y: 5888 },
                    { id: 'imp_2', modelId: 'harrow_small', isOn: false, x: 4032, y: 5888 },
                    { id: 'imp_3', modelId: 'seeder_small', isOn: false, x: 4096, y: 5888 }
                ]
            },
            unlockedLands: ['field_1'],
            hasCellphone: false
        }
    };
}

function ensureLocalState() {
    if (!localState) {
        const saved = sessionStorage.getItem('soloFarmState');
        if (saved) {
            try {
                localState = JSON.parse(saved);
            } catch (e) {
                localState = createDefaultLocalState();
            }
        } else {
            localState = createDefaultLocalState();
        }
    }
    normalizeState(localState);
    return localState;
}

function saveLocalState(state) {
    if (!multiplayerMode && state === localState) {
        sessionStorage.setItem('soloFarmState', JSON.stringify(state));
    }
}

function normalizeState(state) {
    if (!state.farm) state.farm = {};
    if (!state.farm.inventory) state.farm.inventory = {};
    if (!Array.isArray(state.farm.inventory.vehicles)) state.farm.inventory.vehicles = [];
    if (!Array.isArray(state.farm.inventory.implements)) state.farm.inventory.implements = [];
    if (!state.farm.soil) state.farm.soil = {};
    if (!Array.isArray(state.farm.plantedCrops)) state.farm.plantedCrops = [];
    if (!Array.isArray(state.farm.unlockedLands)) state.farm.unlockedLands = ['field_1'];
    if (state.farm.hasCellphone === undefined) state.farm.hasCellphone = false;
    state.economy = state.economy || { pricePerCrop: 10, totalMarketDemand: 50 };
    state.weather = state.weather || 'Ensolarado';
    state.time = state.time || 0;
    state.farm.money ??= 0;
    state.farm.seedDepot ??= 0;
    state.farm.harvestedCrops ??= 0;
    state.farm.harvesterStorage ??= 0;
    state.farm.truckStorage ??= 0;
    state.farm.truckCargoType ??= null;
    state.farm.seederStorage ??= 0;
    state.farm.harvesterCapacity = getLocalHarvesterCapacity(state);
    state.farm.truckCapacity = getLocalTruckCapacity(state);
    state.farm.seederCapacity = getLocalSeederCapacity(state);
    saveLocalState(state);
    return state;
}

function getLocalHarvesterCapacity(state) {
    const harvesters = state.farm.inventory.vehicles.filter(v => LOCAL_CATALOG.vehicles[v.modelId]?.type === 'harvester');
    if (!harvesters.length) return 50;
    return Math.max(...harvesters.map(v => LOCAL_CATALOG.vehicles[v.modelId].capacity || 50));
}

function getLocalTruckCapacity(state) {
    const trucks = state.farm.inventory.vehicles.filter(v => LOCAL_CATALOG.vehicles[v.modelId]?.type === 'truck');
    if (!trucks.length) return 30;
    return Math.max(...trucks.map(v => LOCAL_CATALOG.vehicles[v.modelId].capacity || 30));
}

function getLocalSeederCapacity(state) {
    const seeders = state.farm.inventory.implements.filter(i => LOCAL_CATALOG.implements[i.modelId]?.type === 'seeder');
    if (!seeders.length) return 20;
    return Math.max(...seeders.map(i => LOCAL_CATALOG.implements[i.modelId].capacity || 20));
}

function isPointInUnlockedField(state, x, y) {
    for (const fieldId of state.farm.unlockedLands) {
        const land = LOCAL_CATALOG.lands[fieldId];
        if (land && x >= land.x && x <= land.x + land.w && y >= land.y && y <= land.y + land.h) {
            return true;
        }
    }
    return false;
}

function getLocalSoilState(state, key) {
    const soil = state.farm.soil[key];
    if (!soil) return 'normal';
    return typeof soil === 'string' ? soil : (soil.state || 'normal');
}

function getLocalSoilDir(state, key) {
    const soil = state.farm.soil[key];
    if (!soil || typeof soil === 'string') return null;
    return soil.dir || null;
}

function growLocalCrop(crop, weather) {
    if (crop.isDead || crop.isReady) return;
    if (weather === 'Ensolarado') {
        crop.growthStage += 20;
    } else if (weather === 'Chuvoso') {
        crop.growthStage += 30;
    } else if (weather === 'Seca') {
        crop.growthStage += 5;
        if (Math.random() > 0.8) crop.isDead = true;
    }
    if (crop.growthStage >= 100) {
        crop.growthStage = 100;
        crop.isReady = true;
    }
}

function updateLocalWeather(state) {
    const current = state.weather;
    let next = current;
    if (current === 'Ensolarado') {
        localSunStreak++;
        if (localSunStreak > 4 && Math.random() > 0.5) {
            next = 'Seca';
        } else if (Math.random() > 0.7) {
            next = 'Chuvoso';
            localSunStreak = 0;
        }
    } else if (current === 'Seca') {
        if (Math.random() > 0.6) next = 'Chuvoso';
    } else if (current === 'Chuvoso') {
        if (Math.random() > 0.4) {
            next = 'Ensolarado';
            localSunStreak = 1;
        }
    }
    state.weather = next;
}

function updateLocalEconomy(state) {
    const { economy, farm } = state;
    if (Math.random() > 0.6) {
        economy.totalMarketDemand += (Math.random() * 20 - 10);
    }
    if (economy.totalMarketDemand < 10) economy.totalMarketDemand = 10;
    const supplyRatio = farm.harvestedCrops === 0 ? 0.1 : farm.harvestedCrops;
    const pressure = economy.totalMarketDemand / supplyRatio;
    if (pressure > 2) {
        economy.pricePerCrop += Math.floor(Math.random() * 3) + 1;
    } else if (pressure < 0.5) {
        economy.pricePerCrop -= Math.floor(Math.random() * 3) + 1;
    }
    if (economy.pricePerCrop < 2) economy.pricePerCrop = 2;
    if (economy.pricePerCrop > 50) economy.pricePerCrop = 50;
}

function runLocalTick() {
    const state = ensureLocalState();
    state.time += 1;
    updateLocalWeather(state);
    updateLocalEconomy(state);
    state.farm.plantedCrops.forEach(crop => growLocalCrop(crop, state.weather));
    normalizeState(state);
    return { success: true };
}

function parseRequestBody(options) {
    if (!options || !options.body) return {};
    try {
        return JSON.parse(options.body);
    } catch (e) {
        return {};
    }
}

function useLocalFallback(reason) {
    ensureLocalState();
    if (!localFallbackLogged) {
        console.warn('Fallback local ativado', reason || '');
        localFallbackLogged = true;
    }
}

function handleLocalApi(path, options = {}) {
    const state = ensureLocalState();
    const method = (options.method || 'GET').toUpperCase();
    const body = parseRequestBody(options);

    if (path === '/shop/catalog' && method === 'GET') return deepClone(LOCAL_CATALOG);
    if (path === '/state' && method === 'GET') return deepClone(normalizeState(state));
    if (path === '/tick' && method === 'POST') return runLocalTick();

    if (path === '/action/sync-fuel' && method === 'POST') {
        const vehicles = Array.isArray(body.vehicles) ? body.vehicles : [];
        vehicles.forEach(item => {
            const vehicle = state.farm.inventory.vehicles.find(v => v.id === item.id);
            if (vehicle) vehicle.fuel = Math.max(0, item.fuel || 0);
        });
        return { success: true };
    }

    if (path === '/action/refuel' && method === 'POST') {
        const vehicle = state.farm.inventory.vehicles.find(v => v.id === body.vehicleId);
        if (!vehicle) return { success: false, message: 'Veiculo nao encontrado' };
        const model = LOCAL_CATALOG.vehicles[vehicle.modelId];
        if (!model) return { success: false, message: 'Modelo invalido' };
        const maxFuel = model.fuelCapacity || 100;
        const missingFuel = Math.max(0, maxFuel - (vehicle.fuel || 0));
        const cost = Math.floor(missingFuel * 2);
        if (missingFuel <= 0) return { success: false, message: 'Tanque ja esta cheio' };
        if (state.farm.money < cost) return { success: false, message: `Sem dinheiro! Custa ${cost} para abastecer.` };
        state.farm.money -= cost;
        vehicle.fuel = maxFuel;
        normalizeState(state);
        return { success: true, cost, newFuel: maxFuel, message: `Abastecido por $${cost}` };
    }

    if (path === '/shop/buy' && method === 'POST') {
        const { category, itemId } = body;
        const inventory = state.farm.inventory;
        if (category === 'vehicles') {
            const item = LOCAL_CATALOG.vehicles[itemId];
            if (!item || state.farm.money < item.price) return { success: false, message: 'Compra indisponivel' };
            state.farm.money -= item.price;
            const vehicle = { id: `veh_${localCounters.vehicle++}`, modelId: itemId, isOn: false, fuel: item.fuelCapacity || 100 };
            inventory.vehicles.push(vehicle);
            normalizeState(state);
            return { success: true, item: vehicle };
        }
        if (category === 'implements') {
            const item = LOCAL_CATALOG.implements[itemId];
            if (!item || state.farm.money < item.price) return { success: false, message: 'Compra indisponivel' };
            state.farm.money -= item.price;
            const implement = { id: `imp_${localCounters.implement++}`, modelId: itemId, isOn: false };
            inventory.implements.push(implement);
            normalizeState(state);
            return { success: true, item: implement };
        }
        if (category === 'seeds') {
            const item = LOCAL_CATALOG.seeds[itemId];
            if (!item || state.farm.money < item.price) return { success: false, message: 'Compra indisponivel' };
            state.farm.money -= item.price;
            state.farm.seedDepot += item.amount;
            normalizeState(state);
            return { success: true };
        }
        if (category === 'lands') {
            const item = LOCAL_CATALOG.lands[itemId];
            if (!item || state.farm.money < item.price || state.farm.unlockedLands.includes(itemId)) {
                return { success: false, message: 'Compra indisponivel' };
            }
            state.farm.money -= item.price;
            state.farm.unlockedLands.push(itemId);
            normalizeState(state);
            return { success: true };
        }
        if (category === 'items') {
            const item = LOCAL_CATALOG.items[itemId];
            if (!item || state.farm.money < item.price) return { success: false, message: 'Compra indisponivel' };
            if (itemId === 'cellphone' && state.farm.hasCellphone) return { success: false, message: 'Ja possui' };
            state.farm.money -= item.price;
            if (itemId === 'cellphone') state.farm.hasCellphone = true;
            normalizeState(state);
            return { success: true };
        }
        return { success: false, message: 'Categoria invalida' };
    }

    if (path === '/shop/sell' && method === 'POST') {
        const { category, itemId } = body;
        const inventory = state.farm.inventory;
        if (category === 'vehicles') {
            const idx = inventory.vehicles.findIndex(v => v.id === itemId);
            if (idx === -1) return { success: false, message: 'Veiculo nao encontrado' };
            const item = inventory.vehicles[idx];
            const model = LOCAL_CATALOG.vehicles[item.modelId];
            inventory.vehicles.splice(idx, 1);
            state.farm.money += Math.floor((model?.price || 0) * 0.8);
            normalizeState(state);
            return { success: true };
        }
        if (category === 'implements') {
            const idx = inventory.implements.findIndex(i => i.id === itemId);
            if (idx === -1) return { success: false, message: 'Implemento nao encontrado' };
            const item = inventory.implements[idx];
            const model = LOCAL_CATALOG.implements[item.modelId];
            inventory.implements.splice(idx, 1);
            state.farm.money += Math.floor((model?.price || 0) * 0.8);
            normalizeState(state);
            return { success: true };
        }
        if (category === 'lands') {
            if (itemId === 'field_1') return { success: false, message: 'Nao e possivel vender o campo principal' };
            const idx = state.farm.unlockedLands.indexOf(itemId);
            if (idx === -1) return { success: false, message: 'Terra nao encontrada' };
            const model = LOCAL_CATALOG.lands[itemId];
            if (!model) return { success: false, message: 'Modelo invalido' };
            state.farm.unlockedLands.splice(idx, 1);
            state.farm.money += Math.floor(model.price * 0.8);
            normalizeState(state);
            return { success: true };
        }
        return { success: false, message: 'Categoria invalida' };
    }

    if (path === '/action/plow' && method === 'POST') {
        const { x, y } = body;
        const key = `${x},${y}`;
        if (!isPointInUnlockedField(state, x, y)) return { success: false };
        const current = getLocalSoilState(state, key);
        if (current === 'normal' || current === 'harrowed') {
            state.farm.soil[key] = { state: 'plowed', dir: null };
            return { success: true };
        }
        return { success: false };
    }

    if (path === '/action/harrow' && method === 'POST') {
        const { x, y, dir } = body;
        const key = `${x},${y}`;
        if (!isPointInUnlockedField(state, x, y)) return { success: false };
        if (getLocalSoilState(state, key) === 'plowed') {
            state.farm.soil[key] = { state: 'harrowed', dir: dir || 'h' };
            return { success: true };
        }
        return { success: false };
    }

    if (path === '/action/plant' && method === 'POST') {
        const { x, y } = body;
        const key = `${x},${y}`;
        if (!isPointInUnlockedField(state, x, y)) return { success: false };
        if (getLocalSoilState(state, key) !== 'harrowed') return { success: false };
        if (state.farm.seederStorage <= 0) return { success: false };
        if (state.weather === 'Seca') return { success: false };
        state.farm.seederStorage -= 1;
        state.farm.soil[key] = { state: 'planted', dir: getLocalSoilDir(state, key) };
        state.farm.plantedCrops.push({ x, y, plantedTime: state.time, growthStage: 0, isReady: false, isDead: false });
        normalizeState(state);
        return { success: true };
    }

    if (path === '/action/harvest' && method === 'POST') {
        const { x, y } = body;
        if (state.farm.harvesterStorage >= state.farm.harvesterCapacity) return { success: false };
        const idx = state.farm.plantedCrops.findIndex(c => c.x === x && c.y === y);
        if (idx === -1) return { success: false };
        const crop = state.farm.plantedCrops[idx];
        if ((crop.isReady && !crop.isDead) || crop.isDead) {
            if (crop.isReady && !crop.isDead) state.farm.harvesterStorage += 1;
            state.farm.plantedCrops.splice(idx, 1);
            state.farm.soil[`${x},${y}`] = { state: 'normal', dir: null };
            normalizeState(state);
            return { success: true };
        }
        return { success: false };
    }

    if (path === '/action/unload' && method === 'POST') {
        if (state.farm.harvesterStorage <= 0) return { success: false };
        state.farm.harvestedCrops += state.farm.harvesterStorage;
        state.farm.harvesterStorage = 0;
        normalizeState(state);
        return { success: true };
    }

    if (path === '/action/truck/load-silo' && method === 'POST') {
        if (state.farm.harvestedCrops <= 0) return { success: false };
        if (state.farm.truckCargoType && state.farm.truckCargoType !== 'crops') return { success: false };
        const space = state.farm.truckCapacity - state.farm.truckStorage;
        if (space <= 0) return { success: false };
        const amount = Math.min(state.farm.harvestedCrops, space);
        state.farm.harvestedCrops -= amount;
        state.farm.truckStorage += amount;
        state.farm.truckCargoType = 'crops';
        normalizeState(state);
        return { success: true, loaded: amount };
    }

    if (path === '/action/truck/load-depot' && method === 'POST') {
        if (state.farm.seedDepot <= 0) return { success: false };
        if (state.farm.truckCargoType && state.farm.truckCargoType !== 'seeds') return { success: false };
        const space = state.farm.truckCapacity - state.farm.truckStorage;
        if (space <= 0) return { success: false };
        const amount = Math.min(state.farm.seedDepot, space);
        state.farm.seedDepot -= amount;
        state.farm.truckStorage += amount;
        state.farm.truckCargoType = 'seeds';
        normalizeState(state);
        return { success: true, loaded: amount };
    }

    if (path === '/shop/sell-crops' && method === 'POST') {
        if (state.farm.harvestedCrops <= 0) return { success: false, error: 'Silo vazio' };
        const profit = state.farm.harvestedCrops * state.economy.pricePerCrop;
        state.farm.money += profit;
        state.farm.harvestedCrops = 0;
        normalizeState(state);
        return { success: true, profit };
    }

    if (path === '/action/truck/transfer-seeds' && method === 'POST') {
        if (state.farm.truckCargoType !== 'seeds' || state.farm.truckStorage <= 0) return { success: false };
        const space = state.farm.seederCapacity - state.farm.seederStorage;
        if (space <= 0) return { success: false };
        const amount = Math.min(state.farm.truckStorage, space);
        state.farm.truckStorage -= amount;
        state.farm.seederStorage += amount;
        if (state.farm.truckStorage <= 0) state.farm.truckCargoType = null;
        normalizeState(state);
        return { success: true, transferred: amount };
    }

    return { success: false, message: `Offline action nao implementada: ${path}` };
}

async function apiJson(path, options = {}) {
    if (!multiplayerMode) {
        return handleLocalApi(path, options);
    }
    if (!API) {
        useLocalFallback('sem backend configurado para este host');
        return handleLocalApi(path, options);
    }
    try {
        const response = await fetch(`${API}${path}`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (e) {
        useLocalFallback(e.message);
        return handleLocalApi(path, options);
    }
}

// === Entities ===
let player;
let playerNameTag;
let cropsGroup, soilGfx;
let fieldSprites = {};
let decoGroup;

// === Dynamic vehicles ===
let vehicleSprites = []; // { id, type, sprite }
let vehiclePositions = {}; // { vehicleId: {x, y} } - rastreamento de posições físicas
let spawnedVehicleIds = new Set();
let activeVehIdx = -1; // index into vehicleSprites, -1 = on foot

// === Dynamic implements ===
let implementSprites = []; // { id, type, sprite, lastX, lastY, hitch }
let implementPositions = {}; // { implementId: {x, y} } - rastreamento de posições físicas
let spawnedImplementIds = new Set();

// === Gear system ===
// === Gear system ===
let maxGears = 4;
let transMode = 'manual'; // 'manual' | 'auto'
const RATIOS_4 = [0, 0.25, 0.50, 0.75, 1.0];
const RATIOS_6 = [0, 0.15, 0.28, 0.42, 0.58, 0.74, 0.88];
const CARDINAL_HEADINGS = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
const AUTO_DRIVE_SPEED_FACTOR = 0.7;
const AUTO_DRIVE_TURN_SPEED_FACTOR = 0.45;
const AUTO_DRIVE_MIN_SPEED = 0.05;
const AUTO_DRIVE_SPEED_LOSS_LIMIT = 45;
const AUTO_DRIVE_LANE_TOLERANCE = 6;
const AUTO_DRIVE_RECOVERY_CHECK_FRAMES = 120;
const AUTO_DRIVE_RECOVERY_MIN_MOVE = 10;
const AUTO_DRIVE_RECOVERY_MAX_ATTEMPTS = 3;
const AUTO_DRIVE_RECENT_TARGET_LIMIT = 6;

// === State ===
let toastTimer = null;

let keys;
let lastState = null;
let catalog = LOCAL_CATALOG; // Usar o catálogo local como padrão para evitar terras sumindo
let isHydrated = false;
let currentHour = 0;
let shopOpen = false;
let shopTab = 'vehicles';
let monitorVisible = false;
let vehicleSelectionIdx = 0; // Índice do veículo "selecionado" para cycling
let landBordersGfx;
let gpsGuideGfx;
let multiplayerMode = false;
let socket = null;
let otherPlayers = {}; // { socketId: { sprite, text } }

// === Zones ===
const HOUSE_POS = { x: 4480, y: 5760 };
const SILO_POS = { x: 4992, y: 5760 };
const SHOP_POS = { x: 5504, y: 5760 };
const SELL_POS = { x: 6016, y: 5760 };
const GAS_STATION_POS = { x: 6528, y: 5760 };
const IMPL_BARN_START = { x: 3968, y: 5824 };
const SHOP_PARKING_START = { x: 5504, y: 5824 };
let sfx = {}; // Sound effects registry
let masterVolume = 0.5;
let engineSound = null;
const STATIC_COLLIDERS = [
    { x: HOUSE_POS.x, y: HOUSE_POS.y, halfW: 58, halfH: 58 },
    { x: SILO_POS.x, y: SILO_POS.y, halfW: 54, halfH: 54 },
    { x: SHOP_POS.x, y: SHOP_POS.y, halfW: 62, halfH: 62 },
    { x: SELL_POS.x, y: SELL_POS.y, halfW: 62, halfH: 62 },
    { x: GAS_STATION_POS.x, y: GAS_STATION_POS.y, halfW: 56, halfH: 56 }
];

// ============================================================
//  TEXTURES — PNG Sprite Loading
// ============================================================
function preload() {
    // --- Terrain tiles ---
    this.load.image('grass', 'assets/terrain/grass.png');
    this.load.image('dirt', 'assets/terrain/dirt.png');
    this.load.image('road', 'assets/terrain/road.png');
    this.load.image('tree', 'assets/terrain/tree.png');
    this.load.image('lake', 'assets/terrain/lake.png');

    // --- Crops ---
    this.load.image('crop_1', 'assets/terrain/crop_1.png');
    this.load.image('crop_2', 'assets/terrain/crop_2.png');
    this.load.image('crop_3', 'assets/terrain/crop_3.png');

    // --- Buildings ---
    this.load.image('house', 'assets/buildings/house.png');
    this.load.image('silo', 'assets/buildings/silo.png');
    this.load.image('shop_bld', 'assets/buildings/shop.png');
    this.load.image('sell_bld', 'assets/buildings/sell.png');
    this.load.image('gas_station', 'assets/buildings/gas_station.png');

    // --- Player ---
    this.load.image('p_down', 'assets/ui/player_down.png');
    this.load.image('p_up', 'assets/ui/player_up.png');
    this.load.image('p_side', 'assets/ui/player_side.png');

    // --- Vehicles (single direction: facing right) ---
    const vehicleIds = [
        'tractor_mf275', 'tractor_valtra', 'tractor_nh', 'tractor_jd', 'tractor_case',
        'harvester_mf5650', 'harvester_nh', 'harvester_jd',
        'truck_vw', 'truck_mb', 'truck_scania'
    ];
    vehicleIds.forEach(id => {
        this.load.image('v_' + id, 'assets/vehicles/' + id + '.png');
    });

    // --- Implements (single direction: facing right) ---
    const implIds = [
        'plow_small', 'plow_medium', 'plow_large',
        'harrow_small', 'harrow_medium', 'harrow_large',
        'seeder_small', 'seeder_medium', 'seeder_large'
    ];
    implIds.forEach(id => {
        this.load.image('impl_' + id, 'assets/implements/' + id + '.png');
    });

    // --- Sounds ---
    const soundIds = [
        'engine_loop', 'engine_start', 'engine_stop',
        'plow', 'harrow', 'seed', 'harvest', 'fuel',
        'click', 'menu', 'buy'
    ];
    soundIds.forEach(id => {
        this.load.audio('sfx_' + id, 'assets/sounds/' + id + '.wav');
    });
}

function create() {
    this.cameras.main.setBounds(0, 0, W, H);
    this.add.tileSprite(W / 2, H / 2, W, H, 'grass').setDepth(-10);

    // Rodovias Principais
    this.add.tileSprite(W / 2, 2500, W, 100, 'road').setDepth(-9); // Via transversal
    this.add.tileSprite(2500, H / 2, 100, H, 'road').setDepth(-9); // Via marginal eixos
    // Estrada de terra conectando a fazenda
    this.add.tileSprite(W / 2, 5700, W - 4000, 80, 'dirt').setDepth(-9).setAlpha(0.6);

    soilGfx = this.add.graphics().setDepth(0);
    gpsGuideGfx = this.add.graphics().setDepth(0.2);
    landBordersGfx = this.add.graphics().setDepth(-4);
    cropsGroup = this.add.group();
    decoGroup = this.add.group();

    // Procedural Nature (Arvores e Lagos)
    for (let i = 0; i < 400; i++) {
        const tx = Phaser.Math.Between(0, W);
        const ty = Phaser.Math.Between(0, H);
        if (tx > 4000 && ty > 5000) continue; // Evitar o terreno central da fazenda e campos
        if (tx < 3000 && ty < 3000) continue; // Evitar meio da cidade
        const scale = Phaser.Math.FloatBetween(1.0, 1.8);
        const isLake = Math.random() > 0.92;
        const sp = this.add.sprite(tx, ty, isLake ? 'lake' : 'tree').setDepth(isLake ? -8 : 2);
        sp.setScale(isLake ? scale * 3 : scale);
        decoGroup.add(sp);
    }
    for (let i = 0; i < 15; i++) {
        // Casas figurantes na Cidade
        this.add.sprite(Phaser.Math.Between(500, 3000), Phaser.Math.Between(500, 2000), 'house').setDepth(1);
    }

    // Buildings
    this.add.sprite(HOUSE_POS.x, HOUSE_POS.y, 'house').setDepth(1);
    this.add.sprite(SILO_POS.x, SILO_POS.y, 'silo').setDepth(1);
    this.add.sprite(SHOP_POS.x, SHOP_POS.y, 'shop_bld').setDepth(1);
    this.add.sprite(SELL_POS.x, SELL_POS.y, 'sell_bld').setDepth(1);
    this.add.sprite(GAS_STATION_POS.x, GAS_STATION_POS.y, 'gas_station').setDepth(1);
    const ls = { font: '11px Courier New', fill: '#fff', backgroundColor: '#000a' };
    this.add.text(SILO_POS.x - 14, SILO_POS.y - 52, 'SILO', ls).setDepth(5);
    this.add.text(SHOP_POS.x - 14, SHOP_POS.y - 52, 'LOJA', ls).setDepth(5);
    this.add.text(SELL_POS.x - 18, SELL_POS.y - 52, 'VENDA', ls).setDepth(5);
    this.add.text(GAS_STATION_POS.x - 18, GAS_STATION_POS.y - 52, 'POSTO', ls).setDepth(5);
    this.add.text(HOUSE_POS.x - 14, HOUSE_POS.y - 52, 'CASA', ls).setDepth(5);
    renderLandZones();

    // Player spawns around Farm House
    player = this.add.sprite(HOUSE_POS.x + 50, HOUSE_POS.y + 50, 'p_down').setDepth(4);
    playerNameTag = this.add.text(player.x, player.y - 40, '', {
        fontSize: '14px', fill: '#ffffff', stroke: '#000000', strokeThickness: 3, padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(5).setVisible(false);
    this.cameras.main.startFollow(player);

    // Input
    keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W, a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S, d: Phaser.Input.Keyboard.KeyCodes.D,
        f: Phaser.Input.Keyboard.KeyCodes.F, e: Phaser.Input.Keyboard.KeyCodes.E,
        c: Phaser.Input.Keyboard.KeyCodes.C, l: Phaser.Input.Keyboard.KeyCodes.L, q: Phaser.Input.Keyboard.KeyCodes.Q,
        r: Phaser.Input.Keyboard.KeyCodes.R, v: Phaser.Input.Keyboard.KeyCodes.V,
        g: Phaser.Input.Keyboard.KeyCodes.G,
        h: Phaser.Input.Keyboard.KeyCodes.H,
        t: Phaser.Input.Keyboard.KeyCodes.T, tab: Phaser.Input.Keyboard.KeyCodes.TAB,
        esc: Phaser.Input.Keyboard.KeyCodes.ESC,
        shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        m: Phaser.Input.Keyboard.KeyCodes.M,
        n: Phaser.Input.Keyboard.KeyCodes.N,
        z: Phaser.Input.Keyboard.KeyCodes.Z,
        o: Phaser.Input.Keyboard.KeyCodes.O,
        b: Phaser.Input.Keyboard.KeyCodes.B
    });
    keys.f.on('down', doToggleVehicle, this); // F para Entrar/Sair
    keys.e.on('down', doToggleHitch, this);    // E para Engatar/Desengatar
    keys.c.on('down', doToggleEngine, this);   // C para Motor
    keys.l.on('down', doToggleImplementPower, this); // L para ligar Implemento
    keys.q.on('down', doContextAction, this);  // Q para Interagir (Silo, etc)

    // Marchas em R e V
    keys.r.on('down', doShiftUp, this);
    keys.v.on('down', doShiftDown, this);

    keys.g.on('down', doToggleTransmission, this); // G para Marcha Automática
    keys.h.on('down', doToggleAutoWork, this);     // H para AutoDrive
    keys.t.on('down', () => advanceHour());
    keys.esc.on('down', () => {
        if (shopOpen) closeShop();
        else if (document.getElementById('controls-modal').style.display === 'flex') closeControlsModal();
        else if (document.getElementById('tutorial-modal').style.display === 'flex') closeTutorialModal();
        else openPauseMenu();
    });
    keys.left.on('down', () => cycleVehicles(-1, this));
    keys.right.on('down', () => cycleVehicles(1, this));
    keys.m.on('down', toggleFullMap);
    keys.n.on('down', () => { monitorVisible = !monitorVisible; });
    keys.z.on('down', toggleCellphone);
    keys.b.on('down', toggleChat);
    // Removemos doRefuel em on('down') pois será contínuo no update()
    this.input.keyboard.disableGlobalCapture();

    this.time.addEvent({ delay: 20000, callback: advanceHour, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 5000, callback: syncFuel, callbackScope: this, loop: true });

    console.log("Phaser: Create finished. Starting API sync...");

    // Non-blocking parallel sync
    (async () => {
        try {
            await fetchCatalog();
        } catch (e) {
            console.warn("Falha no catálogo, usando fallback local");
        }
        try {
            await fetchState();
        } catch (e) {
            console.warn("Falha no estado, usando fallback local completo");
            lastState = ensureLocalState();
        }

        console.log("Phaser: Initial sync complete (com fallback)");

        setTimeout(hideLoading, 1000);
    })();

    // Initialize Audio registry synchronously
    const soundKeys = ['engine_loop', 'engine_start', 'engine_stop', 'plow', 'harrow', 'seed', 'harvest', 'fuel', 'click', 'menu', 'buy'];
    soundKeys.forEach(k => {
        try {
            sfx[k] = this.sound.add('sfx_' + k);
        } catch (e) { console.warn("Erro ao criar som:", k); }
    });
    if (sfx['engine_loop']) {
        sfx['engine_loop'].setLoop(true);
        sfx['engine_loop'].setVolume(0);
    }

    // Safety timeout: 10 seconds is too long, world should show anyway
    setTimeout(hideLoading, 5000);

    setInterval(fetchState, 3000);
}

function hideLoading() {
    console.log("Hiding loading screen...");
    const el = document.getElementById('loading-screen');
    if (el) {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.display = 'none';
            console.log("Loading screen removed from display.");
        }, 600);
    }
}

function showToast(message, tone = 'success') {
    const el = document.getElementById('hud-toast');
    if (!el) return;
    el.textContent = message;
    el.className = '';
    el.classList.add('show');
    if (tone) el.classList.add(tone);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        el.classList.remove('show', 'success', 'warning', 'error');
    }, 1900);
}

function normalizeAngle(angle) {
    let value = angle % (Math.PI * 2);
    if (value < 0) value += Math.PI * 2;
    return value;
}

function rotateAngleToward(current, target, maxStep) {
    const diff = Phaser.Math.Angle.Wrap(target - current);
    if (Math.abs(diff) <= maxStep) return normalizeAngle(target);
    return normalizeAngle(current + Math.sign(diff) * maxStep);
}

function snapAngleToCardinal(angle) {
    return CARDINAL_HEADINGS.reduce((closest, candidate) => {
        const closestDiff = Math.abs(Phaser.Math.Angle.Wrap(angle - closest));
        const candidateDiff = Math.abs(Phaser.Math.Angle.Wrap(angle - candidate));
        return candidateDiff < closestDiff ? candidate : closest;
    }, CARDINAL_HEADINGS[0]);
}

function getOwnedFieldAtPoint(x, y) {
    if (!catalog?.lands || !lastState?.farm?.unlockedLands) return null;
    for (const fid of lastState.farm.unlockedLands) {
        const land = catalog.lands[fid];
        if (land && x >= land.x && x <= land.x + land.w && y >= land.y && y <= land.y + land.h) {
            return { id: fid, land };
        }
    }
    return null;
}

function getActiveOwnedField() {
    const ent = getEntity();
    return getOwnedFieldAtPoint(ent.x, ent.y);
}

function getAutoDriveAxis(heading) {
    return Math.abs(Math.cos(heading)) >= 0.5 ? 'horizontal' : 'vertical';
}

function getFieldLaneBounds(land, axis) {
    if (axis === 'horizontal') {
        return { min: land.y + TILE / 2, max: land.y + land.h - TILE / 2 };
    }
    return { min: land.x + TILE / 2, max: land.x + land.w - TILE / 2 };
}

function snapLaneCenter(value, land, axis, step) {
    const bounds = getFieldLaneBounds(land, axis);
    const snapped = bounds.min + Math.round((value - bounds.min) / step) * step;
    return Phaser.Math.Clamp(snapped, bounds.min, bounds.max);
}

function getAutoDriveLaneStep(veh) {
    const widthTiles = (veh.type === 'tractor') ? getImplWidth(veh) : 1;
    return Math.max(TILE, widthTiles * TILE);
}

function hasAutoShiftCapability() {
    return getActiveModel()?.gearType === 'auto';
}

function hasAutoDriveCapability() {
    return !!getActiveModel()?.autoDrive;
}

function canUseAutoMode() {
    return hasAutoShiftCapability();
}

let pendingTilesCache = {};

function clearPendingTilesCache() {
    pendingTilesCache = {};
}

function getJobType(veh) {
    if (veh.type === 'harvester') return 'harvest';
    if (veh.type === 'tractor') {
        const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
        if (hImpl) {
            const implModel = catalog.implements[hImpl.modelId];
            return implModel?.type || null;
        }
    }
    return null;
}

function getAutoDriveTileKey(point) {
    if (!point || !isFinite(point.x) || !isFinite(point.y)) return null;
    return `${Math.floor(point.x / TILE) * TILE},${Math.floor(point.y / TILE) * TILE}`;
}

function rememberAutoDriveTarget(state, tileKey) {
    if (!state || !tileKey) return;
    if (!Array.isArray(state.recentTargets)) state.recentTargets = [];
    state.recentTargets = state.recentTargets.filter(key => key !== tileKey);
    state.recentTargets.push(tileKey);
    if (state.recentTargets.length > AUTO_DRIVE_RECENT_TARGET_LIMIT) {
        state.recentTargets = state.recentTargets.slice(-AUTO_DRIVE_RECENT_TARGET_LIMIT);
    }
}

function setAutoDriveImplementState(veh, enabled) {
    if (!veh) return;
    if (veh.type === 'harvester') {
        veh.toolOn = enabled;
        return;
    }
    if (veh.type !== 'tractor') return;
    const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
    if (hImpl) hImpl.isOn = enabled;
}

function getAutoDriveFieldContext(veh, fallbackState = null) {
    const fieldInfo = getOwnedFieldAtPoint(veh.sprite.x, veh.sprite.y);
    if (fieldInfo && (!fallbackState?.fieldId || fieldInfo.id === fallbackState.fieldId)) return fieldInfo;
    if (fallbackState?.field) {
        return {
            id: fallbackState.fieldId ?? null,
            land: fallbackState.field
        };
    }
    return fieldInfo || null;
}

function isValidAutoDriveTarget(veh, targetTile, field, state = veh.autoDriveState) {
    if (!targetTile || !field || !isFinite(targetTile.x) || !isFinite(targetTile.y)) return false;
    if (targetTile.x < field.x || targetTile.x > field.x + field.w) return false;
    if (targetTile.y < field.y || targetTile.y > field.y + field.h) return false;

    const tileKey = getAutoDriveTileKey(targetTile);
    if (!tileKey) return false;
    if (state?.workedTiles instanceof Set && state.workedTiles.has(tileKey)) return false;

    const [tx, ty] = tileKey.split(',').map(Number);
    return shouldWorkTile(veh, tx, ty);
}

function findPendingWorkTile(veh, land, jobType) {
    if (!jobType || !land) return null;
    const cacheKey = `${land.x}_${land.y}_${jobType}`;

    if (!pendingTilesCache[cacheKey]) {
        let tiles = [];
        const startX = Math.floor(land.x / TILE) * TILE;
        const startY = Math.floor(land.y / TILE) * TILE;
        const endX = startX + land.w;
        const endY = startY + land.h;

        for (let y = startY; y < endY; y += TILE) {
            for (let x = startX; x < endX; x += TILE) {
                // Ao invés de re-verificar regras de crop, usamos shouldWorkTile para a fonte de verdade
                // (isso garante que o estado do solo seja respeitado exatamente como na engine)
                const isPending = shouldWorkTile(veh, x, y);

                if (isPending) {
                    tiles.push({ x: x + TILE / 2, y: y + TILE / 2 });
                }
            }
        }
        pendingTilesCache[cacheKey] = tiles;
    }

    const availableTiles = pendingTilesCache[cacheKey];
    if (!availableTiles || availableTiles.length === 0) return null;

    const state = veh.autoDriveState || {};
    if (!state.recentTargets) state.recentTargets = [];
    const referenceHeading = Number.isFinite(state.resumeHeading)
        ? state.resumeHeading
        : (Number.isFinite(state.heading) ? state.heading : snapAngleToCardinal(veh.angle));
    const referenceAxis = state.axis || getAutoDriveAxis(referenceHeading);
    const lastRecoveryKey = getAutoDriveTileKey(state.lastRecoveryTarget);

    let bestTile = null;
    let maxScore = -Infinity;

    for (let i = 0; i < availableTiles.length; i++) {
        const t = availableTiles[i];
        const soilKey = `${Math.floor(t.x / TILE) * TILE},${Math.floor(t.y / TILE) * TILE}`;

        // 1. Evitar trabalhados nesta sessão
        if (state && state.workedTiles && state.workedTiles.has(soilKey)) continue;

        // 2. Prevenção de Loop (recentTargets)
        if (soilKey === lastRecoveryKey) continue;

        const dist = Math.hypot(t.x - veh.sprite.x, t.y - veh.sprite.y);

        // CÁLCULO DE SCORE
        let score = 10000 - dist; // Base: quanto mais perto melhor
        if (state.recentTargets.includes(soilKey)) score -= 3500;

        // Bônus: Início de faixa (preferir x mínimo para horizontal, y mínimo para vertical)
        const isStartOfLine = (referenceAxis === 'horizontal')
            ? (t.x <= land.x + TILE)
            : (t.y <= land.y + TILE);

        if (isStartOfLine) score += 2000;

        // Bônus: Continuidade (tem vizinho pendente na mesma linha?)
        const nextX = (referenceAxis === 'horizontal') ? t.x + TILE : t.x;
        const nextY = (referenceAxis === 'horizontal') ? t.y : t.y + TILE;

        const hasContinuity = availableTiles.some(at =>
            Math.abs(at.x - nextX) < 5 && Math.abs(at.y - nextY) < 5
        );
        if (hasContinuity) score += 1000;

        if (score > maxScore) {
            maxScore = score;
            bestTile = t;
        }
    }

    if (bestTile) {
        rememberAutoDriveTarget(state, getAutoDriveTileKey(bestTile));
    }

    return bestTile;
}

function enterAutoDriveRecovery(veh, targetTile, announce = true) {
    if (!veh?.autoDriveState) return false;

    const state = veh.autoDriveState;
    const fieldInfo = getAutoDriveFieldContext(veh, state);
    const field = fieldInfo?.land || state.field;
    if (!field) {
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - sem campo valido', 'error');
        return false;
    }

    let nextTarget = targetTile;
    if (!isValidAutoDriveTarget(veh, nextTarget, field, state)) {
        clearPendingTilesCache();
        nextTarget = findPendingWorkTile(veh, field, getJobType(veh));
    }

    if (!isValidAutoDriveTarget(veh, nextTarget, field, state)) {
        disableAutoDrive(veh, 'Campo completo!', 'success');
        return false;
    }

    const resumeHeading = Number.isFinite(state.resumeHeading)
        ? state.resumeHeading
        : (Number.isFinite(state.heading) ? state.heading : snapAngleToCardinal(veh.angle));

    state.mode = 'recovery';
    state.status = 'recovery';
    state.fieldId = fieldInfo?.id ?? state.fieldId ?? null;
    state.field = field;
    state.axis = state.axis || getAutoDriveAxis(resumeHeading);
    state.heading = null;
    state.resumeHeading = resumeHeading;
    state.targetTile = { x: nextTarget.x, y: nextTarget.y };
    state.turnPhase = null;
    state.shiftTarget = null;
    state.shiftHeading = null;
    state.targetAngle = null;
    state.laneDirection = 0;
    state.laneCenter = null;
    state.slowFrames = 0;
    state.lastTile = { x: -1, y: -1 };
    state.posCheckPos = { x: veh.sprite.x, y: veh.sprite.y };
    state.posCheckFrame = 0;
    state.lastPosition = { x: veh.sprite.x, y: veh.sprite.y };
    state.lastRecoveryTarget = { x: nextTarget.x, y: nextTarget.y };
    state.laneStep = state.laneStep || getAutoDriveLaneStep(veh);
    rememberAutoDriveTarget(state, getAutoDriveTileKey(nextTarget));

    setAutoDriveImplementState(veh, false);
    if (Math.abs(veh.velocity) < AUTO_DRIVE_MIN_SPEED) veh.velocity = AUTO_DRIVE_MIN_SPEED;

    if (announce) showToast('Navegando para próxima área...', 'warning');
    return true;
}

function triggerAutoDriveFallback(veh) {
    if (!veh.autoDriveState) return;
    const state = veh.autoDriveState;

    state.recoveryAttempts = (state.recoveryAttempts || 0) + 1;

    if (state.recoveryAttempts >= AUTO_DRIVE_RECOVERY_MAX_ATTEMPTS) {
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - erro crítico de navegação', 'error');
        return;
    }

    clearPendingTilesCache();
    const jobType = getJobType(veh);
    const fieldInfo = getAutoDriveFieldContext(veh, state);
    const targetTile = fieldInfo?.land ? findPendingWorkTile(veh, fieldInfo.land, jobType) : null;

    if (targetTile) {
        enterAutoDriveRecovery(veh, targetTile, true);
        return;
        // RESET COMPLETO DE ESTADO (User requirement)
        state.mode = 'recovery';
        state.targetTile = targetTile;
        state.turnPhase = 'straight';
        state.shiftTarget = null;
        state.shiftHeading = 0;
        state.targetAngle = 0;
        state.status = 'recovery';

        state.lastRecoveryTarget = targetTile;
        state.posCheckPos = { x: veh.sprite.x, y: veh.sprite.y };
        state.posCheckFrame = 0;

        // Levantar implemento imediatamente
        if (veh.type === 'harvester') veh.toolOn = false;
        else if (veh.type === 'tractor') {
            const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
            if (hImpl) hImpl.isOn = false;
        }

        showToast('Navegando para próxima área...', 'warning');
    } else {
        disableAutoDrive(veh, 'Campo completo!', 'success');
    }
}

function canAutoDriveNow(veh) {
    if (!veh) return { ok: false, reason: 'Entre em um veiculo para usar o AUTO DRIVE' };
    const model = catalog.vehicles[veh.modelId];
    if (!model || !model.autoDrive) return { ok: false, reason: 'Este veiculo nao possui piloto automatico' };
    if (!veh.engineOn) return { ok: false, reason: 'Ligue o motor para ativar o AUTO DRIVE' };

    const fieldInfo = getOwnedFieldAtPoint(veh.sprite.x, veh.sprite.y);
    if (!fieldInfo) return { ok: false, reason: 'Entre na area de plantio para usar o AUTO DRIVE' };

    if (Math.abs(veh.velocity) <= 0.01 && veh.gear < 1) {
        return { ok: false, reason: 'Engate uma marcha para ativar o AUTO DRIVE' };
    }

    if (veh.type === 'tractor') {
        const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
        if (!hImpl || !hImpl.isOn) {
            return { ok: false, reason: 'Ligue o implemento para usar o AUTO DRIVE' };
        }
    }

    if (veh.type === 'harvester' && !veh.toolOn) {
        return { ok: false, reason: 'Ligue a plataforma para usar o AUTO DRIVE' };
    }

    return { ok: true, fieldInfo };
}

function getAutoDriveStatus(veh) {
    if (!veh) return 'OFF';
    if (veh.autoDriveEnabled) return veh.autoDriveState?.status?.toUpperCase() || 'ACTIVE';
    const readyCheck = canAutoDriveNow(veh);
    return readyCheck.ok ? 'READY' : 'OFF';
}

function buildAutoDriveState(veh, fieldInfo) {
    const heading = snapAngleToCardinal(veh.angle);
    const axis = getAutoDriveAxis(heading);
    const laneStep = getAutoDriveLaneStep(veh);
    const crossValue = axis === 'horizontal' ? veh.sprite.y : veh.sprite.x;
    const laneCenter = snapLaneCenter(crossValue, fieldInfo.land, axis, laneStep);

    return {
        status: 'working',
        mode: 'working',
        fieldId: fieldInfo.id,
        field: fieldInfo.land,
        axis,
        heading,
        laneCenter,
        laneStep,
        laneDirection: 1,
        targetTile: null,
        turnPhase: 'straight',
        shiftTarget: null,
        shiftHeading: heading,
        resumeHeading: heading,
        slowFrames: 0,
        // Recovery system (position-based)
        recoveryAttempts: 0,
        posCheckPos: { x: veh.sprite.x, y: veh.sprite.y },
        posCheckFrame: 0,
        lastRecoveryTarget: null,
        lastPosition: { x: veh.sprite.x, y: veh.sprite.y },
        lastTile: { x: -1, y: -1 },
        recentTargets: [],
        activeTime: 0,
        workedTiles: new Set()
    };
}

function renderGpsGuides() {
    if (!gpsGuideGfx) return;
    gpsGuideGfx.clear();

    // Only show guides for the active vehicle
    const veh = getActiveVehicle();
    if (!veh) return;

    const model = catalog.vehicles[veh.modelId];
    if (!model?.autoDrive) return;

    const fieldInfo = veh.autoDriveEnabled ? { id: veh.autoDriveState.fieldId, land: veh.autoDriveState.field } : getOwnedFieldAtPoint(veh.sprite.x, veh.sprite.y);
    if (!fieldInfo) return;

    const axis = veh.autoDriveState?.axis || getAutoDriveAxis(snapAngleToCardinal(veh.angle));
    const laneStep = veh.autoDriveState?.laneStep || getAutoDriveLaneStep(veh);
    const laneBounds = getFieldLaneBounds(fieldInfo.land, axis);
    const guideAlpha = veh.autoDriveEnabled ? 0.34 : 0.16;

    gpsGuideGfx.lineStyle(1, 0x73c8ff, guideAlpha);
    if (axis === 'horizontal') {
        for (let y = laneBounds.min; y <= laneBounds.max + 0.1; y += laneStep) {
            gpsGuideGfx.beginPath();
            gpsGuideGfx.moveTo(fieldInfo.land.x, y);
            gpsGuideGfx.lineTo(fieldInfo.land.x + fieldInfo.land.w, y);
            gpsGuideGfx.strokePath();
        }
    } else {
        for (let x = laneBounds.min; x <= laneBounds.max + 0.1; x += laneStep) {
            gpsGuideGfx.beginPath();
            gpsGuideGfx.moveTo(x, fieldInfo.land.y);
            gpsGuideGfx.lineTo(x, fieldInfo.land.y + fieldInfo.land.h);
            gpsGuideGfx.strokePath();
        }
    }

    const focusLane = veh.autoDriveState?.turnPhase === 'shift' ? veh.autoDriveState.shiftTarget : veh.autoDriveState?.laneCenter;
    if (focusLane == null) return;

    gpsGuideGfx.lineStyle(2, 0xe9f8ff, veh.autoDriveEnabled ? 0.72 : 0.28);
    if (axis === 'horizontal') {
        gpsGuideGfx.beginPath();
        gpsGuideGfx.moveTo(fieldInfo.land.x, focusLane);
        gpsGuideGfx.lineTo(fieldInfo.land.x + fieldInfo.land.w, focusLane);
        gpsGuideGfx.strokePath();
    } else {
        gpsGuideGfx.beginPath();
        gpsGuideGfx.moveTo(focusLane, fieldInfo.land.y);
        gpsGuideGfx.lineTo(focusLane, fieldInfo.land.y + fieldInfo.land.h);
        gpsGuideGfx.strokePath();
    }
}

function disableAutoDrive(veh, message = 'AUTO DRIVE: OFF', tone = 'warning') {
    if (!veh) return;
    const wasActive = veh.autoDriveEnabled;
    if (!veh.autoDriveState) veh.autoDriveState = {};
    veh.autoDriveEnabled = false;
    veh.autoDriveState.status = 'idle';
    veh.autoDriveState.mode = 'idle';
    veh.autoDriveState.targetTile = null;
    if (wasActive && message) showToast(message, tone);
    renderGpsGuides();
    refreshStatusHUD();
}

function activateAutoDrive(veh) {
    if (!veh) return false;
    const check = canAutoDriveNow(veh);
    if (!check.ok) {
        showToast(check.reason, 'warning');
        return false;
    }

    const jobType = getJobType(veh);
    clearPendingTilesCache(); // Limpa no começo da sessão
    const targetTile = findPendingWorkTile(veh, check.fieldInfo.land, jobType);

    if (!targetTile) {
        showToast('Campo já está 100% completo', 'success');
        return false;
    }

    veh.autoDriveState = buildAutoDriveState(veh, check.fieldInfo);
    if (!enterAutoDriveRecovery(veh, targetTile, false)) return false;
    veh.autoDriveEnabled = true;
    veh.autoDriveState.status = 'recovery';

    renderGpsGuides();
    refreshStatusHUD();
    showToast('Procurando área não trabalhada...', 'info');
    return true;
}

// getAutoDriveNextLane e getAutoDriveShiftHeading removidos (logica movida para findPendingWorkTile + recovery)

function updateAutoDriveRoute(veh) {
    if (!veh.autoDriveEnabled || !veh.autoDriveState) return;

    const state = veh.autoDriveState;
    const activeField = getOwnedFieldAtPoint(veh.sprite.x, veh.sprite.y);

    // 1. Verificação de Campo
    if (!activeField || activeField.id !== state.fieldId) {
        state.status = 'fora_da_area';
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - fora da área de plantio', 'warning');
        return;
    }

    const field = state.field;
    const axis = state.axis;
    // Usar os limites absolutos do campo
    const forwardBounds = axis === 'horizontal'
        ? { min: field.x, max: field.x + field.w }
        : { min: field.y, max: field.y + field.h };

    if (state.turnPhase === 'straight') {
        const forwardValue = axis === 'horizontal' ? veh.sprite.x : veh.sprite.y;
        const movingPositive = axis === 'horizontal'
            ? Math.cos(state.heading) >= 0
            : Math.sin(state.heading) >= 0;

        const remaining = movingPositive ? forwardBounds.max - forwardValue : forwardValue - forwardBounds.min;

        // Detecta fim da linha com margem menor (0.2) e verificação de limite do campo
        if (remaining <= TILE * 0.2) {
            console.log('[AUTODRIVE] Fim da linha detectado, acionando fallback/navegação');
            triggerAutoDriveFallback(veh);
            return;
        }

        // Lookahead: verificar os próximos 3 a 5 tiles para ver se há trabalho na linha atual
        const stepDir = movingPositive ? TILE : -TILE;
        let hasWorkAhead = false;

        for (let i = 1; i <= 4; i++) {
            const checkX = axis === 'horizontal' ? veh.sprite.x + (stepDir * i) : veh.sprite.x;
            const checkY = axis === 'vertical' ? veh.sprite.y + (stepDir * i) : veh.sprite.y;

            // Verifica se está dentro do campo ainda
            if (checkX < field.x || checkX > field.x + field.w || checkY < field.y || checkY > field.y + field.h) {
                break;
            }

            // Arredonda para alinhar com o grid do solo
            const tx = Math.floor(checkX / TILE) * TILE;
            const ty = Math.floor(checkY / TILE) * TILE;

            if (shouldWorkTile(veh, tx, ty)) {
                hasWorkAhead = true;
                break;
            }
        }

        // Se não encontrou nenhum trabalho à frente nesta linha, pula para o próximo target (recovery)
        if (!hasWorkAhead) {
            console.log('[AUTODRIVE] Linha atual vazia à frente, pulando para a próxima faixa...');
            triggerAutoDriveFallback(veh);
            return;
        }
    }
}
function getAutoDriveTargetAngle(veh) {
    if (!veh.autoDriveEnabled || !veh.autoDriveState) return veh.angle;
    return veh.autoDriveState.heading;
}

function getAutoDriveSpeedLimit(veh, gearMaxSpeed) {
    if (!veh.autoDriveEnabled || !veh.autoDriveState) return gearMaxSpeed;
    // No modo working (linha reta), usamos o fator de velocidade padrão
    return Math.max(0.4, gearMaxSpeed * AUTO_DRIVE_SPEED_FACTOR);
}

function applyAutoDriveLaneCorrection(veh) {
    if (!veh.autoDriveEnabled || !veh.autoDriveState) return;
    const state = veh.autoDriveState;
    if (state.mode === 'recovery' || state.turnPhase !== 'straight') return;

    if (state.axis === 'horizontal') {
        veh.sprite.y = Phaser.Math.Linear(veh.sprite.y, state.laneCenter, 0.08);
    } else {
        veh.sprite.x = Phaser.Math.Linear(veh.sprite.x, state.laneCenter, 0.08);
    }
}

function isBlockedPosition(x, y, radius = 24) {
    if (STATIC_COLLIDERS.some(collider =>
        Math.abs(x - collider.x) <= collider.halfW + radius &&
        Math.abs(y - collider.y) <= collider.halfH + radius
    )) {
        return true;
    }

    if (!decoGroup) return false;
    for (const child of decoGroup.getChildren()) {
        const halfW = Math.max(TILE * 0.35, (child.displayWidth || TILE) * (child.texture.key === 'lake' ? 0.2 : 0.16));
        const halfH = Math.max(TILE * 0.35, (child.displayHeight || TILE) * (child.texture.key === 'lake' ? 0.2 : 0.16));
        if (Math.abs(x - child.x) <= halfW + radius && Math.abs(y - child.y) <= halfH + radius) {
            return true;
        }
    }
    return false;
}

function updateAutoDriveProgress(veh) {
    if (!veh.autoDriveEnabled || !veh.autoDriveState) return;
    const state = veh.autoDriveState;
    const lastPosition = state.lastPosition || { x: veh.sprite.x, y: veh.sprite.y };
    const delta = Phaser.Math.Distance.Between(veh.sprite.x, veh.sprite.y, lastPosition.x, lastPosition.y);
    state.lastPosition = { x: veh.sprite.x, y: veh.sprite.y };

    if (Math.abs(veh.velocity) < AUTO_DRIVE_MIN_SPEED || delta < 0.04) {
        state.slowFrames++;
    } else {
        state.slowFrames = 0;
    }

}

// ========== RECOVERY MODE: FULLY ISOLATED ==========
function runRecoveryLogicLegacy(veh) {
    const m = getVehicleModel(veh);
    if (!m) { disableAutoDrive(veh, 'AUTO DRIVE: OFF - erro crítico', 'error'); return; }

    const state = veh.autoDriveState;
    const target = state.targetTile;

    // 1. Validate target
    if (!target || !isFinite(target.x) || !isFinite(target.y)) {
        console.log('[RECOVERY] Target inválido, tentando fallback...');
        triggerAutoDriveFallback(veh);
        return;
    }

    // 2. Implemento SEMPRE levantado
    if (veh.type === 'harvester') veh.toolOn = false;
    else if (veh.type === 'tractor') {
        const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
        if (hImpl) hImpl.isOn = false;
    }

    // 3. Position-based stuck detection
    state.posCheckFrame = (state.posCheckFrame || 0) + 1;
    if (state.posCheckFrame >= 120) {
        const checkPos = state.posCheckPos || { x: veh.sprite.x, y: veh.sprite.y };
        const distMoved = Math.hypot(veh.sprite.x - checkPos.x, veh.sprite.y - checkPos.y);

        if (distMoved < 5) {
            console.log('[RECOVERY] Travado no recovery, tentando novo target...');
            triggerAutoDriveFallback(veh);
            return;
        } else if (distMoved > TILE * 2) {
            state.recoveryAttempts = 0;
        }

        state.posCheckPos = { x: veh.sprite.x, y: veh.sprite.y };
        state.posCheckFrame = 0;
    }

    // 4. Distance check - arrived at target?
    const dist = Math.hypot(target.x - veh.sprite.x, target.y - veh.sprite.y);

    if (dist < TILE) { // Alterado para TILE (User requirement)
        console.log('[RECOVERY] Chegou ao destino, validando continuidade...');

        // Validação de trabalho à frente antes de sair do recovery
        const fieldInfo = getOwnedFieldAtPoint(veh.sprite.x, veh.sprite.y);
        const jobType = getJobType(veh);

        if (fieldInfo) {
            // Tenta construir o estado e verifica se a linha atual tem algo pendente
            const testState = buildAutoDriveState(veh, fieldInfo);
            const aheadTile = {
                x: veh.sprite.x + Math.cos(testState.heading) * TILE,
                y: veh.sprite.y + Math.sin(testState.heading) * TILE
            };

            // Se o tile imediatamente à frente não é pendente, talvez não seja o melhor lugar para começar "working"
            const isAheadPending = shouldWorkTile(veh, Math.floor(aheadTile.x / TILE) * TILE, Math.floor(aheadTile.y / TILE) * TILE);

            if (isAheadPending) {
                state.mode = 'working';
                state.recoveryAttempts = 0;

                // Abaixar implemento
                if (veh.type === 'harvester') veh.toolOn = true;
                else if (veh.type === 'tractor') {
                    const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
                    if (hImpl) hImpl.isOn = true;
                }

                const workedTiles = state.workedTiles;
                veh.autoDriveState = testState;
                veh.autoDriveState.workedTiles = workedTiles;
                showToast('Trabalhando...', 'info');
                return;
            } else {
                console.log('[RECOVERY] Nada à frente, buscando novo alvo sem sair do recovery');
                triggerAutoDriveFallback(veh);
                return;
            }
        } else {
            disableAutoDrive(veh, 'Fora de campo após recovery', 'warning');
            return;
        }
    }

    // 5. Steering - direct angle to target
    const targetAngle = Math.atan2(target.y - veh.sprite.y, target.x - veh.sprite.x);
    if (!isFinite(targetAngle)) {
        console.log('[RECOVERY] Ângulo inválido, abortando');
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - erro crítico de navegação', 'error');
        return;
    }

    const baseTurnSpeed = m.turnSpeedBase || 0.10;
    veh.angle = rotateAngleToward(veh.angle, targetAngle, baseTurnSpeed);
    veh.angle = normalizeAngle(veh.angle);

    // 6. Throttle - simple forward acceleration
    const maxSpeed = m.speed;
    const ratios = m.gears === 6 ? RATIOS_6 : RATIOS_4;
    const gearMaxSpeed = maxSpeed * (ratios[veh.gear] || 0.25) * 0.8;
    let accel = (m.acceleration || 0.08) * 0.45;

    veh.velocity = Math.min(veh.velocity + accel, gearMaxSpeed);
    if (veh.velocity < AUTO_DRIVE_MIN_SPEED) veh.velocity = AUTO_DRIVE_MIN_SPEED;

    // 7. Movement - NO collision-disable, NO lane correction
    const vx = Math.cos(veh.angle) * veh.velocity;
    const vy = Math.sin(veh.angle) * veh.velocity;

    if (isFinite(vx) && isFinite(vy)) {
        veh.sprite.x = Phaser.Math.Clamp(veh.sprite.x + vx, TILE, W - TILE);
        veh.sprite.y = Phaser.Math.Clamp(veh.sprite.y + vy, TILE, H - TILE);
    }
    veh.sprite.rotation = veh.angle;

    // 8. Minimal RPM & fuel
    if (veh.engineOn) {
        veh.rpm = Phaser.Math.Clamp(Phaser.Math.Linear(veh.rpm, 1600, 0.15), 800, 3000);
        const fuelRate = 0.0005 + (veh.rpm / 3000) * 0.0015;
        veh.fuel = Math.max(0, (veh.fuel || 0) - fuelRate);
        if (veh.fuel <= 0) {
            disableAutoDrive(veh, 'AUTO DRIVE: OFF - sem combustível', 'error');
            return;
        }
    } else {
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - motor desligado', 'warning');
        return;
    }

    // 9. Auto shift
    if (m.gearType === 'auto') {
        if (Math.abs(veh.velocity) > gearMaxSpeed * 0.9 && veh.gear < m.gears) veh.gear++;
        else if (Math.abs(veh.velocity) < gearMaxSpeed * 0.3 && veh.gear > 1) veh.gear--;
    }

    // 10. Progress tracking
    veh.autoDriveState.activeTime += (1 / 60);

    console.log(`[RECOVERY] mode=${state.mode} dist=${dist.toFixed(1)} vel=${veh.velocity.toFixed(2)} attempts=${state.recoveryAttempts}`);
}

function runRecoveryLogic(veh) {
    const m = getVehicleModel(veh);
    if (!m) { disableAutoDrive(veh, 'AUTO DRIVE: OFF - erro critico', 'error'); return; }

    const state = veh.autoDriveState;
    const fieldInfo = getAutoDriveFieldContext(veh, state);
    const field = fieldInfo?.land || state.field;
    if (!field) {
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - sem campo valido', 'error');
        return;
    }

    state.field = field;
    if (fieldInfo?.id != null) state.fieldId = fieldInfo.id;

    if (!isValidAutoDriveTarget(veh, state.targetTile, field, state)) {
        console.log('[RECOVERY] Target invalido, tentando novo alvo...');
        if (!enterAutoDriveRecovery(veh, null, false)) return;
    }

    const target = state.targetTile;
    if (!target) {
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - sem alvo valido', 'error');
        return;
    }

    setAutoDriveImplementState(veh, false);

    state.posCheckFrame = (state.posCheckFrame || 0) + 1;
    if (state.posCheckFrame >= AUTO_DRIVE_RECOVERY_CHECK_FRAMES) {
        const checkPos = state.posCheckPos || { x: veh.sprite.x, y: veh.sprite.y };
        const distMoved = Math.hypot(veh.sprite.x - checkPos.x, veh.sprite.y - checkPos.y);

        if (distMoved < AUTO_DRIVE_RECOVERY_MIN_MOVE) {
            console.log('[RECOVERY] Sem movimento suficiente, escolhendo novo alvo...');
            triggerAutoDriveFallback(veh);
            return;
        }
        if (distMoved > TILE) state.recoveryAttempts = 0;

        state.posCheckPos = { x: veh.sprite.x, y: veh.sprite.y };
        state.posCheckFrame = 0;
    }

    const dist = Math.hypot(target.x - veh.sprite.x, target.y - veh.sprite.y);
    if (dist < TILE) {
        const liveField = getOwnedFieldAtPoint(veh.sprite.x, veh.sprite.y) || fieldInfo;
        if (!liveField?.land) {
            disableAutoDrive(veh, 'Fora de campo apos recovery', 'warning');
            return;
        }

        if (Number.isFinite(state.resumeHeading)) {
            veh.angle = normalizeAngle(state.resumeHeading);
            veh.sprite.rotation = veh.angle;
        }

        const workedTiles = state.workedTiles instanceof Set ? state.workedTiles : new Set();
        const recentTargets = Array.isArray(state.recentTargets) ? state.recentTargets.slice(-AUTO_DRIVE_RECENT_TARGET_LIMIT) : [];
        const activeTime = state.activeTime || 0;

        veh.autoDriveState = buildAutoDriveState(veh, liveField);
        veh.autoDriveState.workedTiles = workedTiles;
        veh.autoDriveState.recentTargets = recentTargets;
        veh.autoDriveState.activeTime = activeTime;
        veh.autoDriveState.recoveryAttempts = 0;
        veh.autoDriveState.lastPosition = { x: veh.sprite.x, y: veh.sprite.y };
        veh.autoDriveState.posCheckPos = { x: veh.sprite.x, y: veh.sprite.y };

        setAutoDriveImplementState(veh, true);
        renderGpsGuides();
        showToast('Trabalhando...', 'info');
        return;
    }

    const targetAngle = Math.atan2(target.y - veh.sprite.y, target.x - veh.sprite.x);
    if (!isFinite(targetAngle)) {
        console.log('[RECOVERY] Angulo invalido, buscando novo alvo...');
        triggerAutoDriveFallback(veh);
        return;
    }

    // No modo recovery, girar muito rápido ou diretamente para o alvo para evitar andar em círculos
    veh.angle = rotateAngleToward(veh.angle, targetAngle, 0.5); // Giro rápido
    veh.angle = normalizeAngle(veh.angle);

    const maxSpeed = m.speed;
    const ratios = m.gears === 6 ? RATIOS_6 : RATIOS_4;
    const gearMaxSpeed = maxSpeed * (ratios[veh.gear] || 0.25) * 0.8;

    // 🎯 SISTEMA REALISTA NO AUTODRIVE — Busca implemento via sprite (modelId correto)
    let totalLoadRecovery = (m.weight || 3000);
    const hImplRecovery = implementSprites.find(i => i.hitchedTo === veh.id);
    let implModelRecovery = null;
    if (hImplRecovery) {
        implModelRecovery = catalog.implements[hImplRecovery.modelId];
        if (implModelRecovery) {
            totalLoadRecovery += (implModelRecovery.weight || 1000);
        }
    }
    // Performance relativa ao peso base do veículo (1.0 sem implemento, < 1.0 com implemento)
    const baseWeight = (m.weight || 3000);
    let powerFactorRecovery = Phaser.Math.Clamp(baseWeight / totalLoadRecovery, 0.15, 1.0);
    // Penalidade por HP insuficiente
    if (implModelRecovery && implModelRecovery.requiredHp) {
        const hpRatio = (m.power || 50) / implModelRecovery.requiredHp;
        if (hpRatio < 1) powerFactorRecovery *= Math.pow(hpRatio, 2);
    }
    powerFactorRecovery = Math.max(0.05, powerFactorRecovery);
    const accelRecovery = (m.acceleration || 0.08) * 0.3 * 0.45 * powerFactorRecovery;

    veh.velocity = Math.min(veh.velocity + accelRecovery, gearMaxSpeed);
    if (veh.velocity < AUTO_DRIVE_MIN_SPEED) veh.velocity = AUTO_DRIVE_MIN_SPEED;

    const vx = Math.cos(veh.angle) * veh.velocity;
    const vy = Math.sin(veh.angle) * veh.velocity;
    if (isFinite(vx) && isFinite(vy)) {
        veh.sprite.x = Phaser.Math.Clamp(veh.sprite.x + vx, TILE, W - TILE);
        veh.sprite.y = Phaser.Math.Clamp(veh.sprite.y + vy, TILE, H - TILE);
    }
    veh.sprite.rotation = veh.angle;

    if (veh.engineOn) {
        veh.rpm = Phaser.Math.Clamp(Phaser.Math.Linear(veh.rpm, 1600, 0.15), 800, 3000);
        const fuelRate = 0.0005 + (veh.rpm / 3000) * 0.0015;
        veh.fuel = Math.max(0, (veh.fuel || 0) - fuelRate);
        if (veh.fuel <= 0) {
            disableAutoDrive(veh, 'AUTO DRIVE: OFF - sem combustivel', 'error');
            return;
        }
    } else {
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - motor desligado', 'warning');
        return;
    }

    if (m.gearType === 'auto') {
        if (Math.abs(veh.velocity) > gearMaxSpeed * 0.9 && veh.gear < m.gears) veh.gear++;
        else if (Math.abs(veh.velocity) < gearMaxSpeed * 0.3 && veh.gear > 1) veh.gear--;
    }

    veh.autoDriveState.activeTime += (1 / 60);
    console.log(`[RECOVERY] dist=${dist.toFixed(1)} vel=${veh.velocity.toFixed(2)} attempts=${state.recoveryAttempts}`);
}

function runVehicleLogic(veh, isControlled, delta = 16.66) {
    const m = getVehicleModel(veh);
    if (!m) return;

    // Garantir estado do AutoDrive
    if (!veh.autoDriveState) {
        veh.autoDriveState = {
            mode: 'working',
            turnPhase: 'straight',
            workedTiles: new Set(),
            laneDirection: 1,
            laneCenter: 0,
            status: 'idle',
            activeTime: 0,
            recoveryAttempts: 0,
            recentTargets: [],
            lastTile: { x: -1, y: -1 },
            posCheckPos: { x: veh.sprite.x, y: veh.sprite.y },
            posCheckFrame: 0
        };
    }

    // ===== RECOVERY INTERCEPT: ABSOLUTE PRIORITY =====
    if (veh.autoDriveEnabled && veh.autoDriveState.mode === 'recovery') {
        runRecoveryLogic(veh);
        return; // NADA mais roda
    }

    if (veh.autoDriveEnabled && veh.autoDriveState.mode !== 'working') {
        if (enterAutoDriveRecovery(veh, veh.autoDriveState.targetTile, false)) {
            runRecoveryLogic(veh);
        }
        return;
    }

    const state = veh.autoDriveState;
    if (!veh.workedTiles) veh.workedTiles = new Set();

    // In multiplayer, passengers should NOT run any physics/logic
    // They just follow the updates from vehicleUpdated event
    const isMPPassenger = multiplayerMode && socket && socket.id && veh.driverId && veh.driverId !== socket.id;
    if (isMPPassenger && isControlled) {
        return;
    }

    // 1. Sync global variables for active vehicle (Shim for legacy compatibility inside this function)
    const isVehActive = isControlled;
    const engineOn = veh.engineOn;
    const maxSpeed = m.speed;
    const ratios = m.gears === 6 ? RATIOS_6 : RATIOS_4;
    let gearMaxSpeed = maxSpeed * (ratios[veh.gear] || 0.25);
    if (isToolOn(veh)) gearMaxSpeed = Math.min(gearMaxSpeed, maxSpeed * 0.35);

    // Inputs (Override if controlled)
    let clutchPressed = veh.clutchPressed;
    let braking = false;
    let throttleForward = false;
    let throttleReverse = false;

    if (isVehActive && !veh.autoDriveEnabled) {
        // In multiplayer, only process inputs if WE are the driver
        const isActuallyPassenger = multiplayerMode && socket && socket.id && veh.driverId && veh.driverId !== socket.id;
        if (isActuallyPassenger) {
            // Passenger: no controls, just follow
        } else {
            veh.clutchPressed = !!(keys.shift && keys.shift.isDown);
            clutchPressed = veh.clutchPressed;
            veh.isBraking = !!(keys.space && keys.space.isDown);
            braking = veh.isBraking;
            throttleForward = keys.w.isDown;
            throttleReverse = keys.s.isDown;
        }
    }

    // Auto Drive Logic Override
    let autoDriveActive = veh.autoDriveEnabled && !!veh.autoDriveState;
    if (autoDriveActive) {
        if (!veh.engineOn) {
            disableAutoDrive(veh, 'AUTO DRIVE: OFF - motor desligado', 'warning');
        } else if (state.mode === 'working') {
            // Only enforce tool-on while in working mode
            if (veh.type === 'tractor') {
                const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
                if (!hImpl || !hImpl.isOn) disableAutoDrive(veh, 'AUTO DRIVE: OFF - implemento desligado', 'warning');
            } else if (veh.type === 'harvester' && !veh.toolOn) {
                disableAutoDrive(veh, 'AUTO DRIVE: OFF - plataforma desligada', 'warning');
            } else if (!getOwnedFieldAtPoint(veh.sprite.x, veh.sprite.y)) {
                disableAutoDrive(veh, 'AUTO DRIVE: OFF - fora da área de trabalho', 'warning');
            }
        }

        autoDriveActive = veh.autoDriveEnabled && !!veh.autoDriveState;
        if (autoDriveActive) {

            // ========== POSITION-BASED STUCK DETECTION (working only) ==========
            state.posCheckFrame = (state.posCheckFrame || 0) + 1;
            if (state.posCheckFrame >= AUTO_DRIVE_RECOVERY_CHECK_FRAMES) {
                const checkPos = state.posCheckPos || { x: veh.sprite.x, y: veh.sprite.y };
                const distMoved = Math.hypot(veh.sprite.x - checkPos.x, veh.sprite.y - checkPos.y);

                if (distMoved < AUTO_DRIVE_RECOVERY_MIN_MOVE) {
                    // Vehicle hasn't moved - enter recovery
                    triggerAutoDriveFallback(veh);
                    return;
                } else if (state.recoveryAttempts > 0 && distMoved > TILE * 2) {
                    state.recoveryAttempts = 0;
                }

                state.posCheckPos = { x: veh.sprite.x, y: veh.sprite.y };
                state.posCheckFrame = 0;
            }

            clutchPressed = false;
            braking = false;
            throttleForward = true;
            updateAutoDriveRoute(veh);
        }
    }

    const speedLimit = autoDriveActive ? getAutoDriveSpeedLimit(veh, gearMaxSpeed) : gearMaxSpeed;

    if (engineOn && veh.rpm > 500) {
        const baseTurnSpeed = m.turnSpeedBase || 0.10;
        const speedFraction = Math.min(Math.abs(veh.velocity) / Math.max(0.1, gearMaxSpeed), 1);
        const turnModifier = 1 - (speedFraction * 0.15);

        if (autoDriveActive) {
            const hasPendingTarget = !!state.targetTile && isFinite(state.targetTile.x) && isFinite(state.targetTile.y);
            const distToTarget = hasPendingTarget
                ? Math.hypot(state.targetTile.x - veh.sprite.x, state.targetTile.y - veh.sprite.y)
                : 0;
            if (!hasPendingTarget || distToTarget <= TILE) {
                const target = state.turnPhase === 'shift' ? veh.angle : state.heading;
                if (isFinite(target)) {
                    veh.angle = rotateAngleToward(veh.angle, target, baseTurnSpeed * turnModifier);
                }
            }
        } else if (isVehActive) {
            if (keys.a.isDown) veh.angle -= baseTurnSpeed * turnModifier;
            if (keys.d.isDown) veh.angle += baseTurnSpeed * turnModifier;
        }
    }
    veh.angle = normalizeAngle(veh.angle);

    // ============================================================================
    // 🎯 SISTEMA FÍSICO REALISTA V2 — Corrigido e Recalibrado
    // ============================================================================

    // 1️⃣ CALCULAR CARGA TOTAL E RESISTÊNCIA — Busca implemento via sprite (modelId correto)
    let totalLoad = (m.weight || 3000);
    let resistance = 0;
    const hImplPhysics = implementSprites.find(i => i.hitchedTo === veh.id);
    let implModelPhysics = null;

    if (hImplPhysics) {
        implModelPhysics = catalog.implements[hImplPhysics.modelId];
        if (implModelPhysics) {
            totalLoad += (implModelPhysics.weight || 1000);
            if (isToolOn(veh)) {
                resistance = (implModelPhysics.drag || 0.05);
            }
        }
    }

    // 2️⃣ PERFORMANCE RELATIVA AO PESO BASE
    // Veículo sozinho = 1.0, com implemento = proporcionalmente menor
    const baseWeight = (m.weight || 3000);
    let finalPower = Phaser.Math.Clamp(baseWeight / totalLoad, 0.15, 1.0);

    // 2.5️⃣ PENALIDADE POR HP INSUFICIENTE (não bloqueia, mas pune severamente)
    if (implModelPhysics && implModelPhysics.requiredHp) {
        const hpRatio = (m.power || 50) / implModelPhysics.requiredHp;
        if (hpRatio < 1) {
            // Penalidade quadrática: 50% HP → 25% performance, 33% HP → 11% performance
            finalPower *= Math.pow(hpRatio, 2);
        }
    }
    finalPower = Math.max(0.05, finalPower); // Mínimo absoluto para não travar

    // 3️⃣ PESO REDUZ VELOCIDADE MÁXIMA (mesma lógica: peso base / peso total)
    const loadPenalty = Phaser.Math.Clamp(baseWeight / totalLoad, 0.25, 1.0);
    const finalMaxSpeed = gearMaxSpeed * loadPenalty;

    // 4️⃣ RESISTÊNCIA CONTÍNUA do peso (proporcional)
    const weightDrag = totalLoad * 0.000002;

    // Throttle / inertia / clutch
    const dtSec = delta / 1000;
    const frameMult = dtSec * 60; // 1 at 60fps

    // 5️⃣ ACELERAÇÃO COM SISTEMA REALISTA
    if (engineOn && veh.rpm > 500 && !clutchPressed) {
        // Aceleração base
        let baseAccel = (m.acceleration || 0.08) * 0.35;
        // Ratios recalibrados para ter mais "força" nas marchas altas e evitar oscilação
        const accelRatios = m.gears === 6 ? [1.8, 1.4, 1.1, 0.9, 0.75, 0.6] : [1.6, 1.2, 0.9, 0.7];
        let gearMult = accelRatios[veh.gear - 1] || 1.0;

        // Aceleração depende da carga através de finalPower
        let accel = baseAccel * gearMult * finalPower;

        if (!isOnRoad(veh.sprite.x, veh.sprite.y)) accel *= 0.65;
        // Resistência do implemento ligado (multiplicador, não subtração)
        if (resistance > 0) accel *= (1 - resistance);
        accel = Math.max(0.005, accel); // Garante um mínimo de força

        if (throttleForward) {
            veh.velocity += accel * frameMult;
        }
        if (throttleReverse) {
            veh.velocity -= (accel * 0.6) * frameMult;
        }

        // 6️⃣ DESACELERAÇÃO SUAVE quando sem throttle
        if (!throttleForward && !throttleReverse) {
            const drag = 0.992;
            veh.velocity *= Math.pow(drag, frameMult);
        }
    } else {
        // 6️⃣ DESACELERAÇÃO SUAVE quando motor está desligado
        const drag = 0.992;
        veh.velocity *= Math.pow(drag, frameMult);
    }

    // 5️⃣ APLICAR RESISTÊNCIA CONTÍNUA do peso (SEM causar drift reverso)
    if (veh.velocity > 0) {
        veh.velocity = Math.max(0, veh.velocity - weightDrag * frameMult);
    } else if (veh.velocity < 0) {
        veh.velocity = Math.min(0, veh.velocity + weightDrag * frameMult);
    }

    // Só zerar velocity quando NÃO está acelerando (evita matar aceleração em construção)
    if (!throttleForward && !throttleReverse && Math.abs(veh.velocity) < 0.05) veh.velocity = 0;

    let brakeF = m.brakeForce || 0.2;
    if (braking && !autoDriveActive) {
        if (veh.velocity > 0) veh.velocity = Math.max(0, veh.velocity - (brakeF * frameMult));
        else if (veh.velocity < 0) veh.velocity = Math.min(0, veh.velocity + (brakeF * frameMult));
    }

    // 7️⃣ CRAWL REAL - Movimento lento quando muito pesado
    if (finalPower <= 0.2 && throttleForward) {
        veh.velocity = Math.max(veh.velocity, 0.15);
    }

    // 8️⃣ LIMITAR VELOCIDADE FINAL
    veh.velocity = Phaser.Math.Clamp(veh.velocity, -finalMaxSpeed, finalMaxSpeed);

    // 9️⃣ DEBUG COMPLETO (OBRIGATÓRIO)
    if ((veh.driverId === socket?.id || veh.isMyDriver || !multiplayerMode) && (isControlled || veh.autoDriveEnabled)) {
        if (!window.lastDebugPrint || Date.now() - window.lastDebugPrint > 1000) {
            console.log({
                power: m.power,
                baseWeight: baseWeight,
                totalWeight: totalLoad,
                finalPower: finalPower.toFixed(3),
                loadPenalty: loadPenalty.toFixed(3),
                velocity: veh.velocity.toFixed(3),
                finalMaxSpeed: finalMaxSpeed.toFixed(3),
                resistance: resistance.toFixed(3),
                implement: implModelPhysics ? implModelPhysics.name : 'nenhum',
                requiredHp: implModelPhysics?.requiredHp || 0,
                engineOn: engineOn,
                toolOn: isToolOn(veh)
            });
            window.lastDebugPrint = Date.now();
        }
    }

    // 4. Movement update
    if (Math.abs(veh.velocity) > 0.01) {
        const vx = Math.cos(veh.angle) * veh.velocity;
        const vy = Math.sin(veh.angle) * veh.velocity;

        if (isFinite(vx) && isFinite(vy)) {
            const nextX = veh.sprite.x + vx;
            const nextY = veh.sprite.y + vy;
            const clampedX = Phaser.Math.Clamp(nextX, TILE, W - TILE);
            const clampedY = Phaser.Math.Clamp(nextY, TILE, H - TILE);
            const hitWorldBounds = clampedX !== nextX || clampedY !== nextY;

            if (autoDriveActive && (hitWorldBounds || isBlockedPosition(clampedX, clampedY))) {
                veh.velocity = 0;
                disableAutoDrive(veh, 'AUTO DRIVE: OFF - colisão detectada', 'error');
            } else {
                veh.sprite.x = clampedX;
                veh.sprite.y = clampedY;
                applyAutoDriveLaneCorrection(veh);
            }

            if (Math.abs(vx) > Math.abs(vy)) veh.lastMoveDir = 'h';
            else if (Math.abs(vy) > Math.abs(vx)) veh.lastMoveDir = 'v';
        }
        veh.sprite.rotation = veh.angle;
    }

    // 5. Fuel & RPM (SISTEMA REALISTA V3)
    if (engineOn) {
        let fuelMult = 1.0;
        if (!isOnRoad(veh.sprite.x, veh.sprite.y)) fuelMult *= 1.35;
        if (isToolOn(veh)) fuelMult *= 1.6;

        const fuelConsumptionRate = (0.0005 + (veh.rpm / 3000) * 0.0015) * fuelMult;
        veh.fuel = Math.max(0, (veh.fuel || 0) - fuelConsumptionRate);
        if (veh.fuel <= 0) doStall(veh);

        const idleRPM = 800;
        const maxRPM = 2800;

        if (clutchPressed || veh.gear === 0) {
            if (throttleForward || throttleReverse) {
                veh.rpm = Phaser.Math.Linear(veh.rpm, maxRPM + 200, 0.12);
            } else {
                veh.rpm = Phaser.Math.Linear(veh.rpm, idleRPM, 0.08);
            }
        } else {
            // RPM baseado na velocidade relativa à marcha ATUAL (Não à velocidade final do veículo)
            const ratios = m.gears === 6 ? RATIOS_6 : RATIOS_4;
            const currentGearMaxSpeed = m.speed * (ratios[veh.gear] || 1.0);
            const speedInGearRatio = Math.abs(veh.velocity) / Math.max(0.1, currentGearMaxSpeed);

            let targetRpm = idleRPM + (speedInGearRatio * (maxRPM - idleRPM));

            // Torque/Slip Effect: Se estiver acelerando, o RPM deve subir para permitir a troca
            if (throttleForward || throttleReverse) {
                // Ratios para o cálculo do slip (mesmos da aceleração)
                const slipRatios = m.gears === 6 ? [1.8, 1.4, 1.1, 0.9, 0.75, 0.6] : [1.6, 1.2, 0.9, 0.7];
                const gearMult = slipRatios[veh.gear - 1] || 1.0;

                // Em marchas baixas o slip é forte (ajuda a subir), em marchas altas é fraco (ajuda a reduzir se pesado)
                const slipPower = (1 - speedInGearRatio) * 600 * gearMult;
                targetRpm += slipPower;
            }

            // Suavização
            veh.rpm = Phaser.Math.Linear(veh.rpm, targetRpm, 0.2);
        }

        veh.rpm = Phaser.Math.Clamp(veh.rpm, idleRPM, 3200);

        // Stall Realista: Se estiver em marcha alta e o RPM cair demais (Lugging/Motor Morrer)
        if (!autoDriveActive && !clutchPressed && veh.gear >= 3) {
            const luggingRPM = 1400;
            // Se tentar acelerar em marcha alta com giro baixo sem embreagem
            if (veh.rpm < luggingRPM && (throttleForward || throttleReverse)) {
                doStall(veh);
            }
        }

        // Stall de Parada: Se o giro cair demais com marcha engatada e sem embreagem
        if (!autoDriveActive && !clutchPressed && veh.gear > 0) {
            if (veh.rpm < 650 && Math.abs(veh.velocity) < 0.1 && (throttleForward || throttleReverse)) {
                doStall(veh);
            }
        }
    } else {
        veh.rpm = Math.max(0, veh.rpm - 50);
    }

    // 6. Auto Shift (RPM-BASED com Histerese Inteligente)
    const autoShiftEnabled = m.gearType === 'auto' && transMode === 'auto';
    if (autoShiftEnabled && engineOn) {
        // Shifting points ajustados para serem mais sensíveis sob carga
        const upShiftRPM = 2500;
        const downShiftRPM = (veh.gear >= 5) ? 1600 : 1300;
        if (veh.rpm > upShiftRPM && veh.gear < m.gears) {
            veh.gear++;
            veh.rpm -= 800; // Simular queda de giro na troca
        } else if (veh.rpm < downShiftRPM && veh.gear > 1) {
            veh.gear--;
            veh.rpm += 600; // Simular pulo de giro na redução
        }
    }

    // 7. Auto Work Execution
    if (engineOn && isToolOn(veh) && veh.velocity !== 0) {
        let workX = veh.sprite.x;
        let workY = veh.sprite.y;

        // Offset if it's a tractor pulling an implement
        if (veh.type === 'tractor') {
            const dist = TILE * 0.65;
            workX -= Math.cos(veh.sprite.rotation) * dist;
            workY -= Math.sin(veh.sprite.rotation) * dist;
        }

        const tx = Math.floor(workX / TILE) * TILE;
        const ty = Math.floor(workY / TILE) * TILE;
        if (tx !== veh.autoDriveState.lastTile.x || ty !== veh.autoDriveState.lastTile.y) {
            // Aplica a largura correta (Pequeno=1, Medio=2, Grande=3)
            const width = getImplWidth(veh);
            const tiles = [{ x: tx, y: ty }];

            if (width >= 2) tiles.push(veh.lastMoveDir === 'h' ? { x: tx, y: ty - TILE } : { x: tx + TILE, y: ty });
            if (width >= 3) tiles.push(veh.lastMoveDir === 'h' ? { x: tx, y: ty + TILE } : { x: tx - TILE, y: ty });

            for (const t of tiles) {
                if (shouldWorkTile(veh, t.x, t.y)) {
                    if (veh.type === 'harvester') {
                        triggerHarvest(veh, t.x, t.y);
                        playActionSound('harvest');
                    }
                    if (veh.type === 'tractor') {
                        triggerImpl(veh, t.x, t.y);
                        const hImplWork = implementSprites.find(i => i.hitchedTo === veh.id);
                        const implWorkModel = hImplWork ? catalog.implements[hImplWork.modelId] : null;
                        if (implWorkModel) playActionSound(implWorkModel.type); // plow, harrow, seed
                    }

                    if (veh.autoDriveEnabled) {
                        veh.autoDriveState.workedTiles.add(`${t.x},${t.y}`);
                    }
                }
            }
            veh.autoDriveState.lastTile = { x: tx, y: ty };
        }
    }
}

let lastActionSoundTime = 0;
function playActionSound(type) {
    if (!sfx[type]) return;
    const now = Date.now();
    if (now - lastActionSoundTime < 300) return; // Cooldown de 300ms para evitar spam

    try {
        sfx[type].play({ volume: masterVolume * 0.4 });
        lastActionSoundTime = now;
    } catch (e) { }
}

function playSFX(key, vol = 1) {
    if (sfx[key]) {
        try { sfx[key].play({ volume: masterVolume * vol }); } catch (e) { }
    }
}

function update(time, delta) {
    if (shopOpen) return;
    if (!keys) return;

    // 1. Update each vehicle independently
    vehicleSprites.forEach((veh, idx) => {
        const isControlled = multiplayerMode ? (veh.driverId === socket?.id) : (idx === activeVehIdx);
        runVehicleLogic(veh, isControlled, delta);
    });

    // 2. Sync active vehicle state to globals (Legacy support for HUD/UI)
    const activeVeh = getActiveVehicle();
    if (activeVeh) {
        player.x = activeVeh.sprite.x;
        player.y = activeVeh.sprite.y;
        player.setVisible(false);
        vehiclePositions[activeVeh.id] = { x: activeVeh.sprite.x, y: activeVeh.sprite.y };

        // Reposition own name tag above vehicle
        if (playerNameTag) {
            let offsetY = -40;
            // Segurança contra socket nulo no modo Solo
            const myId = (multiplayerMode && socket) ? socket.id : null;
            if (activeVeh.driverId === myId || !multiplayerMode) offsetY = -60;
            else offsetY = -35; // Passenger offset
            playerNameTag.setPosition(player.x, player.y + offsetY).setVisible(true);
        }

        updateDashboard();
        refreshStatusHUD();
        refreshGearHUD();
    } else {
        // Player on foot movement
        player.setVisible(true);
        if (playerNameTag) playerNameTag.setPosition(player.x, player.y - 40).setVisible(true);
        let vx = 0, vy = 0;
        if (keys.a.isDown) vx = -3;
        if (keys.d.isDown) vx = 3;
        if (keys.w.isDown) vy = -3;
        if (keys.s.isDown) vy = 3;
        player.x = Phaser.Math.Clamp(player.x + vx, TILE, W - TILE);
        player.y = Phaser.Math.Clamp(player.y + vy, TILE, H - TILE);

        // Multiplayer Sync: Visibility fix
        player.setVisible(true);

        const pvx = vx;
        const pvy = vy;
        if (pvx > 0) { player.setTexture('p_side'); player.setFlipX(false); }
        else if (pvx < 0) { player.setTexture('p_side'); player.setFlipX(true); }
        else if (pvy > 0) { player.setTexture('p_down'); }
        else if (pvy < 0) { player.setTexture('p_up'); }

        // No vehicle active, HUD handles this
    }

    handleContinuousActions();

    // 3. Visuals that depend on overall state
    renderMiniMap();
    renderGpsGuides();

    if (!window.lastMonitorUpdate || Date.now() - window.lastMonitorUpdate > 300) {
        renderFieldMonitor();
        window.lastMonitorUpdate = Date.now();
    }

    // Hitch visual for all vehicles
    vehicleSprites.forEach(v => {
        if (v.type === 'tractor') {
            const hImpl = implementSprites.find(i => i.hitchedTo === v.id);
            if (hImpl && hImpl.sprite) {
                const dist = TILE * 0.65;
                // Use sprite rotation to support both local physics and remote sync
                const rot = v.sprite.rotation;
                hImpl.sprite.x = v.sprite.x - Math.cos(rot) * dist;
                hImpl.sprite.y = v.sprite.y - Math.sin(rot) * dist;
                hImpl.sprite.rotation = rot;
                implementPositions[hImpl.id] = { x: hImpl.sprite.x, y: hImpl.sprite.y };
            }
        }
    });

    // ============================================================
    // MULTIPLAYER SYNC (PHASE 1)
    // ============================================================
    if (multiplayerMode && socket && socket.connected) {
        if (!this._lastMoveEmit || Date.now() - this._lastMoveEmit > 30) { // ~33fps sync
            const activeVeh = getActiveVehicle();

            // Sync Player Movement
            socket.emit('playerMove', {
                x: activeVeh ? activeVeh.sprite.x : player.x,
                y: activeVeh ? activeVeh.sprite.y : player.y,
                angle: activeVeh ? activeVeh.sprite.rotation : player.rotation,
                vehicleId: activeVeh ? activeVeh.id : null
            });

            // Sync Vehicle Movement only if WE are the driver
            if (activeVeh && (!multiplayerMode || !activeVeh.driverId || activeVeh.driverId === socket.id)) {
                // Determine implement state for tractors
                let impOn = false;
                if (activeVeh.type === 'tractor') {
                    const hImpl = implementSprites.find(i => i.hitchedTo === activeVeh.id);
                    if (hImpl) impOn = hImpl.isOn;
                }

                socket.emit('vehicleUpdate', {
                    id: activeVeh.id,
                    x: activeVeh.sprite.x,
                    y: activeVeh.sprite.y,
                    angle: activeVeh.sprite.rotation,
                    velocity: activeVeh.velocity,
                    isOn: activeVeh.engineOn,
                    gear: activeVeh.gear,
                    rpm: activeVeh.rpm,
                    fuel: activeVeh.fuel,
                    toolOn: activeVeh.type === 'harvester' ? activeVeh.toolOn : impOn
                });
            }

            this._lastMoveEmit = Date.now();
        }
    }

    updateAudio();
}

function updateAudio() {
    const veh = getActiveVehicle();
    if (!veh || !sfx['engine_loop']) return;

    if (veh.engineOn) {
        if (!sfx['engine_loop'].isPlaying) {
            try { sfx['engine_loop'].play(); } catch (e) { }
        }
        try {
            // Dynamic pitch and volume based on RPM/Speed
            const loadRatio = Math.min(1.5, (veh.rpm || 800) / 2500);
            const speedFactor = Math.min(1, Math.abs(veh.velocity) / Math.max(0.1, getVehicleModel(veh)?.speed || 5));
            sfx['engine_loop'].setRate(0.8 + loadRatio * 0.4);
            sfx['engine_loop'].setVolume(masterVolume * (0.2 + speedFactor * 0.3));
        } catch (e) { }
    } else {
        if (sfx['engine_loop'].isPlaying) {
            try { sfx['engine_loop'].stop(); } catch (e) { }
        }
    }
}

function handleContinuousActions() {
    if (!lastState) return;
    const veh = getActiveVehicle();
    if (!veh) return;

    // Abastecimento no Posto (O)
    if (keys.o.isDown && near(veh.sprite, GAS_STATION_POS, 100)) {
        const m = getVehicleModel(veh);
        const mainCap = m?.fuelCapacity || 100;

        // Prioridade 1: Tanque principal
        if (veh.fuel < mainCap) {
            veh.fuel += 2;
            if (veh.fuel > mainCap) veh.fuel = mainCap;

            if (!veh._lastRefuelReq || Date.now() - veh._lastRefuelReq > 500) {
                apiJson('/action/refuel', { method: 'POST', body: JSON.stringify({ amount: 2 }) }).catch(e => e);
                veh._lastRefuelReq = Date.now();
            }
        }
        // Prioridade 2: Tanque de carga (apenas para caminhão)
        else if (veh.type === 'truck') {
            const tankCap = m.tankCapacity || 1000;
            if (!veh.fuelTank) veh.fuelTank = 0;

            if (veh.fuelTank < tankCap) {
                veh.fuelTank += 5;
                if (veh.fuelTank > tankCap) veh.fuelTank = tankCap;

                if (!veh._lastRefuelReq || Date.now() - veh._lastRefuelReq > 500) {
                    apiJson('/action/refuel', { method: 'POST', body: JSON.stringify({ amount: 5 }) }).catch(e => e);
                    veh._lastRefuelReq = Date.now();
                }
            }
        }
        updateDashboard();
    }

    // Transferência Caminhão -> Veículo (Q)
    if (keys.q.isDown && veh.type === 'truck' && veh.fuelTank > 0) {
        for (const target of vehicleSprites) {
            if (target.id === veh.id) continue;
            if (near(veh.sprite, target.sprite, 100)) {
                const tCap = getVehicleModel(target)?.fuelCapacity || 100;
                if (target.fuel < tCap) {
                    target.fuel += 1;
                    veh.fuelTank -= 1;
                    if (target.fuel > tCap) {
                        veh.fuelTank += (target.fuel - tCap); // Devolve o excesso
                        target.fuel = tCap;
                    }
                    if (target.id === activeVehIdx || veh.id === activeVehIdx) updateDashboard();
                }
            }
        }
    }
}

// ============================================================
//  HELPERS
// ============================================================
function isOnRoad(x, y) {
    // Via transversal
    if (y >= 2450 && y <= 2550) return true;
    // Via marginal eixos
    if (x >= 2450 && x <= 2550) return true;
    return false;
}

function getEntity() {
    if (activeVehIdx >= 0) return vehicleSprites[activeVehIdx].sprite;
    return player;
}
function getActiveVehicle() {
    if (activeVehIdx < 0) return null;
    return vehicleSprites[activeVehIdx] || null;
}
function getActiveModel() {
    const veh = getActiveVehicle();
    if (!veh || !catalog?.vehicles) return null;
    return getVehicleModel(veh);
}
function isEngineOn(veh) {
    return !!veh?.engineOn;
}
function isToolOn(veh) {
    if (!veh) return false;
    if (veh.type === 'harvester') return !!veh.toolOn;
    if (veh.type === 'tractor') {
        const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
        return !!hImpl?.isOn;
    }
    return false;
}
function getCurrentFieldName() {
    if (!catalog?.lands) return 'Fora de campo';
    const ent = getEntity();
    for (const [fid, land] of Object.entries(catalog.lands)) {
        if (ent.x >= land.x && ent.x <= land.x + land.w && ent.y >= land.y && ent.y <= land.y + land.h) {
            return land.name || fid;
        }
    }
    return 'Fora de campo';
}
function getVehicleModel(veh) {
    if (!veh || !catalog) return null;
    const model = catalog.vehicles[veh.modelId];
    if (!model) return null;
    return {
        ...model,
        hp: model.hp || 50,
        speed: model.speed || 5,
        gears: model.gears || 4,
        gearType: model.gearType || 'manual',
        autoDrive: !!model.autoDrive
    };
}

function getVehiclePhysics(model) {
    if (!model) model = { type: 'tractor' };

    // Padrões por tipo - PHYSICS SIMPLES E ESTÁVEL
    const defaults = {
        tractor: {
            acceleration: 0.08,
            friction: 0.96,      // Leve, perde 4% por frame quando sem aceleração
            maxSpeed: 5
        },
        harvester: {
            acceleration: 0.07,
            friction: 0.95,      // Leve, perde 5% por frame
            maxSpeed: 4
        },
        truck: {
            acceleration: 0.09,
            friction: 0.94,      // Leve, perde 6% por frame
            maxSpeed: 7
        }
    };

    const typePhysics = defaults[model.type] || defaults.tractor;

    return {
        acceleration: model.acceleration || typePhysics.acceleration,
        friction: model.friction || typePhysics.friction,
        maxSpeed: model.maxSpeed || model.speed || typePhysics.maxSpeed
    };
}
function getSpeed(veh) {
    if (!veh) return 3;
    const m = getVehicleModel(veh);
    if (!m) return 3;
    const ratios = m.gears === 6 ? RATIOS_6 : RATIOS_4;
    return m.speed * (ratios[veh.gear] || 0.25);
}
function isInTractor() { return activeVehIdx >= 0 && vehicleSprites[activeVehIdx].type === 'tractor'; }
function isInHarvester() { return activeVehIdx >= 0 && vehicleSprites[activeVehIdx].type === 'harvester'; }
function isInTruck() { return activeVehIdx >= 0 && vehicleSprites[activeVehIdx].type === 'truck'; }
function getImplWidth(veh) {
    // Busca implemento acoplado à este veículo específico
    const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
    if (!hImpl || !catalog) return 1;
    const w = catalog.implements[hImpl.modelId].width || 1;
    // Tradução para TILES (1=1, 2=2, 3=3)
    return w;
}
function shouldWorkTile(veh, tx, ty) {
    if (!lastState?.farm) return false;
    const soilKey = `${tx},${ty}`;
    const soil = lastState.farm.soil[soilKey];
    const st = typeof soil === 'object' ? soil.state : (soil || 'normal');

    // 1. Verificar se a tile está TOTALMENTE dentro de alguma terra desbloqueada (Alinhamento 64px)
    let inField = false;
    if (lastState.farm.unlockedLands) {
        for (const fid of lastState.farm.unlockedLands) {
            const f = catalog.lands[fid];
            if (f && tx >= f.x && (tx + 64) <= (f.x + f.w) && ty >= f.y && (ty + 64) <= (f.y + f.h)) {
                inField = true;
                break;
            }
        }
    }
    if (!inField) return false;

    // Se já foi trabalhado por ESTA máquina nesta sessão de autodrive, ignora
    if (veh.autoDriveEnabled && veh.autoDriveState.workedTiles.has(soilKey)) return false;

    if (veh.type === 'harvester') {
        const crop = lastState.farm.plantedCrops.find(c => Math.abs(c.x - tx) < 5 && Math.abs(c.y - ty) < 5);
        return crop && crop.isReady && !crop.isDead;
    }

    const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
    if (!hImpl) return false;
    const model = catalog.implements[hImpl.modelId];
    if (!model) return false;

    const type = model.type;
    if (type === 'plow') return st !== 'plowed';
    if (type === 'harrow') return st === 'plowed';
    if (type === 'seeder') return st === 'harrowed';

    return false;
}
function getCurrentHp() {
    const m = getActiveModel();
    return m?.hp || 0;
}
function near(a, b, d) { return Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y) < (d || 80); }

// Função de spawn inteligente com rastreamento de posições
function getNextParkingSpot(category) {
    if (category === 'vehicle') {
        // Grid dinâmico no estacionamento da loja: 6 colunas, espaçamento 100px
        const occupied = Object.values(vehiclePositions);
        for (let i = 0; i < 20; i++) {
            const x = SHOP_PARKING_START.x + (i % 6) * 100;
            const y = SHOP_PARKING_START.y + Math.floor(i / 6) * 100;
            const spot = { x, y };

            // Verificar se o espaço está livre (distância > 50px)
            const isFree = !occupied.some(v => Phaser.Math.Distance.Between(v.x, v.y, spot.x, spot.y) < 50);
            if (isFree) return spot;
        }
        return null; // Sem espaço disponível
    } else if (category === 'implement') {
        // Grid dinâmico no galpão: 5 colunas, espaçamento 120px
        const occupied = Object.values(implementPositions);
        for (let i = 0; i < 30; i++) {
            const x = IMPL_BARN_START.x + (i % 5) * 120;
            const y = IMPL_BARN_START.y + Math.floor(i / 5) * 120;
            const spot = { x, y };

            const isFree = !occupied.some(impl => Phaser.Math.Distance.Between(impl.x, impl.y, spot.x, spot.y) < 50);
            if (isFree) return spot;
        }
        return null; // Sem espaço disponível
    }
    return null;
}

// ============================================================
//  VEHICLE SPAWNING
// ============================================================
function ensureVehicles() {
    if (!lastState || !catalog) return;
    const scene = game.scene.scenes[0];
    if (!scene) return;
    const vehicles = multiplayerMode ? Object.values(lastState.vehicles || {}) : (lastState.farm.inventory.vehicles || []);
    console.log(`[ensureVehicles] Modo: ${multiplayerMode ? 'Multi' : 'Solo'}, Total: ${vehicles.length}, CatalogOK: ${!!catalog.vehicles}`);
    const activeIds = new Set(vehicles.map(v => v.id));

    vehicleSprites = vehicleSprites.filter(v => {
        if (activeIds.has(v.id)) return true;
        // Ao remover veículo, liberar seu implemento se houver
        const hImpl = implementSprites.find(i => i.hitchedTo === v.id);
        if (hImpl) hImpl.hitchedTo = null;
        delete vehiclePositions[v.id];
        spawnedVehicleIds.delete(v.id);
        v.sprite.destroy();
        return false;
    });

    if (activeVehIdx >= vehicleSprites.length) activeVehIdx = -1;

    vehicles.forEach(veh => {
        const modelId = veh.modelId;
        const existing = vehicleSprites.find(v => v.id === veh.id);
        if (existing) {
            return;
        }
        if (!spawnedVehicleIds.has(veh.id)) {
            const model = catalog.vehicles[modelId];
            if (!model) {
                console.warn(`[ensureVehicles] Modelo ${modelId} não encontrado para ${veh.id}. Catalog keys:`, Object.keys(catalog.vehicles));
                return;
            }
            const texKey = 'v_' + modelId;
            let startX = veh.x, startY = veh.y;
            if (startX === undefined || startY === undefined) {
                const pos = getNextParkingSpot('vehicle');
                if (pos) { startX = pos.x; startY = pos.y; }
                else { console.warn("Sem espaço de parking para veículo:", veh.id); return; }
            }
            const sprite = scene.add.sprite(startX, startY, texKey).setDepth(3).setRotation(veh.rotation || 1.5708);
            vehicleSprites.push({
                id: veh.id,
                modelId,
                type: model.type,
                sprite,
                engineOn: false,
                clutchPressed: false,
                toolOn: false,
                fuel: veh.fuel || model.fuelCapacity || 100,
                fuelTank: model.type === 'truck' ? (veh.fuelTank || model.tankCapacity || 1000) : 0,
                // Full physics state per vehicle
                velocity: 0,
                rpm: 0,
                gear: 1,
                angle: 1.5708,
                isEngineStalling: false,
                isBraking: false,
                stallProtectionMs: 0,
                autoDriveEnabled: false,
                attachedImplementId: null,
                autoDriveState: {
                    mode: 'working',
                    status: 'idle',
                    fieldId: null,
                    field: null,
                    workedTiles: new Set(),
                    activeTime: 0,
                    lastTile: { x: -1, y: -1 },
                    slowFrames: 0,
                    turnPhase: 'straight',
                    laneCenter: 0,
                    laneDirection: 1,
                    recoveryAttempts: 0,
                    posCheckPos: { x: 0, y: 0 },
                    posCheckFrame: 0
                }
            });
            vehiclePositions[veh.id] = { x: startX, y: startY };
            spawnedVehicleIds.add(veh.id);
        }
    });
}

function ensureImplements() {
    if (!lastState || !catalog) return;
    const scene = game.scene.scenes[0];
    if (!scene) return;
    const implementsArr = multiplayerMode ? Object.values(lastState.implements || {}) : (lastState.farm.inventory.implements || []);
    const activeIds = new Set(implementsArr.map(i => i.id));

    implementSprites = implementSprites.filter(impl => {
        if (activeIds.has(impl.id)) return true;
        // Se o implemento sumir, limpar a referência no veículo dono
        const owner = vehicleSprites.find(v => v.attachedImplementId === impl.id);
        if (owner) owner.attachedImplementId = null;
        delete implementPositions[impl.id];
        spawnedImplementIds.delete(impl.id);
        impl.sprite.destroy();
        return false;
    });

    implementsArr.forEach(implItem => {
        if (spawnedImplementIds.has(implItem.id)) return;
        if (!catalog.implements[implItem.modelId]) return;

        const model = catalog.implements[implItem.modelId];
        const texKey = 'impl_' + implItem.modelId;
        let startX = implItem.x, startY = implItem.y;
        if (startX === undefined || startY === undefined) {
            const pos = getNextParkingSpot('implement');
            if (pos) { startX = pos.x; startY = pos.y; }
            else { console.warn("Sem espaço de galpão para implemento:", implItem.id); return; }
        }
        const sprite = scene.add.sprite(startX, startY, texKey).setDepth(2).setRotation(implItem.rotation || 1.5708);

        implementSprites.push({ id: implItem.id, modelId: implItem.modelId, type: model.type, sprite, lastX: startX, lastY: startY, isOn: false, hitchedTo: implItem.attachedToVehicleId || implItem.hitchedTo || null });
        implementPositions[implItem.id] = { x: startX, y: startY };
        spawnedImplementIds.add(implItem.id);
    });
}

// ============================================================
//  NETWORK
// ============================================================
async function triggerImpl(veh, tx, ty) {
    const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
    if (!hImpl) return;

    // Only the driver triggers actions in multiplayer
    if (multiplayerMode && socket && socket.connected && veh.driverId !== socket.id) return;

    // Contagem de área trabalhada global (Sync via servidor)
    const tileKey = `${tx},${ty}`;
    // workedTiles removido pois o monitor agora usa o solo global do lastState


    const implType = hImpl.type;
    if (multiplayerMode && socket && socket.connected) {
        console.log(`[NET] Emitting action for ${implType} at ${tx},${ty}`);
        if (implType === 'plow') socket.emit('actionPlow', { x: tx, y: ty });
        else if (implType === 'harrow') socket.emit('actionHarrow', { x: tx, y: ty, dir: veh.lastMoveDir || 'h' });
        else if (implType === 'seeder') socket.emit('actionPlant', { x: tx, y: ty, implementId: hImpl.id });
        return;
    }

    let ep = '', body = { x: tx, y: ty };
    if (implType === 'plow') ep = '/action/plow';
    if (implType === 'harrow') { ep = '/action/harrow'; body.dir = veh.lastMoveDir || 'h'; }
    if (implType === 'seeder') ep = '/action/plant';
    if (!ep) return;
    try {
        const d = await apiJson(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (d.success) fetchState();
    } catch (e) { }
}
async function triggerHarvest(veh, tx, ty) {
    if (!lastState || lastState.farm.harvesterStorage >= lastState.farm.harvesterCapacity) return;

    if (multiplayerMode && socket && socket.connected) {
        socket.emit('actionHarvest', { x: tx, y: ty });
        return;
    }

    try {
        const d = await apiJson('/action/harvest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ x: tx, y: ty }) });
        if (d.success) fetchState();
    } catch (e) { }
}

// ============================================================
//  KEY HANDLERS
// ============================================================


function doShiftUp() {
    const veh = getActiveVehicle();
    if (activeVehIdx < 0 || transMode !== 'manual' || (veh && veh.autoDriveEnabled)) return;
    const m = getActiveModel();
    if (!m) return;
    const needsClutch = m.gearType === 'manual';
    if (needsClutch && !keys.shift.isDown) {
        console.log("Marcha (UP) bloqueada: Falta embreagem");
        showToast("Pressione SHIFT (Embreagem)", "warning");
        return;
    }
    if (veh && veh.gear < m.gears) {
        veh.gear++;
        console.log(`Marcha aumentada para: ${veh.gear}`);
        refreshGearHUD();
    }
}
function doShiftDown() {
    const veh = getActiveVehicle();
    if (activeVehIdx < 0 || transMode !== 'manual' || (veh && veh.autoDriveEnabled)) return;
    const m = getActiveModel();
    if (!m) return;
    const needsClutch = m.gearType === 'manual';
    if (needsClutch && !keys.shift.isDown) {
        console.log("Marcha (DOWN) bloqueada: Falta embreagem");
        showToast("Pressione SHIFT (Embreagem)", "warning");
        return;
    }
    if (veh && veh.gear > 1) {
        veh.gear--;
        console.log(`Marcha reduzida para: ${veh.gear}`);
        refreshGearHUD();
    }
}
function doToggleTransmission() {
    const veh = getActiveVehicle();
    if (activeVehIdx < 0 || (veh && veh.autoDriveEnabled)) return;
    if (!canUseAutoMode()) {
        showToast('Este veiculo possui gearbox manual fixo', 'warning');
        return;
    }
    transMode = transMode === 'auto' ? 'manual' : 'auto';
    refreshGearHUD();
    refreshStatusHUD();
    showToast(`AUTO SHIFT: ${transMode === 'auto' ? 'AUTO' : 'MANUAL'}`, 'success');
}

function doToggleAutoWork() {
    if (activeVehIdx < 0) return;
    const veh = getActiveVehicle();
    if (!hasAutoDriveCapability()) {
        showToast('Este veiculo nao possui piloto automatico', 'warning');
        return;
    }
    if (veh && veh.autoDriveEnabled) {
        disableAutoDrive(veh, 'AUTO DRIVE: OFF', 'warning');
        console.log("Autodrive desativado");
        return;
    }
    if (veh) {
        veh.autoDriveDirection = veh.angle; // Trava o angulo atual
        console.log("Autodrive ativado");
        activateAutoDrive(veh);
    }
}

function doToggleEngine() {
    if (activeVehIdx < 0) return;
    const activeVehicle = getActiveVehicle();
    if (!activeVehicle) return;
    if (activeVehicle.isEngineStalling) activeVehicle.isEngineStalling = false;

    if (!activeVehicle.engineOn) {
        if ((activeVehicle.fuel || 0) <= 0) {
            console.log("Sem combustível para ligar o motor!");
            return;
        }
        activeVehicle.engineOn = true;
        playSFX('engine_start');
    } else {
        activeVehicle.engineOn = false;
        playSFX('engine_stop');
        if (sfx['engine_loop'].isPlaying) sfx['engine_loop'].stop();
    }

    if (!activeVehicle.engineOn) {
        activeVehicle.toolOn = false;
        const hImpl = implementSprites.find(i => i.hitchedTo === activeVehicle.id);
        if (hImpl) hImpl.isOn = false;
        disableAutoDrive(activeVehicle, 'AUTO DRIVE: OFF - motor desligado', 'warning');
    }
    if (activeVehicle.engineOn) activeVehicle.stallProtectionMs = Date.now() + 1500;

    activeVehicle.rpm = activeVehicle.engineOn ? 800 : 0;
    refreshStatusHUD();
    updateDashboard();
}

function doToggleImplementPower() {
    if (activeVehIdx < 0) return;
    const activeVehicle = getActiveVehicle();
    if (!activeVehicle || !activeVehicle.engineOn) return;

    if (isInHarvester()) {
        activeVehicle.toolOn = !activeVehicle.toolOn;
    } else if (isInTractor()) {
        const hImpl = implementSprites.find(i => i.hitchedTo === activeVehicle.id);
        if (hImpl) hImpl.isOn = !hImpl.isOn;
    }

    if (activeVehicle.autoDriveEnabled && !isToolOn(activeVehicle)) {
        disableAutoDrive(activeVehicle, isInHarvester() ? 'AUTO DRIVE: OFF - plataforma desligada' : 'AUTO DRIVE: OFF - implemento desligado', 'warning');
    }

    lastTile = { x: -1, y: -1 };
    refreshStatusHUD();
}
function doStall() {
    const activeVehicle = getActiveVehicle();
    if (!activeVehicle) return;
    activeVehicle.engineOn = false;
    activeVehicle.isEngineStalling = true;
    // AutoDrive para se o motor morrer
    disableAutoDrive(activeVehicle, 'AUTO DRIVE: OFF - motor morreu', 'error');
    activeVehicle.rpm = 0;
    refreshStatusHUD(); updateDashboard();
}

function doToggleHitch() {
    if (activeVehIdx < 0) return;
    const veh = getActiveVehicle();
    if (!veh || veh.type !== 'tractor') return;

    // In multiplayer, check driver permission (driverId may not be set yet if solo)
    if (multiplayerMode && socket && veh.driverId && veh.driverId !== socket.id) {
        showToast('Somente o motorista pode engatar!', 'error');
        return;
    }

    const hitched = implementSprites.find(i => i.hitchedTo === veh.id);
    if (hitched) {
        // Desengatar — sincronizar attachedImplementId
        veh.attachedImplementId = null;
        hitched.hitchedTo = null;
        hitched.isOn = false;
        showToast('Implemento desengatado', 'warning');
        if (multiplayerMode && socket && socket.connected) {
            socket.emit('detachImplement', { vehicleId: veh.id });
            console.log('[DETACH IMPLEMENT] sent', veh.id);
        }
    } else {
        const nearImpl = implementSprites.find(i => !i.hitchedTo && near(veh.sprite, i.sprite, 60));
        if (nearImpl) {
            // Verificar HP insuficiente — aviso mas permite engate
            const vehicleModel = getVehicleModel(veh);
            const implCatalog = catalog.implements[nearImpl.modelId];
            if (implCatalog && vehicleModel && implCatalog.requiredHp > (vehicleModel.power || vehicleModel.hp || 50)) {
                showToast(`⚠️ HP insuficiente! Requer ${implCatalog.requiredHp} HP — Desempenho reduzido!`, 'warning');
            }

            // Engatar — sincronizar attachedImplementId
            nearImpl.hitchedTo = veh.id;
            veh.attachedImplementId = nearImpl.id;
            if (implCatalog && vehicleModel && implCatalog.requiredHp <= (vehicleModel.power || vehicleModel.hp || 50)) {
                showToast('Implemento engatado!', 'success');
            }
            if (multiplayerMode && socket && socket.connected) {
                socket.emit('attachImplement', { vehicleId: veh.id, implementId: nearImpl.id });
                console.log('[ATTACH IMPLEMENT] sent', veh.id, nearImpl.id);
            }
        }
    }
}

function doToggleVehicle() {
    if (shopOpen) return;

    if (activeVehIdx >= 0) {
        // Saindo do veículo
        const veh = getActiveVehicle();
        if (multiplayerMode && socket && socket.connected) {
            socket.emit('exitVehicle');
        }
        activeVehIdx = -1;
        document.getElementById('dashboard').style.display = 'none';
        player.setVisible(true);
        refreshStatusHUD();
        refreshGearHUD();
        showToast('Você saiu do veículo');
        const scene = game.scene.scenes[0];
        if (scene && scene.cameras) {
            scene.cameras.main.startFollow(player);
        }
    } else {
        // Enter nearest
        let best = -1, bd = Infinity;
        vehicleSprites.forEach((v, i) => {
            const d = Phaser.Math.Distance.Between(player.x, player.y, v.sprite.x, v.sprite.y);
            if (d < 80 && d < bd) { best = i; bd = d; }
        });
        if (best >= 0) {
            activeVehIdx = best;
            const activeVehicle = vehicleSprites[best];
            const m = catalog.vehicles[activeVehicle.modelId];

            player.setVisible(false);

            if (multiplayerMode && socket && socket.connected) {
                socket.emit('enterVehicle', { vehicleId: activeVehicle.id });
                // Set driver locally immediately (server will confirm via vehicleOccupantsUpdated)
                if (!activeVehicle.driverId) {
                    activeVehicle.driverId = socket.id;
                    activeVehicle.isMyDriver = true;
                }
                console.log('[ENTER VEHICLE] sent', activeVehicle.id, 'driverId:', activeVehicle.driverId);
            } else {
                // No Solo, somos sempre o motorista
                activeVehicle.driverId = 'local-player';
                activeVehicle.isMyDriver = true;
            }

            maxGears = (m?.gears || 4);
            transMode = (m?.gearType === 'auto') ? 'auto' : 'manual';

            // Auto-ativar monitor de campo para máquinas avançadas
            if (Number(maxGears) === 6 && (m?.autoDrive)) {
                console.log("Auto-ativando monitor para:", m.name, "Gears:", m.gears);
                monitorVisible = true;
            }

            highlightVehicle(-1);
            const scene = game.scene.scenes[0];
            if (scene && scene.cameras) {
                scene.cameras.main.startFollow(activeVehicle.sprite);
            }
            document.getElementById('dashboard').style.display = 'flex';
            refreshStatusHUD();
            updateDashboard();
            refreshGearHUD();
            showToast(`Entrou em: ${m ? m.name : 'Veículo'}`);
        }
    }
}

// Sistema de cycling de veículos com setas
function cycleVehicles(direction, context) {
    if (vehicleSprites.length === 0) return; // Sem veículos

    let startIdx = activeVehIdx >= 0 ? activeVehIdx : vehicleSelectionIdx;
    vehicleSelectionIdx = (startIdx + direction + vehicleSprites.length) % vehicleSprites.length;
    const selectedVeh = vehicleSprites[vehicleSelectionIdx];

    if (activeVehIdx >= 0) {
        // Troca direta de máquina (estando dentro)
        doToggleVehicle.call(context || this); // Pass context
        player.x = selectedVeh.sprite.x;
        player.y = selectedVeh.sprite.y + 20;
        doToggleVehicle.call(context || this); // Pass context
        highlightVehicle(-1);
    } else {
        // Apenas ciclando a pé
        player.x = selectedVeh.sprite.x + 50;
        player.y = selectedVeh.sprite.y;
        highlightVehicle(vehicleSelectionIdx);
    }

    // Câmera segue o alvo correto
    if (context && context.cameras) {
        context.cameras.main.startFollow(activeVehIdx >= 0 ? vehicleSprites[activeVehIdx].sprite : player);
    }
}

// Destaca o veículo selecionado com cor amarela
function highlightVehicle(idx) {
    vehicleSprites.forEach((v, i) => {
        if (i === idx) {
            v.sprite.setTint(0xffff00); // Amarelo quando selecionado
        } else {
            v.sprite.clearTint();
        }
    });
}

// Abre menu de mapa tela cheia
function toggleFullMap() {
    const mapModal = document.getElementById('map-modal');
    if (!mapModal) {
        console.warn('map-modal não encontrado');
        return;
    }
    const isVisible = mapModal.style.display === 'flex';
    mapModal.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) renderWorldMap();
}

function renderWorldMap() {
    const canvas = document.getElementById('world-map-canvas');
    if (!canvas || !catalog || !lastState) return;

    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / W;
    const scaleY = canvas.height / H;
    const px = (x) => x * scaleX;
    const py = (y) => y * scaleY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#224422';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawZone = (label, pos, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px(pos.x), py(pos.y), 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Courier New';
        ctx.fillText(label, px(pos.x) + 8, py(pos.y) - 8);
    };

    // Asphalt Roads
    ctx.strokeStyle = '#5a5a5a';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, py(2500)); ctx.lineTo(canvas.width, py(2500)); ctx.stroke(); // Transversal
    ctx.beginPath(); ctx.moveTo(px(2500), 0); ctx.lineTo(px(2500), canvas.height); ctx.stroke(); // Eixo
    // Dirt Road
    ctx.strokeStyle = '#6e4b30';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px(2000), py(5700)); ctx.lineTo(px(8000), py(5700)); ctx.stroke();

    // Environment (Trees and Lakes)
    if (typeof decoGroup !== 'undefined' && decoGroup) {
        decoGroup.getChildren().forEach(child => {
            if (child.texture.key === 'lake') {
                ctx.fillStyle = '#0984e3';
                ctx.beginPath(); ctx.arc(px(child.x), py(child.y), 4, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = '#00b894';
                ctx.fillRect(px(child.x) - 1, py(child.y) - 1, 3, 3);
            }
        });
    }

    const ownedLands = new Set(lastState.farm.unlockedLands || []);
    Object.entries(catalog.lands || {}).forEach(([fid, land]) => {
        ctx.fillStyle = ownedLands.has(fid) ? 'rgba(46,204,113,0.35)' : 'rgba(231,76,60,0.25)';
        ctx.fillRect(px(land.x), py(land.y), land.w * scaleX, land.h * scaleY);
        ctx.strokeStyle = ownedLands.has(fid) ? '#2ecc71' : '#e74c3c';
        ctx.lineWidth = 1;
        ctx.strokeRect(px(land.x), py(land.y), land.w * scaleX, land.h * scaleY);
    });

    drawZone('Loja', SHOP_POS, '#f1c40f');
    drawZone('Silo', SILO_POS, '#9b59b6');
    drawZone('Venda', SELL_POS, '#e67e22');
    drawZone('Fazenda', HOUSE_POS, '#3498db');

    vehicleSprites.forEach((veh) => {
        ctx.fillStyle = '#00d1ff';
        ctx.fillRect(px(veh.sprite.x) - 3, py(veh.sprite.y) - 3, 6, 6);
    });
    implementSprites.forEach((impl) => {
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(px(impl.sprite.x) - 2, py(impl.sprite.y) - 2, 4, 4);
    });

    const ent = getEntity();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px(ent.x), py(ent.y), 4, 0, Math.PI * 2);
    ctx.fill();
}

function renderMiniMap() {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas || !catalog || !lastState) return;
    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / W;
    const scaleY = canvas.height / H;
    const px = (x) => x * scaleX;
    const py = (y) => y * scaleY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo Grama Escura
    ctx.fillStyle = '#112211';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Renderizar Todas as Terras (User requirement)
    const ownedLands = new Set(lastState.farm.unlockedLands || []);
    Object.entries(catalog.lands || {}).forEach(([id, land]) => {
        const owned = ownedLands.has(id);
        ctx.fillStyle = owned ? 'rgba(0, 255, 136, 0.4)' : 'rgba(85, 85, 85, 0.3)';
        ctx.fillRect(px(land.x), py(land.y), land.w * scaleX, land.h * scaleY);
        ctx.strokeStyle = owned ? '#00FF88' : '#555555';
        ctx.lineWidth = 1;
        ctx.strokeRect(px(land.x), py(land.y), land.w * scaleX, land.h * scaleY);
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    // Asphalt Roads
    ctx.strokeStyle = '#5a5a5a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, py(2500)); ctx.lineTo(canvas.width, py(2500)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px(2500), 0); ctx.lineTo(px(2500), canvas.height); ctx.stroke();
    // Dirt Road
    ctx.strokeStyle = '#6e4b30'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px(2000), py(5700)); ctx.lineTo(px(8000), py(5700)); ctx.stroke();

    if (typeof decoGroup !== 'undefined' && decoGroup) {
        decoGroup.getChildren().forEach(child => {
            ctx.fillStyle = child.texture.key === 'lake' ? '#0984e3' : '#00b894';
            ctx.fillRect(px(child.x), py(child.y), 1.5, 1.5);
        });
    }

    const drawDot = (x, y, color, size = 3) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px(x), py(y), size, 0, Math.PI * 2);
        ctx.fill();
        // Glow effect
        ctx.shadowBlur = 4;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.shadowBlur = 0;
    };

    // POIs: Loja (Roxo), Silo (Laranja)
    drawDot(SHOP_POS.x, SHOP_POS.y, '#a855f7', 4); // Loja - Roxo
    drawDot(SILO_POS.x, SILO_POS.y, '#f97316', 4); // Silo - Laranja
    drawDot(SELL_POS.x, SELL_POS.y, '#eab308', 3); // Venda

    // Veículos (Azul) e Implementos (Amarelo)
    vehicleSprites.forEach(v => drawDot(v.sprite.x, v.sprite.y, '#38bdf8', 3)); // Azul
    implementSprites.forEach(i => drawDot(i.sprite.x, i.sprite.y, '#fbbf24', 2)); // Amarelo

    // Jogador (Branco)
    const ent = getEntity();
    drawDot(ent.x, ent.y, '#ffffff', 4); // Branco
}

function renderLandMonitor() {
    // Integrado ao minimapa
}

function getLandStats(land) {
    if (!lastState || !lastState.farm || !lastState.farm.soil) return { plow: 0, harrow: 0, seed: 0, g1: 0, g2: 0, ready: 0, harv: 0 };

    let plowCount = 0, harrowCount = 0, seedCount = 0;
    let growth1Count = 0, growth2Count = 0, readyCount = 0, harvestedCount = 0;
    const totalTiles = Math.floor(land.w / TILE) * Math.floor(land.h / TILE);
    if (totalTiles <= 0) return { plow: 0, harrow: 0, seed: 0, g1: 0, g2: 0, ready: 0, harv: 0 };

    const fieldCrops = lastState.farm.plantedCrops.filter(c =>
        c.x >= land.x && c.x < land.x + land.w && c.y >= land.y && c.y < land.y + land.h
    );

    for (const [key, info] of Object.entries(lastState.farm.soil)) {
        const parts = key.split(',');
        const tx = parseInt(parts[0]);
        const ty = parseInt(parts[1]);

        if (tx >= land.x && tx < land.x + land.w && ty >= land.y && ty < land.y + land.h) {
            const st = typeof info === 'object' ? info.state : info;
            if (st === 'planted') {
                const crop = fieldCrops.find(c => Math.abs(c.x - tx) < 5 && Math.abs(c.y - ty) < 5);
                if (crop) {
                    if (crop.isReady) readyCount++;
                    else if (crop.growthStage > 50) growth2Count++;
                    else growth1Count++;
                    seedCount++;
                } else {
                    harvestedCount++;
                }
            } else if (st === 'harrowed') {
                harrowCount++;
            } else if (st === 'plowed') {
                plowCount++;
            }
        }
    }

    const calc = (v) => ((v / totalTiles) * 100).toFixed(1);
    return {
        plow: calc(plowCount),
        harrow: calc(harrowCount),
        seed: calc(seedCount),
        g1: calc(growth1Count),
        g2: calc(growth2Count),
        ready: calc(readyCount),
        harv: calc(harvestedCount)
    };
}

function renderFieldMonitor() {
    const monDiv = document.getElementById('field-monitor');
    if (!monDiv) return;

    const veh = getActiveVehicle();
    const model = getVehicleModel(veh);

    // Visibilidade estrita: 6 marchas + autodrive + monitorVisible
    const shouldShow = veh && model && Number(model.gears) === 6 && model.autoDrive && monitorVisible;

    if (!shouldShow) {
        monDiv.style.display = 'none';
        return;
    }
    monDiv.style.display = 'block';

    // GLOBAL MONITOR UPDATE
    const globalContainer = document.getElementById('global-lands-list');
    const globalCanvas = document.getElementById('global-monitor-canvas');
    if (globalContainer && lastState && catalog) {
        const unlocked = lastState.farm.unlockedLands || [];
        let html = '';
        unlocked.forEach(landId => {
            const l = catalog.lands[landId];
            if (!l) return;
            const stats = getLandStats(l);
            html += `<div class="global-field-item">
                <div class="g-field-name">${l.name}</div>
                <div class="g-field-stats">
                    <div class="g-stat g-stat-plow">PLOW <span>${stats.plow}%</span></div>
                    <div class="g-stat g-stat-harrow">HARW <span>${stats.harrow}%</span></div>
                    <div class="g-stat g-stat-seed">SEED <span>${stats.seed}%</span></div>
                    <div class="g-stat g-stat-g1">G1 <span>${stats.g1}%</span></div>
                    <div class="g-stat g-stat-g2">G2 <span>${stats.g2}%</span></div>
                    <div class="g-stat g-stat-ready">RDY <span>${stats.ready}%</span></div>
                    <div class="g-stat g-stat-harv">HRV <span>${stats.harv}%</span></div>
                </div>
            </div>`;
        });
        globalContainer.innerHTML = html;

        if (globalCanvas) {
            const gCtx = globalCanvas.getContext('2d', { willReadFrequently: true });
            if (gCtx) {
                gCtx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
                gCtx.fillStyle = '#1e293b';
                gCtx.fillRect(0, 0, globalCanvas.width, globalCanvas.height);

                const scaleX = globalCanvas.width / W;
                const scaleY = globalCanvas.height / H;

                for (const [fid, l] of Object.entries(catalog.lands)) {
                    if (unlocked.includes(fid)) {
                        gCtx.fillStyle = 'rgba(46,204,113,0.4)';
                        gCtx.strokeStyle = 'rgba(46,204,113,0.8)';
                    } else {
                        gCtx.fillStyle = 'rgba(100,116,139,0.3)';
                        gCtx.strokeStyle = 'rgba(100,116,139,0.6)';
                    }
                    const lx = l.x * scaleX, ly = l.y * scaleY, lw = l.w * scaleX, lh = l.h * scaleY;
                    if (isFinite(lx) && isFinite(ly) && isFinite(lw) && isFinite(lh)) {
                        gCtx.fillRect(lx, ly, lw, lh);
                        gCtx.lineWidth = 1;
                        gCtx.strokeRect(lx, ly, lw, lh);
                    }
                }

                vehicleSprites.forEach(v => {
                    const vx = v.sprite.x * scaleX, vy = v.sprite.y * scaleY;
                    if (isFinite(vx) && isFinite(vy)) {
                        gCtx.fillStyle = v.autoDriveEnabled ? '#f59e0b' : '#38bdf8';
                        gCtx.fillRect(vx - 2, vy - 2, 4, 4);
                    }
                });

                const px = player.x * scaleX, py = player.y * scaleY;
                if (isFinite(px) && isFinite(py)) {
                    gCtx.fillStyle = '#ffffff';
                    gCtx.beginPath(); gCtx.arc(px, py, 2, 0, Math.PI * 2); gCtx.fill();
                }
            }
        }
    }

    // LOCAL MONITOR UPDATE
    const fieldInfo = getOwnedFieldAtPoint(veh.sprite.x, veh.sprite.y);
    const waitingDiv = document.getElementById('mon-local-waiting');
    const activeDiv = document.getElementById('mon-local-active');

    if (!fieldInfo || !fieldInfo.land) {
        if (waitingDiv) waitingDiv.style.display = 'block';
        if (activeDiv) activeDiv.style.display = 'none';
        return; // Retorna pois não há campo atual
    }

    if (waitingDiv) waitingDiv.style.display = 'none';
    if (activeDiv) activeDiv.style.display = 'flex';

    const canvas = document.getElementById('field-monitor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const land = fieldInfo.land;
    if (!land || !land.w || !land.h || !isFinite(land.w) || !isFinite(land.h)) return;

    const scaleX = canvas.width / land.w;
    const scaleY = canvas.height / land.h;
    if (!isFinite(scaleX) || !isFinite(scaleY)) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let plowCount = 0, harrowCount = 0, seedCount = 0;
    let growth1Count = 0, growth2Count = 0, readyCount = 0, harvestedCount = 0;
    const totalFieldTiles = Math.floor(land.w / TILE) * Math.floor(land.h / TILE);

    const fieldCrops = lastState.farm.plantedCrops.filter(c =>
        c.x >= land.x && c.x < land.x + land.w && c.y >= land.y && c.y < land.y + land.h
    );

    if (lastState?.farm?.soil) {
        for (const [key, info] of Object.entries(lastState.farm.soil)) {
            const parts = key.split(',');
            const tx = parseInt(parts[0]);
            const ty = parseInt(parts[1]);

            if (tx >= land.x && tx < land.x + land.w && ty >= land.y && ty < land.y + land.h) {
                const st = typeof info === 'object' ? info.state : info;
                const rx = (tx - land.x) * scaleX;
                const ry = (ty - land.y) * scaleY;
                if (!isFinite(rx) || !isFinite(ry)) continue;

                if (st === 'planted') {
                    const crop = fieldCrops.find(c => Math.abs(c.x - tx) < 5 && Math.abs(c.y - ty) < 5);
                    if (crop) {
                        if (crop.isReady) {
                            ctx.fillStyle = '#FFFF00';
                            readyCount++;
                        } else if (crop.growthStage > 50) {
                            ctx.fillStyle = '#27ae60';
                            growth2Count++;
                        } else {
                            ctx.fillStyle = '#2ecc71'; // Verde
                            growth1Count++;
                        }
                        seedCount++;
                    } else {
                        ctx.fillStyle = '#FFFACD'; // Amarelo claro
                        harvestedCount++;
                    }
                } else if (st === 'harrowed') {
                    ctx.fillStyle = '#D2B48C'; // Bege
                    harrowCount++;
                } else if (st === 'plowed') {
                    ctx.fillStyle = '#5c4033'; // Marrom escuro
                    plowCount++;
                } else {
                    continue;
                }

                ctx.fillRect(rx, ry, Math.max(1, TILE * scaleX), Math.max(1, TILE * scaleY));
            }
        }
    }

    ctx.fillStyle = '#ffffff';
    const vcx = (veh.sprite.x - land.x) * scaleX;
    const vcy = (veh.sprite.y - land.y) * scaleY;
    if (isFinite(vcx) && isFinite(vcy)) {
        ctx.beginPath();
        ctx.arc(vcx, vcy, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    const calcPerc = (count) => totalFieldTiles > 0 ? ((count / totalFieldTiles) * 100).toFixed(1) : '0.0';

    let currentOp = 'PARADO';
    let currentProgress = '0%';
    const isHarvester = veh.type === 'harvester';

    if (veh.autoDriveState) {
        if (veh.autoDriveState.mode === 'recovery') {
            currentOp = 'RECUPERANDO';
            currentProgress = '--';
        } else if (veh.autoDriveState.mode === 'movingToTarget') {
            currentOp = 'DESLOCANDO';
            currentProgress = '--';
        } else if (veh.autoDriveState.status === 'working') {
            if (isHarvester && veh.toolOn) {
                currentOp = 'COLHENDO';
                currentProgress = calcPerc(harvestedCount) + '%';
            } else if (veh.type === 'tractor') {
                const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
                if (hImpl && hImpl.isOn) {
                    const implModel = catalog.implements[hImpl.modelId];
                    if (implModel) {
                        if (implModel.type === 'seeder') { currentOp = 'PLANTANDO'; currentProgress = calcPerc(seedCount) + '%'; }
                        else if (implModel.type === 'plow') { currentOp = 'ARANDO'; currentProgress = calcPerc(plowCount) + '%'; }
                        else if (implModel.type === 'harrow') { currentOp = 'GRADEANDO'; currentProgress = calcPerc(harrowCount) + '%'; }
                    }
                }
            }
        }
    }

    const areaVal = veh.autoDriveState && veh.autoDriveState.workedTiles ? veh.autoDriveState.workedTiles.size : 0;

    const elOp = document.getElementById('mon-op');
    if (elOp) {
        elOp.textContent = currentOp;
        if (currentOp === 'PARADO') elOp.style.color = '#f43f5e';
        else if (currentOp === 'RECUPERANDO') elOp.style.color = '#f59e0b';
        else if (currentOp === 'DESLOCANDO') elOp.style.color = '#38bdf8';
        else elOp.style.color = '#4ade80';
    }
    const elPerc = document.getElementById('mon-perc');
    if (elPerc) elPerc.textContent = currentProgress;
    const elArea = document.getElementById('mon-area');
    if (elArea) elArea.textContent = areaVal + ' tiles';
}

// Abre menu de venda de veículos/implementos
function openSellMenu() {
    const sellModal = document.getElementById('sell-modal');
    if (!sellModal) {
        console.warn('sell-modal não encontrado');
        return;
    }
    sellModal.style.display = 'flex';
    renderSellMenu('vehicles');
}

async function doContextAction() {
    if (!lastState) return;
    const ent = getEntity();

    // Shop
    if (near(ent, SHOP_POS, 100)) { playSFX('click'); openShop(); return; }
    // Harvester + silo
    if (isInHarvester() && near(ent, SILO_POS, 80)) {
        try { const d = await apiJson('/action/unload', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
    }
    // Truck + silo
    if (isInTruck() && near(ent, SILO_POS, 80)) {
        try { const d = await apiJson('/action/truck/load-silo', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
    }
    // Truck + house (load seeds from depot)
    if (isInTruck() && near(ent, HOUSE_POS, 100)) {
        try { const d = await apiJson('/action/truck/load-depot', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
    }
    // Truck + sell
    if (isInTruck() && near(ent, SELL_POS, 100)) {
        try { const d = await apiJson('/action/truck/sell', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
    }
    // Truck + seeder (transfer seeds)
    if (isInTruck()) {
        for (const impl of implementSprites) {
            if (impl.type === 'seeder' && near(ent, impl.sprite, 80)) {
                try { const d = await apiJson('/action/truck/transfer-seeds', { method: 'POST' }); if (d.success) await fetchState(); } catch (e) { } return;
            }
        }
    }
}

// ============================================================
//  SHOP & CELLPHONE UI
// ============================================================
let cellphoneOpen = false;

function toggleCellphone() {
    if (!lastState || !lastState.farm.hasCellphone) {
        showToast('Você precisa comprar um celular na loja primeiro!', 'error');
        return;
    }
    if (cellphoneOpen) {
        playSFX('click');
        closeCellphone();
    } else {
        playSFX('menu');
        openCellphone();
    }
}

function openCellphone() {
    cellphoneOpen = true;
    shopOpen = true; // Blocks game controls
    const modal = document.getElementById('cellphone-modal');
    if (modal) modal.style.display = 'flex';
    document.getElementById('cellphone-money').innerText = lastState?.farm?.money || 0;
    renderCellphoneMenu('vehicles');
}

function closeCellphone() {
    cellphoneOpen = false;
    shopOpen = false;
    const modal = document.getElementById('cellphone-modal');
    if (modal) modal.style.display = 'none';
    fetchState();
}

function renderCellphoneMenu(cat) {
    if (!catalog || !lastState) return;
    const cont = document.getElementById('cellphone-content');
    const tabs = document.querySelectorAll('.cellphone-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (cat === 'vehicles') tabs[0].classList.add('active');
    else if (cat === 'implements') tabs[1].classList.add('active');
    else if (cat === 'seeds') tabs[2].classList.add('active');
    else if (cat === 'sell') tabs[3].classList.add('active');

    document.getElementById('cellphone-money').innerText = lastState.farm.money;

    let html = '';
    const inv = lastState.farm.inventory;

    if (cat === 'vehicles') {
        const types = { tractor: '🚜 Tratores', harvester: '🌾 Colheitadeiras', truck: '🚚 Caminhões' };
        for (const typeKey in types) {
            let sectionHtml = `<div class="cp-category-title">${types[typeKey]}</div>`;
            let hasItems = false;
            for (const [id, it] of Object.entries(catalog.vehicles)) {
                if (it.type !== typeKey || it.price <= 0) continue;
                const afford = lastState.farm.money >= it.price;
                sectionHtml += `<div class="cp-item">
                    <div class="cp-name">${it.name}</div>
                    <div class="cp-price">$${it.price.toLocaleString()}</div>
                    <button class="cp-btn-buy" onclick="buyCellphoneItem('vehicles','${id}')" ${!afford ? 'disabled' : ''}>Comprar</button>
                </div>`;
                hasItems = true;
            }
            if (hasItems) html += sectionHtml;
        }
    } else if (cat === 'implements') {
        const types = { plow: '🚜 Arados', harrow: '⚙️ Grades', seeder: '🌱 Plantadeiras' };
        for (const typeKey in types) {
            let sectionHtml = `<div class="cp-category-title">${types[typeKey]}</div>`;
            let hasItems = false;
            for (const [id, it] of Object.entries(catalog.implements)) {
                if (it.type !== typeKey || it.price <= 0) continue;
                const afford = lastState.farm.money >= it.price;
                sectionHtml += `<div class="cp-item">
                    <div class="cp-name">${it.name}</div>
                    <div class="cp-price">$${it.price.toLocaleString()}</div>
                    <button class="cp-btn-buy" onclick="buyCellphoneItem('implements','${id}')" ${!afford ? 'disabled' : ''}>Comprar</button>
                </div>`;
                hasItems = true;
            }
            if (hasItems) html += sectionHtml;
        }
    } else if (cat === 'seeds') {
        for (const [id, it] of Object.entries(catalog.seeds)) {
            if (it.price <= 0) continue;
            const afford = lastState.farm.money >= it.price;
            html += `<div class="cp-item">
                <div class="cp-name">🌱 ${it.name}</div>
                <div class="cp-price">$${it.price.toLocaleString()}</div>
                <button class="cp-btn-buy" onclick="buyCellphoneItem('seeds','${id}')" ${!afford ? 'disabled' : ''}>Comprar</button>
            </div>`;
        }
    } else if (cat === 'sell') {
        const hitchedIds = new Set(implementSprites.filter(i => i.hitchedTo).map(i => i.id));
        let hasItems = false;

        // SEÇÃO DE GRÃOS
        if (lastState.farm.harvestedCrops > 0) {
            hasItems = true;
            const profit = lastState.farm.harvestedCrops * lastState.economy.pricePerCrop;
            html += `<div class="cp-category-title">🌾 Produção (Silo)</div>`;
            html += `<div class="cp-item">
                <div class="cp-name">Total: ${lastState.farm.harvestedCrops} Grains</div>
                <div class="cp-price">Valor: $${profit.toLocaleString()}</div>
                <button class="cp-btn-buy" style="background:#27ae60" onclick="sellGrains()">Vender Tudo</button>
            </div>`;
        }

        html += `<div class="cp-category-title">🚜 Seus Veículos</div>`;
        inv.vehicles.forEach(v => {
            const it = catalog.vehicles[v.modelId];
            if (!it || it.price <= 0) return;
            hasItems = true;
            const refund = Math.floor(it.price * 0.8);
            html += `<div class="cp-item">
                <div class="cp-name">${it.name} (V)</div>
                <div class="cp-price">Receber: $${refund.toLocaleString()}</div>
                <button class="cp-btn-sell" onclick="sellCellphoneItem('vehicles','${v.id}')">Vender</button>
            </div>`;
        });

        html += `<div class="cp-category-title">⚙️ Seus Implementos</div>`;
        inv.implements.forEach(i => {
            const it = catalog.implements[i.modelId];
            if (!it || it.price <= 0) return;
            hasItems = true;
            const isHitched = hitchedIds.has(i.id);
            const refund = Math.floor(it.price * 0.8);
            html += `<div class="cp-item">
                <div class="cp-name">${it.name} (I)</div>
                <div class="cp-price">Receber: $${refund.toLocaleString()}</div>
                <button class="cp-btn-sell" onclick="sellCellphoneItem('implements','${i.id}')" ${isHitched ? 'disabled' : ''}>${isHitched ? 'ENGATADO' : 'Vender'}</button>
            </div>`;
        });

        // SEÇÃO DE TERRAS
        if (lastState.farm.unlockedLands && lastState.farm.unlockedLands.length > 1) {
            html += `<div class="cp-category-title">🗺️ Suas Terras</div>`;
            lastState.farm.unlockedLands.forEach(fid => {
                if (fid === 'field_1') return;
                const it = catalog.lands[fid];
                if (!it || it.price <= 0) return;
                hasItems = true;
                const refund = Math.floor(it.price * 0.8);
                html += `<div class="cp-item">
                    <div class="cp-name">${it.name}</div>
                    <div class="cp-price">Receber: $${refund.toLocaleString()}</div>
                    <button class="cp-btn-sell" onclick="sellCellphoneItem('lands','${fid}')">Vender</button>
                </div>`;
            });
        }

        // Terras (Ocultando field_1 que não pode ser vendido)
        if (lastState.farm.unlockedLands) {
            lastState.farm.unlockedLands.forEach(fid => {
                if (fid === 'field_1') return; // Campo inicial não pode ser vendido
                const land = catalog.lands[fid];
                if (!land || land.price <= 0) return;
                hasItems = true;
                const refund = Math.floor(land.price * 0.8);
                html += `<div class="cp-item">
                    <div class="cp-name">${land.name} (Terra)</div>
                    <div class="cp-price">Receber: $${refund.toLocaleString()}</div>
                    <button class="cp-btn-sell" onclick="sellCellphoneItem('lands','${fid}')">Vender</button>
                </div>`;
            });
        }

        if (!hasItems) {
            html += '<div style="color:#94a3b8; text-align:center; padding: 20px;">Você não possui itens valiosos para vender.</div>';

        }
    }
    cont.innerHTML = html;
}

async function buyCellphoneItem(cat, id) {
    if (multiplayerMode) {
        socket.emit('shopBuy', { category: cat, itemId: id }, async (res) => {
            if (res && res.success) {
                showBigAlert(`${catalog[cat][id].name} comprado com sucesso!`);
                await fetchState();
                renderCellphoneMenu(cat);
                ensureVehicles();
                ensureImplements();
            } else {
                showToast(res ? res.error : 'Erro na compra', 'error');
            }
        });
        return;
    }
    try {
        const d = await apiJson('/shop/buy', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) {
            showBigAlert(`${catalog[cat][id].name} comprado com sucesso!`);
            await fetchState();
            renderCellphoneMenu(cat);
            ensureVehicles();
            ensureImplements();
        } else {
            showToast(d.error || 'Erro na compra', 'error');
        }
    } catch (e) { }
}

async function sellCellphoneItem(cat, idx) {
    if (multiplayerMode) {
        socket.emit('shopSell', { category: cat, itemId: idx }, async (res) => {
            if (res && res.success) {
                let itemName = "Item";
                if (cat === 'lands') {
                    itemName = catalog.lands[idx]?.name || "Terra";
                } else if (catalog[cat] && lastState.farm.inventory[cat]) {
                    const invItem = lastState.farm.inventory[cat].find(i => i.id === idx);
                    if (invItem && catalog[cat][invItem.modelId]) itemName = catalog[cat][invItem.modelId].name;
                }
                showBigAlert(`${itemName} vendido com sucesso!`);
                await fetchState();
                renderCellphoneMenu('sell');
                ensureVehicles();
                ensureImplements();
            } else {
                showToast(res ? res.error : 'Erro na venda', 'error');
            }
        });
        return;
    }
    try {
        const d = await apiJson('/shop/sell', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: idx })
        });
        if (d.success) {
            let itemName = "Item";
            if (cat === 'lands') {
                itemName = catalog.lands[idx]?.name || "Terra";
            } else if (catalog[cat] && lastState.farm.inventory[cat]) {
                const invItem = lastState.farm.inventory[cat].find(i => i.id === idx);
                if (invItem && catalog[cat][invItem.modelId]) itemName = catalog[cat][invItem.modelId].name;
            }
            showBigAlert(`${itemName} vendido com sucesso!`);
            await fetchState();
            renderCellphoneMenu('sell');
            ensureVehicles();
            ensureImplements();
        } else {
            showToast(d.error || 'Erro na venda', 'error');
        }
    } catch (e) { }
}

async function sellGrains() {
    if (multiplayerMode) {
        socket.emit('shopSellCrops', {}, async (res) => {
            if (res && res.success) {
                showBigAlert(`Grãos vendidos por $${res.profit.toLocaleString()}!`);
                await fetchState();
                if (shopOpen) switchTab('sell');
                if (cellphoneOpen) renderCellphoneMenu('sell');
            } else {
                showToast(res ? res.error : 'Erro na venda', 'error');
            }
        });
        return;
    }
    try {
        const d = await apiJson('/shop/sell-crops', { method: 'POST' });
        if (d.success) {
            showBigAlert(`Grãos vendidos por $${d.profit.toLocaleString()}!`);
            await fetchState();
            if (shopOpen) switchTab('sell');
            if (cellphoneOpen) renderCellphoneMenu('sell');
        } else {
            showToast(d.error || 'Erro na venda', 'error');
        }
    } catch (e) { }
}

function showBigAlert(msg) {
    let alertEl = document.getElementById('big-screen-alert');
    if (!alertEl) {
        alertEl = document.createElement('div');
        alertEl.id = 'big-screen-alert';
        document.body.appendChild(alertEl);
    }
    alertEl.innerText = msg;
    alertEl.className = 'big-alert-show';

    // Reproduzir som se possivel
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        }
    } catch (e) { }

    setTimeout(() => {
        alertEl.className = 'big-alert-hide';
    }, 2500);
}

async function syncFuel() {
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
}

async function doRefuel() {
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
}


// ============================================================
//  HUD
// ============================================================
function updateHUD(s) {
    const $ = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    $('ui-money', s.farm.money);
    $('ui-depot', s.farm.seedDepot);
    $('ui-seeder', s.farm.seederStorage + '/' + s.farm.seederCapacity);
    $('ui-harvester', s.farm.harvesterStorage + '/' + s.farm.harvesterCapacity);
    $('ui-truck', (s.farm.truckStorage || 0) + '/' + (s.farm.truckCapacity || 30) + (s.farm.truckCargoType ? (s.farm.truckCargoType === 'seeds' ? ' 🌱' : ' 🌾') : ''));
    $('ui-silo', s.farm.harvestedCrops);
    $('ui-weather', s.weather);
    $('ui-price', s.economy.pricePerCrop);
    $('ui-time', s.time);
    $('ui-hour', currentHour.toString().padStart(2, '0'));
    refreshStatusHUD();
}

function updateDashboard() {
    const d = document.getElementById('dashboard');
    if (!d || activeVehIdx < 0) return;

    const veh = getActiveVehicle();
    if (!veh) return;

    const speed = Math.max(0, Math.round(Math.abs(veh.velocity) * 10));
    document.getElementById('dash-speed').innerText = isFinite(speed) ? speed : 0;
    document.getElementById('dash-gear').innerText = veh.gear;

    const rpmBar = document.getElementById('dash-rpm-bar');
    const rpmPct = Math.min(100, Math.max(0, (veh.rpm / 3000) * 100));
    rpmBar.style.width = (isFinite(rpmPct) ? rpmPct : 0) + '%';

    // Efeito de redline (vibração visual e cor)
    if (veh.rpm > 2700) {
        const shake = (Math.random() - 0.5) * 3;
        rpmBar.style.transform = `translateX(${shake}px)`;
        rpmBar.style.filter = 'brightness(1.5) saturate(1.5)';
    } else {
        rpmBar.style.transform = 'none';
        rpmBar.style.filter = 'none';
    }

    const fuelText = document.getElementById('dash-fuel-text');
    if (fuelText) {
        fuelText.innerText = Math.floor(veh.fuel || 0) + ' L';
    }

    const fuelTankDiv = document.getElementById('dash-fuel-tank');
    const fuelTankText = document.getElementById('dash-fuel-tank-text');
    if (fuelTankDiv && fuelTankText) {
        if (veh.type === 'truck') {
            fuelTankDiv.style.display = 'block';
            fuelTankText.innerText = Math.floor(veh.fuelTank || 0) + ' L';
        } else {
            fuelTankDiv.style.display = 'none';
        }
    }

    document.getElementById('lamp-engine').classList.toggle('active', veh.engineOn);
    document.getElementById('lamp-brake').classList.toggle('active', veh.isBraking);
    document.getElementById('lamp-stall').classList.toggle('active', veh.isEngineStalling);
}

function refreshGearHUD() {
    const el = document.getElementById('ui-gear');
    if (!el) return;
    const veh = getActiveVehicle();
    if (!veh) { el.innerHTML = ''; return; }
    const m = getVehicleModel(veh);
    const mGears = m?.gears || 4;
    const shiftLabel = transMode === 'auto' ? 'AUTO SHIFT' : 'MANUAL SHIFT';
    const brandStr = m ? `<span style="color:#7f8c8d;font-size:10px">${m.brand} ${m.name}</span> ` : '';
    el.innerHTML = `${brandStr}<b>GEAR ${veh.gear}/${mGears}</b> <span style="color:#7f8c8d;font-size:10px">${shiftLabel}</span>`;
}

function formatDuration(seconds) {
    if (!seconds) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

// Função consolidada acima

function refreshStatusHUD() {
    const el = document.getElementById('ui-status');
    if (!el) return;
    const veh = getActiveVehicle();
    if (!veh) { el.innerHTML = ''; return; }

    const model = getVehicleModel(veh);
    const autoStatus = getAutoDriveStatus(veh);
    const autoColor = autoStatus === 'ACTIVE' ? '#2ecc71' : (autoStatus === 'READY' ? '#85c1ff' : '#95a5a6');
    const engineStatus = veh.engineOn ? '<span style="color:#2ecc71">Ligado</span>' : '<span style="color:#e74c3c">Desligado</span>';
    const clutchStatus = veh.clutchPressed ? '<span style="color:#f1c40f">Embreagem pressionada</span>' : '<span style="color:#95a5a6">Embreagem solta</span>';

    let attachmentStatus = '<span style="color:#95a5a6">Sem ferramenta ativa</span>';
    if (veh.type === 'harvester') {
        attachmentStatus = veh.toolOn ? '<span style="color:#2ecc71">Plataforma ON</span>' : '<span style="color:#e74c3c">Plataforma OFF</span>';
    } else if (veh.type === 'tractor') {
        const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
        if (!hImpl) {
            attachmentStatus = '<span style="color:#95a5a6">Acoplado: nenhum</span>';
        } else {
            attachmentStatus = `<span style="color:${hImpl.isOn ? '#2ecc71' : '#e74c3c'}">Acoplado: ${catalog.implements[hImpl.modelId].name} ${hImpl.isOn ? 'ON' : 'OFF'}</span>`;
        }
    }
    el.innerHTML = `Motor: <b>${engineStatus}</b> | ${attachmentStatus} | ${clutchStatus}`;
}

// ============================================================
//  FIELD RENDERING
// ============================================================
function renderLandZones() {
    if (!landBordersGfx || !catalog || !lastState) return;
    landBordersGfx.clear();
    const owned = new Set(lastState.farm.unlockedLands || []);
    for (const [fid, land] of Object.entries(catalog.lands || {})) {
        const isOwned = owned.has(fid);
        landBordersGfx.lineStyle(isOwned ? 3 : 2, isOwned ? 0x2ecc71 : 0xe74c3c, 0.9);
        landBordersGfx.strokeRect(land.x, land.y, land.w, land.h);
        if (!isOwned) {
            landBordersGfx.fillStyle(0xe74c3c, 0.08);
            landBordersGfx.fillRect(land.x, land.y, land.w, land.h);
        }
    }
}

function updateFields() {
    if (!lastState || !catalog) return;
    const scene = game.scene.scenes[0]; if (!scene) return;
    const unlocked = lastState.farm.unlockedLands || [];
    for (const fid of unlocked) {
        if (!fieldSprites[fid] && catalog.lands[fid]) {
            const f = catalog.lands[fid];
            fieldSprites[fid] = scene.add.tileSprite(f.x + f.w / 2, f.y + f.h / 2, f.w, f.h, 'dirt').setDepth(-5);
        }
    }
    for (const [fid, f] of Object.entries(catalog.lands)) {
        const lk = 'lock_' + fid;
        if (!unlocked.includes(fid)) {
            if (!fieldSprites[lk]) fieldSprites[lk] = scene.add.tileSprite(f.x + f.w / 2, f.y + f.h / 2, f.w, f.h, 'dirt').setDepth(-5).setAlpha(0.3);
        } else {
            if (fieldSprites[lk]) { fieldSprites[lk].destroy(); delete fieldSprites[lk]; }
        }
    }
}

// ============================================================
//  SOIL RENDERING
// ============================================================
function updateSoil(soilObj) {
    if (!soilGfx) return; soilGfx.clear();
    for (const [key, info] of Object.entries(soilObj)) {
        const st = typeof info === 'object' ? info.state : info;
        const dir = typeof info === 'object' ? info.dir : null;
        if (st === 'normal') continue;
        const [sx, sy] = key.split(',').map(Number);
        // Agora sx, sy representam o CANTO SUPERIOR ESQUERDO da tile para alinhar com o grid fsico
        const l = sx, t = sy;
        if (st === 'plowed') {
            soilGfx.fillStyle(0x5c4033, 0.85); soilGfx.fillRect(l, t, TILE, TILE);
            soilGfx.lineStyle(2, 0x3b2f2f, 0.7);
            for (let i = 4; i < TILE; i += 6) { soilGfx.beginPath(); soilGfx.moveTo(l, t + i); soilGfx.lineTo(l + TILE, t + i); soilGfx.strokePath(); }
        } else if (st === 'harrowed') {
            soilGfx.fillStyle(0x3b2f2f, 1); soilGfx.fillRect(l, t, TILE, TILE);
            soilGfx.lineStyle(1, 0x2c2320, 0.9);
            if (dir === 'v') { for (let i = 3; i < TILE; i += 5) { soilGfx.beginPath(); soilGfx.moveTo(l + i, t); soilGfx.lineTo(l + i, t + TILE); soilGfx.strokePath(); } }
            else { for (let i = 3; i < TILE; i += 5) { soilGfx.beginPath(); soilGfx.moveTo(l, t + i); soilGfx.lineTo(l + TILE, t + i); soilGfx.strokePath(); } }
            soilGfx.fillStyle(0x4a3020, 0.5);
            for (let px = 4; px < TILE; px += 8) for (let py = 4; py < TILE; py += 8) soilGfx.fillRect(l + px, t + py, 2, 2);
        } else if (st === 'planted') {
            soilGfx.fillStyle(0x2c1f15, 0.95); soilGfx.fillRect(l, t, TILE, TILE);
            soilGfx.fillStyle(0x5c4033, 0.6);
            soilGfx.fillRect(l + 8, t + 8, 3, 3); soilGfx.fillRect(l + 20, t + 20, 3, 3);
            soilGfx.fillRect(l + 8, t + 20, 3, 3); soilGfx.fillRect(l + 20, t + 8, 3, 3);
        }
    }
}

// ============================================================
//  CROP RENDERING
// ============================================================
function updateCrops(crops) {
    const scene = game.scene.scenes[0]; if (!scene) return;
    cropsGroup.clear(true, true);
    crops.forEach(c => {
        let k = 'crop_1', vg = c.growthStage;
        if (!c.isReady && !c.isDead) { vg += (currentHour / 24) * 20; if (vg > 100) vg = 100; }
        if (c.isReady) k = 'crop_3'; else if (vg > 50) k = 'crop_2';
        // Adiciona TILE/2 para centralizar o sprite no quadrado que comea em (c.x, c.y)
        const sp = scene.add.sprite(c.x + TILE / 2, c.y + TILE / 2, k).setDepth(1);
        if (c.isDead) sp.setTint(0x7f8c8d);
        cropsGroup.add(sp);
    });
}


async function fetchCatalog() {
    try {
        const d = await apiJson('/shop/catalog');
        catalog = d;
        console.log("Catálogo carregado:", catalog);
        if (lastState) {
            ensureVehicles();
            ensureImplements();
            updateFields();
            renderLandZones();
        }
    } catch (e) {
        console.warn("Erro ao carregar catálogo:", e);
    }
}

async function fetchState() {
    if (multiplayerMode) return; // In multiplayer, state is pushed via socket
    try {
        const d = await apiJson('/state');
        lastState = d;
        isHydrated = true;
        ensureVehicles();
        ensureImplements();
        updateHUD(lastState);
        updateSoil(lastState.farm.soil);
        updateCrops(lastState.farm.plantedCrops);
        updateFields();
        renderLandZones();
    } catch (e) {
        console.warn("Erro ao carregar estado:", e);
    }
}

async function advanceHour() {
    if (multiplayerMode) return;
    try {
        const d = await apiJson('/tick', { method: 'POST' });
        if (d.success) await fetchState();
    } catch (e) { }
}

function openShop() {
    playSFX('menu');
    shopOpen = true;
    const modal = document.getElementById('shop-modal');
    if (modal) modal.style.display = 'flex';
    const elMoney = document.getElementById('shop-money');
    if (elMoney) elMoney.innerText = lastState?.farm?.money || 0;
    switchTab('vehicles');
}

function closeShop() {
    playSFX('click');
    shopOpen = false;
    const modal = document.getElementById('shop-modal');
    if (modal) modal.style.display = 'none';
    fetchState();
}

function switchTab(cat) {
    if (!catalog) return;
    const cont = document.getElementById('shop-content');
    if (!cont) return;

    const tabs = document.querySelectorAll('.shop-tab');
    tabs.forEach(t => t.classList.remove('active'));

    // Marcar aba ativa
    const tabIds = { 'vehicles': 0, 'implements': 1, 'seeds': 2, 'items': 3, 'lands': 4, 'sell': 5 };
    if (tabIds[cat] !== undefined) tabs[tabIds[cat]].classList.add('active');

    if (cat === 'sell') {
        renderSellMenuInShop();
        return;
    }

    let html = '';
    const items = catalog[cat];
    if (items) {
        if (cat === 'vehicles') {
            const types = {
                tractor: '🚜 Tratores',
                harvester: '🌾 Colheitadeiras',
                truck: '🚚 Caminhões'
            };

            for (const typeKey in types) {
                let hasItems = false;
                let sectionHtml = `<h3 class="shop-category-title">${types[typeKey]}</h3><div class="shop-grid">`;

                for (const id in items) {
                    const item = items[id];
                    if (item.type !== typeKey || item.price <= 0) continue;
                    hasItems = true;
                    sectionHtml += `
                        <div class="shop-card">
                            <div class="shop-card-badge">${cat.toUpperCase()}</div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">$${item.price.toLocaleString()}</div>
                            <div class="item-desc">
                                ${item.brand ? '<span class="brand">' + item.brand + '</span>' : ''}
                            </div>
                            <button class="buy-btn" onclick="buyItem('${cat}', '${id}')">
                                <span>Adquirir</span>
                            </button>
                        </div>
                    `;
                }
                sectionHtml += '</div>';
                if (hasItems) html += sectionHtml;
            }
        } else if (cat === 'implements') {
            const types = { plow: '🚜 Arados', harrow: '⚙️ Grades', seeder: '🌱 Plantadeiras' };
            for (const typeKey in types) {
                let hasItems = false;
                let sectionHtml = `<h3 class="shop-category-title">${types[typeKey]}</h3><div class="shop-grid">`;
                for (const id in items) {
                    const item = items[id];
                    if (item.type !== typeKey || item.price <= 0) continue;
                    hasItems = true;
                    sectionHtml += `
                        <div class="shop-card">
                            <div class="shop-card-badge">${cat.toUpperCase()}</div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">$${item.price.toLocaleString()}</div>
                            <div class="item-desc">
                                ${item.brand ? '<span class="brand">' + item.brand + '</span>' : ''}
                            </div>
                            <button class="buy-btn" onclick="buyItem('${cat}', '${id}')">
                                <span>Adquirir</span>
                            </button>
                        </div>
                    `;
                }
                sectionHtml += '</div>';
                if (hasItems) html += sectionHtml;
            }
        } else {
            html += '<div class="shop-grid">';
            for (const id in items) {
                const item = items[id];
                if (item.price <= 0) continue;

                // Hide unique purchases (cellphone & lands)
                if (cat === 'items' && id === 'cellphone' && lastState.farm.hasCellphone) continue;
                if (cat === 'lands' && lastState.farm.unlockedLands && lastState.farm.unlockedLands.includes(id)) continue;

                html += `
                    <div class="shop-card">
                        <div class="shop-card-badge">${cat.toUpperCase()}</div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">$${item.price.toLocaleString()}</div>
                        <div class="item-desc">
                            ${item.brand ? '<span class="brand">' + item.brand + '</span>' : ''}
                            ${item.type ? '<span class="type">' + item.type + '</span>' : ''}
                        </div>
                        <button class="buy-btn" onclick="buyItem('${cat}', '${id}')">
                            <span>Adquirir</span>
                        </button>
                    </div>
                `;
            }
            html += '</div>';
        }

    }
    cont.innerHTML = html;
}

function renderSellMenuInShop() {
    const cont = document.getElementById('shop-content');
    if (!cont || !lastState) return;

    let html = '<div class="sell-info-header">Itens em sua posse (Venda por 80% do valor original)</div><div class="shop-grid">';
    const inv = lastState.farm.inventory;

    // Veículos
    inv.vehicles.forEach((v) => {
        const model = catalog.vehicles[v.modelId];
        // Bloquear venda de itens de preço 0
        if (model && model.price > 0) {
            html += `
                <div class="shop-card sell-card">
                    <div class="shop-card-badge sell">VEÍCULO</div>
                    <div class="item-name">${model.name}</div>
                    <div class="item-price">Retorno: $${Math.floor(model.price * 0.8).toLocaleString()}</div>
                    <button class="sell-btn" onclick="sellItem('vehicles', '${v.id}')">Vender Agora</button>
                </div>
            `;
        }
    });

    // Implementos
    inv.implements.forEach((imp) => {
        const model = catalog.implements[imp.modelId];
        // Bloquear venda de itens de preço 0
        if (model && model.price > 0) {
            html += `
                <div class="shop-card sell-card">
                    <div class="shop-card-badge sell">IMPL.</div>
                    <div class="item-name">${model.name}</div>
                    <div class="item-price">Retorno: $${Math.floor(model.price * 0.8).toLocaleString()}</div>
                    <button class="sell-btn" onclick="sellItem('implements', '${imp.id}')">Vender Agora</button>
                </div>
            `;
        }
    });
    // Terras (Ocultando field_1)
    if (lastState.farm.unlockedLands) {
        lastState.farm.unlockedLands.forEach(fid => {
            if (fid === 'field_1') return; // Não permite vender o campo principal
            const model = catalog.lands[fid];
            if (model && model.price > 0) {
                html += `
                    <div class="shop-card sell-card">
                        <div class="shop-card-badge sell">TERRA</div>
                        <div class="item-name">${model.name}</div>
                        <div class="item-price">Retorno: $${Math.floor(model.price * 0.8).toLocaleString()}</div>
                        <button class="sell-btn" onclick="sellItem('lands', '${fid}')">Vender Agora</button>
                    </div>
                `;
            }
        });
    }

    // Produção (Grãos no Silo)
    if (lastState.farm.harvestedCrops > 0) {
        const profit = lastState.farm.harvestedCrops * lastState.economy.pricePerCrop;
        html += `
            <div class="shop-card sell-card" style="border-color: #27ae60">
                <div class="shop-card-badge" style="background: #27ae60">GRÃOS</div>
                <div class="item-name">Estoque no Silo</div>
                <div class="item-desc">${lastState.farm.harvestedCrops} unidades</div>
                <div class="item-price">Total: $${profit.toLocaleString()}</div>
                <button class="sell-btn" style="background: #27ae60" onclick="sellGrains()">Vender Tudo</button>
            </div>
        `;
    }

    html += '</div>';
    if (html.includes('shop-card')) {
        cont.innerHTML = html;
    } else {
        cont.innerHTML = '<div class="no-items-msg">Você não possui itens valiosos para vender no momento.</div>';
    }
}

async function buyItem(cat, id) {
    if (!catalog || !catalog[cat] || !catalog[cat][id]) return;
    const item = catalog[cat][id];

    // Bloqueio de segurança para itens de preço 0
    if (item.price <= 0) {
        showToast('Este item não está disponível para venda.', 'warning');
        return;
    }

    if (multiplayerMode) {
        socket.emit('shopBuy', { category: cat, itemId: id }, async (res) => {
            if (res && res.success) {
                playSFX('buy');
                const item = catalog[cat][id];
                showBigAlert(`${item.name} comprado com sucesso!`);
                await fetchState();
                const elMoney = document.getElementById('shop-money');
                if (elMoney) elMoney.innerText = lastState.farm.money;
                ensureVehicles();
                ensureImplements();
                switchTab(cat);
            } else {
                showToast(res ? res.error : 'Erro na compra', 'error');
            }
        });
        return;
    }
    try {
        const d = await apiJson('/shop/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) {
            playSFX('buy');
            showBigAlert(`${item.name} comprado com sucesso!`);
            await fetchState();
            const elMoney = document.getElementById('shop-money');
            if (elMoney) elMoney.innerText = lastState.farm.money;
            ensureVehicles();
            ensureImplements();
            // Refresh shop UI to remove unique items
            switchTab(cat);
        } else {
            showToast(d.error || 'Saldo insuficiente', 'error');
        }
    } catch (e) { }
}

function closeSellMenu() {
    const sellModal = document.getElementById('sell-modal');
    if (sellModal) sellModal.style.display = 'none';
}

async function sellItem(cat, idx) {
    // Busca o modelo para verificar o preço
    let itemPrice = 0;
    if (lastState && catalog) {
        if (cat === 'lands') {
            const model = catalog.lands[idx];
            if (model) itemPrice = model.price;
        } else {
            const inv = lastState.farm.inventory[cat];
            if (inv) {
                const item = inv.find(i => i.id === idx);
                if (item) {
                    const model = catalog[cat][item.modelId];
                    if (model) itemPrice = model.price;
                }
            }
        }
    }

    // Bloqueio de segurança para itens de preço 0
    if (itemPrice <= 0) {
        showToast('Itens iniciais não podem ser vendidos.', 'warning');
        return;
    }

    if (multiplayerMode) {
        socket.emit('shopSell', { category: cat, itemId: idx }, async (res) => {
            if (res && res.success) {
                let itemName = "Item";
                if (cat === 'lands') {
                    itemName = catalog.lands[idx]?.name || "Terra";
                } else if (catalog[cat] && lastState.farm.inventory[cat]) {
                    const invItem = lastState.farm.inventory[cat].find(i => i.id === idx);
                    if (invItem && catalog[cat][invItem.modelId]) itemName = catalog[cat][invItem.modelId].name;
                }
                showBigAlert(`${itemName} vendido com sucesso!`);
                await fetchState();
                const elMoney = document.getElementById('shop-money');
                if (elMoney) elMoney.innerText = lastState.farm.money;
                ensureVehicles();
                ensureImplements();
                switchTab('sell');
            } else {
                showToast(res ? res.error : 'Erro na venda', 'error');
            }
        });
        return;
    }
    try {
        const d = await apiJson('/shop/sell', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: idx })
        });
        if (d.success) {
            let itemName = "Item";
            if (cat === 'lands') {
                itemName = catalog.lands[idx]?.name || "Terra";
            } else if (catalog[cat] && lastState.farm.inventory[cat]) {
                const invItem = lastState.farm.inventory[cat].find(i => i.id === idx);
                if (invItem && catalog[cat][invItem.modelId]) itemName = catalog[cat][invItem.modelId].name;
            }
            showBigAlert(`${itemName} vendido com sucesso!`);
            await fetchState();
            switchTab('sell'); // Recarrega a aba de venda
            ensureVehicles();
            ensureImplements();
        }
    } catch (e) { }
}

function renderSellMenu(cat) {
    if (!catalog || !lastState) return;
    const cont = document.getElementById('sell-items');
    const tabs = document.querySelectorAll('.sell-tab');
    if (!cont || !tabs.length) return;

    tabs.forEach(t => t.classList.remove('active'));
    if (cat === 'vehicles') tabs[0].classList.add('active');
    else if (cat === 'implements') tabs[1].classList.add('active');

    let html = '';
    const inv = lastState.farm.inventory;
    const items = inv[cat];

    if (items.length === 0) {
        html = '<div style="color:#666; padding:20px;">Você não possui itens nesta categoria.</div>';
    } else {
        items.forEach((item, idx) => {
            const model = catalog[cat][item.modelId];
            const price = model ? Math.floor(model.price * 0.7) : 0;
            html += `
                <div class="shop-item">
                    <div class="item-name">${model ? model.name : item.modelId}</div>
                    <div class="item-price">Venda: $${price}</div>
                    <button onclick="sellItem('${cat}', ${idx})">Vender</button>
                </div>
            `;
        });
    }
    cont.innerHTML = html;
}

// Expose to HTML
window.buyItem = buyItem;
window.sellItem = sellItem;
window.openShop = openShop;
window.switchTab = switchTab;
window.closeShop = closeShop;
window.closeSellMenu = closeSellMenu;
window.renderSellMenu = renderSellMenu;
window.toggleFullMap = toggleFullMap;
window.advanceHour = advanceHour;

// UI Modals
function openTutorialModal() {
    const el = document.getElementById('tutorial-modal');
    if (el) el.style.display = 'flex';
}
function closeTutorialModal() {
    const el = document.getElementById('tutorial-modal');
    if (el) el.style.display = 'none';
}
function openControlsModal() {
    const el = document.getElementById('controls-modal');
    if (el) el.style.display = 'flex';
}
function closeControlsModal() {
    const el = document.getElementById('controls-modal');
    if (el) el.style.display = 'none';
}

window.openTutorialModal = openTutorialModal;
window.closeTutorialModal = closeTutorialModal;
window.openControlsModal = openControlsModal;
window.closeControlsModal = closeControlsModal;

function openPauseMenu() {
    document.getElementById('pause-modal').style.display = 'flex';
}

function closePauseMenu() {
    document.getElementById('pause-modal').style.display = 'none';
}

function quitToMainMenu() {
    closePauseMenu();

    // Desconectar se estiver em multiplayer
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    // Limpar estado visual e posições (Evita fantasmas entre salas/Solo)
    vehicleSprites.forEach(v => v.sprite.destroy());
    vehicleSprites = [];
    spawnedVehicleIds.clear();
    implementSprites.forEach(i => i.sprite.destroy());
    implementSprites = [];
    spawnedImplementIds.clear();

    vehiclePositions = {};
    implementPositions = {};
    activeVehIdx = -1;

    if (cropsGroup) cropsGroup.clear(true, true);
    if (decoGroup) decoGroup.clear(true, true);

    Object.values(otherPlayers).forEach(op => {
        if (op.sprite) op.sprite.destroy();
        if (op.text) op.text.destroy();
    });
    otherPlayers = {};

    const chatMsgs = document.getElementById('chat-messages');
    if (chatMsgs) chatMsgs.innerHTML = '';

    multiplayerMode = false;
    lastState = null;
    localState = null; // Força re-carregamento limpo do sessionStorage ao entrar no Solo

    // Esconder HUDs
    document.getElementById('hud').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('minimap').style.display = 'none';
    document.getElementById('field-monitor').style.display = 'none';
    document.getElementById('ui-buttons-container').style.display = 'none';
    document.getElementById('ui-room-code').style.display = 'none';
    document.getElementById('chat-container').style.display = 'none';

    // Mostrar Menu Inicial
    document.getElementById('main-menu').style.display = 'flex';

    // Resetar estado local do jogador se necessário (opcional)
    // window.location.reload(); // Uma forma bruta mas eficaz de resetar tudo
}

// ============================================================
//  MULTIPLAYER LOGIC (PHASE 1)
// ============================================================

function startSoloMode() {
    multiplayerMode = false;
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('ui-room-code').style.display = 'none';
    document.getElementById('chat-container').style.display = 'none';

    // Garantir que o HUD e controles estejam visíveis
    document.getElementById('hud').style.display = 'block';
    document.getElementById('minimap').style.display = 'block';
    document.getElementById('ui-buttons-container').style.display = 'flex';

    console.log("Iniciando Modo Solo...");
}

function startMultiplayerMode() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('lobby-screen').style.display = 'flex';
    console.log("Abrindo Lobby Multiplayer...");
    initMultiplayer();
}

function backToMainMenu() {
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    // Limpar estado do jogo
    vehicleSprites.forEach(v => v.sprite.destroy());
    vehicleSprites = [];
    spawnedVehicleIds.clear();
    implementSprites.forEach(i => i.sprite.destroy());
    implementSprites = [];
    spawnedImplementIds.clear();

    vehiclePositions = {};
    implementPositions = {};
    activeVehIdx = -1;
    if (cropsGroup) cropsGroup.clear(true, true);

    Object.values(otherPlayers).forEach(op => {
        if (op.sprite) op.sprite.destroy();
        if (op.text) op.text.destroy();
    });
    otherPlayers = {};

    const chatMsgs = document.getElementById('chat-messages');
    if (chatMsgs) chatMsgs.innerHTML = '';

    multiplayerMode = false;
    lastState = null;
    localState = null;
}

function initMultiplayer() {
    if (socket) return;

    console.log("Iniciando conexão socket com:", API || window.location.origin);
    socket = io(API || window.location.origin, {
        transports: ['websocket'],
        secure: true
    });

    socket.on('connect', () => {
        console.log("Conectado ao servidor multiplayer! ID:", socket.id);
        socket.emit('requestRoomList');
        setupChatListeners();
    });

    socket.on('connect_error', (err) => {
        console.error("Erro na conexão Socket.io:", err.message);
    });

    socket.on('disconnect', (reason) => {
        console.log("Socket desconectado. Motivo:", reason);
    });

    socket.on('roomStateSynced', (room) => {
        multiplayerMode = true;
        const myInv = room.playerInventories[socket.id] || { vehicles: [], implements: [], hasCellphone: false };
        lastState = {
            time: room.time, weather: room.weather, economy: room.economy,
            farm: {
                ...room.farm,
                inventory: myInv,
                hasCellphone: myInv.hasCellphone
            },
            vehicles: room.vehicles,
            implements: room.implements
        };
        isHydrated = true;
        ensureVehicles();
        ensureImplements();
        updateHUD(lastState);
        updateSoil(room.farm.soil);
        updateCrops(room.farm.plantedCrops);
        updateFields();
        renderLandZones();
        renderWorldMap();

        // Update local name tag
        if (playerNameTag) {
            const nick = document.getElementById('lobby-nickname').value || `Jogador ${socket.id.substring(0, 4)}`;
            playerNameTag.setText(nick).setVisible(true);
        }
    });

    socket.on('tick', (data) => {
        if (!lastState) return;
        lastState.time = data.time;
        lastState.weather = data.weather;
        lastState.farm.plantedCrops = data.crops;
        // Atualizar também o estado global se o servidor enviou (ex: novos veículos)
        if (data.vehicles) lastState.vehicles = data.vehicles;
        if (data.implements) lastState.implements = data.implements;

        ensureVehicles();
        ensureImplements();
        updateHUD(lastState);
        updateCrops(data.crops);
    });

    socket.on('soilUpdated', ({ key, state, dir }) => {
        if (!lastState) return;
        console.log(`[NET] Soil updated at ${key}: ${state}`);
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
        if (!veh) return;

        veh.driverId = data.driverId;
        veh.passengers = data.passengers || [];

        const amIDriver = (veh.driverId === socket.id);
        const amIPassenger = veh.passengers.includes(socket.id);
        const iAmInThisVehicle = activeVehIdx === vehicleSprites.indexOf(veh);

        if (iAmInThisVehicle) {
            // Block or restore input control
            veh.isMyDriver = amIDriver;
            // If someone else took over as driver (e.g., we disconnected briefly), keep camera on veh
        }
    });

    // implementAttached/implementDetached replaced by 'implementUpdated' — see below

    // implementAttached/implementDetached are now handled by the unified 'implementUpdated' event

    socket.on('roomList', (rooms) => {
        const list = document.getElementById('lobby-rooms-list');
        if (!list) return;

        if (rooms.length === 0) {
            list.innerHTML = '<div class="no-rooms">Nenhuma sala pública disponível</div>';
            return;
        }

        list.innerHTML = rooms.map(room => `
            <div class="room-item">
                <div class="room-info">
                    <span class="room-name">${room.name}</span>
                    <span class="room-players">${room.playerCount} jogadores</span>
                </div>
                <button class="room-join-btn" onclick="lobbyJoinRoom('${room.id}')">Entrar</button>
            </div>
        `).join('');
    });

    socket.on('roomCreated', ({ roomId, code }) => {
        if (code) {
            showToast(`Sala privada criada! Código: ${code}`, 'success');
            // Copiar código para área de transferência se possível
            navigator.clipboard.writeText(code).catch(e => e);

            // Mostrar no HUD
            document.getElementById('ui-room-code').style.display = 'block';
            document.getElementById('ui-room-code-val').textContent = code;
        } else {
            document.getElementById('ui-room-code').style.display = 'block';
            document.getElementById('ui-room-code-val').textContent = 'PÚBLICA';
        }

        // Mostrar UI do jogo
        document.getElementById('hud').style.display = 'block';
        document.getElementById('minimap').style.display = 'block';
        document.getElementById('ui-buttons-container').style.display = 'flex';
        document.getElementById('chat-container').style.display = 'flex';

        document.getElementById('lobby-screen').style.display = 'none';
        multiplayerMode = true;
    });

    socket.on('currentPlayers', (players) => {
        // Limpar jogadores antigos
        Object.values(otherPlayers).forEach(op => {
            op.sprite.destroy();
            op.text.destroy();
        });
        otherPlayers = {};

        Object.keys(players).forEach((id) => {
            if (id !== socket.id) {
                addOtherPlayer(id, players[id]);
            }
        });

        // Se entramos por código, o código deve estar no input
        const codeInput = document.getElementById('lobby-join-code');
        if (codeInput && codeInput.value) {
            document.getElementById('ui-room-code').style.display = 'block';
            document.getElementById('ui-room-code-val').textContent = codeInput.value.toUpperCase();
        } else {
            // Se for pública (ou via lista), mostrar como pública por enquanto
            // (Poderíamos receber o código/tipo da sala no evento currentPlayers futuramente)
            document.getElementById('ui-room-code').style.display = 'block';
            document.getElementById('ui-room-code-val').textContent = 'CONECTADO';
        }

        // Mostrar UI do jogo
        document.getElementById('hud').style.display = 'block';
        document.getElementById('minimap').style.display = 'block';
        document.getElementById('ui-buttons-container').style.display = 'flex';
        document.getElementById('chat-container').style.display = 'flex';

        document.getElementById('lobby-screen').style.display = 'none';
        multiplayerMode = true;
    });

    socket.on('newPlayer', (playerInfo) => {
        addOtherPlayer(playerInfo.id, playerInfo);
    });

    socket.on('playerMoved', (playerInfo) => {
        if (otherPlayers[playerInfo.id]) {
            const op = otherPlayers[playerInfo.id];
            op.sprite.setPosition(playerInfo.x, playerInfo.y);
            op.sprite.setRotation(playerInfo.angle);

            let offsetY = -40;
            if (playerInfo.vehicleId) {
                const veh = vehicleSprites.find(v => v.id === playerInfo.vehicleId);
                if (veh) {
                    if (veh.driverId === playerInfo.id) offsetY = -60;
                    else offsetY = -35; // Passenger
                }
            }
            op.text.setPosition(playerInfo.x, playerInfo.y + offsetY);

            // Se o jogador estiver em um veículo, esconda o sprite dele
            if (playerInfo.vehicleId) {
                op.sprite.setVisible(false);
            } else {
                op.sprite.setVisible(true);
            }
        }
    });

    // Player sprite hiding when entering/exiting vehicles (via dedicated events from server)
    socket.on('playerEnteredVehicle', (data) => {
        if (otherPlayers[data.playerId]) {
            otherPlayers[data.playerId].sprite.setVisible(false);
            // Don't hide name tag, let it follow the vehicle in playerMoved
            otherPlayers[data.playerId].text.setVisible(true);
        }
    });

    socket.on('playerExitedVehicle', (data) => {
        if (otherPlayers[data.playerId]) {
            otherPlayers[data.playerId].sprite.setPosition(data.x, data.y);
            otherPlayers[data.playerId].sprite.setVisible(true);
            otherPlayers[data.playerId].text.setVisible(true);
        }
    });

    socket.on('vehicleUpdated', (vehData) => {
        const veh = vehicleSprites.find(v => v.id === vehData.id);
        if (!veh) return;

        // Always sync attachment state regardless of who drives
        veh.attachedImplementId = vehData.attachedImplementId || null;

        // Only update position/rotation/hud-state if we are NOT the driver
        const iAmDriver = multiplayerMode && socket && veh.driverId === socket.id;
        if (!iAmDriver) {
            veh.sprite.setPosition(vehData.x, vehData.y);
            veh.sprite.setRotation(vehData.angle);
            veh.engineOn = vehData.isOn;
            veh.velocity = vehData.velocity || 0;
            veh.gear = vehData.gear || 0;
            veh.rpm = vehData.rpm || 0;
            veh.fuel = vehData.fuel || 100;
            veh.toolOn = vehData.toolOn || false;

            // Update attached implement state for tractors
            if (veh.attachedImplementId) {
                const hImpl = implementSprites.find(i => i.id === veh.attachedImplementId);
                if (hImpl) hImpl.isOn = veh.toolOn;
            }

            // Reposition attached implement to follow this vehicle
            if (veh.attachedImplementId) {
                const TILE = 64;
                const hImpl = implementSprites.find(i => i.id === veh.attachedImplementId);
                if (hImpl) {
                    const dist = TILE * 0.65;
                    const rot = vehData.angle;
                    hImpl.sprite.x = vehData.x - Math.cos(rot) * dist;
                    hImpl.sprite.y = vehData.y - Math.sin(rot) * dist;
                    hImpl.sprite.rotation = rot;
                    hImpl.hitchedTo = veh.id;
                }
            }

            // Force HUD refresh for passengers
            if (idx === activeVehIdx) {
                updateDashboard();
                refreshStatusHUD();
                refreshGearHUD();
            }
        }
    });

    // Full implement state sync (attach/detach)
    socket.on('implementUpdated', (impData) => {
        const imp = implementSprites.find(i => i.id === impData.id);
        if (!imp) return;
        console.log('[IMPLEMENT UPDATED]', impData.id, 'attachedTo:', impData.attachedToVehicleId);
        imp.hitchedTo = impData.attachedToVehicleId || null;
        if (!imp.hitchedTo) imp.isOn = false;
    });

    socket.on('playerLeft', (id) => {
        if (otherPlayers[id]) {
            otherPlayers[id].sprite.destroy();
            otherPlayers[id].text.destroy();
            delete otherPlayers[id];
        }
    });

    socket.on('chatMessage', (data) => {
        addMessageToChat(data.nickname, data.message, data.time, data.playerId === socket.id);
    });

    socket.on('error', (msg) => {
        showToast(msg, 'error');
    });
}

function lobbyCreateRoom(isPrivate) {
    const nickname = document.getElementById('lobby-nickname').value || `Jogador ${socket.id.substring(0, 4)}`;
    socket.emit('createRoom', { nickname, isPrivate });
}

function lobbyJoinRoom(roomId) {
    const nickname = document.getElementById('lobby-nickname').value || `Jogador ${socket.id.substring(0, 4)}`;
    socket.emit('joinRoom', { roomId, nickname });
}

function lobbyJoinByCode() {
    const code = document.getElementById('lobby-join-code').value.toUpperCase();
    const nickname = document.getElementById('lobby-nickname').value || `Jogador ${socket.id.substring(0, 4)}`;
    if (!code) return showToast('Digite o código da sala', 'warning');
    socket.emit('joinByCode', { code, nickname });
}

function addOtherPlayer(id, info) {
    const scene = game.scene.scenes[0];
    if (!scene) return;

    console.log("Adicionando outro jogador:", id);
    const sprite = scene.add.sprite(info.x, info.y, 'p_down').setDepth(4);
    sprite.setTint(0x38bdf8); // Diferenciar outros jogadores com um tom azul

    // Esconder se já estiver em um veículo
    if (info.vehicleId) sprite.setVisible(false);

    const ls = { font: '10px Arial', fill: '#38bdf8', backgroundColor: '#0008', padding: { x: 4, y: 2 } };
    const text = scene.add.text(info.x, info.y - 40, info.nickname || `Jogador ${id.substring(0, 4)}`, ls).setOrigin(0.5).setDepth(5);

    otherPlayers[id] = { sprite, text };
}

function addMessageToChat(nick, msg, time, isSelf) {
    console.log("Recebendo mensagem no chat:", nick, msg);
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'chat-msg' + (isSelf ? ' self' : '');

    div.innerHTML = `
        <span class="chat-msg-time">[${time}]</span>
        <span class="chat-msg-nick">${nick}:</span>
        <span class="chat-msg-text">${msg}</span>
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Configurar input do chat
function setupChatListeners() {
    const chatInput = document.getElementById('chat-input');
    console.log("Configurando listeners do chat... Input encontrado:", !!chatInput);
    if (chatInput) {
        // Remover listeners antigos se houver (para evitar duplicatas em re-init)
        const newChatInput = chatInput.cloneNode(true);
        chatInput.parentNode.replaceChild(newChatInput, chatInput);

        newChatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const message = e.target.value.trim();
                console.log("Tentativa de envio - Mensagem:", message, "Socket Conectado:", (socket && socket.connected));
                if (message && socket && socket.connected) {
                    socket.emit('chatMessage', { message });
                    console.log("Evento 'chatMessage' emitido!");
                    e.target.value = '';
                    e.target.blur(); // Remove o foco do chat para as teclas voltarem para o jogo
                }
            }
            e.stopPropagation();
        });

        newChatInput.addEventListener('focus', () => {
            if (game && game.input && game.input.keyboard) game.input.keyboard.enabled = false;
        });
        newChatInput.addEventListener('blur', () => {
            if (game && game.input && game.input.keyboard) game.input.keyboard.enabled = true;
        });
    }
}

function toggleChat() {
    if (!multiplayerMode) return;
    const chat = document.getElementById('chat-container');
    if (!chat) return;

    if (chat.style.display === 'none') {
        chat.style.display = 'flex';
        showToast('Chat visível', 'info');
    } else {
        chat.style.display = 'none';
        showToast('Chat oculto (Aperte B)', 'info');
    }
}

// Chamar setup quando o DOM estiver pronto ou re-iniciado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupChatListeners);
} else {
    setupChatListeners();
}

window.startSoloMode = startSoloMode;
window.startMultiplayerMode = startMultiplayerMode;
window.lobbyCreateRoom = lobbyCreateRoom;
window.lobbyJoinRoom = lobbyJoinRoom;
window.lobbyJoinByCode = lobbyJoinByCode;
window.backToMainMenu = backToMainMenu;
window.openPauseMenu = openPauseMenu;
window.closePauseMenu = closePauseMenu;
window.quitToMainMenu = quitToMainMenu;

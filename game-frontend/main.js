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

const TILE = 32;
const IS_LOCALHOST = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const API = IS_LOCALHOST ? 'http://localhost:3000' : '';
const LOCAL_CATALOG = {
    vehicles: {
        tractor_mf275: { name: 'MF 275', brand: 'Massey Ferguson', type: 'tractor', hp: 50, speed: 5, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.12, friction: 0.965, turnSpeedBase: 0.12, fuelCapacity: 50, price: 0 },
        tractor_valtra: { name: 'A850', brand: 'Valtra', type: 'tractor', hp: 85, speed: 6, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.15, friction: 0.970, turnSpeedBase: 0.11, fuelCapacity: 80, price: 800 },
        tractor_nh: { name: 'T6.110', brand: 'New Holland', type: 'tractor', hp: 120, speed: 7, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.19, friction: 0.975, turnSpeedBase: 0.09, fuelCapacity: 120, price: 1800 },
        tractor_jd: { name: 'JD 6130J', brand: 'John Deere', type: 'tractor', hp: 150, speed: 8, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.23, friction: 0.980, turnSpeedBase: 0.08, fuelCapacity: 150, price: 3000 },
        tractor_case: { name: 'Magnum 310', brand: 'Case IH', type: 'tractor', hp: 220, speed: 9, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.28, friction: 0.985, turnSpeedBase: 0.07, fuelCapacity: 220, price: 5000 },
        harvester_mf5650: { name: 'MF 5650', brand: 'Massey Ferguson', type: 'harvester', hp: 60, capacity: 50, speed: 4, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.10, friction: 0.960, turnSpeedBase: 0.06, fuelCapacity: 100, price: 0 },
        harvester_nh: { name: 'TC5090', brand: 'New Holland', type: 'harvester', hp: 100, capacity: 120, speed: 5, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.13, friction: 0.965, turnSpeedBase: 0.05, fuelCapacity: 200, price: 2000 },
        harvester_jd: { name: 'S680', brand: 'John Deere', type: 'harvester', hp: 120, capacity: 250, speed: 6, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.16, friction: 0.970, turnSpeedBase: 0.04, fuelCapacity: 350, price: 4500 },
        truck_vw: { name: 'Constellation', brand: 'Volkswagen', type: 'truck', hp: 120, capacity: 30, speed: 7, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.18, friction: 0.975, turnSpeedBase: 0.05, fuelCapacity: 150, price: 0 },
        truck_mb: { name: 'Atego 2430', brand: 'Mercedes-Benz', type: 'truck', hp: 160, capacity: 80, speed: 8, gears: 6, gearType: 'auto', autoDrive: false, acceleration: 0.22, friction: 0.980, turnSpeedBase: 0.04, fuelCapacity: 250, price: 1500 },
        truck_scania: { name: 'R450', brand: 'Scania', type: 'truck', hp: 200, capacity: 150, speed: 9, gears: 6, gearType: 'auto', autoDrive: false, acceleration: 0.26, friction: 0.985, turnSpeedBase: 0.04, fuelCapacity: 400, price: 3000 }
    },
    implements: {
        plow_small: { name: 'Tombador Pequeno', type: 'plow', requiredHp: 30, width: 1, price: 0 },
        plow_medium: { name: 'Tombador Medio', type: 'plow', requiredHp: 80, width: 2, price: 300 },
        plow_large: { name: 'Tombador Grande', type: 'plow', requiredHp: 150, width: 3, price: 700 },
        harrow_small: { name: 'Gradao 4 Linhas', type: 'harrow', requiredHp: 30, width: 1, lines: 4, price: 0 },
        harrow_medium: { name: 'Gradao 8 Linhas', type: 'harrow', requiredHp: 80, width: 2, lines: 8, price: 400 },
        harrow_large: { name: 'Gradao 12 Linhas', type: 'harrow', requiredHp: 150, width: 3, lines: 12, price: 800 },
        seeder_small: { name: 'Plantadeira Pequena', type: 'seeder', requiredHp: 30, width: 1, capacity: 20, price: 0 },
        seeder_medium: { name: 'Plantadeira Media', type: 'seeder', requiredHp: 80, width: 2, capacity: 50, price: 450 },
        seeder_large: { name: 'Plantadeira Grande', type: 'seeder', requiredHp: 150, width: 3, capacity: 100, price: 900 }
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
        field_1: { name: 'Vale Esmeralda', x: 5000, y: 6000, w: 1000, h: 800, price: 0 },
        field_2: { name: 'Colinas do Sol', x: 6200, y: 6000, w: 1200, h: 800, price: 15000 },
        field_3: { name: 'Planicie Alta', x: 5000, y: 7000, w: 1000, h: 1000, price: 20000 },
        field_4: { name: 'Campos do Rio', x: 6200, y: 7000, w: 1500, h: 1000, price: 35000 },
        field_5: { name: 'Latifundio', x: 5000, y: 8200, w: 2500, h: 1200, price: 80000 }
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
                    { id: 'veh_1', modelId: 'tractor_mf275', isOn: false, fuel: 50 },
                    { id: 'veh_2', modelId: 'harvester_mf5650', isOn: false, fuel: 100 },
                    { id: 'veh_3', modelId: 'truck_vw', isOn: false, fuel: 150 }
                ],
                implements: [
                    { id: 'imp_1', modelId: 'plow_small', isOn: false },
                    { id: 'imp_2', modelId: 'harrow_small', isOn: false },
                    { id: 'imp_3', modelId: 'seeder_small', isOn: false }
                ]
            },
            unlockedLands: ['field_1'],
            hasCellphone: false
        }
    };
}

function ensureLocalState() {
    if (!localState) {
        localState = createDefaultLocalState();
    }
    normalizeState(localState);
    return localState;
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

    if (path === '/action/truck/sell' && method === 'POST') {
        if (state.farm.truckCargoType !== 'crops' || state.farm.truckStorage <= 0) return { success: false };
        const amount = state.farm.truckStorage;
        const profit = amount * state.economy.pricePerCrop;
        state.farm.money += profit;
        state.farm.truckStorage = 0;
        state.farm.truckCargoType = null;
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
const RATIOS_6 = [0, 0.18, 0.35, 0.52, 0.70, 0.88, 1.0];
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
let catalog = { vehicles: {}, implements: {}, seeds: {}, lands: {} }; // Default fallback
let isHydrated = false;
let currentHour = 0;
let shopOpen = false;
let shopTab = 'vehicles';
let monitorVisible = false;
let vehicleSelectionIdx = 0; // Índice do veículo "selecionado" para cycling
let landBordersGfx;
let gpsGuideGfx;

// === Zones ===
const SHOP_POS = { x: 1500, y: 1500 };
const GAS_STATION_POS = { x: 2000, y: 1500 };
const SELL_POS = { x: 2500, y: 1500 };
const SHOP_PARKING_START = { x: 1200, y: 1000 };

const HOUSE_POS = { x: 4500, y: 5500 };
const SILO_POS = { x: 5000, y: 5500 };
const IMPL_BARN_START = { x: 4000, y: 5800 };
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
    this.load.image('dirt',  'assets/terrain/dirt.png');
    this.load.image('road',  'assets/terrain/road.png');
    this.load.image('tree',  'assets/terrain/tree.png');
    this.load.image('lake',  'assets/terrain/lake.png');

    // --- Crops ---
    this.load.image('crop_1', 'assets/terrain/crop_1.png');
    this.load.image('crop_2', 'assets/terrain/crop_2.png');
    this.load.image('crop_3', 'assets/terrain/crop_3.png');

    // --- Buildings ---
    this.load.image('house',       'assets/buildings/house.png');
    this.load.image('silo',        'assets/buildings/silo.png');
    this.load.image('shop_bld',    'assets/buildings/shop.png');
    this.load.image('sell_bld',    'assets/buildings/sell.png');
    this.load.image('gas_station', 'assets/buildings/gas_station.png');

    // --- Player ---
    this.load.image('p_down', 'assets/ui/player_down.png');
    this.load.image('p_up',   'assets/ui/player_up.png');
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
    for(let i = 0; i < 400; i++) {
        const tx = Phaser.Math.Between(0, W);
        const ty = Phaser.Math.Between(0, H);
        if(tx > 4000 && ty > 5000) continue; // Evitar o terreno central da fazenda e campos
        if(tx < 3000 && ty < 3000) continue; // Evitar meio da cidade
        const scale = Phaser.Math.FloatBetween(1.0, 1.8);
        const isLake = Math.random() > 0.92;
        const sp = this.add.sprite(tx, ty, isLake ? 'lake' : 'tree').setDepth(isLake ? -8 : 2);
        sp.setScale(isLake ? scale * 3 : scale);
        decoGroup.add(sp);
    }
    for(let i = 0; i < 15; i++) {
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
        o: Phaser.Input.Keyboard.KeyCodes.O
    });
    keys.f.on('down', doToggleVehicle, this);
    keys.e.on('down', doToggleHitch, this);
    keys.c.on('down', doToggleEngine, this);
    keys.l.on('down', doToggleImplementPower, this);
    keys.q.on('down', doContextAction, this);
    keys.r.on('down', doShiftUp, this);
    keys.v.on('down', doShiftDown, this);
    keys.g.on('down', doToggleTransmission, this);
    keys.h.on('down', doToggleAutoWork, this);
    keys.t.on('down', () => advanceHour());
    keys.esc.on('down', () => { if (shopOpen) closeShop(); });
    keys.left.on('down', () => cycleVehicles(-1, this));
    keys.right.on('down', () => cycleVehicles(1, this));
    keys.m.on('down', toggleFullMap);
    keys.n.on('down', () => { monitorVisible = !monitorVisible; });
    keys.z.on('down', toggleCellphone);
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
        console.warn("Falha no estado, usando fallback local");

        // fallback manual
        lastState = {
            farm: {
                soil: {},
                plantedCrops: {},
                lands: []
            }
        };
    }

    console.log("Phaser: Initial sync complete (com fallback)");

    setTimeout(hideLoading, 1000);
})();

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
                    tiles.push({ x: x + TILE/2, y: y + TILE/2 });
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
    veh.autoDriveState.activeTime += (1/60);
    
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
    const accel = (m.acceleration || 0.08) * 0.45;

    veh.velocity = Math.min(veh.velocity + accel, gearMaxSpeed);
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

    veh.autoDriveState.activeTime += (1/60);
    console.log(`[RECOVERY] dist=${dist.toFixed(1)} vel=${veh.velocity.toFixed(2)} attempts=${state.recoveryAttempts}`);
}

function runVehicleLogic(veh, isControlled) {
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
        veh.clutchPressed = !!(keys.shift && keys.shift.isDown);
        clutchPressed = veh.clutchPressed;
        veh.isBraking = !!(keys.space && keys.space.isDown);
        braking = veh.isBraking;
        throttleForward = keys.w.isDown;
        throttleReverse = keys.s.isDown;
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

    // 2. Throttle / inertia / clutch
    if (engineOn && veh.rpm > 500 && !clutchPressed) {
        let accel = (m.acceleration || 0.08) * 0.45;
        const torqueMultipliers = [1.8, 1.4, 1.1, 0.85, 0.65, 0.45];
        const gearIdx = Math.min(veh.gear - 1, torqueMultipliers.length - 1);
        accel *= torqueMultipliers[gearIdx];

        if (!isOnRoad(veh.sprite.x, veh.sprite.y)) accel *= 0.65;
        if (isToolOn(veh)) accel *= 0.55;

        if (throttleForward) veh.velocity = Math.min(veh.velocity + accel, speedLimit);
        if (throttleReverse) veh.velocity = Math.max(veh.velocity - accel * 0.6, -gearMaxSpeed * 0.5);
        
        if (!throttleForward && !throttleReverse) {
            veh.velocity *= (m.friction || 0.985);
        }
    } else {
        veh.velocity *= (m.friction || 0.985);
    }

    // 3. Brake
    if (braking && !autoDriveActive) {
        veh.velocity *= 0.92;
    }

    veh.velocity = Math.max(-gearMaxSpeed * 0.5, Math.min(veh.velocity, speedLimit));
    if (Math.abs(veh.velocity) < 0.005) veh.velocity = 0;

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

    // 5. Fuel & RPM
    if (engineOn) {
        let fuelMult = 1.0;
        if (!isOnRoad(veh.sprite.x, veh.sprite.y)) fuelMult *= 1.35;
        if (isToolOn(veh)) fuelMult *= 1.6;
        
        const fuelConsumptionRate = (0.0005 + (veh.rpm / 3000) * 0.0015) * fuelMult;
        veh.fuel = Math.max(0, (veh.fuel || 0) - fuelConsumptionRate);
        if (veh.fuel <= 0) doStall(veh);

        if (autoDriveActive) {
            const loadRatio = Math.min(1, Math.abs(veh.velocity) / Math.max(0.1, gearMaxSpeed));
            const isManobra = state.turnPhase !== 'straight';
            const rpmFloor = isManobra ? 1150 : 1450;
            const rpmCeil = isManobra ? 1750 : 2150;
            const targetRpm = Phaser.Math.Linear(rpmFloor, rpmCeil, loadRatio);
            veh.rpm = Phaser.Math.Linear(veh.rpm, targetRpm, 0.18);
        } else {
            if (throttleForward || throttleReverse) {
                let rpmRise = clutchPressed ? 120 : 80;
                if (!isOnRoad(veh.sprite.x, veh.sprite.y)) rpmRise *= 0.75;
                if (isToolOn(veh)) rpmRise *= 0.6;
                veh.rpm += rpmRise;
            } else {
                veh.rpm -= 45;
            }
            if (!clutchPressed) {
                const wheelLoad = (Math.abs(veh.velocity) / Math.max(0.1, gearMaxSpeed)) * 900;
                veh.rpm = Math.max(veh.rpm, 800 + wheelLoad);
            }
        }
        veh.rpm = Phaser.Math.Clamp(veh.rpm, 800, 3000);

        // Stall (Only manual or stalled machines)
        if (!autoDriveActive) {
            const lowRpm = veh.rpm < 980;
            const tooHighGear = veh.gear >= 3 && Math.abs(veh.velocity) < 0.35;
            const stallProtected = Date.now() < (veh.stallProtectionMs || 0);
            if (!stallProtected && throttleForward && !clutchPressed && tooHighGear && lowRpm) {
                doStall(veh);
            }
        }
    } else {
        veh.rpm = Math.max(0, veh.rpm - 35);
    }

    // 6. Auto Shift
    const autoShiftEnabled = m.gearType === 'auto' && transMode === 'auto';
    if (autoShiftEnabled && engineOn) {
        if (Math.abs(veh.velocity) > gearMaxSpeed * 0.9 && veh.gear < m.gears) {
            veh.gear++;
        } else if (Math.abs(veh.velocity) < gearMaxSpeed * 0.3 && veh.gear > 1) {
            veh.gear--;
        }
    }

    // 7. Auto Work Execution
    if (engineOn && isToolOn(veh) && veh.velocity !== 0) {
        const tx = Math.floor(veh.sprite.x / TILE) * TILE;
        const ty = Math.floor(veh.sprite.y / TILE) * TILE;
        if (tx !== veh.autoDriveState.lastTile.x || ty !== veh.autoDriveState.lastTile.y) {
            const width = getImplWidth(veh);
            const tiles = [{x: tx, y: ty}];
            if (width >= 2) tiles.push(veh.lastMoveDir === 'h' ? { x: tx, y: ty - TILE } : { x: tx + TILE, y: ty });
            if (width >= 3) tiles.push(veh.lastMoveDir === 'h' ? { x: tx, y: ty + TILE } : { x: tx - TILE, y: ty });
            
            for (const t of tiles) {
                if (shouldWorkTile(veh, t.x, t.y)) {
                    if (veh.type === 'harvester') triggerHarvest(veh, t.x, t.y);
                    if (veh.type === 'tractor') triggerImpl(veh, t.x, t.y);
                    
                    if (veh.autoDriveEnabled) {
                        veh.autoDriveState.workedTiles.add(`${t.x},${t.y}`);
                    }
                }
            }
            veh.autoDriveState.lastTile = { x: tx, y: ty };
        }
    }

    // 8. Progress tracking
    if (veh.autoDriveEnabled) {
        updateAutoDriveProgress(veh);
        // Active time count (User requirement: only while autodrive is active)
        veh.autoDriveState.activeTime += (1/60); // Assuming 60fps
    }
}

function update() {
    if (shopOpen) return;
    if (!keys || !keys.w || !keys.shift) return;

    // 1. Update each vehicle independently
    vehicleSprites.forEach((veh, idx) => {
        const isControlled = (idx === activeVehIdx);
        runVehicleLogic(veh, isControlled);
    });

    // 2. Sync active vehicle state to globals (Legacy support for HUD/UI)
    const activeVeh = getActiveVehicle();
    if (activeVeh) {
        player.x = activeVeh.sprite.x;
        player.y = activeVeh.sprite.y;
        player.setVisible(false);
        vehiclePositions[activeVeh.id] = { x: activeVeh.sprite.x, y: activeVeh.sprite.y };

        updateDashboard();
        refreshStatusHUD();
        refreshGearHUD();
    } else {
        // Player on foot movement
        player.setVisible(true);
        let vx = 0, vy = 0;
        if (keys.a.isDown) vx = -3;
        if (keys.d.isDown) vx = 3;
        if (keys.w.isDown) vy = -3;
        if (keys.s.isDown) vy = 3;
        player.x = Phaser.Math.Clamp(player.x + vx, TILE, W - TILE);
        player.y = Phaser.Math.Clamp(player.y + vy, TILE, H - TILE);

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
                const dist = TILE * 1.5;
                hImpl.sprite.x = v.sprite.x - Math.cos(v.angle) * dist;
                hImpl.sprite.y = v.sprite.y - Math.sin(v.angle) * dist;
                hImpl.sprite.rotation = v.angle;
                implementPositions[hImpl.id] = { x: hImpl.sprite.x, y: hImpl.sprite.y };
            }
        }
    });

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
                apiJson('/action/refuel', { method: 'POST', body: JSON.stringify({ amount: 2 }) }).catch(e=>e);
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
                    apiJson('/action/refuel', { method: 'POST', body: JSON.stringify({ amount: 5 }) }).catch(e=>e);
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
            const spot = {x, y};

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
            const spot = {x, y};

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
    const vehicles = lastState.farm.inventory.vehicles || [];
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
        if (!spawnedVehicleIds.has(veh.id) && catalog.vehicles[modelId]) {
            const pos = getNextParkingSpot('vehicle');
            if (!pos) {
                console.warn("Sem espaço de parking para veículo:", veh.id);
                return;
            }
            const model = catalog.vehicles[modelId];
            const texKey = 'v_' + modelId;
            const sprite = scene.add.sprite(pos.x, pos.y, texKey).setDepth(3).setRotation(1.5708);
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
            vehiclePositions[veh.id] = { x: pos.x, y: pos.y };
            spawnedVehicleIds.add(veh.id);
        }
    });
}

function ensureImplements() {
    if (!lastState || !catalog) return;
    const scene = game.scene.scenes[0];
    if (!scene) return;
    const implementsArr = lastState.farm.inventory.implements || [];
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
        const impl = catalog.implements[implItem.modelId];

        // Encontrar próximo espaço livre no galpão
        const pos = getNextParkingSpot('implement');
        if (!pos) {
            console.warn("Sem espaço no galpão para implemento:", implItem.id);
            return;
        }

        const texKey = 'impl_' + implItem.modelId;
        const sprite = scene.add.sprite(pos.x, pos.y, texKey).setDepth(2).setRotation(1.5708);

        implementSprites.push({ id: implItem.id, modelId: implItem.modelId, type: impl.type, sprite, lastX: pos.x, lastY: pos.y, isOn: false, hitchedTo: null });
        implementPositions[implItem.id] = { x: pos.x, y: pos.y };
        spawnedImplementIds.add(implItem.id);
    });
}

// ============================================================
//  NETWORK
// ============================================================
async function triggerImpl(veh, tx, ty) {
    const hImpl = implementSprites.find(i => i.hitchedTo === veh.id);
    if (!hImpl) return;
    
    // Contagem de área trabalhada global (Sync via servidor)
    const tileKey = `${tx},${ty}`; 
    // workedTiles removido pois o monitor agora usa o solo global do lastState


    const implType = hImpl.type;
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

    // Sincronização global via servidor
    const tileKey = `${tx},${ty}`;

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
    }

    activeVehicle.engineOn = !activeVehicle.engineOn;
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
    if (!isInTractor()) return;
    const veh = getActiveVehicle();
    if (!veh) return;

    // Desengate se já houver algo
    if (veh.attachedImplementId) {
        const imp = implementSprites.find(i => i.id === veh.attachedImplementId);
        if (imp) {
            console.log(`Desengatando: ${imp.id}`);
            imp.isOn = false;
            imp.hitchedTo = null;
        }
        veh.attachedImplementId = null;
        disableAutoDrive(veh, 'AUTO DRIVE: OFF - implemento desacoplado', 'warning');
        refreshStatusHUD();
        return;
    }

    // Buscar implemento livre próximo
    for (const impl of implementSprites) {
        // Segurança: Verificar se já não está preso a OUTRO veículo
        if (impl.hitchedTo) continue;
        
        const d = Phaser.Math.Distance.Between(veh.sprite.x, veh.sprite.y, impl.sprite.x, impl.sprite.y);
        
        if (d < 85) { 
            console.log(`Engatando implemento: ${impl.id} no veículo ${veh.id}`);
            veh.attachedImplementId = impl.id;
            impl.hitchedTo = veh.id;
            refreshStatusHUD();
            showToast("Implemento Acoplado", "success");
            return;
        }
    }
    console.log("Nenhum implemento disponível próximo.");
}

function doToggleVehicle() {
    if (shopOpen) return;
    
    // Clear stall/machine state before switching
    const currentVeh = getActiveVehicle();
    if (currentVeh) currentVeh.isEngineStalling = false;
    refreshStatusHUD();

    // Exit
    if (activeVehIdx >= 0) {
        const veh = vehicleSprites[activeVehIdx];
        // O AutoDrive deve CONTINUAR funcionando ao sair
        activeVehIdx = -1;
        
        player.setVisible(true);
        player.x = veh.sprite.x + TILE;
        player.y = veh.sprite.y;
        player.rotation = 0;
        // veh.sprite.rotation is NOT reset to 0, stays at current angle
        
        const scene = this.scene ? this : game.scene.scenes[0];
        scene.cameras.main.startFollow(player);
        
        document.getElementById('dashboard').style.display = 'none';
        const mon = document.getElementById('field-monitor');
        if (mon) mon.style.display = 'none';
        
        refreshGearHUD();
        return;
    }

    // Enter nearest
    let best = -1, bd = Infinity;
    vehicleSprites.forEach((v, i) => {
        const d = Phaser.Math.Distance.Between(player.x, player.y, v.sprite.x, v.sprite.y);
        if (d < 60 && d < bd) { best = i; bd = d; }
    });
    if (best >= 0) {
        activeVehIdx = best;
        const activeVehicle = vehicleSprites[best];
        const m = catalog.vehicles[activeVehicle.modelId];
        
        maxGears = (m?.gears || 4);
        transMode = (m?.gearType === 'auto') ? 'auto' : 'manual';
        
        // NÃO resetar AutoDrive ao entrar! 
        // Apenas atualizar HUD
        highlightVehicle(-1); 
        this.cameras.main.startFollow(activeVehicle.sprite);
        document.getElementById('dashboard').style.display = 'flex';
        updateDashboard();
        refreshGearHUD();
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
    const shouldShow = veh && model && model.gears === 6 && model.autoDrive && monitorVisible;
    
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
    if (near(ent, SHOP_POS, 100)) { openShop(); return; }
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
        closeCellphone();
    } else {
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
        for (const [id, it] of Object.entries(catalog.vehicles)) {
            const afford = lastState.farm.money >= it.price;
            html += `<div class="cp-item">
                <div class="cp-name">${it.name}</div>
                <div class="cp-price">$${it.price}</div>
                <button class="cp-btn-buy" onclick="buyCellphoneItem('vehicles','${id}')" ${!afford ? 'disabled' : ''}>Comprar</button>
            </div>`;
        }
    } else if (cat === 'implements') {
        for (const [id, it] of Object.entries(catalog.implements)) {
            const afford = lastState.farm.money >= it.price;
            html += `<div class="cp-item">
                <div class="cp-name">${it.name}</div>
                <div class="cp-price">$${it.price}</div>
                <button class="cp-btn-buy" onclick="buyCellphoneItem('implements','${id}')" ${!afford ? 'disabled' : ''}>Comprar</button>
            </div>`;
        }
    } else if (cat === 'seeds') {
        for (const [id, it] of Object.entries(catalog.seeds)) {
            const afford = lastState.farm.money >= it.price;
            html += `<div class="cp-item">
                <div class="cp-name">🌱 ${it.name}</div>
                <div class="cp-price">$${it.price}</div>
                <button class="cp-btn-buy" onclick="buyCellphoneItem('seeds','${id}')" ${!afford ? 'disabled' : ''}>Comprar</button>
            </div>`;
        }
    } else if (cat === 'sell') {
        const hitchedIds = new Set(implementSprites.filter(i => i.hitchedTo).map(i => i.id));
        
        inv.vehicles.forEach(v => {
            const it = catalog.vehicles[v.modelId];
            if (!it) return;
            const refund = Math.floor(it.price * 0.8);
            html += `<div class="cp-item">
                <div class="cp-name">${it.name} (V)</div>
                <div class="cp-price">Receber: $${refund}</div>
                <button class="cp-btn-sell" onclick="sellCellphoneItem('vehicles','${v.id}')">Vender</button>
            </div>`;
        });
        inv.implements.forEach(i => {
            const it = catalog.implements[i.modelId];
            if (!it) return;
            const isHitched = hitchedIds.has(i.id);
            const refund = Math.floor(it.price * 0.8);
            html += `<div class="cp-item">
                <div class="cp-name">${it.name} (I)</div>
                <div class="cp-price">Receber: $${refund}</div>
                <button class="cp-btn-sell" onclick="sellCellphoneItem('implements','${i.id}')" ${isHitched ? 'disabled' : ''}>${isHitched ? 'ENGATADO' : 'Vender'}</button>
            </div>`;
        });
        if (inv.vehicles.length === 0 && inv.implements.length === 0) {
            html += '<div style="color:#94a3b8; text-align:center; padding: 20px;">Inventário vazio.</div>';
        }
    }
    cont.innerHTML = html;
}

async function buyCellphoneItem(cat, id) {
    try {
        const d = await apiJson('/shop/buy', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) { await fetchState(); renderCellphoneMenu(cat); ensureVehicles(); ensureImplements(); }
    } catch (e) { }
}

async function sellCellphoneItem(cat, id) {
    if (cat === 'implements') {
        const isHitched = implementSprites.some(i => i.id === id && i.hitchedTo);
        if (isHitched) {
            showToast('Desengate o implemento antes de vender', 'error');
            return;
        }
    }
    try {
        const d = await apiJson('/shop/sell', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: cat, itemId: id })
        });
        if (d.success) { await fetchState(); renderCellphoneMenu('sell'); ensureVehicles(); ensureImplements(); }
    } catch (e) { }
}
function openShop() {
    shopOpen = true;
    document.getElementById('shop-modal').style.display = 'flex';
    renderShop('vehicles');
}
function closeShop() {
    shopOpen = false;
    document.getElementById('shop-modal').style.display = 'none';
    fetchState();
}
function switchTab(tab) {
    shopTab = tab;
    document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
    const el = document.getElementById('tab-' + tab);
    if (el) el.classList.add('active');
    renderShop(tab);
}
function renderShop(cat) {
    if (!catalog || !lastState) return;
    const cont = document.getElementById('shop-content');
    const inv = lastState.farm.inventory;
    let html = '';

    if (cat === 'vehicles') {
        const types = ['tractor', 'harvester', 'truck'];
        const typeNames = { 'tractor': 'Tratores', 'harvester': 'Colheitadeiras', 'truck': 'Caminhões' };
        const vehicleCounts = {};
        inv.vehicles.forEach(v => { vehicleCounts[v.modelId] = (vehicleCounts[v.modelId] || 0) + 1; });

        types.forEach(type => {
            let sectionHtml = `<div class="shop-category-title">${typeNames[type]}</div>`;
            let hasItems = false;
            for (const [id, it] of Object.entries(catalog.vehicles)) {
                if (it.type !== type) continue;
                hasItems = true;
                const afford = lastState.farm.money >= it.price;
                const trans = it.gearType === 'auto' ? 'A' : 'M';
                const stat = type === 'tractor'
                    ? `<span>HP: <b>${it.hp}</b></span> <span>Marchas: <b>${trans}${it.gears}</b></span>`
                    : `<span>Cap: <b>${it.capacity}L</b></span> <span>HP: <b>${it.hp}</b></span> <span>Marchas: <b>${trans}${it.gears}</b></span>`;
                const qty = vehicleCounts[id] || 0;
                
                sectionHtml += `<div class="shop-item">
                    ${it.autoDrive ? '<div class="si-autodrive">AUTODRIVE</div>' : ''}
                    <div class="si-brand">${it.brand}</div>
                    <div class="si-name">${it.name}</div>
                    <div class="si-stats">${stat}</div>
                    <div class="si-price">${it.price > 0 ? '$' + it.price : 'Grátis'}</div>
                    <div class="si-stats" style="text-align:center;">Na Fazenda: ${qty}</div>
                    <button onclick="buyItem('vehicles','${id}')" ${!afford ? 'disabled' : ''}>${afford ? 'Comprar' : '$$$'}</button>
                </div>`;
            }
            if (hasItems) html += sectionHtml;
        });
    } else if (cat === 'implements') {
        const implementCounts = {};
        inv.implements.forEach(i => { implementCounts[i.modelId] = (implementCounts[i.modelId] || 0) + 1; });
        for (const [id, it] of Object.entries(catalog.implements)) {
            const afford = lastState.farm.money >= it.price;
            let stat = `<span>Requisito: <b>${it.requiredHp}HP</b></span> <span>Largura: <b>${it.width}</b></span>`;
            if (it.capacity) stat += `<span>Capacidade: <b>${it.capacity}</b></span>`;
            if (it.lines) stat += `<span>Linhas: <b>${it.lines}L</b></span>`;
            const qty = implementCounts[id] || 0;
            html += `<div class="shop-item">
                <div class="si-brand">IMPLEMENTO</div>
                <div class="si-name">${it.name}</div>
                <div class="si-stats">${stat}</div>
                <div class="si-price">${it.price > 0 ? '$' + it.price : 'Grátis'}</div>
                <div class="si-stats" style="text-align:center;">Na Fazenda: ${qty}</div>
                <button onclick="buyItem('implements','${id}')" ${!afford ? 'disabled' : ''}>${afford ? 'Comprar' : '$$$'}</button>
            </div>`;
        }
    } else if (cat === 'seeds') {
        for (const [id, it] of Object.entries(catalog.seeds)) {
            const afford = lastState.farm.money >= it.price;
            html += `<div class="shop-item">
                <div class="si-name">🌱 ${it.name}</div>
                <div class="si-stats"><span>Tipo</span> <span>Sementes</span></div>
                <div class="si-price">$${it.price}</div>
                <button onclick="buyItem('seeds','${id}')" ${!afford ? 'disabled' : ''}>${afford ? 'Comprar' : '$$$'}</button>
            </div>`;
        }
        html += `<div class="shop-info">Sementes no Silo da Casa: <b>${lastState.farm.seedDepot}</b></div>`;
    } else if (cat === 'items') {
        for (const [id, it] of Object.entries(catalog.items || {})) {
            const owned = id === 'cellphone' ? lastState.farm.hasCellphone : false;
            if (owned) continue; // Desaparece se já possui

            const afford = lastState.farm.money >= it.price;
            html += `<div class="shop-item">
                <div class="si-brand">ELETRÔNICOS</div>
                <div class="si-name">📱 ${it.name}</div>
                <div class="si-stats"><span>Utilidade</span> <span>Acesso Remoto</span></div>
                <div class="si-price">$${it.price}</div>
                <button onclick="buyItem('items','${id}')" ${!afford ? 'disabled' : ''}>${afford ? 'Comprar' : '$$$'}</button>
            </div>`;
        }
    } else if (cat === 'lands') {
        for (const [id, it] of Object.entries(catalog.lands)) {
            const owned = lastState.farm.unlockedLands.includes(id);
            const afford = lastState.farm.money >= it.price;
            html += `<div class="shop-item ${owned ? 'owned' : ''}">
                <div class="si-name">🗺️ ${it.name}</div>
                <div class="si-stats"><span>Área</span> <span>${it.w / TILE}x${it.h / TILE} tiles</span></div>
                <div class="si-price">${it.price > 0 ? '$' + it.price : 'Grátis'}</div>
                ${owned ? '<span class="si-owned">✓ Possui</span>' :
                    `<button onclick="buyItem('lands','${id}')" ${!afford ? 'disabled' : ''}>${afford ? 'Comprar' : '$$$'}</button>`}
            </div>`;
        }
    } else if (cat === 'sell') {
        html += `<div class="shop-category-title" style="color:#e74c3c; border-color:#e74c3c;">Vender Veículos</div>`;
        if (inv.vehicles.length === 0) {
            html += '<div class="shop-info">Você não possui veículos para vender.</div>';
        } else {
            for (const vehicle of inv.vehicles) {
                const it = catalog.vehicles[vehicle.modelId];
                if (!it) continue;
                const refund = Math.floor(it.price * 0.8);
                html += `<div class="shop-item">
                    <div class="si-brand">${it.brand}</div>
                    <div class="si-name">${it.name}</div>
                    <div class="si-stats"><span>ID:</span> <span>${vehicle.id}</span></div>
                    <div class="si-price">💰 $${refund} (80%)</div>
                    <button class="btn-sell" onclick="sellItem('vehicles','${vehicle.id}')">Vender</button>
                </div>`;
            }
        }
        
        html += `<div class="shop-category-title" style="color:#e74c3c; border-color:#e74c3c; margin-top:20px;">Vender Implementos</div>`;
        if (inv.implements.length === 0) {
            html += '<div class="shop-info">Você não possui implementos para vender.</div>';
        } else {
            // Verificar quais implementos estão engatados agora na simulação local
            const hitchedIds = new Set(implementSprites.filter(i => i.hitchedTo).map(i => i.id));
            
            for (const implement of inv.implements) {
                const it = catalog.implements[implement.modelId];
                if (!it) continue;
                const isHitched = hitchedIds.has(implement.id);
                const refund = Math.floor(it.price * 0.8);
                html += `<div class="shop-item">
                    <div class="si-name">${it.name}</div>
                    <div class="si-stats"><span>ID:</span> <span>${implement.id}</span></div>
                    <div class="si-price">💰 $${refund} (80%)</div>
                    <button class="btn-sell" onclick="sellItem('implements','${implement.id}')" ${isHitched ? 'disabled title="Desengate o implemento antes de vender"' : ''}>${isHitched ? 'ENGATADO' : 'Vender'}</button>
                </div>`;
            }
        }
    }
    cont.innerHTML = html;
}

async function buyItem(cat, id) {
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
}

async function sellItem(cat, id) {
    if (cat === 'implements') {
        const isHitched = implementSprites.some(i => i.id === id && i.hitchedTo);
        if (isHitched) {
            showToast('Desengate o implemento antes de vender', 'error');
            return;
        }
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
}



// ============================================================
//  TIME
// ============================================================
function advanceHour() {
    currentHour++;
    if (currentHour >= 24) { currentHour = 0; forceTick(); }
    if (lastState) { updateHUD(lastState); updateCrops(lastState.farm.plantedCrops); }
}

// ============================================================
//  NETWORKING
// ============================================================
async function fetchCatalog() {
    try {
        const data = await apiJson('/shop/catalog');
        if (data && data.vehicles) {
            catalog = data;
            // Garantir que items do LOCAL_CATALOG sempre existam no catálogo
            if (!catalog.items) catalog.items = LOCAL_CATALOG.items;
            console.log("Catálogo carregado com sucesso.");
        }
    } catch (e) {
        console.warn("Usando catálogo local/fallback (API inacessível)");
    }
}
async function fetchState() {
    try {
        const s = normalizeState(await apiJson('/state'));
        lastState = s;
        updateHUD(s); updateSoil(s.farm.soil); updateCrops(s.farm.plantedCrops);
        updateFields(); renderLandZones(); ensureVehicles(); ensureImplements(); renderWorldMap();
        isHydrated = true;
    } catch (e) {
        console.warn("Estado não atualizado:", e.message);
    }
}
async function forceTick() {
    try { await apiJson('/tick', { method: 'POST' }); fetchState(); } catch (e) { }
}

async function syncFuel() {
    if (!isHydrated || !catalog) return;
    const vehFuelData = vehicleSprites.map(v => ({ id: v.id, fuel: v.fuel || 0 }));
    if (vehFuelData.length === 0) return;
    try { 
        await apiJson('/action/sync-fuel', { 
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ vehicles: vehFuelData })
        });
    } catch(e){}
}

async function doRefuel() {
    if (activeVehIdx < 0) return;
    const ent = getEntity();
    if (!near(ent, GAS_STATION_POS, 150)) return;
    
    const activeVehicle = getActiveVehicle();
    if (!activeVehicle) return;

    try {
        const d = await apiJson('/action/refuel', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicleId: activeVehicle.id })
        });
        if (d.success && d.newFuel !== undefined) {
            activeVehicle.fuel = d.newFuel;
            await fetchState(); // Updates money visually
            console.log("Refuel efetuado:", d.message);
        } else {
            console.log("Refuel falhou/negado:", d.message);
        }
    } catch(e){
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
        const l = sx - TILE / 2, t = sy - TILE / 2;
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
        const sp = scene.add.sprite(c.x, c.y, k).setDepth(1);
        if (c.isDead) sp.setTint(0x7f8c8d);
        cropsGroup.add(sp);
    });
}

// Expose to HTML
window.buyItem = buyItem;
window.switchTab = switchTab;
window.closeShop = closeShop;
window.closeSellMenu = closeSellMenu;
window.renderSellMenu = renderSellMenu;
window.toggleFullMap = toggleFullMap;

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

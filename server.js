import express from 'express';
import cors from 'cors';
import { globalState } from './core/state.js';
import { runTick } from './core/gameLoop.js';
import Crop from './models/crop.js';

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// ============================================================
//  CATALOG — Veículos com marcas, implementos, sementes, terras
// ============================================================
const CATALOG = {
  vehicles: {
    // TRATORES
    tractor_mf275:   { name: 'MF 275',        brand: 'Massey Ferguson', type: 'tractor', hp: 50,  speed: 5, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.12, friction: 0.965, turnSpeedBase: 0.12, fuelCapacity: 50, price: 0 },
    tractor_valtra:  { name: 'A850',           brand: 'Valtra',         type: 'tractor', hp: 85,  speed: 6, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.15, friction: 0.970, turnSpeedBase: 0.11, fuelCapacity: 80, price: 800 },
    tractor_nh:      { name: 'T6.110',         brand: 'New Holland',    type: 'tractor', hp: 120, speed: 7, gears: 6, gearType: 'auto',   autoDrive: true,  acceleration: 0.19, friction: 0.975, turnSpeedBase: 0.09, fuelCapacity: 120, price: 1800 },
    tractor_jd:      { name: 'JD 6130J',       brand: 'John Deere',     type: 'tractor', hp: 150, speed: 8, gears: 6, gearType: 'auto',   autoDrive: true,  acceleration: 0.23, friction: 0.980, turnSpeedBase: 0.08, fuelCapacity: 150, price: 3000 },
    tractor_case:    { name: 'Magnum 310',     brand: 'Case IH',        type: 'tractor', hp: 220, speed: 9, gears: 6, gearType: 'auto',   autoDrive: true,  acceleration: 0.28, friction: 0.985, turnSpeedBase: 0.07, fuelCapacity: 220, price: 5000 },
    // COLHEITADEIRAS
    harvester_mf5650:{ name: 'MF 5650',        brand: 'Massey Ferguson', type: 'harvester', hp: 60,  capacity: 50,  speed: 4, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.10, friction: 0.960, turnSpeedBase: 0.06, fuelCapacity: 100, price: 0 },
    harvester_nh:    { name: 'TC5090',         brand: 'New Holland',     type: 'harvester', hp: 100, capacity: 120, speed: 5, gears: 6, gearType: 'auto',   autoDrive: true,  acceleration: 0.13, friction: 0.965, turnSpeedBase: 0.05, fuelCapacity: 200, price: 2000 },
    harvester_jd:    { name: 'S680',           brand: 'John Deere',      type: 'harvester', hp: 120, capacity: 250, speed: 6, gears: 6, gearType: 'auto',   autoDrive: true,  acceleration: 0.16, friction: 0.970, turnSpeedBase: 0.04, fuelCapacity: 350, price: 4500 },
    // CAMINHÕES
    truck_vw:        { name: 'Constellation',  brand: 'Volkswagen',      type: 'truck', hp: 120, capacity: 30,  speed: 7, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.18, friction: 0.975, turnSpeedBase: 0.05, fuelCapacity: 150, price: 0 },
    truck_mb:        { name: 'Atego 2430',     brand: 'Mercedes-Benz',   type: 'truck', hp: 160, capacity: 80,  speed: 8, gears: 6, gearType: 'auto',   autoDrive: false, acceleration: 0.22, friction: 0.980, turnSpeedBase: 0.04, fuelCapacity: 250, price: 1500 },
    truck_scania:    { name: 'R450',           brand: 'Scania',          type: 'truck', hp: 200, capacity: 150, speed: 9, gears: 6, gearType: 'auto',   autoDrive: false, acceleration: 0.26, friction: 0.985, turnSpeedBase: 0.04, fuelCapacity: 400, price: 3000 },
  },
  implements: {
    plow_small:    { name: 'Tombador Pequeno',    type: 'plow',   requiredHp: 30,  width: 1, price: 0 },
    plow_medium:   { name: 'Tombador Médio',      type: 'plow',   requiredHp: 80,  width: 2, price: 300 },
    plow_large:    { name: 'Tombador Grande',      type: 'plow',   requiredHp: 150, width: 3, price: 700 },
    harrow_small:  { name: 'Gradão 4 Linhas',     type: 'harrow', requiredHp: 30,  width: 1, lines: 4,  price: 0 },
    harrow_medium: { name: 'Gradão 8 Linhas',     type: 'harrow', requiredHp: 80,  width: 2, lines: 8,  price: 400 },
    harrow_large:  { name: 'Gradão 12 Linhas',    type: 'harrow', requiredHp: 150, width: 3, lines: 12, price: 800 },
    seeder_small:  { name: 'Plantadeira Pequena',  type: 'seeder', requiredHp: 30,  width: 1, capacity: 20,  price: 0 },
    seeder_medium: { name: 'Plantadeira Média',    type: 'seeder', requiredHp: 80,  width: 2, capacity: 50,  price: 450 },
    seeder_large:  { name: 'Plantadeira Grande',    type: 'seeder', requiredHp: 150, width: 3, capacity: 100, price: 900 },
  },
  seeds: {
    seed_10: { name: '10 Sementes', amount: 10, price: 30 },
    seed_25: { name: '25 Sementes', amount: 25, price: 65 },
    seed_50: { name: '50 Sementes', amount: 50, price: 110 },
  },
  lands: {
    field_1: { name: 'Vale Esmeralda', x: 5000, y: 6000, w: 1000, h: 800, price: 0 },
    field_2: { name: 'Colinas do Sol', x: 6200, y: 6000, w: 1200, h: 800, price: 15000 },
    field_3: { name: 'Planície Alta', x: 5000, y: 7000, w: 1000, h: 1000, price: 20000 },
    field_4: { name: 'Campos do Rio', x: 6200, y: 7000, w: 1500, h: 1000, price: 35000 },
    field_5: { name: 'Latifúndio', x: 5000, y: 8200, w: 2500, h: 1200, price: 80000 }
  },
  items: {
    cellphone: { name: 'Celular Smartphone', type: 'item', price: 500 }
  }
};

// Helpers
function getHarvesterCapacity() {
  const h = globalState.farm.inventory.vehicles.filter(v => CATALOG.vehicles[v.modelId]?.type === 'harvester');
  if (!h.length) return 50;
  return Math.max(...h.map(v => CATALOG.vehicles[v.modelId].capacity));
}
function getTruckCapacity() {
  const t = globalState.farm.inventory.vehicles.filter(v => CATALOG.vehicles[v.modelId]?.type === 'truck');
  if (!t.length) return 30;
  return Math.max(...t.map(v => CATALOG.vehicles[v.modelId].capacity));
}
function getSeederCapacity() {
  const s = globalState.farm.inventory.implements.filter(i => CATALOG.implements[i.modelId]?.type === 'seeder');
  if (!s.length) return 20;
  return Math.max(...s.map(i => CATALOG.implements[i.modelId].capacity));
}
function getSoilState(key) {
  const v = globalState.farm.soil[key];
  if (!v) return 'normal';
  return typeof v === 'string' ? v : (v.state || 'normal');
}
function getSoilDir(key) {
  const v = globalState.farm.soil[key];
  if (!v || typeof v === 'string') return null;
  return v.dir || null;
}
function isInAnyField(x, y) {
  for (const fid of globalState.farm.unlockedLands) {
    const f = CATALOG.lands[fid];
    if (f && x >= f.x && x <= f.x + f.w && y >= f.y && y <= f.y + f.h) return true;
  }
  return false;
}

// ============================================================
//  ENDPOINTS
// ============================================================
app.get('/shop/catalog', (req, res) => res.json(CATALOG));

app.get('/state', (req, res) => {
  const soilMap = {};
  for (const [k, v] of Object.entries(globalState.farm.soil)) {
    const st = typeof v === 'string' ? v : (v.state || 'normal');
    const dr = typeof v === 'object' ? (v.dir || null) : null;
    if (st !== 'normal') soilMap[k] = { state: st, dir: dr };
  }
  res.json({
    time: globalState.time, weather: globalState.weather, economy: globalState.economy,
    farm: {
      money: globalState.farm.money,
      seedDepot: globalState.farm.seedDepot,
      harvestedCrops: globalState.farm.harvestedCrops,
      harvesterStorage: globalState.farm.harvesterStorage,
      harvesterCapacity: getHarvesterCapacity(),
      truckStorage: globalState.farm.truckStorage,
      truckCapacity: getTruckCapacity(),
      truckCargoType: globalState.farm.truckCargoType,
      seederStorage: globalState.farm.seederStorage,
      seederCapacity: getSeederCapacity(),
      soil: soilMap,
      plantedCrops: globalState.farm.plantedCrops.map(c => ({
        x: c.x, y: c.y, growthStage: c.growthStage, isDead: c.isDead, isReady: c.isReady
      })),
      inventory: globalState.farm.inventory,
      unlockedLands: globalState.farm.unlockedLands,
      hasCellphone: globalState.farm.hasCellphone
    }
  });
});

app.get('/logs', (req, res) => res.json(globalState.logs));
app.post('/tick', (req, res) => { runTick(); res.json({ success: true }); });

// FUEL ENDPOINTS
app.post('/action/sync-fuel', (req, res) => {
  const { vehicles } = req.body; // Array of { id, fuel }
  if (Array.isArray(vehicles)) {
    vehicles.forEach(v => {
      const idx = globalState.farm.inventory.vehicles.findIndex(veh => veh.id === v.id);
      if (idx !== -1) {
        globalState.farm.inventory.vehicles[idx].fuel = Math.max(0, v.fuel);
      }
    });
  }
  res.json({ success: true });
});

app.post('/action/refuel', (req, res) => {
  const { vehicleId } = req.body;
  const idx = globalState.farm.inventory.vehicles.findIndex(v => v.id === vehicleId);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Veículo não encontrado' });
  
  const veh = globalState.farm.inventory.vehicles[idx];
  const model = CATALOG.vehicles[veh.modelId];
  if (!model) return res.status(404).json({ success: false, message: 'Modelo inválido' });
  
  const maxFuel = model.fuelCapacity || 100;
  const missingFuel = Math.max(0, maxFuel - (veh.fuel || 0));
  
  // Cost: $2 per liter/unit of fuel
  const fuelPricePerUnit = 2;
  const cost = Math.floor(missingFuel * fuelPricePerUnit);
  
  if (missingFuel <= 0) {
    return res.json({ success: false, message: 'Tanque já está cheio!' });
  }

  if (globalState.farm.money < cost) {
    return res.status(400).json({ success: false, message: `Sem dinheiro! Custa ${cost} para abastecer.` });
  }

  globalState.farm.money -= cost;
  veh.fuel = maxFuel;
  return res.json({ success: true, cost, newFuel: maxFuel, message: `Abastecido por $${cost}` });
});

// SHOP
app.post('/shop/buy', (req, res) => {
  const { category, itemId } = req.body;
  const inv = globalState.farm.inventory;

  if (category === 'vehicles') {
    const it = CATALOG.vehicles[itemId];
    if (!it) return res.status(400).json({ success: false, message: 'Item inválido' });
    if (globalState.farm.money < it.price) return res.status(400).json({ success: false, message: 'Sem dinheiro' });
    globalState.farm.money -= it.price;
    const id = `veh_${globalState.counters.vehicle++}`;
    const vehicle = { id, modelId: itemId, isOn: false, fuel: it.fuelCapacity || 100 };
    inv.vehicles.push(vehicle);
    return res.json({ success: true, item: vehicle });
  }
  if (category === 'implements') {
    const it = CATALOG.implements[itemId];
    if (!it) return res.status(400).json({ success: false, message: 'Item inválido' });
    if (globalState.farm.money < it.price) return res.status(400).json({ success: false, message: 'Sem dinheiro' });
    globalState.farm.money -= it.price;
    const id = `imp_${globalState.counters.implement++}`;
    const implement = { id, modelId: itemId, isOn: false };
    inv.implements.push(implement);
    return res.json({ success: true, item: implement });
  }
  if (category === 'seeds') {
    const it = CATALOG.seeds[itemId];
    if (!it) return res.status(400).json({ success: false, message: 'Item inválido' });
    if (globalState.farm.money < it.price) return res.status(400).json({ success: false, message: 'Sem dinheiro' });
    globalState.farm.money -= it.price;
    globalState.farm.seedDepot += it.amount;
    return res.json({ success: true });
  }
  if (category === 'lands') {
    const it = CATALOG.lands[itemId];
    if (!it) return res.status(400).json({ success: false, message: 'Item inválido' });
    if (globalState.farm.money < it.price) return res.status(400).json({ success: false, message: 'Sem dinheiro' });
    if (globalState.farm.unlockedLands.includes(itemId)) return res.status(400).json({ success: false, message: 'Já possui' });
    globalState.farm.money -= it.price;
    globalState.farm.unlockedLands.push(itemId);
    return res.json({ success: true });
  }
  if (category === 'items') {
    const it = CATALOG.items[itemId];
    if (!it) return res.status(400).json({ success: false, message: 'Item inválido' });
    if (globalState.farm.money < it.price) return res.status(400).json({ success: false, message: 'Sem dinheiro' });
    if (itemId === 'cellphone' && globalState.farm.hasCellphone) return res.status(400).json({ success: false, message: 'Já possui' });
    globalState.farm.money -= it.price;
    if (itemId === 'cellphone') globalState.farm.hasCellphone = true;
    return res.json({ success: true });
  }
  res.status(400).json({ success: false });
});

app.post('/shop/sell', (req, res) => {
  const { category, itemId } = req.body;
  const inv = globalState.farm.inventory;

  if (category === 'vehicles') {
    const idx = inv.vehicles.findIndex(v => v.id === itemId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Veículo não encontrado' });

    const item = inv.vehicles[idx];
    const model = CATALOG.vehicles[item.modelId];
    if (!model) return res.status(400).json({ success: false, message: 'Modelo inválido' });

    inv.vehicles.splice(idx, 1);
    const refund = Math.floor(model.price * 0.8);
    globalState.farm.money += refund;
    return res.json({ success: true, refund });
  }

  if (category === 'implements') {
    const idx = inv.implements.findIndex(i => i.id === itemId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Implemento não encontrado' });

    const item = inv.implements[idx];
    const model = CATALOG.implements[item.modelId];
    if (!model) return res.status(400).json({ success: false, message: 'Modelo inválido' });

    inv.implements.splice(idx, 1);
    const refund = Math.floor(model.price * 0.8);
    globalState.farm.money += refund;
    return res.json({ success: true, refund });
  }

  return res.status(400).json({ success: false, message: 'Categoria inválida' });
});

// IMPLEMENT ACTIONS
app.post('/action/plow', (req, res) => {
  const { x, y } = req.body;
  if (x === undefined || y === undefined) return res.status(400).json({ success: false });
  if (!isInAnyField(x, y)) return res.json({ success: false });
  const key = `${x},${y}`, cur = getSoilState(key);
  if (cur === 'normal' || cur === 'harrowed') {
    globalState.farm.soil[key] = { state: 'plowed', dir: null };
    return res.json({ success: true });
  }
  res.json({ success: false });
});

app.post('/action/harrow', (req, res) => {
  const { x, y, dir } = req.body;
  if (x === undefined || y === undefined) return res.status(400).json({ success: false });
  if (!isInAnyField(x, y)) return res.json({ success: false });
  const key = `${x},${y}`;
  if (getSoilState(key) === 'plowed') {
    globalState.farm.soil[key] = { state: 'harrowed', dir: dir || 'h' };
    return res.json({ success: true });
  }
  res.json({ success: false });
});

app.post('/action/plant', (req, res) => {
  const { x, y } = req.body;
  if (x === undefined || y === undefined) return res.status(400).json({ success: false });
  if (!isInAnyField(x, y)) return res.json({ success: false });
  const key = `${x},${y}`;
  if (getSoilState(key) !== 'harrowed') return res.json({ success: false });
  if (globalState.farm.seederStorage <= 0) return res.json({ success: false });
  if (globalState.weather === '🔥 Seca') return res.json({ success: false });
  globalState.farm.seederStorage -= 1;
  globalState.farm.soil[key] = { state: 'planted', dir: getSoilDir(key) };
  globalState.farm.plantedCrops.push(new Crop(x, y, globalState.time));
  res.json({ success: true });
});

app.post('/action/harvest', (req, res) => {
  const { x, y } = req.body;
  if (x === undefined || y === undefined) return res.status(400).json({ success: false });
  if (globalState.farm.harvesterStorage >= getHarvesterCapacity()) return res.json({ success: false });
  const ci = globalState.farm.plantedCrops.findIndex(c => c.x === x && c.y === y);
  if (ci === -1) return res.json({ success: false });
  const crop = globalState.farm.plantedCrops[ci];
  if ((crop.isReady && !crop.isDead) || crop.isDead) {
    if (crop.isReady && !crop.isDead) globalState.farm.harvesterStorage += 1;
    globalState.farm.plantedCrops.splice(ci, 1);
    globalState.farm.soil[`${x},${y}`] = { state: 'normal', dir: null };
    return res.json({ success: true });
  }
  res.json({ success: false });
});

// LOGISTICS
app.post('/action/unload', (req, res) => {
  const a = globalState.farm.harvesterStorage;
  if (a <= 0) return res.json({ success: false });
  globalState.farm.harvestedCrops += a;
  globalState.farm.harvesterStorage = 0;
  res.json({ success: true });
});

app.post('/action/truck/load-silo', (req, res) => {
  if (globalState.farm.harvestedCrops <= 0) return res.json({ success: false });
  if (globalState.farm.truckCargoType && globalState.farm.truckCargoType !== 'crops') return res.json({ success: false });
  const space = getTruckCapacity() - globalState.farm.truckStorage;
  if (space <= 0) return res.json({ success: false });
  const n = Math.min(globalState.farm.harvestedCrops, space);
  globalState.farm.harvestedCrops -= n;
  globalState.farm.truckStorage += n;
  globalState.farm.truckCargoType = 'crops';
  res.json({ success: true, loaded: n });
});

app.post('/action/truck/load-depot', (req, res) => {
  if (globalState.farm.seedDepot <= 0) return res.json({ success: false });
  if (globalState.farm.truckCargoType && globalState.farm.truckCargoType !== 'seeds') return res.json({ success: false });
  const space = getTruckCapacity() - globalState.farm.truckStorage;
  if (space <= 0) return res.json({ success: false });
  const n = Math.min(globalState.farm.seedDepot, space);
  globalState.farm.seedDepot -= n;
  globalState.farm.truckStorage += n;
  globalState.farm.truckCargoType = 'seeds';
  res.json({ success: true, loaded: n });
});

app.post('/action/truck/sell', (req, res) => {
  if (globalState.farm.truckCargoType !== 'crops' || globalState.farm.truckStorage <= 0) return res.json({ success: false });
  const a = globalState.farm.truckStorage;
  const profit = a * globalState.economy.pricePerCrop;
  globalState.farm.money += profit;
  globalState.farm.truckStorage = 0;
  globalState.farm.truckCargoType = null;
  res.json({ success: true, profit });
});

app.post('/action/truck/transfer-seeds', (req, res) => {
  if (globalState.farm.truckCargoType !== 'seeds' || globalState.farm.truckStorage <= 0) return res.json({ success: false });
  const space = getSeederCapacity() - globalState.farm.seederStorage;
  if (space <= 0) return res.json({ success: false });
  const n = Math.min(globalState.farm.truckStorage, space);
  globalState.farm.truckStorage -= n;
  globalState.farm.seederStorage += n;
  if (globalState.farm.truckStorage <= 0) globalState.farm.truckCargoType = null;
  res.json({ success: true, transferred: n });
});

app.listen(PORT, () => console.log(`Backend rodando em http://localhost:${PORT}`));

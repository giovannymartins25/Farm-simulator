import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Crop from './models/crop.js';

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});
app.use(cors());
app.use(express.json());
app.use(express.static('game-frontend'));

// ============================================================
//  CATALOG — Veículos com marcas, implementos, sementes, terras
// ============================================================
const CATALOG = {
  vehicles: {
    // TRATORES
    tractor_mf275: { name: 'MF 275', brand: 'Massey Ferguson', type: 'tractor', power: 50, weight: 3500, brakeForce: 0.15, hp: 50, speed: 5, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.12, friction: 0.965, turnSpeedBase: 0.12, fuelCapacity: 50, price: 0 },
    tractor_valtra: { name: 'A850', brand: 'Valtra', type: 'tractor', power: 85, weight: 4200, brakeForce: 0.15, hp: 85, speed: 6, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.15, friction: 0.970, turnSpeedBase: 0.11, fuelCapacity: 80, price: 800 },
    tractor_nh: { name: 'T6.110', brand: 'New Holland', type: 'tractor', power: 120, weight: 5500, brakeForce: 0.2, hp: 120, speed: 7, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.19, friction: 0.975, turnSpeedBase: 0.09, fuelCapacity: 120, price: 1800 },
    tractor_jd: { name: 'JD 6130J', brand: 'John Deere', type: 'tractor', power: 150, weight: 6500, brakeForce: 0.25, hp: 150, speed: 8, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.23, friction: 0.980, turnSpeedBase: 0.08, fuelCapacity: 150, price: 3000 },
    tractor_case: { name: 'Magnum 310', brand: 'Case IH', type: 'tractor', power: 220, weight: 11000, brakeForce: 0.35, hp: 220, speed: 9, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.28, friction: 0.985, turnSpeedBase: 0.07, fuelCapacity: 220, price: 5000 },
    // COLHEITADEIRAS
    harvester_mf5650: { name: 'MF 5650', brand: 'Massey Ferguson', type: 'harvester', power: 60, weight: 8000, brakeForce: 0.15, hp: 60, capacity: 50, speed: 4, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.10, friction: 0.960, turnSpeedBase: 0.06, fuelCapacity: 100, price: 0 },
    harvester_nh: { name: 'TC5090', brand: 'New Holland', type: 'harvester', power: 100, weight: 11000, brakeForce: 0.2, hp: 100, capacity: 120, speed: 5, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.13, friction: 0.965, turnSpeedBase: 0.05, fuelCapacity: 200, price: 2000 },
    harvester_jd: { name: 'S680', brand: 'John Deere', type: 'harvester', power: 120, weight: 14000, brakeForce: 0.3, hp: 120, capacity: 250, speed: 6, gears: 6, gearType: 'auto', autoDrive: true, acceleration: 0.16, friction: 0.970, turnSpeedBase: 0.04, fuelCapacity: 350, price: 4500 },
    // CAMINHÕES
    truck_vw: { name: 'Constellation', brand: 'Volkswagen', type: 'truck', power: 120, weight: 6000, brakeForce: 0.2, hp: 120, capacity: 30, speed: 7, gears: 4, gearType: 'manual', autoDrive: false, acceleration: 0.18, friction: 0.975, turnSpeedBase: 0.05, fuelCapacity: 150, price: 0 },
    truck_mb: { name: 'Atego 2430', brand: 'Mercedes-Benz', type: 'truck', power: 160, weight: 8000, brakeForce: 0.25, hp: 160, capacity: 80, speed: 8, gears: 6, gearType: 'auto', autoDrive: false, acceleration: 0.22, friction: 0.980, turnSpeedBase: 0.04, fuelCapacity: 250, price: 1500 },
    truck_scania: { name: 'R450', brand: 'Scania', type: 'truck', power: 200, weight: 10000, brakeForce: 0.35, hp: 200, capacity: 150, speed: 9, gears: 6, gearType: 'auto', autoDrive: false, acceleration: 0.26, friction: 0.985, turnSpeedBase: 0.04, fuelCapacity: 400, price: 3000 },
  },
  implements: {
    plow_small: { name: 'Tombador Pequeno', type: 'plow', requiredHp: 30, weight: 800, drag: 0.05, width: 1, price: 0 },
    plow_medium: { name: 'Tombador Médio', type: 'plow', requiredHp: 80, weight: 1500, drag: 0.08, width: 2, price: 300 },
    plow_large: { name: 'Tombador Grande', type: 'plow', requiredHp: 150, weight: 3000, drag: 0.15, width: 3, price: 700 },
    harrow_small: { name: 'Gradão 4 Linhas', type: 'harrow', requiredHp: 30, weight: 600, drag: 0.03, width: 1, lines: 4, price: 0 },
    harrow_medium: { name: 'Gradão 8 Linhas', type: 'harrow', requiredHp: 80, weight: 1200, drag: 0.06, width: 2, lines: 8, price: 400 },
    harrow_large: { name: 'Gradão 12 Linhas', type: 'harrow', requiredHp: 150, weight: 2500, drag: 0.10, width: 3, lines: 12, price: 800 },
    seeder_small: { name: 'Plantadeira Pequena', type: 'seeder', requiredHp: 30, weight: 1000, drag: 0.04, width: 1, capacity: 20, price: 0 },
    seeder_medium: { name: 'Plantadeira Média', type: 'seeder', requiredHp: 80, weight: 2000, drag: 0.08, width: 2, capacity: 50, price: 450 },
    seeder_large: { name: 'Plantadeira Grande', type: 'seeder', requiredHp: 150, weight: 4000, drag: 0.14, width: 3, capacity: 100, price: 900 },
  },
  seeds: {
    seed_10: { name: '10 Sementes', amount: 10, price: 30 },
    seed_25: { name: '25 Sementes', amount: 25, price: 65 },
    seed_50: { name: '50 Sementes', amount: 50, price: 110 },
  },
  lands: {
    field_1: { name: 'Vale Esmeralda', x: 4992, y: 5952, w: 1024, h: 832, price: 0 },
    field_2: { name: 'Colinas do Sol', x: 6144, y: 5952, w: 1216, h: 832, price: 15000 },
    field_3: { name: 'Planície Alta', x: 4992, y: 6976, w: 1024, h: 1024, price: 20000 },
    field_4: { name: 'Campos do Rio', x: 6144, y: 6976, w: 1536, h: 1024, price: 35000 },
    field_5: { name: 'Latifúndio', x: 4992, y: 8192, w: 2560, h: 1216, price: 80000 }
  },
  items: {
    cellphone: { name: 'Celular Smartphone', type: 'item', price: 500 }
  }
};

// Helpers
function getHarvesterCapacity(room) {
  const h = Object.values(room.vehicles).filter(v => CATALOG.vehicles[v.modelId]?.type === 'harvester');
  if (!h.length) return 50;
  return Math.max(...h.map(v => CATALOG.vehicles[v.modelId].capacity));
}
function getTruckCapacity(room) {
  const t = Object.values(room.vehicles).filter(v => CATALOG.vehicles[v.modelId]?.type === 'truck');
  if (!t.length) return 30;
  return Math.max(...t.map(v => CATALOG.vehicles[v.modelId].capacity));
}
function getSeederCapacity(room) {
  const s = Object.values(room.implements).filter(i => CATALOG.implements[i.modelId]?.type === 'seeder');
  if (!s.length) return 20;
  return Math.max(...s.map(i => CATALOG.implements[i.modelId].capacity));
}
function getSoilState(room, key) {
  const v = room.farm.soil[key];
  if (!v) return 'normal';
  return typeof v === 'string' ? v : (v.state || 'normal');
}
function getSoilDir(room, key) {
  const v = room.farm.soil[key];
  if (!v || typeof v === 'string') return null;
  return v.dir || null;
}
function isInAnyField(room, x, y) {
  for (const fid of room.farm.unlockedLands) {
    const f = CATALOG.lands[fid];
    // Verifica se a tile está TOTALMENTE dentro do campo (Alinhamento 64px)
    if (f && x >= f.x && (x + 64) <= (f.x + f.w) && y >= f.y && (y + 64) <= (f.y + f.h)) return true;
  }
  return false;
}

// ============================================================
//  ENDPOINTS
// ============================================================
app.get('/shop/catalog', (req, res) => res.json(CATALOG));

// ============================================================
//  MULTIPLAYER (SOCKET.IO)
// ============================================================

const rooms = {}; // roomId -> RoomState
const players = {}; // socketId -> { id, roomId, x, y, angle, vehicleId, nickname }

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createRoomState(roomId, isPrivate, code) {
  return {
    id: roomId,
    isPrivate: !!isPrivate,
    code: code,
    createdAt: Date.now(),
    players: [], // socketIds
    time: 0,
    weather: '☀️ Ensolarado',
    economy: { pricePerCrop: 10, totalMarketDemand: 50 },
    farm: {
      money: 999999, // Dinheiro compartilhado
      seedDepot: 0,
      harvestedCrops: 0,
      harvesterStorage: 0,
      truckStorage: 0,
      truckCargoType: null,
      seederStorage: 0,
      soil: {},
      plantedCrops: [],
      unlockedLands: ['field_1']
    },
    playerInventories: {}, // playerId -> { vehicles: [], implements: [], hasCellphone: false }
    vehicles: {
      'veh_1': { id: 'veh_1', modelId: 'tractor_mf275', ownerId: 'server', driverId: null, passengers: [], fuel: 50, attachedImplementId: null, x: 4480, y: 5696, rotation: 0, velocity: 0, engineOn: false },
      'veh_2': { id: 'veh_2', modelId: 'harvester_mf5650', ownerId: 'server', driverId: null, passengers: [], fuel: 100, attachedImplementId: null, x: 4544, y: 5696, rotation: 0, velocity: 0, engineOn: false },
      'veh_3': { id: 'veh_3', modelId: 'truck_vw', ownerId: 'server', driverId: null, passengers: [], fuel: 150, attachedImplementId: null, x: 4608, y: 5696, rotation: 0, velocity: 0, engineOn: false }
    },
    implements: {
      'imp_1': { id: 'imp_1', modelId: 'plow_small', ownerId: 'server', seedStorage: 0, attachedToVehicleId: null },
      'imp_2': { id: 'imp_2', modelId: 'harrow_small', ownerId: 'server', seedStorage: 0, attachedToVehicleId: null },
      'imp_3': { id: 'imp_3', modelId: 'seeder_small', ownerId: 'server', seedStorage: 0, attachedToVehicleId: null }
    },
    counters: { vehicle: 10, implement: 10 }
  };
}

io.on('connection', (socket) => {
  console.log("Cliente conectado:", socket.id);

  players[socket.id] = {
    id: socket.id,
    roomId: null,
    nickname: `Jogador ${socket.id.substring(0, 4)}`,
    x: 4480 + Math.random() * 64,
    y: 5504 + Math.random() * 64,
    angle: 0,
    vehicleId: null
  };

  // --- LOBBY EVENTS ---

  socket.on('createRoom', ({ nickname, isPrivate }) => {
    const roomId = `room_${Date.now()}`;
    const code = isPrivate ? generateRoomCode() : null;

    rooms[roomId] = createRoomState(roomId, isPrivate, code);

    players[socket.id].nickname = nickname || players[socket.id].nickname;
    joinRoom(socket, roomId);

    socket.emit('roomCreated', { roomId, code });
    broadcastRoomList();
  });

  socket.on('joinRoom', ({ roomId, nickname }) => {
    if (rooms[roomId]) {
      players[socket.id].nickname = nickname || players[socket.id].nickname;
      joinRoom(socket, roomId);
    } else {
      socket.emit('error', 'Sala não encontrada');
    }
  });

  socket.on('joinByCode', ({ code, nickname }) => {
    const room = Object.values(rooms).find(r => r.code === code);
    if (room) {
      players[socket.id].nickname = nickname || players[socket.id].nickname;
      joinRoom(socket, room.id);
    } else {
      socket.emit('error', 'Código de sala inválido');
    }
  });

  socket.on('requestRoomList', () => {
    broadcastRoomList(socket);
  });

  function joinRoom(socket, roomId) {
    const oldRoomId = players[socket.id].roomId;
    if (oldRoomId) {
      socket.leave(oldRoomId);
      if (rooms[oldRoomId]) {
        rooms[oldRoomId].players = rooms[oldRoomId].players.filter(id => id !== socket.id);
        if (rooms[oldRoomId].players.length === 0) delete rooms[oldRoomId];
      }
    }

    const room = rooms[roomId];
    socket.join(roomId);
    players[socket.id].roomId = roomId;
    room.players.push(socket.id);
    
    // Inicializar inventário se não existir
    if (!room.playerInventories[socket.id]) {
      room.playerInventories[socket.id] = { vehicles: [], implements: [], hasCellphone: false };
    }

    const roomPlayers = {};
    room.players.forEach(pid => {
      roomPlayers[pid] = players[pid];
    });

    socket.emit('currentPlayers', roomPlayers);
    socket.emit('roomStateSynced', getClientRoomState(room));
    socket.to(roomId).emit('newPlayer', players[socket.id]);

    console.log(`[Multiplayer] ${players[socket.id].nickname} entrou na sala ${roomId}`);
    broadcastRoomList();
  }

  function broadcastRoomList(target = io) {
    const publicRooms = Object.values(rooms)
      .filter(r => !r.isPrivate)
      .map(r => ({
        id: r.id,
        playerCount: r.players.length,
        name: `Fazenda de ${players[r.players[0]]?.nickname || 'Alguém'}`
      }));
    target.emit('roomList', publicRooms);
  }

  // Helper to send state to client without circular or huge objects
  function getClientRoomState(room) {
    return {
      time: room.time, weather: room.weather, economy: room.economy,
      farm: room.farm,
      playerInventories: room.playerInventories,
      vehicles: room.vehicles,
      implements: room.implements
    };
  }

  function broadcastRoomState(roomId) {
    const room = rooms[roomId];
    if (room) {
      io.to(roomId).emit('roomStateSynced', getClientRoomState(room));
    }
  }

  // --- GAMEPLAY EVENTS ---
  socket.on('playerMove', (moveData) => {
    const player = players[socket.id];
    if (player && player.roomId) {
      player.x = moveData.x;
      player.y = moveData.y;
      player.angle = moveData.angle;
      player.vehicleId = moveData.vehicleId;
      socket.to(player.roomId).emit('playerMoved', player);
    }
  });

  socket.on('enterVehicle', (data) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[data.vehicleId];
    if (!veh) return;

    // Remover de outro veiculo antes
    if (player.vehicleId && player.vehicleId !== data.vehicleId) {
       const oldVeh = room.vehicles[player.vehicleId];
       if (oldVeh) {
          if (oldVeh.driverId === socket.id) oldVeh.driverId = oldVeh.passengers.length ? oldVeh.passengers.shift() : null;
          else oldVeh.passengers = oldVeh.passengers.filter(p => p !== socket.id);
          io.to(player.roomId).emit('vehicleOccupantsUpdated', { vehicleId: oldVeh.id, driverId: oldVeh.driverId, passengers: oldVeh.passengers });
       }
    }

    if (!veh.driverId) {
      veh.driverId = socket.id;
    } else if (veh.driverId !== socket.id && !veh.passengers.includes(socket.id)) {
      veh.passengers.push(socket.id);
    }
    
    player.vehicleId = data.vehicleId;
    console.log('[ENTER VEHICLE]', socket.id, '->', data.vehicleId, 'as', veh.driverId === socket.id ? 'DRIVER' : 'PASSENGER');
    // Broadcast occupants + notify others to hide player sprite
    io.to(player.roomId).emit('vehicleOccupantsUpdated', { 
      vehicleId: veh.id, driverId: veh.driverId, passengers: veh.passengers 
    });
    socket.to(player.roomId).emit('playerEnteredVehicle', { playerId: socket.id, vehicleId: veh.id });
  });

  socket.on('exitVehicle', () => {
    const player = players[socket.id];
    if (!player || !player.roomId || !player.vehicleId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[player.vehicleId];
    if (!veh) { player.vehicleId = null; return; }

    if (veh.driverId === socket.id) {
      veh.driverId = veh.passengers.length ? veh.passengers.shift() : null;
    } else {
      veh.passengers = veh.passengers.filter(p => p !== socket.id);
    }
    
    player.vehicleId = null;
    console.log('[EXIT VEHICLE]', socket.id, 'from', veh.id, 'newDriver:', veh.driverId);
    // Notify all to show the player sprite again
    io.to(player.roomId).emit('vehicleOccupantsUpdated', { vehicleId: veh.id, driverId: veh.driverId, passengers: veh.passengers });
    socket.to(player.roomId).emit('playerExitedVehicle', { 
      playerId: socket.id, x: player.x, y: player.y 
    });
  });

  socket.on('vehicleUpdate', (vehData) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[vehData.id];
    
    // Only the driver can push vehicle state
    if (veh && veh.driverId === socket.id) {
      veh.x = vehData.x;
      veh.y = vehData.y;
      veh.rotation = vehData.angle;
      veh.velocity = vehData.velocity;
      veh.engineOn = vehData.isOn;
      veh.gear = vehData.gear;
      veh.rpm = vehData.rpm;
      veh.fuel = vehData.fuel;
      veh.toolOn = vehData.toolOn; // For harvesters

      // Broadcast to ALL others (includes implement position via client reconstruct)
      socket.to(player.roomId).emit('vehicleUpdated', {
        id: veh.id,
        x: veh.x,
        y: veh.y,
        angle: veh.rotation,
        velocity: veh.velocity,
        isOn: veh.engineOn,
        gear: veh.gear,
        rpm: veh.rpm,
        fuel: veh.fuel,
        toolOn: veh.toolOn,
        attachedImplementId: veh.attachedImplementId
      });
    }
  });

  socket.on('attachImplement', (data) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[data.vehicleId];
    const imp = room.implements[data.implementId];
    
    if (veh && imp && veh.driverId === socket.id) {
      // Clear previous attachment on the implement if any
      if (imp.attachedToVehicleId && imp.attachedToVehicleId !== veh.id) {
        const prevVeh = room.vehicles[imp.attachedToVehicleId];
        if (prevVeh) prevVeh.attachedImplementId = null;
      }
      // Clear previous implement on the vehicle if any
      if (veh.attachedImplementId && veh.attachedImplementId !== imp.id) {
        const prevImp = room.implements[veh.attachedImplementId];
        if (prevImp) prevImp.attachedToVehicleId = null;
      }
      veh.attachedImplementId = imp.id;
      imp.attachedToVehicleId = veh.id;
      console.log('[ATTACH IMPLEMENT]', socket.id, 'veh:', veh.id, 'imp:', imp.id);
      // Broadcast full objects so clients can reconstruct render
      io.to(player.roomId).emit('implementUpdated', { ...imp });
      io.to(player.roomId).emit('vehicleUpdated', {
        id: veh.id, x: veh.x, y: veh.y, angle: veh.rotation,
        velocity: veh.velocity, isOn: veh.engineOn, attachedImplementId: veh.attachedImplementId
      });
    }
  });

  socket.on('detachImplement', (data) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[data.vehicleId];
    
    if (veh && veh.driverId === socket.id && veh.attachedImplementId) {
      const imp = room.implements[veh.attachedImplementId];
      const oldImpId = veh.attachedImplementId;
      if (imp) imp.attachedToVehicleId = null;
      veh.attachedImplementId = null;
      console.log('[DETACH IMPLEMENT]', socket.id, 'veh:', veh.id, 'imp:', oldImpId);
      // Broadcast updated state
      if (imp) io.to(player.roomId).emit('implementUpdated', { ...imp });
      io.to(player.roomId).emit('vehicleUpdated', {
        id: veh.id, x: veh.x, y: veh.y, angle: veh.rotation,
        velocity: veh.velocity, isOn: veh.engineOn, attachedImplementId: null
      });
    }
  });

  socket.on('syncFuel', ({ vehicles }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (Array.isArray(vehicles)) {
      vehicles.forEach(v => {
        if (room.vehicles[v.id]) {
          room.vehicles[v.id].fuel = Math.max(0, v.fuel);
        }
      });
    }
  });

  socket.on('refuel', ({ vehicleId }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[vehicleId];
    if (!veh) return;
    
    const model = CATALOG.vehicles[veh.modelId];
    if (!model) return;
    
    const maxFuel = model.fuelCapacity || 100;
    const missingFuel = Math.max(0, maxFuel - (veh.fuel || 0));
    const cost = Math.floor(missingFuel * 2);
    
    if (missingFuel <= 0) return socket.emit('error', 'Tanque já está cheio!');
    if (room.farm.money < cost) return socket.emit('error', 'Sem dinheiro!');
    
    room.farm.money -= cost;
    veh.fuel = maxFuel;
    broadcastRoomState(player.roomId);
    socket.emit('toast', { msg: `Abastecido por $${cost}`, tone: 'success' });
  });

  socket.on('shopBuy', ({ category, itemId }, ack) => {
    const player = players[socket.id];
    if (!player || !player.roomId) { if(ack) ack({success: false, error: 'Sem sala'}); return; }
    const room = rooms[player.roomId];
    const inv = room.playerInventories[socket.id];
    
    if (category === 'vehicles') {
      const it = CATALOG.vehicles[itemId];
      if (!it || room.farm.money < it.price) { if(ack) ack({success: false, error: 'Saldo insuficiente'}); return; }
      room.farm.money -= it.price;
      const id = `veh_${room.counters.vehicle++}`;
      room.vehicles[id] = { id, modelId: itemId, ownerId: socket.id, driverId: null, passengers: [], fuel: it.fuelCapacity || 100, attachedImplementId: null, x: player.x, y: player.y, rotation: 0, velocity: 0, engineOn: false };
      inv.vehicles.push(id);
    } else if (category === 'implements') {
      const it = CATALOG.implements[itemId];
      if (!it || room.farm.money < it.price) { if(ack) ack({success: false, error: 'Saldo insuficiente'}); return; }
      room.farm.money -= it.price;
      const id = `imp_${room.counters.implement++}`;
      room.implements[id] = { id, modelId: itemId, ownerId: socket.id, seedStorage: 0, attachedToVehicleId: null };
      inv.implements.push(id);
    } else if (category === 'seeds') {
      const it = CATALOG.seeds[itemId];
      if (!it || room.farm.money < it.price) { if(ack) ack({success: false, error: 'Saldo insuficiente'}); return; }
      room.farm.money -= it.price;
      room.farm.seedDepot += it.amount;
    } else if (category === 'lands') {
      const it = CATALOG.lands[itemId];
      if (!it || room.farm.money < it.price || room.farm.unlockedLands.includes(itemId)) { if(ack) ack({success: false, error: 'Saldo insuficiente ou já possui'}); return; }
      room.farm.money -= it.price;
      room.farm.unlockedLands.push(itemId);
    } else if (category === 'items') {
      const it = CATALOG.items[itemId];
      if (!it || room.farm.money < it.price || inv.hasCellphone) { if(ack) ack({success: false, error: 'Saldo insuficiente ou já possui'}); return; }
      room.farm.money -= it.price;
      if (itemId === 'cellphone') inv.hasCellphone = true;
    }
    broadcastRoomState(player.roomId);
    if (ack) ack({ success: true });
  });

  socket.on('shopSell', ({ category, itemId }, ack) => {
    const player = players[socket.id];
    if (!player || !player.roomId) { if(ack) ack({success: false, error: 'Sem sala'}); return; }
    const room = rooms[player.roomId];
    const inv = room.playerInventories[socket.id];
    
    if (category === 'vehicles') {
      const idx = inv.vehicles.indexOf(itemId);
      if (idx === -1) { if(ack) ack({success: false, error: 'Não possui'}); return; }
      const veh = room.vehicles[itemId];
      if (!veh) { if(ack) ack({success: false, error: 'Não existe'}); return; }
      
      if (veh.driverId || veh.passengers.length > 0) {
        socket.emit('error', 'Veículo em uso');
        if(ack) ack({success: false, error: 'Veículo em uso'});
        return;
      }
      
      const model = CATALOG.vehicles[veh.modelId];
      inv.vehicles.splice(idx, 1);
      delete room.vehicles[itemId];
      room.farm.money += Math.floor(model.price * 0.8);
    } else if (category === 'implements') {
      const idx = inv.implements.indexOf(itemId);
      if (idx === -1) { if(ack) ack({success: false, error: 'Não possui'}); return; }
      const imp = room.implements[itemId];
      if (!imp) { if(ack) ack({success: false, error: 'Não existe'}); return; }
      
      if (imp.attachedToVehicleId) {
        socket.emit('error', 'Implemento engatado');
        if(ack) ack({success: false, error: 'Implemento engatado'});
        return;
      }
      
      const model = CATALOG.implements[imp.modelId];
      inv.implements.splice(idx, 1);
      delete room.implements[itemId];
      room.farm.money += Math.floor(model.price * 0.8);
    } else if (category === 'lands') {
      if (itemId === 'field_1') {
        socket.emit('error', 'Nao e possivel vender o campo principal');
        if(ack) ack({success: false, error: 'Nao e possivel vender o campo principal'});
        return;
      }
      const idx = room.farm.unlockedLands.indexOf(itemId);
      if (idx === -1) { if(ack) ack({success: false, error: 'Não possui'}); return; }
      
      const model = CATALOG.lands[itemId];
      if (!model) { if(ack) ack({success: false, error: 'Não existe'}); return; }
      
      room.farm.unlockedLands.splice(idx, 1);
      room.farm.money += Math.floor(model.price * 0.8);
    }
    broadcastRoomState(player.roomId);
    if (ack) ack({ success: true });
  });

  socket.on('shopSellCrops', ({}, ack) => {
    const player = players[socket.id];
    if (!player || !player.roomId) { if(ack) ack({success: false, error: 'Sem sala'}); return; }
    const room = rooms[player.roomId];
    
    if (room.farm.harvestedCrops <= 0) {
      if(ack) ack({success: false, error: 'Silo vazio'});
      return;
    }
    
    const amount = room.farm.harvestedCrops;
    const profit = amount * room.economy.pricePerCrop;
    room.farm.money += profit;
    room.farm.harvestedCrops = 0;
    
    broadcastRoomState(player.roomId);
    if (ack) ack({ success: true, profit });
  });

  socket.on('actionPlow', ({ x, y }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (!isInAnyField(room, x, y)) {
      socket.emit('toast', { msg: 'Fora do campo!', tone: 'warning' });
      return;
    }
    const key = `${x},${y}`;
    const cur = getSoilState(room, key);
    if (cur === 'normal' || cur === 'harrowed') {
      room.farm.soil[key] = { state: 'plowed', dir: null };
      io.to(player.roomId).emit('soilUpdated', { key, state: 'plowed', dir: null });
      console.log(`[ACTION] ${player.nickname} araou em ${key}`);
    }
  });

  socket.on('actionHarrow', ({ x, y, dir }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (!isInAnyField(room, x, y)) return;
    const key = `${x},${y}`;
    if (getSoilState(room, key) === 'plowed') {
      room.farm.soil[key] = { state: 'harrowed', dir: dir || 'h' };
      io.to(player.roomId).emit('soilUpdated', { key, state: 'harrowed', dir: dir || 'h' });
    }
  });

  socket.on('actionPlant', ({ x, y, implementId }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (!isInAnyField(room, x, y)) return;
    
    const imp = room.implements[implementId];
    if (!imp || imp.seedStorage <= 0) return;
    
    const key = `${x},${y}`;
    if (getSoilState(room, key) !== 'harrowed') return;
    if (room.weather === '🔥 Seca') return;
    
    imp.seedStorage -= 1;
    const dir = getSoilDir(room, key);
    room.farm.soil[key] = { state: 'planted', dir };
    room.farm.plantedCrops.push(new Crop(x, y, room.time));
    
    io.to(player.roomId).emit('soilUpdated', { key, state: 'planted', dir });
    io.to(player.roomId).emit('cropPlanted', { x, y, time: room.time });
    socket.emit('implementStorageUpdated', { id: imp.id, seedStorage: imp.seedStorage });
  });

  socket.on('actionHarvest', ({ x, y }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    
    if (room.farm.harvesterStorage >= getHarvesterCapacity(room)) return;
    const ci = room.farm.plantedCrops.findIndex(c => c.x === x && c.y === y);
    if (ci === -1) return;
    
    const crop = room.farm.plantedCrops[ci];
    if ((crop.isReady && !crop.isDead) || crop.isDead) {
      if (crop.isReady && !crop.isDead) room.farm.harvesterStorage += 1;
      room.farm.plantedCrops.splice(ci, 1);
      room.farm.soil[`${x},${y}`] = { state: 'normal', dir: null };
      
      io.to(player.roomId).emit('cropHarvested', { x, y });
      broadcastRoomState(player.roomId);
    }
  });

  // logistics
  socket.on('actionUnload', () => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (room.farm.harvesterStorage > 0) {
      room.farm.harvestedCrops += room.farm.harvesterStorage;
      room.farm.harvesterStorage = 0;
      broadcastRoomState(player.roomId);
    }
  });

  socket.on('actionTruckLoadSilo', () => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (room.farm.harvestedCrops <= 0) return;
    if (room.farm.truckCargoType && room.farm.truckCargoType !== 'crops') return;
    
    const space = getTruckCapacity(room) - room.farm.truckStorage;
    if (space <= 0) return;
    
    const n = Math.min(room.farm.harvestedCrops, space);
    room.farm.harvestedCrops -= n;
    room.farm.truckStorage += n;
    room.farm.truckCargoType = 'crops';
    broadcastRoomState(player.roomId);
  });

  socket.on('actionTruckLoadDepot', () => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (room.farm.seedDepot <= 0) return;
    if (room.farm.truckCargoType && room.farm.truckCargoType !== 'seeds') return;
    
    const space = getTruckCapacity(room) - room.farm.truckStorage;
    if (space <= 0) return;
    
    const n = Math.min(room.farm.seedDepot, space);
    room.farm.seedDepot -= n;
    room.farm.truckStorage += n;
    room.farm.truckCargoType = 'seeds';
    broadcastRoomState(player.roomId);
  });

  socket.on('actionTruckSell', () => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (room.farm.truckCargoType !== 'crops' || room.farm.truckStorage <= 0) return;
    
    const profit = room.farm.truckStorage * room.economy.pricePerCrop;
    room.farm.money += profit;
    room.farm.truckStorage = 0;
    room.farm.truckCargoType = null;
    broadcastRoomState(player.roomId);
  });

  socket.on('actionTruckTransferSeeds', ({ implementId }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (room.farm.truckCargoType !== 'seeds' || room.farm.truckStorage <= 0) return;
    
    const imp = room.implements[implementId];
    if (!imp) return;
    
    const model = CATALOG.implements[imp.modelId];
    const space = (model?.capacity || 20) - imp.seedStorage;
    if (space <= 0) return;
    
    const n = Math.min(room.farm.truckStorage, space);
    room.farm.truckStorage -= n;
    imp.seedStorage += n;
    if (room.farm.truckStorage <= 0) room.farm.truckCargoType = null;
    
    socket.emit('implementStorageUpdated', { id: imp.id, seedStorage: imp.seedStorage });
    broadcastRoomState(player.roomId);
  });

  socket.on('chatMessage', (data) => {
    const player = players[socket.id];
    if (player && player.roomId) {
      io.to(player.roomId).emit('chatMessage', {
        nickname: player.nickname,
        message: data.message,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        playerId: socket.id
      });
    }
  });

  socket.on('disconnect', () => {
    const player = players[socket.id];
    if (player) {
      const roomId = player.roomId;
      if (roomId && rooms[roomId]) {
        // Remover de veiculo se estiver em um
        if (player.vehicleId) {
           const veh = rooms[roomId].vehicles[player.vehicleId];
           if (veh) {
              if (veh.driverId === socket.id) veh.driverId = veh.passengers.length ? veh.passengers.shift() : null;
              else veh.passengers = veh.passengers.filter(p => p !== socket.id);
              io.to(roomId).emit('vehicleOccupantsUpdated', { vehicleId: veh.id, driverId: veh.driverId, passengers: veh.passengers });
           }
        }
        rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);
        socket.to(roomId).emit('playerLeft', socket.id);
        if (rooms[roomId].players.length === 0) delete rooms[roomId];
      }
      delete players[socket.id];
      broadcastRoomList();
    }
  });
});

// Gameloop Server-Side
setInterval(() => {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    if (room.players.length === 0) continue; // Pula salas vazias

    // Simular o que acontecia no runTick() original
    room.time++;
    
    // Clima
    let nextWeather = room.weather;
    if (room.weather === '☀️ Ensolarado') {
      if (Math.random() > 0.95) nextWeather = '🌧️ Chuvoso';
    } else if (room.weather === '🌧️ Chuvoso') {
      if (Math.random() > 0.8) nextWeather = '☀️ Ensolarado';
    } else if (room.weather === '🔥 Seca') {
      if (Math.random() > 0.6) nextWeather = '🌧️ Chuvoso';
    }
    room.weather = nextWeather;

    // Colheitas
    room.farm.plantedCrops.forEach(c => {
      // Simplificação do c.grow()
      if (c.isDead || c.isReady) return;
      const weather = room.weather;
      if (weather.includes('Ensolarado')) c.growthStage += 20;
      else if (weather.includes('Chuvoso')) c.growthStage += 30;
      else if (weather.includes('Seca')) {
        c.growthStage += 5;
        if (Math.random() > 0.8) c.isDead = true;
      }
      if (c.growthStage >= 100) {
        c.growthStage = 100;
        c.isReady = true;
      }
    });

    // Send update to clients
    io.to(roomId).emit('tick', { time: room.time, weather: room.weather, crops: room.farm.plantedCrops });
  }
}, 20000); // 20s = 1 in-game hour

httpServer.listen(PORT, () => console.log(`Backend Multiplayer rodando na porta ${PORT}`));

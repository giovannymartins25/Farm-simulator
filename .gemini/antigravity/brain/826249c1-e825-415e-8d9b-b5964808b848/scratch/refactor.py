import re

with open('c:/Users/Giovanny/Desktop/Jogo-farm/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove REST endpoints related to gameplay
# They start at app.get('/state', ...) and end before const rooms = {};
start_idx = content.find("app.get('/state'")
end_idx = content.find("// ============================================================\n//  MULTIPLAYER (SOCKET.IO)")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

# Remove globalState and runTick imports
content = content.replace("import { globalState } from './core/state.js';\n", "")
content = content.replace("import { runTick } from './core/gameLoop.js';\n", "")

# Replace helpers that use globalState
helpers_start = content.find("// Helpers")
helpers_end = content.find("app.get('/shop/catalog'")
if helpers_start != -1 and helpers_end != -1:
    new_helpers = """// Helpers
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
    if (f && x >= f.x && x <= f.x + f.w && y >= f.y && y <= f.y + f.h) return true;
  }
  return false;
}

// ============================================================
//  ENDPOINTS
// ============================================================
"""
    content = content[:helpers_start] + new_helpers + content[helpers_end:]


# Add Room logic
socket_start = content.find("const rooms = {};")
socket_logic = """
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
    vehicles: {}, // vehId -> { id, modelId, ownerId, driverId, passengers: [], fuel, attachedImplementId, x, y, rotation, velocity, engineOn }
    implements: {}, // impId -> { id, modelId, ownerId, seedStorage, attachedToVehicleId }
    counters: { vehicle: 10, implement: 10 }
  };
}

io.on('connection', (socket) => {
  console.log("Cliente conectado:", socket.id);

  players[socket.id] = {
    id: socket.id,
    roomId: null,
    nickname: `Jogador ${socket.id.substring(0, 4)}`,
    x: 1000 + Math.random() * 100,
    y: 1000 + Math.random() * 100,
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
    if (player.vehicleId) {
       const oldVeh = room.vehicles[player.vehicleId];
       if (oldVeh) {
          if (oldVeh.driverId === socket.id) oldVeh.driverId = oldVeh.passengers.length ? oldVeh.passengers.shift() : null;
          else oldVeh.passengers = oldVeh.passengers.filter(p => p !== socket.id);
       }
    }

    if (!veh.driverId) {
      veh.driverId = socket.id;
    } else if (veh.driverId !== socket.id && !veh.passengers.includes(socket.id)) {
      veh.passengers.push(socket.id);
    }
    
    player.vehicleId = data.vehicleId;
    io.to(player.roomId).emit('vehicleOccupantsUpdated', { vehicleId: veh.id, driverId: veh.driverId, passengers: veh.passengers });
  });

  socket.on('exitVehicle', () => {
    const player = players[socket.id];
    if (!player || !player.roomId || !player.vehicleId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[player.vehicleId];
    if (!veh) return;

    if (veh.driverId === socket.id) {
      veh.driverId = veh.passengers.length ? veh.passengers.shift() : null;
    } else {
      veh.passengers = veh.passengers.filter(p => p !== socket.id);
    }
    
    player.vehicleId = null;
    io.to(player.roomId).emit('vehicleOccupantsUpdated', { vehicleId: veh.id, driverId: veh.driverId, passengers: veh.passengers });
  });

  socket.on('vehicleUpdate', (vehData) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[vehData.id];
    
    // Somente o driver pode atualizar o estado do veículo
    if (veh && veh.driverId === socket.id) {
      veh.x = vehData.x;
      veh.y = vehData.y;
      veh.rotation = vehData.angle;
      veh.velocity = vehData.velocity;
      veh.engineOn = vehData.isOn;
      socket.to(player.roomId).emit('vehicleUpdated', vehData);
    }
  });

  socket.on('attachImplement', (data) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[data.vehicleId];
    const imp = room.implements[data.implementId];
    
    if (veh && imp && veh.driverId === socket.id) {
      veh.attachedImplementId = imp.id;
      imp.attachedToVehicleId = veh.id;
      io.to(player.roomId).emit('implementAttached', { vehicleId: veh.id, implementId: imp.id });
    }
  });

  socket.on('detachImplement', (data) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const veh = room.vehicles[data.vehicleId];
    
    if (veh && veh.driverId === socket.id && veh.attachedImplementId) {
      const imp = room.implements[veh.attachedImplementId];
      if (imp) imp.attachedToVehicleId = null;
      const oldImpId = veh.attachedImplementId;
      veh.attachedImplementId = null;
      io.to(player.roomId).emit('implementDetached', { vehicleId: veh.id, implementId: oldImpId });
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

  socket.on('shopBuy', ({ category, itemId }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const inv = room.playerInventories[socket.id];
    
    if (category === 'vehicles') {
      const it = CATALOG.vehicles[itemId];
      if (!it || room.farm.money < it.price) return;
      room.farm.money -= it.price;
      const id = `veh_${room.counters.vehicle++}`;
      room.vehicles[id] = { id, modelId: itemId, ownerId: socket.id, driverId: null, passengers: [], fuel: it.fuelCapacity || 100, attachedImplementId: null, x: player.x, y: player.y, rotation: 0, velocity: 0, engineOn: false };
      inv.vehicles.push(id);
    } else if (category === 'implements') {
      const it = CATALOG.implements[itemId];
      if (!it || room.farm.money < it.price) return;
      room.farm.money -= it.price;
      const id = `imp_${room.counters.implement++}`;
      room.implements[id] = { id, modelId: itemId, ownerId: socket.id, seedStorage: 0, attachedToVehicleId: null };
      inv.implements.push(id);
    } else if (category === 'seeds') {
      const it = CATALOG.seeds[itemId];
      if (!it || room.farm.money < it.price) return;
      room.farm.money -= it.price;
      room.farm.seedDepot += it.amount;
    } else if (category === 'lands') {
      const it = CATALOG.lands[itemId];
      if (!it || room.farm.money < it.price || room.farm.unlockedLands.includes(itemId)) return;
      room.farm.money -= it.price;
      room.farm.unlockedLands.push(itemId);
    } else if (category === 'items') {
      const it = CATALOG.items[itemId];
      if (!it || room.farm.money < it.price || inv.hasCellphone) return;
      room.farm.money -= it.price;
      if (itemId === 'cellphone') inv.hasCellphone = true;
    }
    broadcastRoomState(player.roomId);
  });

  socket.on('shopSell', ({ category, itemId }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    const inv = room.playerInventories[socket.id];
    
    if (category === 'vehicles') {
      const idx = inv.vehicles.indexOf(itemId);
      if (idx === -1) return;
      const veh = room.vehicles[itemId];
      if (!veh) return;
      
      if (veh.driverId || veh.passengers.length > 0) return socket.emit('error', 'Veículo em uso');
      
      const model = CATALOG.vehicles[veh.modelId];
      inv.vehicles.splice(idx, 1);
      delete room.vehicles[itemId];
      room.farm.money += Math.floor(model.price * 0.8);
    } else if (category === 'implements') {
      const idx = inv.implements.indexOf(itemId);
      if (idx === -1) return;
      const imp = room.implements[itemId];
      if (!imp) return;
      
      if (imp.attachedToVehicleId) return socket.emit('error', 'Implemento engatado');
      
      const model = CATALOG.implements[imp.modelId];
      inv.implements.splice(idx, 1);
      delete room.implements[itemId];
      room.farm.money += Math.floor(model.price * 0.8);
    }
    broadcastRoomState(player.roomId);
  });

  socket.on('actionPlow', ({ x, y }) => {
    const player = players[socket.id];
    if (!player || !player.roomId) return;
    const room = rooms[player.roomId];
    if (!isInAnyField(room, x, y)) return;
    const key = `${x},${y}`;
    const cur = getSoilState(room, key);
    if (cur === 'normal' || cur === 'harrowed') {
      room.farm.soil[key] = { state: 'plowed', dir: null };
      io.to(player.roomId).emit('soilUpdated', { key, state: 'plowed', dir: null });
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
"""
# We replace from socket_start to the end of file
content = content[:socket_start] + socket_logic
    
with open('c:/Users/Giovanny/Desktop/Jogo-farm/server.js', 'w', encoding='utf-8') as f:
    f.write(content)


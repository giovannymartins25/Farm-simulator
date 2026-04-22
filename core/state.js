/**
 * Estado Global da Fazenda
 */
class GameState {
  constructor() {
    this.time = 0;
    this.weather = '☀️ Ensolarado';
    this.economy = { pricePerCrop: 10, totalMarketDemand: 50 };

    this.farm = {
      money: 999999,
      seedDepot: 0,
      harvestedCrops: 0,
      harvesterStorage: 0,
      truckStorage: 0,
      truckCargoType: null,
      seederStorage: 0,
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
      unlockedLands: ['field_1']
    };
    this.counters = {
      vehicle: 4,
      implement: 4
    };
    this.logs = [];
  }

  advanceTime() { this.time++; }

  addLog(agentName, message) {
    this.logs.unshift({
      id: Date.now() + Math.random(), day: this.time,
      agent: agentName, message, timestamp: new Date().toLocaleTimeString()
    });
    if (this.logs.length > 50) this.logs.pop();
    console.log(`[Dia ${this.time} - ${agentName}] ${message}`);
  }
}

export const globalState = new GameState();

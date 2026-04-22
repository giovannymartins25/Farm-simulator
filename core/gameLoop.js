import { globalState } from './state.js';
import FarmerAgent from '../agents/farmerAgent.js';
import MarketAgent from '../agents/marketAgent.js';
import WeatherAgent from '../agents/weatherAgent.js';

const farmer = new FarmerAgent(globalState);
const market = new MarketAgent(globalState);
const weather = new WeatherAgent(globalState);

/**
 * Avança manualmente o Tick da simulação chamando os três agentes pela interface AG Kit
 */
export function runTick() {
  globalState.advanceTime();
  
  weather.update();
  market.update();

  globalState.farm.plantedCrops.forEach(crop => {
    crop.grow(globalState.weather);
  });

  farmer.update();
}

/**
 * Inicializador visual
 */
export function initGame() {
  globalState.addLog('Sistema', 'A Simulação de Fazenda foi inicializada');
}

initGame();

import BaseAgent from './baseAgent.js';
import EconomyModel from '../models/economy.js';

export default class MarketAgent extends BaseAgent {
  constructor(gameState) {
    super('Mercado Invisível', 'Simular flutuações de demanda e oferta global', gameState);
  }

  update() {
    const { economy, farm } = this.gameState;

    if (Math.random() > 0.6) {
      economy.totalMarketDemand += (Math.random() * 20 - 10);
    }
    
    if (economy.totalMarketDemand < 10) economy.totalMarketDemand = 10;
    
    const supply = farm.harvestedCrops;
    const oldPrice = economy.pricePerCrop;
    const newPrice = EconomyModel.calculateNewPrice(economy.pricePerCrop, supply, economy.totalMarketDemand);
    
    economy.pricePerCrop = newPrice;

    if (oldPrice !== newPrice) {
      const trend = newPrice > oldPrice ? '📈 Subiu' : '📉 Caiu';
      this.gameState.addLog(this.name, `ajustou o preço das colheitas: $${newPrice} (${trend})`);
      this.memorize(`Ajustou preço para $${newPrice}`);
    }
  }
}

import BaseAgent from './baseAgent.js';

/**
 * FarmerAgent - Assistente econômico passivo.
 * Não planta, não colhe, não compra. Apenas vende colheita do silo quando o preço está bom.
 */
export default class FarmerAgent extends BaseAgent {
  constructor(gameState) {
    super('Fazendeiro Zé', 'Gerenciar vendas automaticamente', gameState);
  }

  update() {
    const { farm, economy } = this.gameState;

    // Atua apenas 40% dos ticks para não competir com o jogador
    if (Math.random() > 0.4) return;

    // Vender colheita do Silo quando o preço é bom ou a grana está baixa
    if (farm.harvestedCrops > 0 && (economy.pricePerCrop >= 12 || farm.money < 10)) {
      const amount = farm.harvestedCrops;
      const profit = amount * economy.pricePerCrop;
      farm.money += profit;
      farm.harvestedCrops = 0;
      this.gameState.addLog(this.name, `vendeu ${amount} colheitas por $${profit}`);
      this.memorize(`Vendeu ${amount} itens por $${profit}`);
    }
  }
}

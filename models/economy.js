/**
 * Economy Helper Model
 * Provê cálculos puros de oferta/demanda que serão usados pelo MarketAgent.
 */
export default class EconomyModel {
  static calculateNewPrice(currentPrice, farmSupply, baseDemand) {
    const supplyRatio = farmSupply === 0 ? 0.1 : farmSupply; // Previne divisão por zero
    const pressure = baseDemand / supplyRatio;
    
    let newPrice = currentPrice;
    
    if (pressure > 2) {
      // Muita demanda, pouco suprimento (Inflação)
      newPrice += Math.floor(Math.random() * 3) + 1;
    } else if (pressure < 0.5) {
      // Muito suprimento, pouca demanda (Deflação)
      newPrice -= Math.floor(Math.random() * 3) + 1;
    }

    // Limites de preço (nunca 0)
    if (newPrice < 2) newPrice = 2;
    if (newPrice > 50) newPrice = 50;

    return newPrice;
  }
}

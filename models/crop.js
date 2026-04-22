/**
 * Crop Model
 * Lógica passiva das plantações.
 */
export default class Crop {
  constructor(x, y, plantedTime) {
    this.x = x;
    this.y = y;
    this.plantedTime = plantedTime; // Tick que foi plantado
    this.growthStage = 0; // 0 a 100
    this.isReady = false;
    this.isDead = false;
  }

  grow(weather) {
    if (this.isDead || this.isReady) return;

    // Regras puras de crescimento
    if (weather === '☀️ Ensolarado') {
      this.growthStage += 20;
    } else if (weather === '🌧️ Chuvoso') {
      this.growthStage += 30; // Chuva acelera crescimento
    } else if (weather === '🔥 Seca') {
      this.growthStage += 5; // Crescimento mínimo
      // Possibilidade de morte pela seca
      if (Math.random() > 0.8) {
        this.isDead = true; 
      }
    }

    if (this.growthStage >= 100) {
      this.growthStage = 100;
      this.isReady = true;
    }
  }
}

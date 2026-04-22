import BaseAgent from './baseAgent.js';

export default class WeatherAgent extends BaseAgent {
  constructor(gameState) {
    super('Mãe Natureza', 'Gerenciar o ambiente e adicionar risco/imprevisibilidade', gameState);
    this.consecutiveSunDays = 0;
  }

  update() {
    const currentState = this.gameState.weather;
    let nextState = currentState;

    if (currentState === '☀️ Ensolarado') {
      this.consecutiveSunDays++;
      if (this.consecutiveSunDays > 4 && Math.random() > 0.5) {
        nextState = '🔥 Seca';
      } else if (Math.random() > 0.7) {
        nextState = '🌧️ Chuvoso';
        this.consecutiveSunDays = 0;
      }
    } else if (currentState === '🔥 Seca') {
      if (Math.random() > 0.6) {
        nextState = '🌧️ Chuvoso';
      }
    } else if (currentState === '🌧️ Chuvoso') {
      if (Math.random() > 0.4) {
        nextState = '☀️ Ensolarado';
        this.consecutiveSunDays = 1;
      }
    }

    if (currentState !== nextState) {
      this.gameState.weather = nextState;
      this.gameState.addLog(this.name, `mudou o tempo para: ${nextState}`);
      this.memorize(`Mudou tempo para ${nextState}`);
    }
  }
}

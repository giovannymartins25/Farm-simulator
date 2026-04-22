/**
 * BaseAgent (Implementação de AG Kit)
 * 
 * Segundo os requisitos (AG Kit Obrigatório), todos os agentes devem:
 * - Ter um {goal} implícito e claro.
 * - Possuir {memory} (lembrar de suas decisões e eventos).
 * - Acessar {state} (contexto global).
 * - Tomar decisões com base nessas entradas (Autonomia).
 */
export default class BaseAgent {
  constructor(name, goal, gameState) {
    this.name = name;
    this.goal = goal;       // Propósito do agente no jogo
    this.gameState = gameState; // Acesso ao estado global do jogo
    this.memory = [];       // Histórico simples de decisões/eventos para contexto
  }

  // Método que armazena dados simples para aprendizado/reação futura
  memorize(event) {
    this.memory.push({ time: this.gameState.time, event });
    if (this.memory.length > 20) this.memory.shift(); // Limite simples
  }

  // AG Kit: Avaliação contínua. Todos os agentes implementam 'evaluateContext' ou 'update'
  // que representa seu ciclo de raciocínio no loop.
  update() {
    throw new Error('O método update() deve ser implementado nas subclasses.');
  }
}

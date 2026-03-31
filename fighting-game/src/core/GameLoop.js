export default class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;

    this.lastTime = 0;
    this.started = false; // 🔥 controle do primeiro frame
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(time) {

    // 🔥 PRIMEIRO FRAME (EVITA DELTA GIGANTE)
    if (!this.started) {
      this.lastTime = time;
      this.started = true;
    }

    let deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // 🔥 PROTEÇÃO CONTRA DELTA QUEBRADO
    if (deltaTime < 0) deltaTime = 0;
    if (deltaTime > 0.1) deltaTime = 0.1; // máximo ~100ms (anti travamento)

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }
}
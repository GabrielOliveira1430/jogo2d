export default class Keyboard {
  constructor() {
    this.keys = {};
    this.previous = {};

    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }

  // deve ser chamado no GameLoop a cada frame
  update() {
    this.previous = { ...this.keys };
  }

  // tecla segurada
  isPressed(key) {
    return !!this.keys[key];
  }

  // tecla acabou de ser pressionada (1 frame só)
  isJustPressed(key) {
    return this.keys[key] && !this.previous[key];
  }
}
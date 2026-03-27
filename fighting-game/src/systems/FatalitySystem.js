import FinishSystem from "./FinishSystem.js";

export default class FatalitySystem {

  static active = false;
  static executed = false;

  static attacker = null;
  static victim = null;

  static inputBuffer = [];
  static maxBufferTime = 1;
  static bufferTimer = 0;

  static combo = ["down", "right", "attack"];

  static trigger(player1, player2) {
    this.active = true;
    this.executed = false;

    this.attacker = player1;
    this.victim = player2;

    this.inputBuffer = [];
    this.bufferTimer = 0;
  }

  static reset() {
    this.active = false;
    this.executed = false;
    this.attacker = null;
    this.victim = null;
    this.inputBuffer = [];
  }

  static update(deltaTime, keyboard, controls, p1, p2) {

    if (!FinishSystem.active) {
      this.reset();
      return;
    }

    if (!this.active) {
      this.trigger(p1, p2);
    }

    if (this.executed) return;

    this.bufferTimer += deltaTime;

    if (this.bufferTimer > this.maxBufferTime) {
      this.inputBuffer = [];
      this.bufferTimer = 0;
    }

    if (keyboard.isJustPressed(controls.down)) this.push("down");
    if (keyboard.isJustPressed(controls.right)) this.push("right");
    if (keyboard.isJustPressed(controls.attack)) this.push("attack");

    if (this.checkCombo()) {
      this.execute();
    }
  }

  static push(input) {
    this.inputBuffer.push(input);
    this.bufferTimer = 0;

    if (this.inputBuffer.length > this.combo.length) {
      this.inputBuffer.shift();
    }
  }

  static checkCombo() {
    if (this.inputBuffer.length !== this.combo.length) return false;

    return this.combo.every((c, i) => c === this.inputBuffer[i]);
  }

  static execute() {
    this.executed = true;

    if (!this.attacker || !this.victim) return;

    // 🔥 ANIMAÇÃO
    this.attacker.playFatality();

    // 🔥 VÍTIMA MORRE
    this.victim.isAlive = false;
    this.victim.currentAnimation = "dead";

    // 🔥 EFEITO
    FinishSystem.flash = 0.5;
    FinishSystem.shake = 0.6;

    console.log("💀 FATALITY REAL EXECUTADO");
  }

  static render(ctx, width, height) {
    if (!this.active || this.executed) return;

    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";

    ctx.fillText("FATALITY: ↓ → + ATK", width / 2, height - 30);
  }
}
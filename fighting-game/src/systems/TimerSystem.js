import FatalitySystem from "./FatalitySystem.js";
import FinishSystem from "./FinishSystem.js";

export default class TimerSystem {

  static time = 99;
  static isRunning = true;

  static onTimeUp = null;
  static hasTriggered = false; // 🔥 garante execução única

  static update(deltaTime) {

    // 🔥 NÃO RODA DURANTE CINEMÁTICA
    if (FatalitySystem.active || FinishSystem.active) return;

    if (!this.isRunning) return;

    // 🔥 proteção
    if (typeof deltaTime !== "number") return;

    this.time -= deltaTime;

    if (this.time <= 0) {
      this.time = 0;
      this.isRunning = false;

      // 🔥 dispara UMA VEZ
      if (!this.hasTriggered && this.onTimeUp) {
        this.hasTriggered = true;
        this.onTimeUp();
      }
    }
  }

  static render(ctx, canvasWidth) {

    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "white";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
      Math.ceil(this.time),
      canvasWidth / 2,
      40
    );

    ctx.restore();
  }

  static reset() {
    this.time = 99;
    this.isRunning = true;
    this.hasTriggered = false; // 🔥 reset correto
  }
}
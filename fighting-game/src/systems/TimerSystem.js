export default class TimerSystem {

  static time = 99;
  static isRunning = true;

  // 🔥 callback opcional
  static onTimeUp = null;

  static update(deltaTime) {

    if (!this.isRunning) return;

    this.time -= deltaTime;

    if (this.time <= 0) {
      this.time = 0;
      this.isRunning = false;

      // 🔥 dispara UMA VEZ
      if (this.onTimeUp) {
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
  }
}
export default class TimerSystem {

  static time = 99;
  static isRunning = true;

  static update(deltaTime) {

    if (!this.isRunning) return;

    this.time -= deltaTime;

    if (this.time <= 0) {
      this.time = 0;
      this.isRunning = false;
    }
  }

  static render(ctx, canvasWidth) {

    ctx.save();

    // 🔥 NÃO sofre zoom/câmera
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
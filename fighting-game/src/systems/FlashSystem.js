export default class FlashSystem {

  static time = 0;

  static trigger(duration = 0.1) {
    this.time = duration;
  }

  static update(deltaTime) {
    if (this.time > 0) {
      this.time -= deltaTime;
    }
  }

  static render(ctx, width, height) {

    if (this.time <= 0) return;

    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }
}
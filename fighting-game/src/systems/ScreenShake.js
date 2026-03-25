export default class ScreenShake {

  static duration = 0;
  static intensity = 0;

  static start(time = 0.15, power = 6) {
    this.duration = time;
    this.intensity = power;
  }

  static update(deltaTime) {
    if (this.duration > 0) {
      this.duration -= deltaTime;

      if (this.duration < 0) {
        this.duration = 0;
      }
    }
  }

  static apply(ctx) {

    if (this.duration <= 0) return;

    const shakeX = (Math.random() - 0.5) * this.intensity;
    const shakeY = (Math.random() - 0.5) * this.intensity;

    // ✅ CORRETO: usa translate (respeita save/restore)
    ctx.translate(shakeX, shakeY);
  }
}
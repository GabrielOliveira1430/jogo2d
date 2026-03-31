export default class FinishSystem {

  static active = false;
  static timer = 0;
  static duration = 3;

  static flash = 0;
  static shake = 0;

  static trigger() {
    this.active = true;
    this.timer = this.duration;

    this.flash = 0.2;
    this.shake = 0.3;
  }

  static reset() {
    this.active = false;
    this.timer = 0;
    this.flash = 0;
    this.shake = 0;
  }

  static update(deltaTime) {
    if (!this.active) return;

    // 🔥 proteção (evita bug silencioso)
    if (typeof deltaTime !== "number") return;

    this.timer -= deltaTime;

    if (this.flash > 0) this.flash -= deltaTime;
    if (this.shake > 0) this.shake -= deltaTime;

    // 🔥 CORREÇÃO IMPORTANTE
    if (this.timer <= 0) {
      this.reset(); // 👉 antes era só active = false
    }
  }

  static render(ctx, width, height) {
    if (!this.active) return;

    // 🔥 DARK SCREEN
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, width, height);

    // 🔥 SPOTLIGHT
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      50,
      width / 2,
      height / 2,
      300
    );

    gradient.addColorStop(0, "rgba(255,0,0,0.4)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 🔥 SHAKE
    let offsetX = 0;
    let offsetY = 0;

    if (this.shake > 0) {
      offsetX = (Math.random() - 0.5) * 10;
      offsetY = (Math.random() - 0.5) * 10;
    }

    // 🔥 TEXTO
    ctx.save();

    ctx.translate(width / 2 + offsetX, height / 2 + offsetY);

    const scale = 1 + Math.sin(performance.now() * 0.01) * 0.15;
    ctx.scale(scale, scale);

    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;

    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";

    ctx.strokeText("FINISH HIM!", 0, 0);
    ctx.fillText("FINISH HIM!", 0, 0);

    ctx.restore();

    // 🔥 FLASH FINAL
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.flash * 4})`;
      ctx.fillRect(0, 0, width, height);
    }
  }
}
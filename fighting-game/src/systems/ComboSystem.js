export default class ComboSystem {

  static combo = 0;
  static timer = 0;
  static comboTime = 1.2;

  static registerHit() {
    this.combo++;
    this.timer = this.comboTime;
  }

  static update(deltaTime) {

    if (this.combo <= 0) return;

    this.timer -= deltaTime;

    if (this.timer <= 0) {
      this.combo = 0;
      this.timer = 0;
    }
  }

  static render(ctx, canvasWidth = 800) {

    if (this.combo < 2) return;

    ctx.fillStyle = "yellow";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
      this.combo + " HIT COMBO",
      canvasWidth / 2,
      60
    );
  }
}
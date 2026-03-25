export default class Hurtbox {

  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update(x, y, width = this.width, height = this.height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  intersects(hitbox) {

    if (!hitbox || !hitbox.active) return false;

    return (
      this.x < hitbox.x + hitbox.width &&
      this.x + this.width > hitbox.x &&
      this.y < hitbox.y + hitbox.height &&
      this.y + this.height > hitbox.y
    );
  }

  render(ctx) {

    ctx.save();

    // 🔥 EVITA INTERFERÊNCIA COM KO / CAMERA
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      this.x,
      this.y,
      this.width,
      this.height
    );

    ctx.restore();
  }
}
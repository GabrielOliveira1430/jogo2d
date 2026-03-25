export default class Hitbox {
  constructor({ x, y, width, height, damage, direction, knockback = 35 }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.damage = damage;
    this.direction = direction;
    this.knockback = knockback;

    this.active = true;
    this.hitTargets = new Set();
  }

  intersects(hurtbox) {

    const hitboxLeft = this.x;
    const hitboxRight = this.x + this.width;
    const hitboxTop = this.y;
    const hitboxBottom = this.y + this.height;

    const hurtboxLeft = hurtbox.x;
    const hurtboxRight = hurtbox.x + hurtbox.width;
    const hurtboxTop = hurtbox.y;
    const hurtboxBottom = hurtbox.y + hurtbox.height;

    return (
      hitboxLeft < hurtboxRight &&
      hitboxRight > hurtboxLeft &&
      hitboxTop < hurtboxBottom &&
      hitboxBottom > hurtboxTop
    );
  }

  canHit(target) {
    return !this.hitTargets.has(target);
  }

  registerHit(target) {
    this.hitTargets.add(target);
  }

  render(ctx) {

    ctx.save();

    // 🔥 ISOLA TOTALMENTE DO JOGO
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.strokeStyle = this.active ? "red" : "gray";
    ctx.lineWidth = 2;

    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.restore();
  }
}
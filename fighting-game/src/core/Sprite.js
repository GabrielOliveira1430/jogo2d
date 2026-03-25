export default class Sprite {
  constructor({ imageSrc, frameWidth, frameHeight, frameCount }) {
    this.image = new Image();
    this.image.src = imageSrc;

    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;

    this.columns = 1;
    this.loaded = false;

    this.image.onload = () => {
      this.columns = Math.floor(this.image.width / this.frameWidth);
      this.loaded = true;
    };
  }

  draw(ctx, x, y, frameIndex = 0, flip = false) {
    if (!this.loaded) return;

    frameIndex = frameIndex % this.frameCount;

    const col = frameIndex % this.columns;
    const row = Math.floor(frameIndex / this.columns);

    const sx = col * this.frameWidth;
    const sy = row * this.frameHeight;

    ctx.save();

    if (flip) {
      ctx.translate(x + this.frameWidth, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }

    ctx.drawImage(
      this.image,
      sx,
      sy,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth,
      this.frameHeight
    );

    ctx.restore();
  }
}
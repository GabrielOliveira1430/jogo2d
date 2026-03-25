export default class CameraSystem {

  static x = 0;
  static y = 0;

  static zoom = 1;
  static targetZoom = 1;

  static smoothSpeed = 5;
  static zoomSpeed = 3;

  static worldWidth = 1600;

  static minZoom = 0.8;
  static maxZoom = 1.2;

  static update(player1, player2, deltaTime, canvasWidth) {

    // =========================
    // POSIÇÃO
    // =========================
    const centerX = (player1.x + player2.x) / 2;
    const targetX = centerX - canvasWidth / 2;

    this.x += (targetX - this.x) * this.smoothSpeed * deltaTime;

    this.x = Math.max(0, this.x);
    const maxX = this.worldWidth - canvasWidth;
    this.x = Math.min(this.x, maxX);

    // =========================
    // ZOOM DINÂMICO
    // =========================
    const distance = Math.abs(player1.x - player2.x);

    let dynamicZoom = 1 - (distance / 800);

    dynamicZoom = Math.max(this.minZoom, dynamicZoom);
    dynamicZoom = Math.min(this.maxZoom, dynamicZoom);

    this.targetZoom = dynamicZoom;

    // 🔥 SUAVIZAÇÃO DO ZOOM
    this.zoom += (this.targetZoom - this.zoom) * 5 * deltaTime;
  }

  static apply(ctx, canvasWidth, canvasHeight) {

    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    ctx.scale(this.zoom, this.zoom);

    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    ctx.translate(-this.x, 0);
  }

  // 🔥 NOVO MÉTODO
  static impactZoom() {
    this.targetZoom = 1.3;

    setTimeout(() => {
      this.targetZoom = 1;
    }, 120);
  }
}
export default class Canvas {
  constructor(width = 800, height = 400) {
    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext("2d");

    this.width = width;
    this.height = height;

    this.canvas.width = width;
    this.canvas.height = height;

    // garante tamanho visual igual ao interno
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
  }

  clear() {
    const ctx = this.context;

    // 🔥 RESET TOTAL DO CANVAS (ESSA É A CHAVE)
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(0, 0, this.width, this.height);
  }
}
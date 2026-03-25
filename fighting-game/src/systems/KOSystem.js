export default class KOSystem {

  static isKO = false;
  static winner = null;
  static timer = 0;

  static trigger(winnerName) {
    if (this.isKO) return;

    console.log("🔥 KO FUNCIONOU");
    console.log("Winner:", winnerName);

    this.isKO = true;
    this.winner = winnerName;
    this.timer = 2;
  }

  static update(deltaTime) {
    if (!this.isKO) return;

    this.timer -= deltaTime;
  }

  static render(ctx, canvasWidth, canvasHeight) {
    if (!this.isKO) return;

    ctx.save();

    // 🔥 GARANTE QUE DESENHA NA TELA (IGNORA SHAKE E MOVIMENTO)
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // fundo escuro
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "white";
    ctx.font = "bold 64px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    if (this.timer > 0) {
      ctx.fillText("KO!", centerX, centerY);
    } else {
      ctx.fillText(
        `${this.winner} WINS`,
        centerX,
        centerY
      );
    }

    ctx.restore();
  }

  static reset() {
    this.isKO = false;
    this.winner = null;
    this.timer = 0;
  }
}
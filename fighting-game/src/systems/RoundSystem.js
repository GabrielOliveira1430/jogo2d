import TimerSystem from "./TimerSystem.js";
import KOSystem from "./KOSystem.js";

export default class RoundSystem {

  static round = 1;
  static maxRounds = 3;

  static p1Wins = 0;
  static p2Wins = 0;

  static state = "intro"; // intro | fighting | result
  static timer = 2; // tempo de exibição

  // ========================
  // INICIAR ROUND
  // ========================
  static startRound() {
    this.state = "intro";
    this.timer = 2;

    TimerSystem.reset();
    KOSystem.reset();
  }

  // ========================
  // UPDATE
  // ========================
  static update(deltaTime, player1, player2) {

    // INTRO (Round 1, Fight)
    if (this.state === "intro") {
      this.timer -= deltaTime;

      if (this.timer <= 0) {
        this.state = "fighting";
      }

      return;
    }

    // LUTANDO
    if (this.state === "fighting") {

      if (KOSystem.isKO) {
        this.state = "result";
        this.timer = 2;

        // registra vitória
        if (KOSystem.winner === "PLAYER 1") this.p1Wins++;
        if (KOSystem.winner === "PLAYER 2") this.p2Wins++;
      }

      return;
    }

    // RESULTADO
    if (this.state === "result") {
      this.timer -= deltaTime;

      if (this.timer <= 0) {

        // vitória final?
        if (
          this.p1Wins === Math.ceil(this.maxRounds / 2) ||
          this.p2Wins === Math.ceil(this.maxRounds / 2)
        ) {
          // reinicia jogo completo
          this.round = 1;
          this.p1Wins = 0;
          this.p2Wins = 0;
        } else {
          this.round++;
        }

        // reset players
        player1.health = 100;
        player2.health = 100;

        player1.isAlive = true;
        player2.isAlive = true;

        player1.x = 150;
        player2.x = 550;

        // 🔥 RESET DE ENERGIA (ADICIONADO)
        player1.energy = 0;
        player2.energy = 0;

        this.startRound();
      }
    }
  }

  // ========================
  // RENDER
  // ========================
  static render(ctx, canvasWidth, canvasHeight) {

    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    // INTRO
    if (this.state === "intro") {

      ctx.font = "bold 40px Arial";

      ctx.fillText(
        `ROUND ${this.round}`,
        canvasWidth / 2,
        canvasHeight / 2 - 40
      );

      ctx.font = "bold 60px Arial";

      ctx.fillText(
        "FIGHT!",
        canvasWidth / 2,
        canvasHeight / 2 + 20
      );
    }

    // RESULTADO FINAL
    if (this.state === "result") {

      ctx.font = "bold 40px Arial";

      ctx.fillText(
        `${KOSystem.winner} WINS`,
        canvasWidth / 2,
        canvasHeight / 2
      );
    }

    ctx.restore();
  }
}
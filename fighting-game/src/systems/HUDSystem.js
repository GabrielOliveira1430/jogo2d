export default class HUDSystem {

  // 🔥 vida animada (efeito MK)
  static displayHealth1 = 100;
  static displayHealth2 = 100;

  static update(deltaTime, p1, p2) {

    // 🔥 delay na redução da vida (efeito clássico)
    const speed = 60 * deltaTime;

    if (this.displayHealth1 > p1.health) {
      this.displayHealth1 -= speed;
      if (this.displayHealth1 < p1.health) {
        this.displayHealth1 = p1.health;
      }
    }

    if (this.displayHealth2 > p2.health) {
      this.displayHealth2 -= speed;
      if (this.displayHealth2 < p2.health) {
        this.displayHealth2 = p2.health;
      }
    }
  }

  static getHealthColor(health) {
    if (health > 60) return "#00ff00"; // verde
    if (health > 30) return "#ffff00"; // amarelo
    return "#ff0000"; // vermelho
  }

  static render(ctx, p1, p2, width) {

    const barWidth = 250;
    const barHeight = 20;
    const top = 30;

    ctx.save();

    // 🔥 HUD fixo (sem câmera)
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // =========================
    // PLAYER 1
    // =========================
    const p1HealthPercent = p1.health / 100;
    const p1DisplayPercent = this.displayHealth1 / 100;

    // fundo
    ctx.fillStyle = "#222";
    ctx.fillRect(50, top, barWidth, barHeight);

    // dano atrasado (vermelho escuro)
    ctx.fillStyle = "#550000";
    ctx.fillRect(
      50,
      top,
      barWidth * p1DisplayPercent,
      barHeight
    );

    // vida atual
    ctx.fillStyle = this.getHealthColor(p1.health);
    ctx.fillRect(
      50,
      top,
      barWidth * p1HealthPercent,
      barHeight
    );

    // borda
    ctx.strokeStyle = "white";
    ctx.strokeRect(50, top, barWidth, barHeight);

    // nome
    ctx.fillStyle = "cyan";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("PLAYER 1", 50, top - 5);

    // =========================
    // PLAYER 2
    // =========================
    const p2HealthPercent = p2.health / 100;
    const p2DisplayPercent = this.displayHealth2 / 100;

    // fundo
    ctx.fillStyle = "#222";
    ctx.fillRect(width - 300, top, barWidth, barHeight);

    // dano atrasado
    ctx.fillStyle = "#550000";
    ctx.fillRect(
      width - 300,
      top,
      barWidth * p2DisplayPercent,
      barHeight
    );

    // vida atual (invertida)
    ctx.fillStyle = this.getHealthColor(p2.health);
    ctx.fillRect(
      width - 300,
      top,
      barWidth * p2HealthPercent,
      barHeight
    );

    // borda
    ctx.strokeStyle = "white";
    ctx.strokeRect(width - 300, top, barWidth, barHeight);

    // nome
    ctx.fillStyle = "orange";
    ctx.textAlign = "right";
    ctx.fillText("PLAYER 2", width - 50, top - 5);

    ctx.restore();
  }

  static reset() {
    this.displayHealth1 = 100;
    this.displayHealth2 = 100;
  }
}
export default class HUDSystem {

  static render(ctx, player1, player2, canvasWidth) {

    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const margin = 20;
    const barWidth = 250;
    const barHeight = 20;

    // ========================
    // VIDA PLAYER 1
    // ========================
    ctx.fillStyle = "red";
    ctx.fillRect(margin, margin, barWidth, barHeight);

    ctx.fillStyle = "green";
    ctx.fillRect(
      margin,
      margin,
      (barWidth * player1.health) / 100,
      barHeight
    );

    // ========================
    // VIDA PLAYER 2
    // ========================
    ctx.fillStyle = "red";
    ctx.fillRect(
      canvasWidth - barWidth - margin,
      margin,
      barWidth,
      barHeight
    );

    ctx.fillStyle = "green";
    ctx.fillRect(
      canvasWidth - margin - (barWidth * player2.health) / 100,
      margin,
      (barWidth * player2.health) / 100,
      barHeight
    );

    // ========================
    // ⚡ ENERGIA PLAYER 1
    // ========================
    ctx.fillStyle = "gray";
    ctx.fillRect(margin, margin + 30, barWidth, 10);

    ctx.fillStyle = "cyan";
    ctx.fillRect(
      margin,
      margin + 30,
      (barWidth * player1.energy) / player1.maxEnergy,
      10
    );

    // ========================
    // ⚡ ENERGIA PLAYER 2
    // ========================
    ctx.fillStyle = "gray";
    ctx.fillRect(
      canvasWidth - barWidth - margin,
      margin + 30,
      barWidth,
      10
    );

    ctx.fillStyle = "cyan";
    ctx.fillRect(
      canvasWidth - margin - (barWidth * player2.energy) / player2.maxEnergy,
      margin + 30,
      (barWidth * player2.energy) / player2.maxEnergy,
      10
    );

    ctx.restore();
  }
}
export default class Menu {

  constructor(startCallback) {
    this.options = ["PLAYER VS PLAYER", "PLAYER VS CPU"];
    this.selected = 0;
    this.startCallback = startCallback;

    this.keys = {};

    window.addEventListener("keydown", (e) => {
      if (this.keys[e.code]) return;

      this.keys[e.code] = true;

      if (e.code === "ArrowUp") {
        this.selected--;
        if (this.selected < 0) this.selected = this.options.length - 1;
      }

      if (e.code === "ArrowDown") {
        this.selected++;
        if (this.selected >= this.options.length) this.selected = 0;
      }

      if (e.code === "Enter") {
        this.startCallback(this.selected);
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
  }

  update() {}

  render(ctx, width, height) {

    // fundo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 48px Arial";
    ctx.fillText("FIGHTING GAME", width / 2, 100);

    ctx.font = "28px Arial";

    for (let i = 0; i < this.options.length; i++) {

      if (i === this.selected) {
        ctx.fillStyle = "yellow";
      } else {
        ctx.fillStyle = "white";
      }

      ctx.fillText(
        this.options[i],
        width / 2,
        200 + i * 50
      );
    }

    ctx.font = "16px Arial";
    ctx.fillStyle = "gray";
    ctx.fillText("Use ↑ ↓ e ENTER", width / 2, height - 40);
  }
}
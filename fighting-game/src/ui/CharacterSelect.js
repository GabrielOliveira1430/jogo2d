export default class CharacterSelect {

  constructor(onComplete) {

    this.onComplete = onComplete;

    this.index1 = 0;
    this.index2 = 1;

    this.confirm1 = false;
    this.confirm2 = false;

    this.currentPlayer = 1;

    this.active = true;

    this.characters = [
      {
        name: "FIGHTER 1",
        portrait: "../../assets/portraits/fighter1.png",
        folder: "fighter1"
      },
      {
        name: "FIGHTER 2",
        portrait: "../../assets/portraits/fighter2.png",
        folder: "fighter2"
      }
    ];

    this.images = this.characters.map(c => {
      const img = new Image();
      img.src = new URL(c.portrait, import.meta.url).href;
      return img;
    });

    this.keyHandler = (e) => {

      if (!this.active) return;
      if (e.repeat) return;

      // =====================
      // PLAYER 1
      // =====================
      if (this.currentPlayer === 1) {

        if (e.code === "KeyA") {
          this.index1 =
            (this.index1 - 1 + this.characters.length) %
            this.characters.length;
        }

        if (e.code === "KeyD") {
          this.index1 =
            (this.index1 + 1) %
            this.characters.length;
        }

        if (e.code === "Enter") {
          this.confirm1 = true;
          this.currentPlayer = 2;
          return;
        }
      }

      // =====================
      // PLAYER 2
      // =====================
      if (this.currentPlayer === 2) {

        if (e.code === "ArrowLeft") {
          this.index2 =
            (this.index2 - 1 + this.characters.length) %
            this.characters.length;
        }

        if (e.code === "ArrowRight") {
          this.index2 =
            (this.index2 + 1) %
            this.characters.length;
        }

        if (e.code === "Enter") {
          this.confirm2 = true;

          // 🔥 FINALIZA SEM BUG
          this.destroy();

          this.onComplete(
            this.characters[this.index1],
            this.characters[this.index2]
          );
        }
      }
    };

    window.addEventListener("keydown", this.keyHandler);
  }

  destroy() {
    this.active = false;
    window.removeEventListener("keydown", this.keyHandler);
  }

  update() {}

  render(ctx, width, height) {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SELECT YOUR FIGHTER", width / 2, 50);

    // PLAYER 1
    ctx.drawImage(this.images[this.index1], 100, 100, 200, 200);

    // PLAYER 2
    ctx.drawImage(this.images[this.index2], width - 300, 100, 200, 200);

    ctx.fillStyle = "cyan";
    ctx.fillText("P1", 200, 350);

    ctx.fillStyle = "red";
    ctx.fillText("P2", width - 200, 350);

    // TEXTO
    ctx.fillStyle = "yellow";

    if (this.currentPlayer === 1) {
      ctx.fillText("P1: A / D + ENTER", width / 2, height - 40);
    } else {
      ctx.fillText("P2: ← / → + ENTER", width / 2, height - 40);
    }
  }
}

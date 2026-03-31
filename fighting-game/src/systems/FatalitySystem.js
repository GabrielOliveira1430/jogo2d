import ScreenShake from "./ScreenShake.js";
import SlowMotionSystem from "./SlowMotionSystem.js";
import ParticleSystem from "./ParticleSystem.js";
import FreezeSystem from "./FreezeSystem.js";

class FatalitySystem {

  static active = false;
  static timer = 0;
  static phase = "idle";

  static attacker = null;
  static victim = null;

  static totalTime = 0;

  static trigger(attacker, victim) {
    this.active = true;
    this.timer = 0;
    this.totalTime = 0;
    this.phase = "intro";

    this.attacker = attacker;
    this.victim = victim;

    // 🔥 garante que a flag começa limpa
    if (typeof window !== "undefined") {
      window.__fatalityFinished = false;
    }

    if (this.attacker) {
      this.attacker.currentAnimation = "fatality";
    }

    if (this.victim) {
      this.victim.velocityX = 0;
      this.victim.velocityY = 0;
      this.victim.currentAnimation = "hit";
    }

    SlowMotionSystem.set(0.15);
  }

  static update(deltaTime) {
    if (!this.active) return;

    if (typeof deltaTime !== "number") deltaTime = 0;

    this.timer += deltaTime;
    this.totalTime += deltaTime;

    switch (this.phase) {

      case "intro":
        if (this.timer > 0.4) {
          this.phase = "zoom";
          this.timer = 0;
          ScreenShake.start(0.4, 8);
        }
        break;

      case "zoom":
        if (this.timer > 0.6) {
          this.phase = "hit";
          this.timer = 0;

          if (this.attacker) {
            this.attacker.currentAnimation = "fatality";
          }

          FreezeSystem.trigger(0.08);
        }
        break;

      case "hit":
        if (this.timer < 0.2 && this.victim) {
          for (let i = 0; i < 6; i++) {
            ParticleSystem.spawn({
              x: this.victim.x + this.victim.width / 2,
              y: this.victim.y - this.victim.height / 2,
              color: "red",
              speedX: (Math.random() - 0.5) * 400,
              speedY: (Math.random() - 0.5) * 400,
              life: 0.6
            });
          }
        }

        if (this.timer > 0.4) {
          this.phase = "slowkill";
          this.timer = 0;

          SlowMotionSystem.set(0.05);
          ScreenShake.start(0.6, 12);

          if (this.victim) {
            this.victim.currentAnimation = "dead";
          }
        }
        break;

      case "slowkill":
        if (this.timer > 1) {
          this.phase = "final";
          this.timer = 0;
          SlowMotionSystem.set(1);
        }
        break;

      case "final":
        if (this.timer > 2) {
          this.finishFatality();
        }
        break;
    }

    // 🔥 fallback de segurança (não quebra fluxo)
    if (this.totalTime > 6) {
      this.finishFatality();
    }
  }

  // 🔥 FINALIZAÇÃO CONTROLADA (EVITA DUPLO RESET)
  static finishFatality() {
    if (!this.active) return;

    this.active = false;
    this.timer = 0;
    this.totalTime = 0;
    this.phase = "idle";

    this.attacker = null;
    this.victim = null;

    SlowMotionSystem.set(1);

    // 🔥 sinaliza UMA VEZ só
    if (typeof window !== "undefined") {
      window.__fatalityFinished = true;
    }
  }

  static render(ctx, width, height) {
    if (!this.active) return;

    // ⚡ FLASH
    if (this.phase === "hit") {
      const alpha = Math.max(0, 0.7 - this.timer);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(0, 0, width, height);
    }

    // 🔥 OVERLAY
    if (this.phase === "slowkill") {
      const pulse = 0.2 + Math.sin(performance.now() * 0.02) * 0.1;
      ctx.fillStyle = `rgba(255,0,0,${pulse})`;
      ctx.fillRect(0, 0, width, height);
    }

    // 💀 TEXTO
    if (this.phase === "slowkill" || this.phase === "final") {

      ctx.save();

      const scale = 1.2 + Math.sin(performance.now() * 0.01) * 0.2;

      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);

      ctx.fillStyle = "red";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 6;

      ctx.font = "bold 90px Arial";
      ctx.textAlign = "center";

      ctx.strokeText("FATALITY", 0, 0);
      ctx.fillText("FATALITY", 0, 0);

      ctx.restore();
    }
  }

  // 🔥 reset manual (usado no startVS)
  static reset() {
    this.active = false;
    this.timer = 0;
    this.totalTime = 0;
    this.phase = "idle";

    this.attacker = null;
    this.victim = null;

    SlowMotionSystem.set(1);

    if (typeof window !== "undefined") {
      window.__fatalityFinished = false;
    }
  }
}

export default FatalitySystem;
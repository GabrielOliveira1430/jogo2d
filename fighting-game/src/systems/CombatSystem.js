import ComboSystem from "./ComboSystem.js";
import ParticleSystem from "./ParticleSystem.js";
import ScreenShake from "./ScreenShake.js";
import FreezeSystem from "./FreezeSystem.js";
import KOSystem from "./KOSystem.js";
import { MOVES } from "../moves/Moves.js"; // 🔥 NECESSÁRIO PARA DETECTAR ESPECIAL
import FlashSystem from "./FlashSystem.js"; // 🔥 ADICIONADO
import ImpactBackground from "./ImpactBackground.js"; // 🔥 ADICIONADO
import SlowMotionSystem from "./SlowMotionSystem.js"; // 🔥 ADICIONADO
import CameraSystem from "./CameraSystem.js"; // 🔥 ADICIONADO

export default class CombatSystem {

  static handleAttack(attacker, defender) {

    if (!attacker.hitbox || !attacker.hitbox.active) return;

    if (defender.hurtbox && attacker.hitbox.intersects(defender.hurtbox)) {

      if (!attacker.hitbox.canHit(defender)) return;

      attacker.hitbox.registerHit(defender);

      // ========================
      // DANO (ALTERADO)
      // ========================
      const damage = attacker.hitbox.damage;
      defender.takeDamage(damage);

      // ========================
      // ⚡ DETECTA ESPECIAL (ADICIONADO)
      // ========================
      const isSpecial = attacker.currentMove === MOVES.special;

      // 🔥 GANHA ENERGIA
      attacker.energy += 10;
      if (attacker.energy > attacker.maxEnergy) {
        attacker.energy = attacker.maxEnergy;
      }

      // ========================
      // 🔥 KO (SEM RETURN)
      // ========================
      if (!defender.isAlive && !KOSystem.isKO) {

        const winner =
          attacker === window.game.player1
            ? "PLAYER 1"
            : "PLAYER 2";

        KOSystem.trigger(winner);

        // impacto final forte
        ScreenShake.start(0.5, 15);
      }

      // ========================
      // RESTO NORMAL (ALTERADO)
      // ========================
      if (isSpecial) {

        // 🔥 SUPER IMPACTO
        FreezeSystem.trigger(0.12);

        ScreenShake.start(0.4, 20);

        // 🔥 FLASH
        FlashSystem.trigger(0.08);

        // 🔥 FUNDO IMPACTO
        ImpactBackground.trigger(0.2);

        // 🔥 SLOW MOTION
        SlowMotionSystem.trigger(0.2, 0.3);

        // 🔥 ZOOM IMPACTO
        CameraSystem.impactZoom();

        // 🔥 SOM FORTE
        const specialSound = new Audio("../../assets/sounds/kick.wav");
        specialSound.volume = 1;
        specialSound.play();

        // MAIS PARTÍCULAS
        for (let i = 0; i < 3; i++) {
          ParticleSystem.spawn(
            defender.x + defender.width / 2,
            defender.y - defender.height / 2,
            attacker.hitbox.direction
          );
        }

      } else {

        // impacto normal
        FreezeSystem.trigger(0.06);
        ScreenShake.start(0.12, 8);
      }

      ComboSystem.registerHit();

      ParticleSystem.spawn(
        defender.x + defender.width / 2,
        defender.y - defender.height / 2,
        attacker.hitbox.direction
      );

      defender.x += attacker.hitbox.direction * attacker.hitbox.knockback;
      defender.velocityY = -120;

      defender.hitTimer = 0.2;
    }
  }

  static resolveCollision(player1, player2) {
    const overlap =
      player1.x + player1.width > player2.x &&
      player1.x < player2.x + player2.width;

    if (!overlap) return;

    const push = 5;

    if (player1.x < player2.x) {
      player1.x -= push;
      player2.x += push;
    } else {
      player1.x += push;
      player2.x -= push;
    }
  }

  static clampToArena(player, arenaWidth = 800) {
    if (player.x < 0) player.x = 0;

    if (player.x + player.width > arenaWidth) {
      player.x = arenaWidth - player.width;
    }
  }
}
import Sprite from "../core/Sprite.js";
import { FighterState } from "../entities/Fighter.js";

export default class AnimationSystem {
  static animations = {
    [FighterState.IDLE]: {
      sprite: new Sprite({
        imageSrc: "./assets/characters/fighter1/idle.png",
        frameWidth: 128,
        frameHeight: 768,
        frameCount: 4,
      }),
      frameTime: 0.25,
      loop: true,
    },

    [FighterState.WALK]: {
      sprite: new Sprite({
        imageSrc: "./assets/characters/fighter1/walk.png",
        frameWidth: 128,
        frameHeight: 768,
        frameCount: 4,
      }),
      frameTime: 0.15,
      loop: true,
    },

    [FighterState.JUMP]: {
      sprite: new Sprite({
        imageSrc: "./assets/characters/fighter1/jump.png",
        frameWidth: 128,
        frameHeight: 768,
        frameCount: 2,
      }),
      frameTime: 0.25,
      loop: false,
    },

    [FighterState.ATTACK]: {
      sprite: new Sprite({
        imageSrc: "./assets/characters/fighter1/attack.png",
        frameWidth: 128,
        frameHeight: 768,
        frameCount: 4,
      }),
      frameTime: 0.12,
      loop: false,
    },

    [FighterState.HIT]: {
      sprite: new Sprite({
        imageSrc: "./assets/characters/fighter1/hit.png",
        frameWidth: 128,
        frameHeight: 768,
        frameCount: 2,
      }),
      frameTime: 0.18,
      loop: false,
    },
  };

  static update(fighter, deltaTime) {
    const anim = this.animations[fighter.state];
    if (!anim) return;

    fighter.animTimer += deltaTime;

    if (fighter.animTimer >= anim.frameTime) {
      fighter.animTimer = 0;

      if (fighter.animFrame < anim.sprite.frameCount - 1) {
        fighter.animFrame++;
      } else {
        // 🔒 trava no último frame se não for loop
        fighter.animFrame = anim.loop
          ? 0
          : anim.sprite.frameCount - 1;
      }
    }
  }

  static render(fighter, ctx) {
    const anim = this.animations[fighter.state];
    if (!anim) return;

    const sprite = anim.sprite;

    const drawX = fighter.x;
    const drawY =
      fighter.y + fighter.height - sprite.frameHeight;

    sprite.draw(
      ctx,
      drawX,
      drawY,
      fighter.animFrame,
      fighter.direction === -1
    );
  }
}
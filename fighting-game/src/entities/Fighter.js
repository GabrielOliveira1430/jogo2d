import Hurtbox from "./Hurtbox.js";
import { MOVES } from "../moves/Moves.js";
import { SETTINGS } from "../config/settings.js";
import Hitbox from "./Hitbox.js";

export const FighterState = {
  IDLE: "idle",
  WALK: "walk",
  JUMP: "jump",
  ATTACK: "attack",
  HIT: "hit",
  DEAD: "dead",
  BLOCK: "block",
  FATALITY: "fatality",
};

export default class Fighter {
  constructor({
    x,
    y,
    width = 80,
    height = 120,
    speed,
    controls,
    keyboard,
    sprites,
  }) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    // 🔥 CONTROLE AGORA VEM DO GAME.JS (CORRETO)
    this.controls = controls;
    this.keyboard = keyboard;

    this.health = 100;
    this.isAlive = true;

    this.energy = 0;
    this.maxEnergy = 100;

    this.velocityX = 0;
    this.velocityY = 0;
    this.isOnGround = false;

    this.direction = 1;
    this.state = FighterState.IDLE;

    this.attackCooldown = 0;
    this.attackTimer = 0;
    this.hitbox = null;
    this.currentMove = null;
    this.currentAnimation = "idle";
    this.hitTimer = 0;

    this.hurtbox = new Hurtbox({
      x: this.x,
      y: this.y - this.height,
      width: this.width,
      height: this.height
    });

    this.dashSpeed = 450;
    this.dashTimer = 0;
    this.dashDuration = 0.15;

    this.lastLeftTap = 0;
    this.lastRightTap = 0;
    this.doubleTapTime = 0.25;

    this.leftWasPressed = false;
    this.rightWasPressed = false;

    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 0.09;

    this.sprites = {};

    for (const key in sprites) {
      const img = new Image();
      img.src = new URL(sprites[key], import.meta.url).href;
      this.sprites[key] = img;
    }

    this.frameWidth = 128;
    this.frameHeight = 128;
    this.columns = 2;
    this.totalFrames = 4;
  }

  isHitActive() {
    if (!this.currentMove) return false;

    const activeFrames = this.currentMove.activeFrames;
    if (!activeFrames) return true;

    return activeFrames.includes(this.animFrame);
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.animFrame = 0;
      this.animTimer = 0;
    }
  }

  takeDamage(amount) {
    if (!this.isAlive) return;

    if (this.state === FighterState.BLOCK) {
      amount *= 0.3;
    }

    this.health -= amount;

    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;
      this.currentAnimation = "dead";
      this.setState(FighterState.DEAD);
    } else {
      this.currentAnimation = "hit";
      this.setState(FighterState.HIT);
      this.hitTimer = 0.25;
    }
  }

  executeMove(moveName) {

    const move = MOVES[moveName];

    if (!move) {
      console.warn("Move não encontrado:", moveName);
      return;
    }

    this.currentMove = move;

    if (moveName === "punch") this.currentAnimation = "punch";
    else if (moveName === "kick") this.currentAnimation = "kick";
    else if (moveName === "special") this.currentAnimation = "kick";
    else this.currentAnimation = "punch";

    const direction = this.direction;

    const hitboxX =
      direction === 1
        ? this.x + this.width + (move.offsetX || 0)
        : this.x - move.width - (move.offsetX || 0);

    this.hitbox = new Hitbox({
      x: hitboxX,
      y: this.y - this.height + (move.offsetY || 0),
      width: move.width,
      height: move.height,
      damage: move.damage || 5,
      direction: direction,
      knockback: move.knockback || 100
    });

    this.attackTimer = move.duration || 0.3;
    this.attackCooldown = move.cooldown || 0.3;

    this.setState(FighterState.ATTACK);
  }

  updateHitbox() {
    if (!this.hitbox || !this.currentMove) return;

    const move = this.currentMove;
    const direction = this.direction;

    this.hitbox.x =
      direction === 1
        ? this.x + this.width + (move.offsetX || 0)
        : this.x - move.width - (move.offsetX || 0);

    this.hitbox.y = this.y - this.height + (move.offsetY || 0);
    this.hitbox.active = this.isHitActive();
  }

  update(deltaTime) {

    if (!this.isAlive) {
      this.animateDeath(deltaTime);
      return;
    }

    this.velocityX = 0;

    const now = performance.now() / 1000;

    const leftPressed = this.keyboard.isPressed(this.controls.left);
    const rightPressed = this.keyboard.isPressed(this.controls.right);

    const attackPressed = this.keyboard.isJustPressed(this.controls.attack);
    const kickPressed = this.keyboard.isJustPressed(this.controls.kick);
    const specialPressed = this.keyboard.isJustPressed(this.controls.special);

    const jumpPressed = this.keyboard.isPressed(this.controls.jump);

    this.updateAnimation(deltaTime);

    if (this.state === FighterState.HIT) {
      this.hitTimer -= deltaTime;
      if (this.hitTimer <= 0) {
        this.setState(this.isOnGround ? FighterState.IDLE : FighterState.JUMP);
      }
    }

    if (this.state !== FighterState.ATTACK && this.state !== FighterState.HIT) {

      if (leftPressed) {
        this.handleMove(-1, now);
      } else if (rightPressed) {
        this.handleMove(1, now);
      } else if (this.isOnGround) {
        this.currentAnimation = "idle";
        this.setState(FighterState.IDLE);
      }

      if (jumpPressed && this.isOnGround) {
        this.velocityY = -SETTINGS.jumpForce;
        this.isOnGround = false;
        this.currentAnimation = "jump";
        this.setState(FighterState.JUMP);
      }
    }

    if (this.attackCooldown <= 0 && this.state !== FighterState.ATTACK) {

      if (!this.isOnGround && attackPressed) {
        this.executeMove("airAttack");
      } else if (kickPressed) {
        this.executeMove("kick");
      } else if (attackPressed) {
        this.executeMove("punch");
      } else if (specialPressed && this.energy >= 50) {
        this.energy -= 50;
        this.executeMove("special");
      }
    }

    this.updateTimers(deltaTime);

    this.applyPhysics(deltaTime);

    this.hurtbox.update(
      this.x,
      this.y - this.height,
      this.width,
      this.height
    );
  }

  handleMove(dir, now) {

    if (dir === -1) {
      if (!this.leftWasPressed && now - this.lastLeftTap < this.doubleTapTime) {
        this.dashTimer = this.dashDuration;
      }
      this.lastLeftTap = now;
    } else {
      if (!this.rightWasPressed && now - this.lastRightTap < this.doubleTapTime) {
        this.dashTimer = this.dashDuration;
      }
      this.lastRightTap = now;
    }

    this.velocityX =
      this.dashTimer > 0
        ? dir * this.dashSpeed
        : dir * this.speed;

    this.direction = dir;

    if (this.isOnGround) {
      this.currentAnimation = "walk";
      this.setState(FighterState.WALK);
    }

    this.leftWasPressed = dir === -1;
    this.rightWasPressed = dir === 1;
  }

  updateAnimation(deltaTime) {
    this.animTimer += deltaTime;

    if (this.animTimer > this.animSpeed) {
      this.animFrame++;
      this.animTimer = 0;

      if (this.animFrame >= this.totalFrames) {
        this.animFrame = this.state === FighterState.ATTACK
          ? this.totalFrames - 1
          : 0;
      }
    }
  }

  updateTimers(deltaTime) {

    this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);

    if (this.attackTimer > 0) {
      this.attackTimer -= deltaTime;
      this.updateHitbox();

      if (this.attackTimer <= 0) {
        this.hitbox = null;
        this.currentMove = null;
        this.currentAnimation = "idle";
        this.setState(this.isOnGround ? FighterState.IDLE : FighterState.JUMP);
      }
    }

    if (this.dashTimer > 0) {
      this.dashTimer -= deltaTime;
    }
  }

  applyPhysics(deltaTime) {

    this.x += this.velocityX * deltaTime;

    this.velocityY += SETTINGS.gravity * deltaTime;
    this.y += this.velocityY * deltaTime;

    if (this.y >= SETTINGS.groundY) {
      this.y = SETTINGS.groundY;
      this.velocityY = 0;
      this.isOnGround = true;

      if (this.state === FighterState.JUMP) {
        this.currentAnimation = "idle";
        this.setState(FighterState.IDLE);
      }
    }
  }

  animateDeath(deltaTime) {
    this.animTimer += deltaTime;

    if (this.animTimer > this.animSpeed) {
      this.animFrame++;
      this.animTimer = 0;

      if (this.animFrame >= this.totalFrames) {
        this.animFrame = this.totalFrames - 1;
      }
    }
  }

  render(ctx) {

    const drawX = this.x;
    const drawY = this.y - this.height;

    let sprite = this.sprites[this.currentAnimation] || this.sprites.idle;

    const col = this.animFrame % this.columns;
    const row = Math.floor(this.animFrame / this.columns);

    const sx = col * this.frameWidth;
    const sy = row * this.frameHeight;

    ctx.save();

    if (this.direction === -1) {
      ctx.scale(-1, 1);
      ctx.drawImage(
        sprite,
        sx, sy,
        this.frameWidth,
        this.frameHeight,
        -drawX - this.width,
        drawY,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        sprite,
        sx, sy,
        this.frameWidth,
        this.frameHeight,
        drawX,
        drawY,
        this.width,
        this.height
      );
    }

    ctx.restore();
  }
}
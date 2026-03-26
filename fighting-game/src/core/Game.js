import Canvas from "./Canvas.js";
import GameLoop from "./GameLoop.js";
import Fighter from "../entities/Fighter.js";
import Keyboard from "../input/Keyboard.js";
import { CONTROLS } from "../config/controls.js";
import CombatSystem from "../systems/CombatSystem.js";
import ScreenShake from "../systems/ScreenShake.js";
import ParticleSystem from "../systems/ParticleSystem.js";
import ComboSystem from "../systems/ComboSystem.js";
import FreezeSystem from "../systems/FreezeSystem.js";
import KOSystem from "../systems/KOSystem.js";
import CameraSystem from "../systems/CameraSystem.js";
import HUDSystem from "../systems/HUDSystem.js";
import TimerSystem from "../systems/TimerSystem.js";
import RoundSystem from "../systems/RoundSystem.js";
import SlowMotionSystem from "../systems/SlowMotionSystem.js";
import ImpactBackground from "../systems/ImpactBackground.js";
import AISystem from "../systems/AISystem.js"; // 🔥 ADICIONADO

export default class Game {
  constructor() {
    this.canvas = new Canvas(800, 400);
    this.keyboard = new Keyboard();

    // 🔥 INICIAR ROUND
    RoundSystem.startRound();

    this.player1 = new Fighter({
      x: 150,
      y: 300,
      width: 80,
      height: 120,
      speed: 200,
      keyboard: this.keyboard,
      controls: CONTROLS.player1,
      sprites: {
        idle: "../../assets/characters/fighter1/idle.png",
        walk: "../../assets/characters/fighter1/walk.png",
        jump: "../../assets/characters/fighter1/jump.png",
        punch: "../../assets/characters/fighter1/punch.png",
        kick: "../../assets/characters/fighter1/kick.png",
        hit: "../../assets/characters/fighter1/hit.png",
        dead: "../../assets/characters/fighter1/dead.png",
      },
    });

    this.player2 = new Fighter({
      x: 550,
      y: 300,
      width: 80,
      height: 120,
      speed: 200,
      keyboard: this.keyboard,
      controls: CONTROLS.player2,
      sprites: {
        idle: "../../assets/characters/fighter2/idle.png",
        walk: "../../assets/characters/fighter2/walk.png",
        jump: "../../assets/characters/fighter2/jump.png",
        punch: "../../assets/characters/fighter2/punch.png",
        kick: "../../assets/characters/fighter2/kick.png",
        hit: "../../assets/characters/fighter2/hit.png",
        dead: "../../assets/characters/fighter2/dead.png",
      },
    });

    this.loop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    );
  }

  start() {
    this.loop.start();
  }

  update(deltaTime) {

    // 🔥 SLOW MOTION
    deltaTime = SlowMotionSystem.getDeltaTime(deltaTime);

    const isKO = KOSystem.isKO;
    const isFrozen = FreezeSystem.isFrozen();

    // ========================
    // GAMEPLAY
    // ========================
    if (!isKO && RoundSystem.state === "fighting") {

      if (!isFrozen) {
        this.player1.update(deltaTime);

        // player2 agora é CPU → não usa teclado
        this.player2.update(deltaTime);
      }

      // 🔥 IA CONTROLANDO PLAYER 2
      AISystem.update(this.player2, this.player1, deltaTime);

      // direção
      if (this.player1.x < this.player2.x) {
        this.player1.direction = 1;
        this.player2.direction = -1;
      } else {
        this.player1.direction = -1;
        this.player2.direction = 1;
      }

      // combate
      CombatSystem.handleAttack(this.player1, this.player2);
      CombatSystem.handleAttack(this.player2, this.player1);

      // colisão
      CombatSystem.resolveCollision(this.player1, this.player2);
      CombatSystem.clampToArena(this.player1);
      CombatSystem.clampToArena(this.player2);

      // 🔥 DETECÇÃO DE KO
      if (!this.player1.isAlive) {
        KOSystem.trigger("PLAYER 2");
      }

      if (!this.player2.isAlive) {
        KOSystem.trigger("PLAYER 1");
      }
    }

    // 🔥 PARAR TIMER NO KO
    if (KOSystem.isKO) {
      TimerSystem.isRunning = false;
    }

    // ========================
    // SISTEMAS (SEMPRE)
    // ========================
    ScreenShake.update(deltaTime);
    ParticleSystem.update(deltaTime);
    ComboSystem.update(deltaTime);
    FreezeSystem.update(deltaTime);
    KOSystem.update(deltaTime);

    SlowMotionSystem.update(deltaTime);
    ImpactBackground.update(deltaTime);

    CameraSystem.update(
      this.player1,
      this.player2,
      deltaTime,
      this.canvas.width
    );

    TimerSystem.update(deltaTime);

    RoundSystem.update(deltaTime, this.player1, this.player2);

    this.keyboard.update();
  }

  render() {

    const ctx = this.canvas.context;

    this.canvas.clear();

    ctx.save();

    CameraSystem.apply(ctx, this.canvas.width, this.canvas.height);
    ScreenShake.apply(ctx);

    this.player1.render(ctx);
    this.player2.render(ctx);

    ParticleSystem.render(ctx);
    ComboSystem.render(ctx, this.canvas.width);

    ctx.restore();

    // ========================
    // UI (SEM SHAKE)
    // ========================

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 10, 10);

    HUDSystem.render(
      ctx,
      this.player1,
      this.player2,
      this.canvas.width
    );

    TimerSystem.render(ctx, this.canvas.width);

    ImpactBackground.render(
      ctx,
      this.canvas.width,
      this.canvas.height
    );

    KOSystem.render(
      ctx,
      this.canvas.width,
      this.canvas.height
    );

    RoundSystem.render(
      ctx,
      this.canvas.width,
      this.canvas.height
    );
  }
}
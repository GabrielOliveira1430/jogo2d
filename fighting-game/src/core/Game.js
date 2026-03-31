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
import Menu from "../ui/Menu.js";
import AISystem from "../systems/AISystem.js";
import CharacterSelect from "../ui/CharacterSelect.js";
import FinishSystem from "../systems/FinishSystem.js";
import FatalitySystem from "../systems/FatalitySystem.js";

export default class Game {
  constructor() {
    this.canvas = new Canvas(800, 400);
    this.keyboard = new Keyboard();

    this.state = "menu";

    this.menu = new Menu((option) => {
      this.startGame(option);
    });

    this.characterSelect = null;
    this.vsCPU = false;

    this.player1 = null;
    this.player2 = null;

    this.score = { p1: 0, p2: 0 };

    this.lastKOState = false;
    this.finishTriggered = false;
    this.fatalityScheduled = false;

    this.loop = new GameLoop(
      this.update.bind(this),
      this.render.bind(this)
    );
  }

  createFighter(folder, x, controls) {
    return new Fighter({
      x,
      y: 300,
      width: 80,
      height: 120,
      speed: 200,
      keyboard: this.keyboard,
      controls,
      sprites: {
        idle: `../../assets/characters/${folder}/idle.png`,
        walk: `../../assets/characters/${folder}/walk.png`,
        jump: `../../assets/characters/${folder}/jump.png`,
        punch: `../../assets/characters/${folder}/punch.png`,
        kick: `../../assets/characters/${folder}/kick.png`,
        hit: `../../assets/characters/${folder}/hit.png`,
        dead: `../../assets/characters/${folder}/dead.png`,
        fatality: `../../assets/characters/${folder}/fatality.png`,
      },
    });
  }

  start() {
    this.loop.start();
  }

  startGame(option) {
    if (this.state !== "menu") return;

    this.vsCPU = option !== 0;

    this.characterSelect = new CharacterSelect((p1, p2) => {
      this.startVS(p1, p2);
    });

    this.state = "select";
  }

  startVS(p1, p2) {
    this.characterSelect?.destroy();

    this.player1 = this.createFighter(p1.folder, 150, CONTROLS.player1);
    this.player2 = this.createFighter(p2.folder, 550, CONTROLS.player2);

    this.score = { p1: 0, p2: 0 };

    this.resetRound();

    this.state = "game";
  }

  resetRound() {
    KOSystem.reset();
    FinishSystem.reset();
    FatalitySystem.reset();

    this.lastKOState = false;
    this.finishTriggered = false;
    this.fatalityScheduled = false;

    this.player1.health = 100;
    this.player2.health = 100;

    this.player1.isAlive = true;
    this.player2.isAlive = true;

    this.player1.x = 150;
    this.player2.x = 550;

    TimerSystem.reset();
    RoundSystem.startRound();
  }

  update(deltaTime) {

    if (this.state === "menu") {
      this.menu.update();
      return;
    }

    if (this.state === "select") {
      this.characterSelect?.update();
      return;
    }

    deltaTime = SlowMotionSystem.getDeltaTime(deltaTime);

    const isKO = KOSystem.isKO;

    // 🔥 DETECTA KO UMA VEZ
    if (isKO && !this.lastKOState) {

      let winner = null;
      let loser = null;

      if (this.player1.isAlive) {
        this.score.p1++;
        winner = this.player1;
        loser = this.player2;
      } else {
        this.score.p2++;
        winner = this.player2;
        loser = this.player1;
      }

      if (!this.finishTriggered && (this.score.p1 === 2 || this.score.p2 === 2)) {
        this.finishTriggered = true;
        FinishSystem.trigger();

        setTimeout(() => {
          FinishSystem.active = false;
          FatalitySystem.trigger(winner, loser);
        }, 1000);
      }
    }

    this.lastKOState = isKO;

    // 🔥 AGORA SÓ LUTA SE ESTIVER EM "fighting"
    if (
      RoundSystem.state === "fighting" &&
      !isKO &&
      !FinishSystem.active &&
      !FatalitySystem.active
    ) {

      this.player1.update(deltaTime);
      this.player2.update(deltaTime);

      if (this.vsCPU) {
        AISystem.update(this.player2, this.player1, deltaTime);
      }

      // DIREÇÃO
      if (this.player1.x < this.player2.x) {
        this.player1.direction = 1;
        this.player2.direction = -1;
      } else {
        this.player1.direction = -1;
        this.player2.direction = 1;
      }

      // COMBATE
      CombatSystem.handleAttack(this.player1, this.player2);
      CombatSystem.handleAttack(this.player2, this.player1);

      // COLISÃO
      CombatSystem.resolveCollision(this.player1, this.player2);

      // LIMITES
      CombatSystem.clampToArena(this.player1);
      CombatSystem.clampToArena(this.player2);
    }

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
    HUDSystem.update(deltaTime, this.player1, this.player2);

    FinishSystem.update(deltaTime);
    FatalitySystem.update(deltaTime);

    if (typeof window !== "undefined" && window.__fatalityFinished === true) {
      window.__fatalityFinished = false;
      this.resetRound();
    }

    this.keyboard.update();
  }

  render() {
    const ctx = this.canvas.context;

    if (this.state === "menu") {
      this.menu.render(ctx, this.canvas.width, this.canvas.height);
      return;
    }

    if (this.state === "select") {
      this.characterSelect?.render(ctx, this.canvas.width, this.canvas.height);
      return;
    }

    this.canvas.clear();

    ctx.save();
    CameraSystem.apply(ctx, this.canvas.width, this.canvas.height);
    ScreenShake.apply(ctx);

    this.player1.render(ctx);
    this.player2.render(ctx);

    ctx.restore();

    HUDSystem.render(ctx, this.player1, this.player2, this.canvas.width);
    TimerSystem.render(ctx, this.canvas.width);
    ImpactBackground.render(ctx, this.canvas.width, this.canvas.height);
    KOSystem.render(ctx, this.canvas.width, this.canvas.height);
    RoundSystem.render(ctx, this.canvas.width, this.canvas.height);

    if (!FatalitySystem.active) {
      FinishSystem.render(ctx, this.canvas.width, this.canvas.height);
    }

    FatalitySystem.render(ctx, this.canvas.width, this.canvas.height);
  }
}
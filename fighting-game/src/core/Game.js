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

    RoundSystem.startRound();

    TimerSystem.onTimeUp = () => {
      this.handleTimeUp();
    };

    this.player1 = this.createFighter("fighter1", 150, CONTROLS.player1);
    this.player2 = this.createFighter("fighter2", 550, CONTROLS.player2);

    this.vsTimer = 0;
    this.vsAnimTime = 0;
    this.vsDuration = 2;

    this.vsImpactDone = false;
    this.vsFlash = 0;
    this.vsShake = 0;
    this.showFightText = false;

    this.selectedP1 = null;
    this.selectedP2 = null;

    this.vsImage1 = new Image();
    this.vsImage2 = new Image();

    this.score = { p1: 0, p2: 0 };

    this.lastKOState = false;
    this.finishTriggered = false;

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
    if (this.state !== "select") return;

    if (this.characterSelect) {
      this.characterSelect.destroy();
      this.characterSelect = null;
    }

    this.selectedP1 = p1;
    this.selectedP2 = p2;

    this.vsImage1.src = new URL(p1.portrait, import.meta.url).href;
    this.vsImage2.src = new URL(p2.portrait, import.meta.url).href;

    this.player1 = this.createFighter(p1.folder || "fighter1", 150, CONTROLS.player1);
    this.player2 = this.createFighter(p2.folder || "fighter2", 550, CONTROLS.player2);

    this.vsTimer = 0;
    this.vsAnimTime = 0;

    this.vsImpactDone = false;
    this.vsFlash = 0;
    this.vsShake = 0;
    this.showFightText = false;

    FinishSystem.reset();
    this.finishTriggered = false;
    this.lastKOState = false;

    this.score = { p1: 0, p2: 0 };

    TimerSystem.reset();
    TimerSystem.isRunning = false;

    HUDSystem.reset();

    this.state = "vs";
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

    if (this.state === "vs") {
      this.vsTimer += deltaTime;
      this.vsAnimTime += deltaTime;

      if (!this.vsImpactDone && this.vsAnimTime >= this.vsDuration) {
        this.vsImpactDone = true;

        // 🔥 IMPACTO MAIS FORTE
        this.vsFlash = 0.35;
        this.vsShake = 0.3;
        this.showFightText = true;
      }

      if (this.vsFlash > 0) this.vsFlash -= deltaTime;
      if (this.vsShake > 0) this.vsShake -= deltaTime;

      if (this.vsTimer > 2.5) {
        TimerSystem.isRunning = true;
        this.state = "game";
      }

      return;
    }

    deltaTime = SlowMotionSystem.getDeltaTime(deltaTime);

    const isKO = KOSystem.isKO;

    if (isKO && !this.lastKOState) {

      if (this.player1.isAlive) this.score.p1++;
      else if (this.player2.isAlive) this.score.p2++;

      if (!this.finishTriggered && (this.score.p1 === 2 || this.score.p2 === 2)) {
        FinishSystem.trigger();
        this.finishTriggered = true;
      }
    }

    this.lastKOState = isKO;

    if (!isKO && RoundSystem.state === "fighting") {

      if (!FreezeSystem.isFrozen()) {
        this.player1.update(deltaTime);
        this.player2.update(deltaTime);
      }

      if (this.vsCPU) {
        AISystem.update(this.player2, this.player1, deltaTime);
      }

      if (this.player1.x < this.player2.x) {
        this.player1.direction = 1;
        this.player2.direction = -1;
      } else {
        this.player1.direction = -1;
        this.player2.direction = 1;
      }

      CombatSystem.handleAttack(this.player1, this.player2);
      CombatSystem.handleAttack(this.player2, this.player1);

      CombatSystem.resolveCollision(this.player1, this.player2);
      CombatSystem.clampToArena(this.player1);
      CombatSystem.clampToArena(this.player2);

      if (!this.player1.isAlive) KOSystem.trigger("PLAYER 2");
      if (!this.player2.isAlive) KOSystem.trigger("PLAYER 1");
    }

    ScreenShake.update(deltaTime);
    ParticleSystem.update(deltaTime);
    ComboSystem.update(deltaTime);
    FreezeSystem.update(deltaTime);
    KOSystem.update(deltaTime);

    SlowMotionSystem.update(deltaTime);
    ImpactBackground.update(deltaTime);

    CameraSystem.update(this.player1, this.player2, deltaTime, this.canvas.width);

    TimerSystem.update(deltaTime);
    RoundSystem.update(deltaTime, this.player1, this.player2);

    HUDSystem.update(deltaTime, this.player1, this.player2);

    FinishSystem.update(deltaTime);

    // 🔥 SÓ PERMITE FATALITY NO MOMENTO CERTO
    if (FinishSystem.active) {
      FatalitySystem.update(
        deltaTime,
        this.keyboard,
        this.player1.controls,
        this.player1,
        this.player2
      );
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

    if (this.state === "vs") {
      this.renderVS(ctx);
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

    FinishSystem.render(ctx, this.canvas.width, this.canvas.height);
    FatalitySystem.render(ctx, this.canvas.width, this.canvas.height);
  }

  renderVS(ctx) {
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    const t = Math.min(this.vsAnimTime / this.vsDuration, 1);
    const ease = t * t * (3 - 2 * t);

    const centerX = width / 2;
    const offset = 120;

    const p1X = -250 + (centerX - offset - 100 + 250) * ease;
    const p2X = width + 250 + (centerX + offset - 100 - (width + 250)) * ease;

    const y = height / 2 - 100;

    if (this.vsImage1.complete) {
      ctx.drawImage(this.vsImage1, p1X, y, 200, 200);
    }

    if (this.vsImage2.complete) {
      ctx.drawImage(this.vsImage2, p2X, y, 200, 200);
    }

    ctx.fillStyle = "red";
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.fillText("VS", centerX, height / 2);

    if (this.showFightText) {
      ctx.fillStyle = "yellow";
      ctx.font = "bold 50px Arial";
      ctx.fillText("FIGHT!", centerX, height / 2 + 80);
    }

    // 🔥 FLASH MAIS CINEMATOGRÁFICO
    if (this.vsFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.vsFlash * 5})`;
      ctx.fillRect(0, 0, width, height);
    }
  }
}
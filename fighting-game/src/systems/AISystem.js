export default class AISystem {

  static thinkTimer = 0;

  // 🔥 dificuldade: "easy", "normal", "hard"
  static difficulty = "normal";

  static update(cpu, player, deltaTime) {

    if (!cpu.isAlive) return;

    this.thinkTimer -= deltaTime;

    if (this.thinkTimer > 0) return;

    this.thinkTimer = this.getThinkSpeed();

    const distance = player.x - cpu.x;
    const absDist = Math.abs(distance);

    const isPlayerAttacking = player.state === "attack";
    const isLowHealth = cpu.health < 30;

    // limpa input
    cpu.input = {
      left: false,
      right: false,
      attack: false,
      kick: false,
      special: false,
      jump: false,
      block: false
    };

    // ========================
    // 🛡️ BLOQUEIO (REAÇÃO)
    // ========================
    if (isPlayerAttacking && absDist < 100) {

      if (Math.random() < this.getBlockChance()) {
        cpu.input.block = true;
        return;
      }
    }

    // ========================
    // 🔴 VIDA BAIXA → DEFENSIVO
    // ========================
    if (isLowHealth) {

      // recua
      if (distance > 0) cpu.input.left = true;
      else cpu.input.right = true;

      // contra-ataque ocasional
      if (Math.random() < 0.3) {
        cpu.input.attack = true;
      }

      return;
    }

    // ========================
    // 🔵 LONGE → APROXIMA
    // ========================
    if (absDist > 150) {

      if (distance > 0) cpu.input.right = true;
      else cpu.input.left = true;

      // movimento mais humano
      if (Math.random() < 0.15) {
        cpu.input.jump = true;
      }

      return;
    }

    // ========================
    // 🟡 MÉDIA DISTÂNCIA (BAIT)
    // ========================
    if (absDist > 80) {

      // bait (vai e volta)
      if (Math.random() < 0.5) {
        if (distance > 0) cpu.input.right = true;
        else cpu.input.left = true;
      } else {
        if (distance > 0) cpu.input.left = true;
        else cpu.input.right = true;
      }

      // poke
      if (Math.random() < 0.3) {
        cpu.input.attack = true;
      }

      return;
    }

    // ========================
    // 🔥 PERTO → COMBATE INTELIGENTE
    // ========================

    // COUNTER se player atacando
    if (isPlayerAttacking && Math.random() < this.getCounterChance()) {

      cpu.input.kick = true;
      return;
    }

    const action = Math.random();

    if (action < 0.35) {
      cpu.input.attack = true;
    }
    else if (action < 0.65) {
      cpu.input.kick = true;
    }
    else if (cpu.energy >= 50 && Math.random() < this.getSpecialChance()) {
      cpu.input.special = true;
    }
    else if (Math.random() < 0.3) {
      cpu.input.jump = true;
    }

    // reposicionamento
    if (Math.random() < 0.25) {
      if (distance > 0) cpu.input.left = true;
      else cpu.input.right = true;
    }
  }

  // ========================
  // 🎯 DIFICULDADE
  // ========================

  static getThinkSpeed() {
    if (this.difficulty === "easy") return 0.25;
    if (this.difficulty === "hard") return 0.08;
    return 0.15;
  }

  static getBlockChance() {
    if (this.difficulty === "easy") return 0.2;
    if (this.difficulty === "hard") return 0.8;
    return 0.5;
  }

  static getCounterChance() {
    if (this.difficulty === "easy") return 0.2;
    if (this.difficulty === "hard") return 0.7;
    return 0.4;
  }

  static getSpecialChance() {
    if (this.difficulty === "easy") return 0.2;
    if (this.difficulty === "hard") return 0.9;
    return 0.5;
  }
}
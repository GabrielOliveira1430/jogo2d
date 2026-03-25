export const MOVES = {

  // ========================
  // SOCO
  // ========================
  punch: {
    damage: 8,
    width: 45,
    height: 35,
    offsetX: 30,
    offsetY: 35,
    duration: 0.18,
    cooldown: 0.30,
    knockback: 20,
    activeFrames: [1, 2, 3]
  },

  // ========================
  // CHUTE
  // ========================
  kick: {
    damage: 12,
    width: 60,
    height: 40,
    offsetX: 35,
    offsetY: 35,
    duration: 0.22,
    cooldown: 0.40,
    knockback: 35,
    activeFrames: [1, 2, 3]
  },

  // ========================
  // ATAQUE NO AR
  // ========================
  airAttack: {
    damage: 10,
    width: 45,
    height: 45,
    offsetX: 30,
    offsetY: 25,
    duration: 0.18,
    cooldown: 0.35,
    knockback: 25,
    activeFrames: [1, 2, 3]
  },

  // ========================
  // ESPECIAL (AJUSTADO)
  // ========================
  special: {
    damage: 25,
    width: 80,
    height: 40,
    offsetX: 10,
    offsetY: 20,
    duration: 0.3,
    cooldown: 0.6,
  }

};
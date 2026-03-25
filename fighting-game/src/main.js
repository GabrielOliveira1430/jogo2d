import Game from "./core/Game.js";

const game = new Game();

// 🔥 ESSENCIAL (permite o CombatSystem saber quem é player1/player2)
window.game = game;

game.start();
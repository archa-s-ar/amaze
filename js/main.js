/**
 * AMAZE — Space Mission Engineering Simulator
 * main.js — Application entry point and bootstrap
 */

import { GameController } from './game.js';

function initApp() {
  const game = new GameController();
  window.AmazeGame = game; // Exposed for debugging / inspection if needed
  game.start();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}

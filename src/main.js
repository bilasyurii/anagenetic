import Engine from './anvas/engine.js';
import PreloadState from './states/preload.js';
import GameState from './states/game.js';
import Stats from './utils/stats.js';

new Engine()
  .setCanvasId('canvas')
  .setBodyColor('#222222')
  .setCanvasColor('#000000')
  .registerState('preload', PreloadState)
  .registerState('game', GameState)
  .setStartingState('preload')
  .start();

const stats = new Stats();
document.body.appendChild(stats.dom);

requestAnimationFrame(function loop() {
  stats.update();
  requestAnimationFrame(loop);
});
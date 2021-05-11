import Engine from './anvas/engine';
import GameState from './states/game';
import HashGrid from './anvas/physics/space-partitioning/hash-grid';
import UI from './ui/ui';
// import Stats from './utils/stats';

new UI();

new Engine()
  .setCanvasId('canvas')
  .setBodyColor('#222222')
  .setCanvasColor('#000000')
  .registerState('game', GameState)
  .setStartingState('game')
  .setSpacePartitioning(new HashGrid())
  .start();

// const stats = new Stats();

// document.body.appendChild(stats.dom);

// requestAnimationFrame(function loop() {
//   stats.update();
//   requestAnimationFrame(loop);
// });

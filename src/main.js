import Engine from './anvas/engine';
import SimulationState from './states/simulation';
import HashGrid from './anvas/physics/space-partitioning/hash-grid';
import UI from './ui/ui';
import UIMediator from './ui/ui-mediator';
// import Stats from './utils/stats';

const engine = new Engine()
  .setCanvasId('canvas')
  .setBodyColor('#111111')
  .setCanvasColor('#000000')
  .registerState('simulation', SimulationState)
  .setStartingState('simulation')
  .setSpacePartitioning(new HashGrid())
  .start();

engine.onDocumentReady.add(() => {
  UIMediator.registerUI(new UI());
});

// const stats = new Stats();

// document.body.appendChild(stats.dom);

// requestAnimationFrame(function loop() {
//   stats.update();
//   requestAnimationFrame(loop);
// });

import State from '../anvas/state/state.js';

export default class PreloadState extends State {
  onEnter() {
    const load = this.load;

    load.onLoaded.once(this._onLoadingFinished, this);

    load
      .image('test', 'assets/test.png')
      .image('sprite', 'assets/sprite.png')
      .start();
  }

  _onLoadingFinished() {
    const loadedMsg = 'Loading finished. Total loaded files: ';
    const failedMsg = 'total failed: ';
    const load = this.load;
    const loadedCount = load.loadedCount;
    const failedCount = load.failedCount;
    const failed = (failedCount === 0 ? '' : ', ' + failedMsg + failedCount);
    const message = loadedMsg + loadedCount + failed + '.';

    console.log(message);

    this.changeState('game');
  }
}

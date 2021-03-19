import ArrayUtils from '../utils/array-utils.js';
import Timer from './timer.js';

export default class TimerManager {
  constructor(engine) {
    this.engine = engine;

    this.events = new Timer(this.engine)

    this._timers = [];
  }

  create() {
    const timer = new Timer(this.engine);

    this._timers.push(timer);

    return timer;
  }

  add(timer) {
    this._timers.push(timer);

    return this;
  }

  remove(timer) {
    return ArrayUtils.removeByValue(this._timers, timer);
  }

  update() {
    const time = this.engine.elapsedMS;

    this.events.update(time);

    const timers = this._timers;
    const count = timers.length;

    for (let i = 0; i < count; ++i) {
      timers[i].update(time);
    }
  }
}

export default class TimerEvent {
  constructor(timer, delay, time, loop, repeats, cb, context, args) {
    this.timer = timer;
    this.delay = delay;
    this.time = time;
    this.loop = loop;
    this.repeats = repeats;
    this.cb = cb;
    this.context = context;
    this.args = args;
    this.deletePending = false;
  }

  raise() {
    this.cb.apply(this.context, this.args);
  }

  cancel() {
    this.timer.remove(this);
  }
}

import TimerEvent from './timer-event.js';

export default class Timer {
  constructor(engine) {
    this.engine = engine;

    this._events = [];
    this._nextEventTime = 0;
    this._startTime = 0;
    this._running = false;
    this._currentTime = 0;
  }

  start(delay = 0) {
    if (this._running === false) {
      this._running = true;
      this._startTime = delay + this.engine.elapsedMS;

      const events = this._events;
      const count = events.length;

      for (let i = 0; i < count; ++i) {
        const timerEvent = events[i];

        timerEvent.time = startTime + timerEvent.delay;
      }
    }
  }

  clear() {
    this._events = [];
  }

  stop() {
    this._running = false;
    this._events = [];
  }

  once(delay, cb, context) {
    return this._create(cb, context, arguments, delay, false, 0);
  }

  loop(delay, cb, context) {
    return this._create(cb, context, arguments, delay, true, 0);
  }

  repeat(delay, cb, context) {
    return this._create(cb, context, arguments, delay, false, repeats);
  }

  remove(event) {
    const events = this._events;
    const count = events.length;

    for (let i = 0; i < count; ++i) {
      const e = events[i];

      if (e === event) {
        e.deletePending = true;

        return true;
      }
    }

    return false;
  }

  update(time) {
    this._currentTime = time;

    this._deletePending();

    const events = this._events;
    const count = events.length;

    if (count !== 0 && this._nextEventTime < time) {
      let i = 0;
      let pendingCount = 0;

      while (i < count) {
        const timerEvent = events[i];

        if (timerEvent.time < time && timerEvent.deletePending === false) {
          if (timerEvent.loop === true) {
            timerEvent.time += timerEvent.delay;
          } else if (timerEvent.repeats !== 0) {
            timerEvent.time += timerEvent.delay;
            --timerEvent.repeats;
          } else {
            timerEvent.deletePending = true;
            ++pendingCount;
          }

          timerEvent.raise();

          ++i;
        } else {
          break;
        }
      }

      if (count > pendingCount) {
        events.sort(timerEventsComparison);

        this._nextEventTime = events[0].time;
      }
    }
  }

  _create(cb, context, args, delay, loop, repeats) {
    const time = this._currentTime + delay;

    const argsCount = args.length;
    const argsArr = [];

    for (let i = 3; i < argsCount; ++i) {
      argsArr.push(args[i]);
    }

    const timerEvent = new TimerEvent(
      this,
      delay,
      time,
      loop,
      repeats,
      cb,
      context,
      argsArr
    );

    const events = this._events;
    const count = events.length;

    let bottom = 0;
    let top = count;
    let middle;

    while (bottom < count && bottom !== top) {
      middle = ~~((top + bottom) * 0.5);

      if (events[middle].time < time) {
        bottom = middle + 1;
      } else {
        top = middle;
      }
    }

    events.splice(bottom, 0, timerEvent);

    return timerEvent;
  }

  _deletePending() {
    const events = this._events;

    for (let i = events.length - 1; i >= 0; --i) {
      if (events[i].deletePending === true) {
        events.splice(i, 1);
      }
    }
  }
}

function timerEventsComparison(a, b) {
  return a.time - b.time;
}

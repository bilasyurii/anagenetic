export default class Subscription {
  constructor(observable, cb, context, isOnce, args) {
    this._observable = observable;
    this._cb = cb;
    this._context = context;
    this._isOnce = isOnce;
    this._args = args;
    this._active = true;
  }

  post(additionalArgs) {
    if (this._active === true) {
      const _args = this._args;

      if (_args === undefined) {
        this._cb.apply(this._context, additionalArgs);
      } else if (additionalArgs === undefined) {
        this._cb.apply(this._context, _args);
      } else {
        this._cb.apply(this._context, _args.concat(additionalArgs));
      }

      if (this._isOnce === true) {
        this.detach();
      }
    }
  }

  detach() {
    this._active = false;

    return this._observable.remove(this._cb, this._context);
  }

  get isOnce() {
    return this._isOnce;
  }

  get cb() {
    return this._cb;
  }

  get context() {
    return this._context;
  }

  get observable() {
    return this._observable;
  }

  get isActive() {
    return this._active;
  }

  pause() {
    this._active = false;
  }

  resume() {
    this._active = true;
  }
}

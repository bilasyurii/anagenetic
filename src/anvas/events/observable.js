import Subscription from './subscription.js';

export default class Observable {
  constructor() {
    this._subscriptions = [];
    this._active = true;
  }

  add(cb, context) {
    let args;
    const count = arguments.length;

    if (count > 2) {
      args = [];

      for (let i = 0; i < count; ++i) {
        args.push(arguments[i]);
      }
    }

    const subscription = new Subscription(this, cb, context, false, args);

    this._subscriptions.push(subscription);

    return subscription;
  }

  once(cb, context) {
    let args;
    const count = arguments.length;

    if (count > 2) {
      args = [];

      for (let i = 0; i < count; ++i) {
        args.push(arguments[i]);
      }
    }

    const subscription = new Subscription(this, cb, context, true, args);

    this._subscriptions.push(subscription);

    return subscription;
  }

  post() {
    let subscriptions = this._subscriptions;
    const count = subscriptions.length;

    if (count === 0) {
      return;
    }

    const args = Array.prototype.slice.call(arguments);

    for (let i = count - 1; i >= 0; --i) {
      if (this._active === true) {
        subscriptions[i].post(args);
      } else {
        return;
      }
    }
  }

  has(cb, context) {
    const subscriptions = this._subscriptions;
    const count = subscriptions.length;

    for (let i = 0; i < count; ++i) {
      const subscription = subscriptions[i];

      if (subscription.cb === cb && subscription.context === context) {
        return true;
      }
    }

    return false;
  }

  remove(cb, context) {
    const subscriptions = this._subscriptions;
    const count = subscriptions.length;

    for (let i = 0; i < count; ++i) {
      const subscription = subscriptions[i];

      if (subscription.cb === cb && subscription.context === context) {
        subscriptions.splice(i, 1);

        return true;
      }
    }

    return false;
  }

  removeAll(context = undefined) {
    if (context === undefined) {
      this._subscriptions = [];
    } else {
      const subscriptions = this._subscriptions;

      for (let i = subscriptions.length - 1; i >= 0; --i) {
        if (subscriptions[i].context === context) {
          subscriptions.splice(i, 1);
        }
      }
    }
  }

  halt() {
    this._active = false;
  }

  destroy() {
    this._subscriptions = null;
    this._active = false;
  }
}

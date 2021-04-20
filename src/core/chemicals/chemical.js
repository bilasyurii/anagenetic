import Observable from '../../anvas/events/observable';

export default class Chemical {
  constructor(element, count) {
    this.view = null;

    this.onRunOut = new Observable();

    this._alive = true;
    this._element = element;
    this._count = count;
  }

  get isAlive() {
    return this._alive;
  }

  get element() {
    return this._element;
  }

  get count() {
    return this._count;
  }

  takeDamage(amount) {
    const count = this._count;

    let eaten;

    if (count > amount) {
      eaten = amount;
      this._count = count - amount;
    } else {
      eaten = count;
      this._count = 0;
      this._alive = false;
      this.onRunOut.post(this);
    }

    return [
      {
        element: this._element,
        amount: eaten,
      }
    ];
  }
}

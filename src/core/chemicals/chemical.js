export default class Chemical {
  constructor(element, count) {
    this._element = element;
    this._count = count;
  }

  get element() {
    return this._element;
  }

  get count() {
    return this._count;
  }

  eat(amount) {
    const count = this._count;

    if (count < amount) {
      this._count = 0;

      return count;
    }

    this._count = count - amount;

    return amount;
  }
}

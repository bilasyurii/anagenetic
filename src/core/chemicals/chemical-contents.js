import Observable from '../../anvas/events/observable';

export default class ChemicalContents {
  constructor() {
    this.onChanged = new Observable();

    this._elementsAmounts = {};
  }

  getAmount(name) {
    return this._elementsAmounts[name] || 0;
  }

  setAmount(name, amount) {
    this._elementsAmounts[name] = amount;

    this.onChanged.post();

    return this;
  }

  add(name, amount) {
    const elementsAmounts = this._elementsAmounts;

    let current = elementsAmounts[name];

    if (current === undefined) {
      elementsAmounts[name] = amount;

      this.onChanged.post();

      return amount;
    } else {
      current += amount;
      elementsAmounts[name] = current;

      this.onChanged.post();

      return current;
    }
  }

  spend(name, amount) {
    const elementsAmounts = this._elementsAmounts;
    const current = elementsAmounts[name];

    if (current === undefined) {
      return false;
    } else if (current < amount) {
      return false;
    }

    elementsAmounts[name] = current - amount;

    this.onChanged.post();

    return true;
  }
}

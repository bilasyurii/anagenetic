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

  addMany(data) {
    const count = data.length;

    for (let i = 0; i < count; ++i) {
      const item = data[i];

      this.addSingle(item.element.name, item.amount);
    }

    return this;
  }

  addSingle(name, amount, silent) {
    if (amount === 0) {
      return this;
    }

    const elementsAmounts = this._elementsAmounts;

    let current = elementsAmounts[name];

    if (current === undefined) {
      current = amount;
    } else {
      current += amount;
    }

    elementsAmounts[name] = current;

    if (silent !== true) {
      this.onChanged.post();
    }

    return this;
  }

  spend(name, amount, silent) {
    const elementsAmounts = this._elementsAmounts;
    const current = elementsAmounts[name];

    if (current === undefined) {
      return false;
    } else if (current < amount) {
      return false;
    }

    elementsAmounts[name] = current - amount;

    if (silent !== true) {
      this.onChanged.post();
    }

    return true;
  }
}

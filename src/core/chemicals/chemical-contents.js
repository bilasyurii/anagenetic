import Observable from '../../anvas/events/observable';
import ElementRegistry from './element-registry';

export default class ChemicalContents {
  constructor() {
    this.onChanged = new Observable();

    this._elementsAmounts = {};
    this._elementsList = [];
    this._foodResult = [];

    this._initElements();
  }

  forEach(callback) {
    const list = this._elementsList;
    const count = list.length;

    for (let i = 0; i < count; ++i) {
      callback(list[i].value, i);
    }
  }

  updateChanges() {
    this.onChanged.post();

    return this;
  }

  getAmount(name) {
    return this._elementsAmounts[name].value;
  }

  setAmount(name, amount) {
    this._elementsAmounts[name].value = amount;

    this.onChanged.post();

    return this;
  }

  addMany(data) {
    const count = data.length;

    for (let i = 0; i < count; ++i) {
      const item = data[i];
      const amount = item.amount;

      if (amount === 0) {
        continue;
      }

      this.addSingle(item.name, amount, true);
    }

    this.onChanged.post();

    return this;
  }

  addSingle(name, amount, silent) {
    if (amount === 0) {
      return this;
    }

    this._elementsAmounts[name].value += amount;

    if (silent !== true) {
      this.onChanged.post();
    }

    return this;
  }

  spend(name, amount, silent) {
    const amountObj = this._elementsAmounts[name];
    const current = amountObj.value;

    if (current < amount) {
      return false;
    }

    amountObj.value = current - amount;

    if (silent !== true) {
      this.onChanged.post();
    }

    return true;
  }

  divideTo(other) {
    const elementsList = this._elementsList;
    const count = elementsList.length;

    for (let i = 0; i < count; ++i) {
      const obj = elementsList[i];
      const amount = obj.value;
      const half = ~~(amount * 0.5);

      if (half === 0) {
        continue;
      }

      other.addSingle(obj.name, half, true);
      obj.value = amount - half;
    }

    other.updateChanges();

    return this;
  }

  takeDamage(damage) {
    const elementsList = this._elementsList;
    const count = elementsList.length;
    const food = this._foodResult;

    let damageLeft = damage;
    let flag;

    for (let i = 0; i < count; ++i) {
      food[i].amount = 0;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      flag = false;

      for (let i = 0; i < count; ++i) {
        const obj = elementsList[i];
        const value = obj.value;

        if (value === 0) {
          continue;
        }
  
        obj.value = value - 1;
        ++food[i].amount;
        flag = true;

        if (--damageLeft === 0) {
          return {
            food,
            left: 0,
          };
        }
      }

      if (flag === false) {
        break;
      }
    }

    return {
      food,
      left: damageLeft,
    };
  }

  _initElements() {
    const elementsAmounts = this._elementsAmounts;
    const elementsList = this._elementsList;
    const foodResult = this._foodResult;
    const queue = ElementRegistry.getDamageQueue();
    const count = queue.length;

    for (let i = 0; i < count; ++i) {
      const name = queue[i];
      const obj = {
        name,
        value: 0,
      };

      elementsAmounts[name] = obj;
      elementsList.push(obj);
      foodResult.push({
        name,
        amount: 0,
      });
    }
  }
}

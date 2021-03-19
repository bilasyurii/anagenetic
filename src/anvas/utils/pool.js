import Debug from '../debug/debug.js';

export default class Pool {
  constructor(creator, autoCreate = false) {
    this._creator = creator;
    this._autoCreate = false;
    this._available = [];

    this.autoCreate = autoCreate;
  }

  get autoCreate() {
    return this._autoCreate;
  }

  set autoCreate(value) {
    this._autoCreate = value;

    if (value === true) {
      Debug.defined(this._creator);
    }
  }

  populate(amount) {
    const creator = this._creator;

    Debug.defined(creator);

    const available = this._available;
	
    for (let i = 0; i < amount; ++i) {
      available.push(creator());
    }
  }

  hasAvailable() {
    return (this._available.length !== 0);
  }

  release(object) {
    this._available.push(object);
  }

  get() {
    const object = this._available.pop();

    if (object === undefined && this.autoCreate === true) {
      return this._creator();
    }

    return object;
  }
}

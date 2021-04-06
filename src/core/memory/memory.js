export default class Memory {
  constructor() {
    this._data = null;

    this._initData();
  }

  getByte(index) {
    return this._data[index];
  }

  setByte(index, value) {
    this._data[index] = value;

    return this;
  }

  _initData() {
    const data = this._data = [];
    const size = Memory.SIZE;

    for (let i = 0; i < size; ++i) {
      data.push(0);
    }
  }
}

Memory.SIZE = 16;

import Gene from "../genome/gene";

export default class Memory {
  constructor() {
    this._lookup = null;
    this._data = null;

    this._init();
  }

  getByte(index) {
    return this._lookup[index].value;
  }

  setByte(index, value) {
    this._lookup[index].value = value;

    return this;
  }

  _init() {
    this._initData();
    this._initLookup();
  }

  _initData() {
    const data = this._data = [];
    const size = Memory.SIZE;

    for (let i = 0; i < size; ++i) {
      data.push({
        value: 0,
      });
    }
  }

  _initLookup() {
    const lookup = this._lookup = [];
    const lookupSize = Gene.VARIETY;
    const bytes = this._data;
    const bytesCount = bytes.length;

    let byteIndex = 0;

    for (let i = 0; i < lookupSize; ++i) {
      lookup.push(bytes[byteIndex]);
  
      byteIndex = (byteIndex + 1) % bytesCount;
    }
  }
}

Memory.SIZE = 16;

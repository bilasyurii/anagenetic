export default class Registry {
  constructor(isWritable) {
    this._isWritable = isWritable;

    this._value = 0;
  }

  get isWritable() {
    return this._isWritable;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;

    return this;
  }
}

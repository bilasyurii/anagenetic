import Debug from '../../anvas/debug/debug';

export default class Command {
  constructor(name, energy) {
    this._name = name;
    this._energy = (energy === undefined ? 0.05 : energy);
  }

  get energy() {
    return this._energy;
  }

  get name() {
    return this._name;
  }

  execute(context) {
    Debug.abstractMethod();
  }
}

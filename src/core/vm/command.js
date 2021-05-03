import Debug from '../../anvas/debug/debug';

export default class Command {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  execute(context) {
    Debug.abstractMethod();
  }
}

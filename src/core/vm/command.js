import Debug from '../../anvas/debug/debug';

export default class Command {
  constructor(name, mnemonic, argsCount, energy) {
    this.name = name;
    this.mnemonic = mnemonic;
    this.argsCount = argsCount;
    this.energy = (energy === undefined ? 0.05 : energy);
  }

  execute(context) {
    Debug.abstractMethod();
  }
}

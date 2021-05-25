import Debug from '../../anvas/debug/debug';

export default class Command {
  constructor(name, mnemonic, description, argsCount, energy) {
    this.name = name;
    this.mnemonic = mnemonic;
    this.description = description;
    this.argsCount = argsCount;
    this.energy = (energy === undefined ? 0.05 : energy);
  }

  execute() {
    Debug.abstractMethod();
  }
}

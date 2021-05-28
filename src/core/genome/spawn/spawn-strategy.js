import Observable from '../../../anvas/events/observable';
import Math2 from '../../../anvas/utils/math2';
import Genome from '../genome';

export default class SpawnStrategy {
  constructor() {
    this.onSpawn = new Observable();

    this._config = null;
    this._cellIndex = 0;
    this._additionalSpawnEnabled = false;
    this._startingAmount = 0;
    this._genomes = [];
  }

  onCellAdded(cell) {
    if (this._additionalSpawnEnabled === false) {
      return false;
    }

    this._genomes.push(cell.genome);

    return true;
  }

  onCellDied(cell) {
    const cellGenome = cell.genome;
    const genomes = this._genomes;
    const count = genomes.length;

    for (let i = 0; i < count; ++i) {
      if (genomes[i] === cellGenome) {
        genomes.splice(i, 1);
        return;
      }
    }
  }

  reset(config) {
    this._additionalSpawnEnabled = false;
    this._config = config;
    this._cellIndex = 0;
    this._spawnFirstGeneration();
    this._additionalSpawnEnabled = true;
  }

  _spawnFirstGeneration() {
    const config = this._config;
    const genomes = config.genomes;
    const genomesCount = genomes.length;
    const amount = this._startingAmount = config.startingCellsAmount;

    let predefinedIndex = 0;

    if (config.firstAllPredefined === true) {
      for (let i = 0; i < amount; ++i) {
        this.onSpawn.post(genomes[predefinedIndex].clone());
        ++predefinedIndex;

        if (predefinedIndex >= genomesCount) {
          predefinedIndex = 0;
        }
      }
    } else {
      const predefinedCount = Math2.min(amount, genomesCount);

      for (let i = 0; i < predefinedCount; ++i) {
        this.onSpawn.post(genomes[predefinedIndex].clone());
        ++predefinedIndex;
      }

      for (let i = predefinedCount; i < amount; ++i) {
        this.onSpawn.post(Genome.random());
      }
    }
  }

  static onCellAdded(cell) {
    return SpawnStrategy._active.onCellAdded(cell);
  }

  static onCellDied(cell) {
    return SpawnStrategy._active.onCellDied(cell);
  }

  static reset(config) {
    SpawnStrategy._active.reset(config);
  }

  static setActive(strategy) {
    SpawnStrategy._active = strategy;

    const onSpawn = SpawnStrategy._onSpawn;

    strategy.onSpawn.removeAll();
    strategy.onSpawn.add(onSpawn.post, onSpawn);
  }

  static get onSpawn() {
    return SpawnStrategy._onSpawn;
  }
}

SpawnStrategy._active = null;
SpawnStrategy._onSpawn = new Observable();

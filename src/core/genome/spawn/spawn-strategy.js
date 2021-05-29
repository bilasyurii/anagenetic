import Observable from '../../../anvas/events/observable';
import Math2 from '../../../anvas/utils/math2';
import Genome from '../genome';

export default class SpawnStrategy {
  constructor() {
    this.onSpawn = new Observable();

    this._config = null;
    this._cellIndex = 0;
    this._startingAmount = 0;
    this._cells = [];
    this._bestCellsCapacity = 3;
    this._bestCells = [];
  }

  onCellAdded(cell) {
    this._cells.push(cell);

    return true;
  }

  onCellDied(cell) {
    const cells = this._cells;
    const count = cells.length;

    for (let i = 0; i < count; ++i) {
      if (cells[i] === cell) {
        cells.splice(i, 1);
        break;
      }
    }

    const bestCells = this._bestCells;

    bestCells.push(cell);
    bestCells.sort(this._comparator);

    this._bestCells = bestCells.slice(-this._bestCellsCapacity);
  }

  reset(config) {
    this._config = config;
    this._cellIndex = 0;
    this._spawnFirstGeneration();
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

  _getBestCellFromArray(cells) {
    const count = cells.length;

    let bestCell = null;
    let bestScore = -1;

    for (let i = 0; i < count; ++i) {
      const cell = cells[i];
      const score = cell.score;

      if (score > bestScore) {
        bestCell = cell;
        bestScore = score;
      }
    }

    return bestCell;
  }

  _comparator(a, b) {
    return a.score - b.score;
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

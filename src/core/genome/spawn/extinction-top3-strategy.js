import ExtinctionBestSpawnStrategy from './extinction-best-strategy';

export default class ExtinctionTop3SpawnStrategy extends ExtinctionBestSpawnStrategy {
  constructor() {
    super();

    this._topIndex = 0;
  }

  requestSpawn(count) {
    this._topIndex = 0;
    super.requestSpawn(count);
  }

  _getBestGenome() {
    const bestCells = this._bestCells;
    const count = bestCells.length;

    if (count === 0) {
      return this._getBestCellFromArray(this._cells).genome;
    } else {
      let topIndex = this._topIndex;
      const cell = bestCells[topIndex];

      ++topIndex;

      if (topIndex === count) {
        topIndex = 0;
      }

      this._topIndex = topIndex;

      return cell.genome;
    }
  }
}

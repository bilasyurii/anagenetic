import SpawnStrategy from './spawn-strategy';

export default class ExtinctionBestSpawnStrategy extends SpawnStrategy {
  requestSpawn(count) {
    if (this._cells.length === 0 && count >= this._startingAmount) {
      for (let i = 0; i < count; ++i) {
        this._spawnRequestedOnce();
      }
    }
  }

  _spawnRequestedOnce() {
    const genome = this._getBestGenome()
      .clone()
      .mutate();

    this.onSpawn.post(genome, true);
  }

  _getBestGenome() {
    const bestCells = this._bestCells;
    const count = bestCells.length;

    if (count === 0) {
      return this._getBestCellFromArray(this._cells).genome;
    } else {
      return bestCells[count - 1].genome;
    }
  }
}

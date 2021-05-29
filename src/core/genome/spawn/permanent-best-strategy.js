import SpawnStrategy from './spawn-strategy';

export default class PermanentBestSpawnStrategy extends SpawnStrategy {
  _spawnRequestedOnce() {
    if (this._cells.length >= this._startingAmount) {
      return;
    }

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

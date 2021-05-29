import SpawnStrategy from './spawn-strategy';

export default class PermanentBestSpawnStrategy extends SpawnStrategy {
  onCellDied(cell) {
    if (this._cells.length - 1 < this._startingAmount) {
      const genome = this._getBestGenome()
        .clone()
        .mutate();

      this.onSpawn.post(genome);
    }

    super.onCellDied(cell);
  }

  _getBestCell() {
    const bestCells = this._bestCells;
    const count = bestCells.length;

    if (count === 0) {
      return this._getBestCellFromArray(this._cells).genome;
    } else {
      return bestCells[count - 1].genome;
    }
  }
}

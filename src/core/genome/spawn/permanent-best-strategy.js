import SpawnStrategy from './spawn-strategy';
import Genome from '../genome';

export default class PermanentBestSpawnStrategy extends SpawnStrategy {
  onCellDied(cell) {
    super.onCellDied(cell);

    if (this._genomes.length < this._startingAmount) {
      // this.onSpawn.post(this._getBest().clone());
    }
  }

  _getBest() {
    return Genome.random();
    // TODO
  }
}

import Genome from '../genome';
import ExtinctionTop3SpawnStrategy from './extinction-top3-strategy';

export default class ExtinctionMixedSpawnStrategy extends ExtinctionTop3SpawnStrategy {
  constructor() {
    super();

    this._randomFlag = true;
  }

  requestSpawn(count) {
    this._randomFlag = true;
    super.requestSpawn(count);
  }

  _getBestGenome() {
    this._randomFlag = !this._randomFlag;

    if (this._randomFlag === true) {
      return Genome.random();
    }

    return super._getBestGenome();
  }
}

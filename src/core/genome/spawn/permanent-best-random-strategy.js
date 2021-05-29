import Genome from '../genome';
import PermanentBestSpawnStrategy from './permanent-best-strategy';

export default class PermanentBestRandomSpawnStrategy extends PermanentBestSpawnStrategy {
  constructor() {
    super();

    this._randomFlag = true;
  }

  _getBestGenome() {
    this._randomFlag = !this._randomFlag;

    if (this._randomFlag === true) {
      return Genome.random();
    }

    return super._getBestGenome();
  }
}

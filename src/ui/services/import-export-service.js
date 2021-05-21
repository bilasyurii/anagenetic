import { saveAs } from 'file-saver';
import Genome from '../../core/genome/genome';

export default class ImportExportService {
  constructor() {
    this._input = null;
    this._callback = null;

    this._init();
  }
  
  export(content, name) {
    saveAs(new Blob([content]), name);

    return this;
  }

  import(callback) {
    this._callback = callback;
    this._input.click();

    return this;
  }

  importGenome(callback) {
    this.import((data) => callback(Genome.deserialize(data)));
  }

  exportGenome(genome) {
    const name = genome.name || 'unnamed';

    this.export(genome.serialize(), name + '.genome');

    return this;
  }

  _init() {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      this._callback(readerEvent.target.result);
    };

    const input = this._input = document.createElement('input');

    input.type = 'file';

    input.onchange = (e) => {
      const file = e.target.files[0];

      reader.readAsText(file);
    };
  }
}

import { saveAs } from 'file-saver';
import Genome from '../../core/genome/genome';
import ArrayUtils from '../../anvas/utils/array-utils';

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
    this.import((data) => callback(Genome.parse(data)));
  }

  importLibrary(callback) {
    this.import((data) => {
      const json = JSON.parse(data);
      const library = ArrayUtils.map(json, Genome.fromJSON);

      callback(library);
    });
  }

  exportGenome(genome) {
    const name = genome.name || 'unnamed';

    this.export(genome.stringify(), name + '.genome');

    return this;
  }

  exportLibrary(library) {
    const json = ArrayUtils.map(library, function(genome) {
      return genome.json();
    });

    this.export(JSON.stringify(json), 'unnamed.library');

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

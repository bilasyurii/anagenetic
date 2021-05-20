import { saveAs } from 'file-saver';

export default class ImportExportService {
  constructor() {
  }
  
  export(content, name) {
    saveAs(new Blob([content]), name);

    return this;
  }

  import() {
    //

    return this;
  }

  exportGenome(genome) {
    const name = genome.name || 'unnamed';

    this.export(genome.serialize(), name + '.genome');

    return this;
  }
}

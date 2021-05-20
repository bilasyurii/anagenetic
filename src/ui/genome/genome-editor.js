import GenomeViewer from './genome-viewer';
import VM from '../../core/vm/vm';

export default class GenomeEditor extends GenomeViewer {
  constructor(factory, dom) {
    super(factory, dom);

    this._geneSelector = null;

    this._initEditor();
  }

  randomize() {
    this._genome.randomize();
    this._table.updateGenes();
  }

  _initEditor() {
    const selectInput = this.create
      .selectInput()
      .setOptions(VM.getGenesOptions());

    this._geneSelector = this.create
      .formItem()
      .setName('Gene:')
      .setInput(selectInput)
      .injectTo(this, 'gene-selector')
      .hide();

    this._setupEditorEvents();
  }

  _setupEditorEvents() {
    const geneSelector = this._geneSelector;
    const geneSelectInput = geneSelector.getInput();

    geneSelectInput.onChanges.add(() => {
      const value = geneSelector.getValue();
      const geneItem = this._selected;
      const gene = geneItem.getGene();

      gene.value = parseInt(value);
      VM.describeCommandGene(gene);
      geneItem.update();
    });
  }

  _onGeneClicked(geneItem) {
    if (super._onGeneClicked(geneItem) === true) {
      this._geneSelector
        .show()
        .setValue(geneItem.getGene().value);
    } else {
      this._geneSelector.hide();
    }
  }
}

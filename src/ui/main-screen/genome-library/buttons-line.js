import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';

export default class ButtonsLine extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onNewGenome = new Observable();
    this.onClearLibrary = new Observable();
    this.onImportLibrary = new Observable();
    this.onExportLibrary = new Observable();
    this.onImportGenome = new Observable();
    this.onNewSimulation = new Observable();

    this._buttons = {};

    this._initButtons();
  }

  _initButtons() {
    this._initButton('New Genome', this.onNewGenome);
    this._initButton('Clear Library', this.onClearLibrary);
    this._initButton('Import Library', this.onImportLibrary);
    this._initButton('Export Library', this.onExportLibrary);
    this._initButton('Import Genome', this.onImportGenome);
    this._initButton('New Simulation', this.onNewSimulation);
  }

  _initButton(text, observable) {
    this._buttons[text] = this.create
      .button()
      .setText(text)
      .setClick(() => observable.post())
      .addTo(this);
  }
}

import UIElement from '../core/ui-element';
import Observable from '../../anvas/events/observable';
import GenomeLibrary from './genome-library/genome-library';

export default class MainScreenUI extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this._genomeLibrary = null;

    this._init();
  }

  _init() {
    this._initGenomeLibrary();
    this._setupEvents();
  }

  _initGenomeLibrary() {
    this.create
      .custom('genome-library', GenomeLibrary)
      .injectTo(this);
  }

  _setupEvents() {
  }
}

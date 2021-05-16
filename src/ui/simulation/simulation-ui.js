import SidePanel from '../side-panel/side-panel';
import CellPanelContent from './cell-panel/cell-panel-content';
import ZoomControls from './controls/zoom-controls';

export default class SimulationUI {
  constructor(factory, parent) {
    this.create = factory;
    this.parent = parent;

    this._cell = null;

    this._zoomControls = null;
    this._sidePanel = null;
    this._cellPanelContent = null;

    this._init();
  }

  onCellSelected(cell) {
    this._cell = cell;
    this._cellPanelContent.setCell(cell);
    this._sidePanel.show();
  }

  add(child) {
    this.parent.add(child);

    return this;
  }

  _init() {
    this._initZoomControls();
    this._initSidePanel();
    this._initCellPanel();
    this._setupEvents();
  }

  _initZoomControls() {
    const zoom = this._zoomControls = this.create
      .custom('zoom-controls', ZoomControls)
      .addTo(this);

    zoom.onZoomChanged.add((zoomValue) => console.log(zoomValue));
  }

  _initSidePanel() {
    this._sidePanel = this.create
      .custom('side-panel', SidePanel)
      .addTo(this);
  }

  _initCellPanel() {
    this._cellPanelContent = this.create
      .custom('cell-side-panel-content', CellPanelContent)
      .injectTo(this._sidePanel);
  }

  _setupEvents() {
    const sidePanel = this._sidePanel;

    sidePanel.onClose.add(() => console.log('closed'));
    this._cellPanelContent.onClose.add(() => sidePanel.close());
  }
}

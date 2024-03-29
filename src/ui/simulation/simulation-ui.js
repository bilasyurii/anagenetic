import Observable from '../../anvas/events/observable';
import SimulationSidePanel from './panel/simulation-side-panel';
import CellPanelContent from './panel/cell-panel-content';
import OpenPanelButton from './panel/open-panel-button';
import ZoomControls from './controls/zoom-controls';
import MenuPanelContent from './panel/menu-panel-content';
import AnalysisPanelContent from './panel/analysis-panel-content';
import UIElement from '../core/ui-element';
import SpawnStrategy from '../../core/genome/spawn/spawn-strategy';

export default class SimulationUI extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onZoomChanged = new Observable();
    this.onCellDeselected = new Observable();

    this._cell = null;
    this._zoomControls = null;
    this._sidePanel = null;
    this._cellPanelContent = null;
    this._menuPanelContent = null;
    this._analysisPanelContent = null;
    this._openPanelButton = null;

    this._init();
  }

  setWorld(world) {
    this._analysisPanelContent.setWorld(world);
    this._menuPanelContent.setWorld(world);

    return this;
  }

  reset() {
    this._sidePanel.close();
    this._openPanelButton.show();

    return this;
  }

  update() {
    if (this._sidePanel.isOpened() === false) {
      return;
    }

    if (this._cell !== null) {
      this._cellPanelContent.updateInfo();
    }

    this._analysisPanelContent.updateInfo();
  }

  onCellSelected(cell) {
    this._cell = cell;

    const sidePanel = this._sidePanel;

    this._cellPanelContent
      .setCell(cell)
      .injectTo(sidePanel);

    sidePanel.show();
  }

  _init() {
    this._initOpenPanelButton();
    this._initZoomControls();
    this._initSidePanel();
    this._initCellPanel();
    this._initMenuPanel();
    this._initAnalysisPanel();
    this._setupEvents();
  }

  _initOpenPanelButton() {
    this._openPanelButton = this.create
      .custom('open-panel-button', OpenPanelButton)
      .addTo(this);
  }

  _initZoomControls() {
    this._zoomControls = this.create
      .custom('zoom-controls', ZoomControls)
      .addTo(this);
  }

  _initSidePanel() {
    this._sidePanel = this.create
      .custom('side-panel', SimulationSidePanel)
      .addTo(this);
  }

  _initCellPanel() {
    this._cellPanelContent = this.create
      .custom('cell-side-panel-content', CellPanelContent);
  }

  _initMenuPanel() {
    this._menuPanelContent = this.create
      .custom('menu-side-panel-content', MenuPanelContent);
  }

  _initAnalysisPanel() {
    this._analysisPanelContent = this.create
      .custom('analysis-side-panel-content', AnalysisPanelContent);
  }

  _setupEvents() {
    const openPanelButton = this._openPanelButton;
    const sidePanel = this._sidePanel;
    const menuPanelContent = this._menuPanelContent;
    const analysisPanelContent = this._analysisPanelContent;

    this._zoomControls.onZoomChanged.add((zoom) => this.onZoomChanged.post(zoom));

    openPanelButton.onOpenPanel.add(() => {
      sidePanel
        .inject(menuPanelContent)
        .show();
    });

    sidePanel.onShow.add(() => {
      openPanelButton.hide();
    });

    const closePanel = () => {
      sidePanel.close();
      openPanelButton.show();
    };

    this._cellPanelContent.onClose.add(() => {
      closePanel();
      this.onCellDeselected.post();
    });

    menuPanelContent.onClose.add(closePanel);
    menuPanelContent.onAnalysisOpen.add(() => {
      sidePanel
        .inject(analysisPanelContent)
        .show();
    });

    analysisPanelContent.onClose.add(closePanel);
    analysisPanelContent.onBestGenomeRequested.add(this._onBestGenomeRequested, this);
  }

  _onBestGenomeRequested() {
    const bestCell = SpawnStrategy.getBestCell();

    if (!bestCell) {
      return;
    }

    this.onCellSelected(bestCell);
  }
}

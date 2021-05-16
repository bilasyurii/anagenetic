import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';
import $ from 'jquery';

export default class ZoomControls extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onZoomChanged = new Observable();

    this._zoom = 1;

    this._zoomInButton$ = null;
    this._zoomOutButton$ = null;

    this._init();
  }

  getZoom() {
    return this._zoom;
  }

  setZoom(zoom, silent) {
    if (zoom === this._zoom) {
      return this;
    }

    this._zoom = zoom;

    if (silent !== true) {
      this.onZoomChanged.post(zoom);
    }

    return this;
  }

  _init() {
    this._setupNodes();
    this._setupEvents();
    this.setZoom(1, true);
  }

  _setupNodes() {
    const dom$ = this.dom$;

    this._zoomInButton$ = $(dom$.find('.zoom-in')[0]);
    this._zoomOutButton$ = $(dom$.find('.zoom-out')[0]);
  }

  _setupEvents() {
    this._zoomInButton$.click(() => {
      this.setZoom(this._zoom - 0.2);
    });

    this._zoomOutButton$.click(() => {
      this.setZoom(this._zoom + 0.2);
    });
  }
}

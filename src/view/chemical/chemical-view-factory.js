import Math2 from '../../anvas/utils/math2';
import ChemicalView from './chemical-view';

export default class ChemicalViewFactory {
  constructor(engine) {
    this.engine = engine;

    this._bitmaps = {};
  }

  create(chemical) {
    const bmd = this._getBitmap(chemical.element);

    return new ChemicalView(chemical, bmd);
  }

  _getBitmap(element) {
    const name = element.name;
    const bitmaps = this._bitmaps;

    let bmd = bitmaps[name];

    if (bmd === undefined) {
      bmd = bitmaps[name] = this._createBitmap(element.color);
    }

    return bmd;
  }

  _createBitmap(color) {
    const radius = ChemicalView.RADIUS;
    const diameter = radius * 2;

    const bmd = this.engine.create.bitmap(diameter, diameter);
    const ctx = bmd.ctx;

    ctx.arc(radius, radius, radius, 0, Math2.PI2);
    ctx.fillStyle = color;
    ctx.fill();

    return bmd;
  }
}

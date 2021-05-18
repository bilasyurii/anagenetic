import Sprite from '../../anvas/game-objects/sprite';
import Math2 from '../../anvas/utils/math2';

export default class CellSelectorView extends Sprite {
  constructor(engine) {
    const bmd = CellSelectorView._getBitmap(engine);

    super(bmd);

    this.alignPivot();
  }

  static _getBitmap(engine) {
    let bmd = CellSelectorView._bmd;

    if (bmd === null) {
      const radius = 40;
      const size = radius * 2 + 6;
      const offset = size * 0.5;

      bmd = CellSelectorView._bmd = engine.create.bitmap(size, size);

      const ctx = bmd.ctx;

      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.lineWidth = 5;
      ctx.arc(offset, offset, radius, 0, Math2.PI2);
      ctx.stroke();
    }

    return bmd;
  }
}
CellSelectorView._bmd = null;

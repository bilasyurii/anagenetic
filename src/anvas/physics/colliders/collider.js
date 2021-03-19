import Vec2 from '../../geom/vec2.js';

export default class Collider {
  constructor(offset) {
    this.offset = (offset === undefined ? new Vec2() : offset);

    this.position = new Vec2();
  }

  updateTransform(x, y) {
    this.position.set(x, y).addVec(this.offset);
  }
}

import Collider from './collider.js';

export default class CircleCollider extends Collider {
  constructor(radius, offset) {
    super(offset);

    this.isCircle = true;

    this._radius = (radius === undefined ? 10 : radius);
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    if (this._radius !== value) {
      this._radius = value;

      this._dirtyBounds = true;
    }
  }

  _updateBounds() {
    const position = this.position;
    const radius = this._radius;

    this._bounds.set(
      position.x - radius,
      position.y - radius,
      position.x + radius,
      position.y + radius
    );
  }
}

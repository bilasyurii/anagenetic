import Collider from './collider.js';

export default class CircleCollider extends Collider {
  constructor(radius, offset) {
    super(offset);

    const radius_ = (radius === undefined ? 10 : radius);

    this.isCircle = true;

    this._radius = radius_;
    this._radiusSqr = radius_ * radius_;
  }

  get radius() {
    return this._radius;
  }

  get radiusSqr() {
    return this._radiusSqr;
  }

  set radius(value) {
    if (this._radius !== value) {
      this._radius = value;
      this._radiusSqr = value * value;

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

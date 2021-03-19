import Collider from './collider.js';

export default class CircleCollider extends Collider {
  constructor(radius, offset) {
    super(offset);

    this.radius = (radius === undefined ? 10 : radius);
    this.isCircle = true;
  }
}

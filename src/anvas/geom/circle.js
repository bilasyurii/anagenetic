import Math2 from '../utils/math2.js';
import Vec2 from './vec2.js';

export default class Circle {
  constructor(x, y, radius) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
    } else {
      this.x = x;
      this.y = (y === undefined ? x : y);
    }

    this.radius = (radius === undefined ? 0 : radius);
  }

  get area() {
    const radius = this.radius;

    return radius * radius * Math.PI;
  }

  get diameter() {
    return this.radius * 2;
  }

  get position() {
    return new Vec2(this.x, this.y);
  }

  set position(value) {
    this.x = value.x;
    this.y = value.y;
  }

  get center() {
    return new Vec2(this.x, this.y);
  }

  set center(value) {
    this.x = value.x;
    this.y = value.y;
  }

  translate(x, y) {
    this.x += x;
    this.y += (y === undefined ? x : y);

    return this;
  }

  scale(value) {
    this.radius *= value;

    return this;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = (y === undefined ? x : y);

    return this;
  }

  setCenter(x, y) {
    this.x = x;
    this.y = (y === undefined ? x : y);

    return this;
  }

  intersects(circle) {
    const dx = this.x - circle.x;
    const dy = this.y - circle.y;
    const radiuses = this.radius + circle.radius;

    return (dx * dx + dy * dy) < (radiuses * radiuses);
  }

  contains(vec) {
    const dx = this.x - vec.x;
    const dy = this.y - vec.y;
    const radius = this.radius;

    return (dx * dx + dy * dy) < (radius * radius);
  }

  set(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    return this;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.radius = 0;

    return this;
  }

  copyFrom(r) {
    this.x = r.x;
    this.y = r.y;
    this.radius = r.radius;

    return this;
  }

  copyTo(r) {
    r.x = this.x;
    r.y = this.y;
    r.radius = this.radius;

    return this;
  }

  clone() {
    return new Circle(this.x, this.y, this.radius);
  }

  equals(r) {
    return (
      this.x === r.x &&
      this.y === r.y &&
      this.radius === r.radius
    );
  }

  equalsEps(r, eps) {
    return (
      Math2.abs(this.x - r.x) <= eps &&
      Math2.abs(this.y - r.y) <= eps &&
      Math2.abs(this.radius - r.radius) <= eps
    );
  }

  lerp(to, time) {
    this.x += (to.x - this.x) * time;
    this.y += (to.y - this.y) * time;
    this.radius += (to.radius - this.radius) * time;
  }
}

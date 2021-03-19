import Math2 from '../utils/math2.js';
import Vec2 from './vec2.js';
import Bounds from './bounds.js';

export default class Rect {
  constructor(x, y, w, h) {
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
      this.w = 0;
      this.h = 0;
    } else {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
  }

  get left() {
    return this.w > 0 ? this.x : this.x + this.w;
  }

  get right() {
    return this.w > 0 ? this.x + this.w : this.x;
  }

  get top() {
    return this.h > 0 ? this.y : this.y + this.h;
  }

  get bottom() {
    return this.h > 0 ? this.y + this.h : this.y;
  }

  get area() {
    return this.w * this.h;
  }

  get width() {
    return Math2.abs(this.w);
  }

  set width(value) {
    this.w = value * Math2.sign(this.w) || 1;
  }

  get height() {
    return Math2.abs(this.h);
  }

  set height(value) {
    this.h = value * (Math2.sign(this.h) || 1);
  }

  get position() {
    return new Vec2(this.x, this.y);
  }

  set position(value) {
    this.x = value.x;
    this.y = value.y;
  }

  get size() {
    return new Vec2(this.w, this.h);
  }

  set size(value) {
    this.w = value.w;
    this.h = value.h;
  }

  translate(x, y) {
    this.x += x;
    this.y += (y === undefined ? x : y);

    return this;
  }

  scale(x, y) {
    this.w *= x;
    this.h *= (y === undefined ? x : y);

    return this;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = (y === undefined ? x : y);

    return this;
  }

  setSize(w, h) {
    this.w = w;
    this.h = (h === undefined ? w : h);

    return this;
  }

  set(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    return this;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    return this;
  }

  copyFrom(r) {
    this.x = r.x;
    this.y = r.y;
    this.w = r.w;
    this.h = r.h;

    return this;
  }

  copyTo(r) {
    r.x = this.x;
    r.y = this.y;
    r.w = this.w;
    r.h = this.h;

    return this;
  }

  clone() {
    return new Rect(this.x, this.y, this.w, this.h);
  }

  equals(r) {
    return (
      this.x === r.x &&
      this.y === r.y &&
      this.w === r.w &&
      this.h === r.h
    );
  }

  equalsEps(r, eps) {
    return (
      Math2.abs(this.x - r.x) <= eps &&
      Math2.abs(this.y - r.y) <= eps &&
      Math2.abs(this.w - r.w) <= eps &&
      Math2.abs(this.h - r.h) <= eps
    );
  }

  lerp(to, time) {
    this.x += (to.x - this.x) * time;
    this.y += (to.y - this.y) * time;
    this.w += (to.w - this.w) * time;
    this.h += (to.h - this.h) * time;
  }

  isBiggerThan(r) {
    return (this.w * this.h > r.w * r.h);
  }

  isSmallerThan(r) {
    return (this.w * this.h < r.w * r.h);
  }

  isEqualSize(r) {
    return (this.w * this.h === r.w * r.h);
  }

  get longerSide() {
    return (this.w > this.h ? this.w : this.h);
  }

  get shorterSide() {
    return (this.w < this.h ? this.w : this.h);
  }

  get diagonalLength() {
    return Math2.hypot2(this.w, this.h);
  }

  addRect(r) {
    const right = this.right;
    const bottom = this.bottom;

    this.x = Math2.min(this.left, r.left);
    this.y = Math2.min(this.top, r.top);
    this.w = Math2.max(right, r.right) - this.x;
    this.h = Math2.max(bottom, r.bottom) - this.y;

    return this;
  }

  toBounds() {
    return new Bounds(this.left, this.top, this.right, this.bottom);
  }

  toString() {
    return this.x + ' ' + this.y + ' ' + this.w + ' ' + this.h;
  }

  hash() {
    return ~~(x * y + w * y + x + y + w + h);
  }

  static bigger(a, b) {
    return (a.isBiggerThan(b) === true ? a : b);
  }

  static smaller(a, b) {
    return (a.isSmallerThan(b) === true ? a : b);
  }

  static lerp(a, b, time) {
    const aX = a.x;
    const aY = a.y;
    const aW = a.w;
    const aH = a.h;

    return new Vec2(
      aX + (b.x - aX) * time,
      aY + (b.y - aY) * time,
      aW + (b.w - aW) * time,
      aH + (b.h - aH) * time
    );
  }
}

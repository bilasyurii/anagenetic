import Vec2 from './vec2.js';

export default class Transform {
  constructor(a, b, c, d, e, f) {
    if (a === undefined) {
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 0;
      this.e = 1;
      this.f = 0;
    } else {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.e = e;
      this.f = f;
    }
  }

  get inverse() {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    const detInv = 1 / (a * d - b * c);

    return new Transform(
      detInv * a,
      detInv * -b,
      detInv * -c,
      detInv * a,
      detInv * (c * f - d * e),
      detInv * (b * e - a * f)
    );
  }

  combine(t) {
    const a1 = this.a;
    const b1 = this.b;
    const d1 = this.d;
    const e1 = this.e;
  
    this.a = t.a * a1 + t.b * d1;
    this.b = t.a * b1 + t.b * e1;
    this.d = t.d * a1 + t.e * d1;
    this.e = t.d * b1 + t.e * e1;
    this.c = t.c * a1 + t.f * d1 + this.c;
    this.f = t.c * b1 + t.f * e1 + this.f;

    return this;
  }

  combineRaw(a2, b2, c2, d2, e2, f2) {
    const a1 = this.a;
    const b1 = this.b;
    const d1 = this.d;
    const e1 = this.e;
  
    this.a = a2 * a1 + b2 * d1;
    this.b = a2 * b1 + b2 * e1;
    this.d = d2 * a1 + e2 * d1;
    this.e = d2 * b1 + e2 * e1;
    this.c = c2 * a1 + f2 * d1 + this.c;
    this.f = c2 * b1 + f2 * e1 + this.f;

    return this;
  }

  combined(t) {
    return this.clone().combine(t);
  }

  transformXY(x, y) {
    return new Vec2(
      this.a * x + this.b * y + this.c,
      this.d * x + this.e * y + this.f
    );
  }

  transform(vec) {
    const x = vec.x;
    const y = vec.y;

    return new Vec2(
      this.a * x + this.b * y + this.c,
      this.d * x + this.e * y + this.f
    );
  }

  inverseTransform(vec) {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    const id = 1 / ((a * e) + (d * -b));

    const x = vec.x;
    const y = vec.y;

    return new Vec2(
      id * x * e + id * y * -d + id * (f * d - c * e),
      id * y * a + id * x * -b + id * (-f * a + c * b)
    );
  }

  inverseTransformXY(x, y) {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    const id = 1 / ((a * e) + (d * -b));

    return new Vec2(
      id * x * e + id * y * -d + id * (f * d - c * e),
      id * y * a + id * x * -b + id * (-f * a + c * b)
    );
  }

  translateXY(x, y) {
    return this.combineRaw(
      1, 0, x,
      0, 1, y
    );
  }

  translateX(x) {
    return this.combineRaw(
      1, 0, x,
      0, 1, 0
    );
  }

  translateY(y) {
    return this.combineRaw(
      1, 0, 0,
      0, 1, y
    );
  }

  translate(vec) {
    return this.combineRaw(
      1, 0, vec.x,
      0, 1, vec.y
    );
  }

  rotate(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return this.combineRaw(
      cos, -sin, 0,
      sin,  cos, 0
    );
  }

  rotateAround(angle, x, y) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const cos1 = 1 - cos;

    return this.combineRaw(
      cos, -sin, x * cos1 + y * sin,
      sin,  cos, y * cos1 - x * sin
    );
  }

  rotateAroundVec(angle, vec) {
    const x = vec.x;
    const y = vec.y;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const cos1 = 1 - cos;

    return this.combineRaw(
      cos, -sin, x * cos1 + y * sin,
      sin,  cos, y * cos1 - x * sin
    );
  }

  scaleXY(x, y) {
    if (y === undefined) {
      y = x;
    }

    return this.combineRaw(
      x, 0, 0,
      0, y, 0
    );
  }

  scaleX(x) {
    return this.combineRaw(
      x, 0, 0,
      0, 1, 0
    );
  }

  scaleY(y) {
    return this.combineRaw(
      1, 0, 0,
      0, y, 0
    );
  }

  scale(vec) {
    return this.combineRaw(
      vec.x, 0,     0,
      0,     vec.y, 0
    );
  }

  scaleFrom(x, y, fromX, fromY) {
    return this.combineRaw(
      x, 0, fromX * (1 - x),
      0, y, fromY * (1 - y)
    );
  }

  scaleFromVec(x, y, vec) {
    return this.combineRaw(
      x, 0, vec.x * (1 - x),
      0, y, vec.y * (1 - y)
    );
  }

  flipX() {
    return this.combineRaw(
      -1, 0, 0,
       0, 1, 0
    );
  }

  flipY() {
    return this.combineRaw(
      1,  0, 0,
      0, -1, 0
    );
  }

  multiplyScalar(x) {
    this.a *= x;
    this.b *= x;
    this.c *= x;
    this.d *= x;
    this.e *= x;
    this.f *= x;

    return this;
  }

  divideScalar(x) {
    const xInv = 1 / x;

    this.a *= xInv;
    this.b *= xInv;
    this.c *= xInv;
    this.d *= xInv;
    this.e *= xInv;
    this.f *= xInv;

    return this;
  }

  set(a, b, c, d, e, f) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;

    return this;
  }

  setIdentity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 0;
    this.e = 1;
    this.f = 0;

    return this;
  }

  copyTo(t) {
    t.a = this.a;
    t.b = this.b;
    t.c = this.c;
    t.d = this.d;
    t.e = this.e;
    t.f = this.f;

    return this;
  }

  copyFrom(t) {
    this.a = t.a;
    this.b = t.b;
    this.c = t.c;
    this.d = t.d;
    this.e = t.e;
    this.f = t.f;

    return this;
  }

  clone() {
    return new Transform(this.a, this.b, this.c, this.d, this.e, this.f);
  }

  equals(t) {
    return (
      this.a === t.a &&
      this.b === t.b &&
      this.c === t.c &&
      this.d === t.d &&
      this.e === t.e &&
      this.f === t.f
    );
  }

  isIdentity() {
    return (
      this.a === 1 &&
      this.b === 0 &&
      this.c === 0 &&
      this.d === 0 &&
      this.e === 1 &&
      this.f === 0
    );
  }

  isInvertible() {
    return (a * d - b * c) !== 0;
  }

  determinant() {
    return a * d - b * c;
  }

  interpolate(to, time) {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

		this.a = a + (to.a - a) * time;
		this.b = b + (to.b - b) * time;
		this.c = c + (to.c - c) * time;
		this.d = d + (to.d - d) * time;
		this.e = e + (to.e - e) * time;
		this.f = f + (to.f - f) * time;

		return this;
	}

  interpolated(to, time) {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    return new Transform(
      a + (to.a - a) * time,
      b + (to.b - b) * time,
      c + (to.c - c) * time,
      d + (to.d - d) * time,
      e + (to.e - e) * time,
      f + (to.f - f) * time
    );
	}

  toArray() {
    return [
      this.a,
      this.b,
      this.c,
      this.d,
      this.e,
      this.f,
    ];
  }

  toString() {
    return this.toArray() + '';
  }
}

Transform.identity = new Transform();
Transform.tempTransform = new Transform();

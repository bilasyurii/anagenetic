import Vec2 from '../geom/vec2.js';
import Material from './material.js';

export default class RigidBody {
  constructor(gameObject, material) {
    this.gameObject = gameObject;

    if (material === undefined) {
      this.material = Material.default;
    } else {
      this.material = material;
    }

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.drag = 0.0;
    this.collider = null;

    this._force = new Vec2();
    this._mass = 1;
    this._invMass = 1;
  }

  get mass() {
    return this._mass;
  }

  set mass(value) {
    this._mass = value;

    if (value === 0) {
      this._invMass = 0;
    } else {
      this._invMass = 1 / value;
    }
  }

  get invMass() {
    return this._invMass;
  }

  get isStatic() {
    return this._mass === 0;
  }

  addForce(force) {
    this._force.addVec(force);

    return this;
  }

  addForceXY(x, y) {
    this._force.add(x, y);

    return this;
  }

  fixedUpdate(dt) {
    if (this._mass === 0) {
      return;
    }

    const force = this._force.mul(this._invMass * dt);
    const velocity = this.velocity;

    velocity.addVec(force);
    velocity.mul(1 - dt * this.drag);
    this.position.add(velocity.x * dt, velocity.y * dt);

    force.setZero();
  }

  preUpdate() {
    const position = this.position;
    const gameObject = this.gameObject;

    if (gameObject !== undefined) {
      position.copyFrom(gameObject.position);
    }

    const collider = this.collider;

    if (collider !== null) {
      collider.updateTransform(position.x, position.y);
    }
  }

  postUpdate() {
    const position = this.position;

    const gameObject = this.gameObject;

    if (gameObject !== undefined) {
      gameObject.position = position;
    }
  }
}

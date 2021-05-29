import Observable from '../../anvas/events/observable';
import Random from '../utils/random';

export default class Chemical {
  constructor(world, element, count) {
    this.world = world;

    this.onRunOut = new Observable();
    this.isChemical = true;

    this._view = null;
    this._rigidBody = null;
    this._alive = true;
    this._element = element;
    this._count = count;
    this._ttl = element.ttl + 150;
  }

  get isAlive() {
    return this._alive;
  }

  get element() {
    return this._element;
  }

  get count() {
    return this._count;
  }

  get view() {
    return this._view;
  }

  set view(value) {
    this._view = value;
    this._rigidBody = value.rigidBody;
  }

  setPositionXY(x, y) {
    this._view.position.set(x, y);
    this._rigidBody.position.set(x, y);

    return this;
  }

  setPosition(pos) {
    this._view.position.copyFrom(pos);
    this._rigidBody.position.copyFrom(pos);

    return this;
  }

  addForce(force) {
    this._rigidBody.addForce(force);

    return this;
  }

  takeDamage(amount) {
    const count = this._count;

    let eaten;

    if (count > amount) {
      eaten = amount;
      this._count = count - amount;
    } else {
      eaten = count;
      this._count = 0;
      this._alive = false;
      this.onRunOut.post(this);
    }

    return [
      {
        name: this._element.name,
        amount: eaten,
      }
    ];
  }

  die() {
    if (this._alive === false) {
      return;
    }

    this._alive = false;
    this.world.registerEnergyLoss(this._element.energyEquivalent * this._count)
    this.onRunOut.post(this);
  }

  randomizeTTL() {
    this._ttl -= Random.int() % 30;
  }

  update() {
    const ttl = this._ttl - 1;

    if (ttl === 0) {
      this._ttl = 0;
      this.die();
    } else {
      this._ttl = ttl;
    }
  }
}

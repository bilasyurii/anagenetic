import Vec2 from '../geom/vec2.js';

export default class CollisionData {
  constructor(normal, depth) {
    if (normal === undefined) {
      this._normal = new Vec2();
      this._depth = 0;
      this._isColliding = false;
    } else {
      this._normal = normal;
      this._depth = depth;
      this._isColliding = true;
    }

    this._contacts = [];
  }

  get isColliding() {
    return this._isColliding;
  }

  get normal() {
    return this._normal;
  }

  get depth() {
    return this._depth;
  }

  get contacts() {
    return this._contacts;
  }

  addContact(contact) {
    this._contacts.push(contact);

    return this;
  }
}

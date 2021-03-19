import Transform from '../geom/transform.js';
import ArrayUtils from '../utils/array-utils.js';
import GameObject from './game-object.js';

export default class Group extends GameObject {
  constructor() {
    super();

    this.children = [];
  }

  add(child) {
    this.children.push(child);

    const engine = this.engine;

    if (engine !== null) {
      child.engine = engine;
      child.onAddedToScene();
    }

    child.parent = this;

    return child;
  }

  onAddedToScene() {
    super.onAddedToScene();

    const children = this.children;
    const count = children.length;
    const engine = this.engine;

    for (let i = 0; i < count; ++i) {
      const child = children[i];

      child.engine = engine;
      child.onAddedToScene();
    }
  }

  remove(child) {
    ArrayUtils.removeByValue(this.children, child);

    child.parent = null;
  }

  fixedUpdate() {
    const children = this.children;
    const count = children.length;

    for (let i = 0; i < count; ++i) {
      children[i].fixedUpdate();
    }
  }

  getBounds(matrix) {
    const bounds = this._worldBounds;
    const children = this.children;
    const count = children.length;
    const worldTransform = this._world;

    this._world = matrix || this._world;
    this._worldDirty = true;

    bounds.reset();

    for (let i = 0; i < count; ++i) {
      const child = children[i];

      if (child.visible === false) {
        continue;
      }

      bounds.addBounds(child.getBounds());
    }

    this._world = worldTransform;
    this._worldDirty = true;

    for (let i = 0; i < count; ++i) {
      const child = children[i];

      if (child.visible === false) {
        continue;
      }

      child.recursiveUpdateTransform();
    }

    return bounds;
  }

  destroy() {
    const children = this.children;
    const count = children.length;

    for (let i = 0; i < count; ++i) {
      children[i].destroy();
    }

    this.children = null;
  }
}

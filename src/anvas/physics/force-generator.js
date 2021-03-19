import Debug from '../debug/debug.js';

export default class ForceGenerator {
  constructor() {
    this._rigidBodies = null;
  }

  setRigidBodies(rigidBodies) {
    this._rigidBodies = rigidBodies;
  }

  fixedUpdate(dt) {
    Debug.abstractMethod();
  }
}

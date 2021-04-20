import Manifold from './collision/manifold.js';
import CollisionData from './collision/collision-data.js';

export default class Physics {
  constructor(engine, solveIterations, spacePartitioning) {
    this.engine = engine;
    this.solveIterations = solveIterations;

    this._spacePartitioning = spacePartitioning;
    this._dt = engine.dt;
    this._forceGenerators = [];
    this._rigidBodies = [];
    this._bodiesToRemove = [];
  }

  get spacePartitioning() {
    return this._spacePartitioning;
  }

  addRigidBody(body) {
    this._rigidBodies.push(body);
    this._spacePartitioning.addBody(body);

    return this;
  }

  removeRigidBody(body) {
    this._bodiesToRemove.push(body);
    this._spacePartitioning.removeBody(body);

    return this;
  }

  addForceGenerator(forceGenerator) {
    this._forceGenerators.push(forceGenerator);

    forceGenerator.setRigidBodies(this._rigidBodies);
  }

  fixedUpdate() {
    // finding collisions
    const collisions = [];

    this._removePending();

    const pairs = this._spacePartitioning.broadPhase();
    const pairsCount = pairs.length;

    for (let i = 0; i < pairsCount; ++i) {
      const pair = pairs[i];
      const rb1 = pair.rb1;
      const rb2 = pair.rb2;
      const collider1 = rb1.collider;
      const collider2 = rb2.collider;

      if (collider1 === null || collider2 === null) {
        continue;
      }

      if (rb1.isStatic === false || rb2.isStatic === false) {
        const collision = CollisionData.getFromColliders(collider1, collider2);

        if (collision.isColliding === true) {
          collisions.push(new Manifold(rb1, rb2, collision));
        }
      }
    }

    const dt = this._dt;

    // updating force generators
    const forceGenerators = this._forceGenerators;
    const count = forceGenerators.length;

    for (let i = 0; i < count; ++i) {
      forceGenerators[i].fixedUpdate(dt);
    }

    // resolving collisions
    const iterations = this.solveIterations;
    const collisionsCount = collisions.length;

    for (let s = 0; s < iterations; ++s) {
      for (let i = 0; i < collisionsCount; ++i) {
        const manifold = collisions[i];
        const contactsCount = manifold.data.contacts.length;

        for (let c = 0; c < contactsCount; ++c) {
          manifold.applyImpulse();
        }
      }
    }

    const bodies = this._rigidBodies;
    const bodiesCount = bodies.length;

    // updating bodies
    for (let i = 0; i < bodiesCount; ++i) {
      bodies[i].fixedUpdate(dt);
    }

    for (let i = 0; i < collisionsCount; ++i) {
      collisions[i].positionalCorrection();
    }
  }

  preUpdate() {
    const bodies = this._rigidBodies;
    const count = bodies.length;

    for (let i = 0; i < count; ++i) {
      bodies[i].preUpdate();
    }
  }

  postUpdate() {
    const bodies = this._rigidBodies;
    const count = bodies.length;

    for (let i = 0; i < count; ++i) {
      bodies[i].postUpdate();
    }
  }

  _removePending() {
    this._spacePartitioning.removePending();

    const pending = this._bodiesToRemove;

    let pendingCount = pending.length;

    if (pendingCount === 0) {
      return;
    }

    const bodies = this._rigidBodies;

    for (let i = bodies.length - 1; i >= 0; --i) {
      const body = bodies[i];

      for (let j = 0; j < pendingCount; ++j) {
        if (pending[j] === body) {
          bodies.splice(i, 1);
          pending.splice(j, 1);

          if (--pendingCount === 0) {
            this._bodiesToRemove = [];

            return;
          }

          break;
        }
      }
    }

    this._bodiesToRemove = [];
  }
}

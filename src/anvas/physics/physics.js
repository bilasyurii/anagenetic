import Manifold from './manifold.js';
import Collisions from './collisions.js';

export default class Physics {
  constructor(engine, solveIterations) {
    this.engine = engine;
    this.solveIterations = solveIterations;
    
    this._dt = engine.dt;
    this._forceGenerators = [];
    this._rigidBodies = [];
  }

  addRigidBody(body) {
    this._rigidBodies.push(body);
  }

  addForceGenerator(forceGenerator) {
    this._forceGenerators.push(forceGenerator);

    forceGenerator.setRigidBodies(this._rigidBodies);
  }

  fixedUpdate() {
    // finding collisions
    const collisions = [];

    const bodies = this._rigidBodies;
    const bodiesCount = bodies.length;

    for (let i = 0; i < bodiesCount; ++i) {
      const rbI = bodies[i];
      const colliderI = rbI.collider;

      if (colliderI === null) {
        continue;
      }

      for (let j = i + 1; j < bodiesCount; ++j) {
        const rbJ = bodies[j];
        const colliderJ = rbJ.collider;

        if (colliderJ !== null && !(rbI.isStatic === true && rbJ.isStatic === true)) {
          const collision = Collisions.checkCollision(colliderI, colliderJ);

          if (collision.isColliding === true) {
            collisions.push(new Manifold(rbI, rbJ, collision));
          }
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
}

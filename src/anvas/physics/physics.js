import Math2 from '../utils/math2.js';
import CollisionPair from './collision-pair.js';
import Collisions from './collisions.js';

export default class Physics {
  constructor(engine, solveIterations) {
    this.engine = engine;
    this.solveIterations = solveIterations;
    
    this._dt = engine.dt;
    this._forceGenerators = [];
    this._rigidBodies = [];
    this.__applyImpulse = this._applyImpulse.bind(this);
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
            collisions.push(new CollisionPair(rbI, rbJ, collision));
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
    const applyImpulse = this.__applyImpulse;

    for (let s = 0; s < iterations; ++s) {
      for (let i = 0; i < collisionsCount; ++i) {
        const collision = collisions[i];
        const rb1 = collision.rb1;
        const rb2 = collision.rb2;
        const collisionData = collision.data;
        const contactsCount = collisionData.contacts.length;

        for (let c = 0; c < contactsCount; ++c) {
          applyImpulse(rb1, rb2, collisionData);
        }
      }
    }

    // updating bodies

    for (let i = 0; i < bodiesCount; ++i) {
      bodies[i].fixedUpdate(dt);
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

  _applyImpulse(rb1, rb2, data) {
    const invMass1 = rb1.invMass;
    const invMass2 = rb2.invMass;
    const invMasses = invMass1 + invMass2;

    const relativeVelocity = rb2.velocity.clone().subVec(rb1.velocity);
    const relativeNormal = data.normal;
    const dot = relativeVelocity.dot(relativeNormal);

    if (dot > 0) {
      return;
    }

    const e = Math2.min(rb1.material.restitution, rb2.material.restitution);
    let j = (-1 - e) * dot / invMasses;

    if (j !== 0) {
      const contactsCount = data.contacts.length;
  
      if (contactsCount !== 0) {
        j /= contactsCount;
      }
    }

    const impulseX = relativeNormal.x * j;
    const impulseY = relativeNormal.y * j;

    rb1.velocity.sub(impulseX * invMass1, impulseY * invMass1);
    rb2.velocity.add(impulseX * invMass2, impulseY * invMass2);
  }
}

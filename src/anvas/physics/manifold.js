import Math2 from '../utils/math2.js';

export default class Manifold {
  constructor(rb1, rb2, data) {
    this.rb1 = rb1;
    this.rb2 = rb2;
    this.data = data;
  }

  applyImpulse() {
    const rb1 = this.rb1;
    const rb2 = this.rb2;
    const invMass1 = rb1.invMass;
    const invMass2 = rb2.invMass;
    const invMasses = invMass1 + invMass2;

    const relativeVelocity = rb2.velocity.clone().subVec(rb1.velocity);
    const data = this.data;
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

  positionalCorrection() {
    const rb1 = this.rb1;
    const rb2 = this.rb2;
    const invMass1 = rb1.invMass;
    const invMass2 = rb2.invMass;
    const data = this.data;
    const correction = (Math2.max(data.depth - 0.05, 0) / (invMass1 + invMass2)) * 0.01;
    const normal = data.normal;
    const correctedNormalX = normal.x * correction;
    const correctedNormalY = normal.y * correction;

    rb1.position.sub(invMass1 * correctedNormalX, invMass1 * correctedNormalY);
    rb2.position.add(invMass2 * correctedNormalX, invMass2 * correctedNormalY);
  }
}

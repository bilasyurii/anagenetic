import SpacePartitioning from './space-partitioning';

export default class NoPartitioning extends SpacePartitioning {
  constructor() {
    super();

    this._bodies = [];
    this._pairs = [];
    this._bodiesToRemove = [];
  }

  addBody(body) {
    const bodies = this._bodies;
    const count = bodies.length;
    const pairs = this._pairs;

    for (let i = 0; i < count; ++i) {
      pairs.push({
        rb1: body,
        rb2: bodies[i],
      });
    }

    bodies.push(body);

    return this;
  }

  removeBody(body) {
    this._bodiesToRemove.push(body);

    return this;
  }

  removePending() {
    const pending = this._bodiesToRemove;

    let pendingCount = pending.length;

    if (pendingCount === 0) {
      return this;
    }

    const pairs = this._pairs;
    const bodies = this._bodies;

    for (let i = pairs.length - 1; i >= 0; --i) {
      const pair = pairs[i];

      for (let j = 0; j < pendingCount; ++j) {
        const body = pending[j];

        if (pair.rb1 === body || pair.rb2 === body) {
          pairs.splice(i, 1);

          break;
        }
      }
    }

    const count = bodies.length;

    for (let i = 0; i < count; ++i) {
      const body = bodies[i];

      for (let j = 0; j < pendingCount; ++j) {
        if (pending[j] === body) {
          bodies.splice(i, 1);
          pending.splice(j, 1);

          if (--pendingToDeleteCount === 0) {
            this._bodiesToRemove = [];

            return this;
          }

          break;
        }
      }
    }

    this._bodiesToRemove = [];

    return this;
  }

  getInBounds(bounds) {
    return this._bodies;
  }

  getInCircle(circle) {
    const found = [];
    const bodies = this._bodies;
    const count = bodies.length;

    for (let i = 0; i < count; ++i) {
      const body = bodies[i];

      if (circle.contains(body.position) === true) {
        found.push(body);
      }
    }

    return found;
  }

  broadPhase() {
    return this._pairs;
  }
}

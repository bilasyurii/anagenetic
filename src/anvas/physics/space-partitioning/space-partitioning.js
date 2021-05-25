import Debug from '../../debug/debug';

export default class SpacePartitioning {
  addBody() {
    Debug.abstractMethod();
  }

  removeBody() {
    Debug.abstractMethod();
  }

  removePending() {
    Debug.abstractMethod();
  }

  getInBounds() {
    Debug.abstractMethod();
  }

  getInCircle() {
    Debug.abstractMethod();
  }

  broadPhase() {
    Debug.abstractMethod();
  }

  reset() {
    Debug.abstractMethod();
  }
}

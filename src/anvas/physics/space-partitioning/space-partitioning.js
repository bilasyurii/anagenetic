import Debug from '../../debug/debug';

export default class SpacePartitioning {
  addBody(body) {
    Debug.abstractMethod();
  }

  removeBody(body) {
    Debug.abstractMethod();
  }

  removePending() {
    Debug.abstractMethod();
  }

  getInBounds(bounds) {
    Debug.abstractMethod();
  }

  getInCircle(circle) {
    Debug.abstractMethod();
  }

  broadPhase() {
    Debug.abstractMethod();
  }
}

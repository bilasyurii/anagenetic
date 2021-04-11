import Group from '../../anvas/game-objects/group';
import RigidBody from '../../anvas/physics/rigid-body';
import CircleCollider from '../../anvas/physics/colliders/circle-collider';

export default class ChemicalView extends Group {
  constructor(chemical, bmd) {
    super();

    this.chemical = chemical;

    this._bmd = bmd;

    this._view = null;
  }

  onAddedToScene() {
    super.onAddedToScene();

    this._initView();
    this._initBody();
  }

  _initView() {
    const engine = this.engine;
    const view = this._view = engine.create.sprite(this._bmd);

    view.alignPivot();

    this.add(view);
  }

  _initBody() {
    const body = this.rigidBody = new RigidBody(this);

    body.drag = 0.5;
    body.collider = new CircleCollider(ChemicalView.RADIUS);

    this.engine.physics.addRigidBody(body);
  }
}

ChemicalView.RADIUS = 5;

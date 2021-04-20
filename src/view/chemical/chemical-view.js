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

  get dataObject() {
    return this.chemical;
  }

  onAddedToScene() {
    super.onAddedToScene();

    this._initView();
    this._initBody();
    this._setupEvents();
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
    body.mass = 0.1;

    this.engine.physics.addRigidBody(body);
  }

  _setupEvents() {
    this.chemical.onRunOut.add(this._onRunOut, this);
  }

  _onRunOut() {
    const parent = this.parent;

    if (parent !== null) {
      parent.remove(this);
      this.engine.physics.removeRigidBody(this.rigidBody);
    }
  }
}

ChemicalView.RADIUS = 5;

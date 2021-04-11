import Group from '../../anvas/game-objects/group';
import Math2 from '../../anvas/utils/math2';
import RigidBody from '../../anvas/physics/rigid-body';
import CircleCollider from '../../anvas/physics/colliders/circle-collider';

export default class ChemicalView extends Group {
  constructor(chemical) {
    super();

    this.chemical = chemical;

    this._view = null;
  }

  onAddedToScene() {
    super.onAddedToScene();

    this._initView();
    this._initBody();
  }

  _initView() {
    const engine = this.engine;
    const bmd = ChemicalView._getBitmap(engine);
    const view = this._view = engine.create.sprite(bmd);

    view.alignPivot();

    this.add(view);
  }

  _initBody() {
    const body = this.rigidBody = new RigidBody(this);

    body.drag = 0.5;
    body.collider = new CircleCollider(ChemicalView.RADIUS);

    this.engine.physics.addRigidBody(body);
  }

  static _getBitmap(engine) {
    let bmd = ChemicalView._bmd;

    if (bmd === null) {
      const radius = ChemicalView.RADIUS;
      const diameter = radius * 2;

      bmd = ChemicalView._bmd = engine.create.bitmap(diameter, diameter);

      const ctx = bmd.ctx;

      ctx.arc(radius, radius, radius, 0, Math2.PI2);
      ctx.fillStyle = 'rgb(0, 255, 0)';
      ctx.fill();
    }

    return bmd;
  }
}

ChemicalView.RADIUS = 5;
ChemicalView._bmd = null;

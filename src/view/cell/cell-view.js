import Group from '../../anvas/game-objects/group';
import Math2 from '../../anvas/utils/math2';
import RigidBody from '../../anvas/physics/rigid-body';
import CircleCollider from '../../anvas/physics/colliders/circle-collider';

export default class CellView extends Group {
  constructor(cell) {
    super();

    this.cell = cell;

    this._view = null;
  }

  fixedUpdate() {
    this.rigidBody.addForce(this.cell.force);
  }

  onAddedToScene() {
    super.onAddedToScene();

    this._initView();
    this._initBody();
    this._setupEvents();
    this._onRadiusChanged(this.cell.radius);
  }

  _initView() {
    const engine = this.engine;
    const bmd = CellView._getBitmap(engine);
    const view = this._view = engine.create.sprite(bmd);

    view.alignPivot();

    this.add(view);
  }

  _initBody() {
    const body = this.rigidBody = new RigidBody(this);

    body.collider = new CircleCollider(this.cell.radius);

    this.engine.physics.addRigidBody(body);
  }

  _setupEvents() {
    this.cell.onRadiusChanged.add(this._onRadiusChanged, this);
  }

  _onRadiusChanged(radius) {
    const view = this._view;

    const size = radius * 2;

    view.width = size;
    view.height = size;

    this.rigidBody.collider.radius = radius;
  }

  static _getBitmap(engine) {
    let bmd = CellView._bmd;

    if (bmd === null) {
      const radius = 150;
      const diameter = radius * 2;

      bmd = CellView._bmd = engine.create.bitmap(diameter, diameter);

      const ctx = bmd.ctx;

      ctx.arc(radius, radius, radius, 0, Math2.PI2);
      ctx.fillStyle = 'rgb(255, 255, 0)';
      ctx.fill();
    }

    return bmd;
  }
}

CellView._bmd = null;

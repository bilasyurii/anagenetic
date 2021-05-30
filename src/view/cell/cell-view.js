import Group from '../../anvas/game-objects/group';
import Math2 from '../../anvas/utils/math2';
import RigidBody from '../../anvas/physics/rigid-body';
import CircleCollider from '../../anvas/physics/colliders/circle-collider';
import Observable from '../../anvas/events/observable';

export default class CellView extends Group {
  constructor(cell) {
    super();

    this.cell = cell;
    this.onSelected = new Observable();

    this._view = null;
    this._selectorView = null;

    this.position.copyFrom(cell.position);
  }

  get dataObject() {
    return this.cell;
  }

  select(selectorView) {
    this._selectorView = selectorView;
    this.add(selectorView);

    return this;
  }

  preUpdate() {
    const cell = this.cell;
    const body = this.rigidBody;

    cell.position.copyFrom(body.position);
    cell.velocity.copyFrom(body.velocity);
  }

  update() {
    this.rigidBody.addForce(this.cell.force);
  }

  destroy() {
    const cell = this.cell;
    const view = this._view;
    const input = view && view.input;

    cell.onSizeChanged.remove(this._onSizeChanged, this);
    cell.onDied.remove(this._onDied, this);

    if (input) {
      this._view.input.onDown.remove(this._onInputDown, this);
    }

    super.destroy();
  }

  onAddedToScene() {
    super.onAddedToScene();

    this._initView();
    this._initBody();
    this._setupEvents();

    const cell = this.cell;
    this._onSizeChanged(cell.mass, cell.radius);
  }

  _initView() {
    const engine = this.engine;
    const bmd = CellView._getBitmap(engine);
    const view = this._view = engine.create.sprite(bmd);

    view.alignPivot();
    view.addInput();

    this.add(view);
  }

  _initBody() {
    const body = this.rigidBody = new RigidBody(this);

    body.drag = 0.5;
    body.collider = new CircleCollider(this.cell.radius);

    this.engine.physics.addRigidBody(body);
  }

  _setupEvents() {
    const cell = this.cell;

    cell.onSizeChanged.add(this._onSizeChanged, this);
    cell.onDied.add(this._onDied, this);

    this._view.input.onDown.add(this._onInputDown, this);
  }

  _onSizeChanged(mass, radius) {
    const view = this._view;
    const rigidBody = this.rigidBody;
    const size = radius * 2;

    view.width = size;
    view.height = size;

    rigidBody.mass = mass;
    rigidBody.collider.radius = radius;
  }

  _onDied() {
    const parent = this.parent;
    const selector = this._selectorView;

    if (selector !== null) {
      this.remove(selector);
      selector.visible = false;
      this._selectorView = null;
    }

    if (parent !== null) {
      parent.remove(this);
      this.engine.physics.removeRigidBody(this.rigidBody);
    }
  }

  _onInputDown() {
    this.onSelected.post(this);
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

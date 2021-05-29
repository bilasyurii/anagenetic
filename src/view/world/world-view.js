import Group from '../../anvas/game-objects/group';
import RigidBody from '../../anvas/physics/rigid-body';
import AABBCollider from '../../anvas/physics/colliders/aabb-collider';
import Vec2 from '../../anvas/geom/vec2';

export default class WorldView extends Group {
  constructor(world) {
    super();

    this.world = world;
    this.walls = [];

    world.view = this;
  }

  onAddedToScene() {
    super.onAddedToScene();

    this._initWalls();
  }

  fixedUpdate() {
    super.fixedUpdate();

    this.world.update();
  }

  _initWalls() {
    const engine = this.engine;
    const create = engine.create;
    const bmd = WorldView._getBitmap(engine);

    this.world.forEachWall((wall) => {
      const width = wall.width;
      const height = wall.height;
      const view = create.sprite(bmd);

      view.width = width;
      view.height = height;
      view.dataObject = wall;

      view.position.set(wall.minX, wall.minY);

      const body = view.rigidBody = new RigidBody(view);
      const halfSize = new Vec2(width * 0.5, height * 0.5);

      body.mass = 0;
      body.collider = new AABBCollider(halfSize, halfSize.clone());

      engine.physics.addRigidBody(body);

      this.add(view);
    });
  }

  static _getBitmap(engine) {
    let bmd = WorldView._bmd;

    if (bmd === null) {
      const size = 10;

      bmd = WorldView._bmd = engine.create.bitmap(size, size);

      const ctx = bmd.ctx;

      ctx.fillStyle = 'rgb(50, 50, 50)';
      ctx.fillRect(0, 0, size, size);
    }

    return bmd;
  }
}

WorldView._bmd = null;
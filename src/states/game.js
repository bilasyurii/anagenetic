import State from '../anvas/state/state.js';
import Group from '../anvas/game-objects/group.js';
import Renderable from '../anvas/rendering/renderable.js';
import Math2 from '../anvas/utils/math2.js';
import RigidBody from '../anvas/physics/rigid-body.js';
import CircleCollider from '../anvas/physics/colliders/circle-collider.js';
import AABBCollider from '../anvas/physics/colliders/aabb-collider.js';
import Vec2 from '../anvas/geom/vec2.js';
import CellView from '../view/cell/cell-view.js';
import World from '../core/world/world.js';
import WorldView from '../view/world/world-view.js';
import Genome from '../core/genome/genome.js';
import ChemicalElement from '../core/chemicals/chemical-element.js';
import ChemicalViewFactory from '../view/chemical/chemical-view-factory.js';
import ElementRegistry from '../core/chemicals/element-registry.js';

export default class GameState extends State {
  onEnter() {
    const engine = this.engine;

    const spacePartitioning = engine.physics.spacePartitioning;
    const world = new World(spacePartitioning, new Vec2(700, 400));
    const worldView = new WorldView(world);

    worldView.position.set(100, 100);

    engine.add(worldView);

    ElementRegistry.register(new ChemicalElement('billanium', 4, 'rgb(0, 0, 255)'));
    ElementRegistry.register(new ChemicalElement('hillagen', 3, 'rgb(255, 0, 0)'));
    ElementRegistry.register(new ChemicalElement('chubium', 1, 'rgb(0, 255, 0)'));
    ElementRegistry.register(new ChemicalElement('dion', 2, 'rgb(255, 0, 255)'));
    ElementRegistry.initLookup();
    ElementRegistry.initDamageQueue();

    const chemicalViewFactory = new ChemicalViewFactory(engine);

    world.onCellAdded.add((cell) => {
      const cellView = new CellView(cell);

      worldView.add(cellView);

      cell.view = cellView;
    });

    world.onChemicalAdded.add((chemical) => {
      const chemicalView = chemicalViewFactory.create(chemical);

      worldView.add(chemicalView);

      chemical.view = chemicalView;
    });

    const cell = world.create.cell();

    cell.genome = Genome.random();
    cell.chemicals.addSingle('hillagen', 20);
    cell
      .addEnergy(20)
      .setPositionXY(100, 100);

    // const cell2 = world.create.cell();

    // cell2.genome = cell.genome.clone();
    // cell2.setPositionXY(130, 100);

    // world.create.chemical(element, 10)
    //   .setPositionXY(130, 100);

    return;
    const group = new Group();

    group.position.set(200);

    const rect = new Rectangle();

    rect.x = 100;
    rect.y = 300;
    rect.degrees = 15;
    rect.pivot.set(50, 50);
    rect.localTransform.flipX();

    engine.time.events.loop(10, () => {
      rect.rotation += 0.01;
      rect.scaleX = Math.sin(engine.elapsed * 5) * 0.25 + 0.75;
    });

    engine.add(rect);
    engine.add(group);

    const event = engine.time.events.loop(50, (arg) => {
      console.log(arg);
    }, undefined, 5);

    function createCircle(radius, color, mass) {
      const bmd = engine.create.bitmap(300, 300);
      const spr = engine.add(engine.create.sprite(bmd));

      const ctx = bmd.ctx;

      ctx.arc(150, 150, 150, 0, Math2.PI2);
      ctx.fillStyle = color;
      ctx.fill();

      spr.width = radius * 2;
      spr.scale.y = spr.scale.x;

      spr.alignPivot();

      const rb = spr.rigidBody = new RigidBody(spr);

      rb.mass = mass;
      rb.collider = new CircleCollider(radius);

      engine.physics.addRigidBody(rb);

      return spr;
    }

    const spr1 = createCircle(50, 'magenta', 3);
    const spr2 = createCircle(25, 'red', 1);

    spr1.position.set(300, 300);
    spr2.position.set(500, 300);

    spr1.rigidBody.addForceXY(16000, 8000);
    spr2.rigidBody.addForceXY(-4000, 2000);

    const r = engine.add(new Rectangle());

    // r.pivot.set(50, 50);
    r.position.set(440, 350);

    const rRb = r.rigidBody = new RigidBody(r);

    rRb.mass = 0;
    rRb.collider = new AABBCollider(new Vec2(50), new Vec2(50));

    engine.physics.addRigidBody(rRb);

    engine.time.events.once(500, () => {
      const sprite = engine.create.sprite('test');

      sprite.rotation = 20;
      sprite.addInput();

      engine.input.onDown.add(() => {
        sprite.input.toggle();
      });

      sprite.input.onOver.add(() => {
        sprite2.visible = false;    
      });

      sprite.input.onOut.add(() => {
        sprite2.visible = true;    
      });

      group.add(sprite);

      event.cancel();

      const bmd = engine.create.bitmap(100, 100);
      const sprite2 = engine.create.sprite(bmd);

      sprite2.pivot.set(50);

      group.add(sprite2);

      const ctx = bmd.ctx;

      ctx.arc(50, 50, 30, 0, Math2.PI2);
      ctx.fillStyle = 'green';
      ctx.fill();

      ctx.fillStyle = 'cyan';
      ctx.fillRect(50, 45, 45, 10);

      engine.time.events.loop(10, () => {
        sprite2.rotation += 0.05;

        sprite.right = sprite2.left;
        sprite.bottom = sprite2.top;

        rect.position.set(group.right, group.bottom);
      });
    });
  }
}

class Rectangle extends Renderable {
  render(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, 0, 100, 100);
  }

  fixedUpdate() {
    // console.log(this.engine.dt);
  }
}

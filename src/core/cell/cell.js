import Observable from '../../anvas/events/observable';
import Vec2 from '../../anvas/geom/vec2';
import ChemicalContents from '../chemicals/chemical-contents';
import ElementRegistry from '../chemicals/element-registry';
import Memory from '../memory/memory';
import RegistryManager from '../memory/registry-manager';
import VMUtils from '../utils/vm-utils';
import VM from '../vm/vm';

export default class Cell {
  constructor(world) {
    this.world = world;

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.force = new Vec2();
    this.onRadiusChanged = new Observable();

    this._radius = 0;
    this._rotation = 0;
    this._energy = 0;
    this._energyCapacity = 0;

    this._view = null;
    this._rigidBody = null;
    this._genome = null;
    this._memory = null;
    this._registries = null;
    this._chemicals = null;
    this._vm = null;

    this._init();
  }

  get radius() {
    return this._radius;
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    this._rotation = value;

    return this;
  }

  get energy() {
    return this._energy;
  }

  set energy(value) {
    this._energy = value;
  }

  get genome() {
    return this._genome;
  }

  set genome(genome) {
    this._genome = genome;
    this._vm.genome = genome;
  }

  get memory() {
    return this._memory;
  }

  get registries() {
    return this._registries;
  }

  get vm() {
    return this._vm;
  }

  get view() {
    return this._view;
  }

  set view(value) {
    this._view = value;
    this._rigidBody = value.rigidBody;
  }

  setPositionXY(x, y) {
    this.position.set(x, y);
    this._view.position.set(x, y);
    this._rigidBody.position.set(x, y);

    return this;
  }

  setPosition(pos) {
    this.position.copyFrom(pos);
    this._view.position.copyFrom(pos);
    this._rigidBody.position.copyFrom(pos);

    return this;
  }

  addForce(force) {
    this._rigidBody.addForce(force);

    return this;
  }

  preUpdate() {
    this._view.preUpdate();
    this.force.setZero();
  }

  update() {
    this._vm.execute();
    this._view.update();
  }

  move(angle) {
    const speed = 50;
    const x = Math.cos(angle) * speed;
    const y = Math.sin(angle) * speed;

    this.force.add(x, y);
  }

  eat(angle) {
    const target = this.world.getClosestTarget(this, angle);

    if (target !== null) {
      const foodReceived = target.takeDamage(this._radius);

      this._chemicals.addMany(foodReceived);
    }
  }

  spawnChemical(elementCode, angle) {
    const element = ElementRegistry.get(elementCode);
    const chemical = this.world.create.chemical(element, 10);
    const force = VMUtils
      .getDirection(angle, Vec2.temp)
      .mul(500);

    chemical
      .setPosition(this.position)
      .addForce(force);
  }

  divide() {
    const cell = this.world.create.cell();
    const force = VMUtils
      .randomDirection(Vec2.temp)
      .mul(500);

    cell.genome = this.genome.clone();
    cell
      .setPosition(this.position)
      .addForce(force);
  }

  check(angle) {
    const targets = this.world.getTargets(this.position, angle, Cell.ANGLE_THRESHOLD);

    if (targets.length === 0) {
      return false;
    }

    const view = this._view;

    if (targets.length === 1) {
      return targets[0].body.gameObject !== view;
    }

    return (
      targets[0].body.gameObject !== view ||
      targets[1].body.gameObject !== view
    );
  }

  takeDamage(damage) {
    //TODO
  }

  _init() {
    this._initMemory();
    this._initRegistries();
    this._initChemicals();
    this._initVM();
    this._updateRadius(true);
  }

  _initMemory() {
    this._memory = new Memory();
  }

  _initRegistries() {
    this._registries = new RegistryManager();
  }

  _initChemicals() {
    const chemicals = this._chemicals = new ChemicalContents();

    chemicals.onChanged.add(this._onChemicalsChanged, this);
  }

  _initVM() {
    this._vm = new VM(this);
  }

  _onChemicalsChanged() {
    this._updateEnergyCapacity();
    this._updateRadius();
    // this._updateChemicalsRegistries();
  }

  _updateEnergyCapacity() {
    // TODO
  }

  _updateRadius(silent = false) {
    // TODO
    this._radius = 10;

    if (silent === false) {
      this.onRadiusChanged.post(this._radius);
    }
  }
}

Cell.VISION_RADIUS = 50;
Cell.ANGLE_THRESHOLD = (256 / 8) * VMUtils.VM2RAD;

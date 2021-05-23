import Observable from '../../anvas/events/observable';
import Vec2 from '../../anvas/geom/vec2';
import ChemicalContents from '../chemicals/chemical-contents';
import ElementRegistry from '../chemicals/element-registry';
import Memory from '../memory/memory';
import RegistryManager from '../memory/registry-manager';
import VMUtils from '../utils/vm-utils';
import VM from '../vm/vm';
import Gene from '../genome/gene';

export default class Cell {
  constructor(world) {
    this.world = world;

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.force = new Vec2();
    this.onRadiusChanged = new Observable();
    this.onDied = new Observable();
    this.isCell = true;

    this._radius = 0;
    this._damage = 10;
    this._armor = 10;
    this._rotation = 0;
    this._energy = 0;
    this._energyCapacity = 0;
    this._ttl = Gene.MAX_VAL;
    this._isAlive = true;
    this._directionAngle = 0;
    this._vmUpdated = false;

    this._view = null;
    this._rigidBody = null;
    this._genome = null;
    this._memory = null;
    this._registries = null;
    this._chemicals = null;
    this._vm = null;

    this._init();
  }

  get isAlive() {
    return this._isAlive;
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

  get energyCapacity() {
    return this._energyCapacity;
  }

  get ttl() {
    return this._ttl;
  }

  get armor() {
    return this._armor;
  }

  get damage() {
    return this._damage;
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

  get chemicals() {
    return this._chemicals;
  }

  reduceEnergy(amount) {
    const newEnergy = this._energy - amount;

    if (newEnergy > 0 || this._vmUpdated === false) {
      this._energy = newEnergy;
    } else {
      this.die();
    }

    return this;
  }

  addEnergy(amount) {
    const newEnergy = this._energy + amount;
    const capacity = this._energyCapacity;

    if (newEnergy > capacity) {
      this._energy = capacity;
    } else {
      this._energy = newEnergy;
    }

    return this;
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
    this.force.addVec(force);

    return this;
  }

  preUpdate() {
    this._view.preUpdate();
    this.force.setZero();
    this._vmUpdated = false;
  }

  update() {
    this._updateStats();
    this._updateRegistries();
    this._vm.execute();
    this._view.update();
    this._vmUpdated = true;

    if (this._energy <= 0) {
      this.die();
    }
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
      const foodReceived = target.takeDamage(this._damage);

      this._chemicals.addMany(foodReceived);
    }
  }

  spawnChemical(elementCode, angle) {
    const element = ElementRegistry.get(elementCode);

    if (this._chemicals.spend(element.name, 1) === false) {
      return false;
    }

    const chemical = this.world.create.chemical(element, 1);
    const force = VMUtils
      .getDirection(angle, Vec2.temp)
      .mul(500);

    chemical
      .setPosition(this.position)
      .addForce(force);

    return true;
  }

  divide() {
    const chemicals = this._chemicals;

    // 10 hillagen is needed to make new cell's body
    if (chemicals.spend('hillagen', 10, true) === false) {
      return false;
    }

    const currentEnergy = this._energy;

    if (currentEnergy < 20) {
      return false;
    }

    const energy = (currentEnergy - 10) * 0.5;

    this._energy = energy;
    this.world.registerEnergyLoss(10);

    const cell = this.world.create.cell();

    chemicals.divideTo(cell.chemicals);
    this.memory.copyTo(cell.memory);

    cell.genome = this.genome
      .clone()
      .mutate();

    const force = VMUtils
      .randomDirection(Vec2.temp)
      .mul(500);

    cell
      .addEnergy(energy)
      .setPosition(this.position)
      .addForce(force);

    return true;
  }

  compare(angle) {
    const target = this.world.getClosestTarget(this, angle);

    if (target === null || target.isCell !== true) {
      return Gene.MAX_VAL;
    }

    return this.genome.compare(target.genome);
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

  distinguish(angle) {
    const target = this.world.getClosestTarget(this, angle);

    if (target === null) {
      return 0;
    }

    if (target.isCell === true) {
      return 1;
    }

    if (target.isChemical === true) {
      return 2;
    }

    return 3; // wall
  }

  takeDamage(damage) {
    let reducedDamage = damage - this._armor;

    if (reducedDamage < 1) {
      reducedDamage = 1;
    }

    const { food, left } = this._chemicals.takeDamage(reducedDamage);

    if (left !== 0) {
      this.reduceEnergy(left);
    }

    return food;
  }

  die() {
    this._isAlive = false;
    this.world.registerEnergyLoss(this._energy);
    this.onDied.post(this);
  }

  destroy() {
    this.view.destroy();
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
    this._energyCapacity = 255;
  }

  _updateRadius(silent = false) {
    // TODO
    this._radius = 10;

    if (silent === false) {
      this.onRadiusChanged.post(this._radius);
    }
  }

  _updateStats() {
    const ttl = this._ttl - 1;

    if (ttl === 0) {
      this.die();
      return;
    } else {
      this._ttl = ttl;
    }

    this._directionAngle = VMUtils.angleFromVec(this._rigidBody.velocity);
  }

  _updateRegistries() {
    const registries = this._registries;

    registries
      .setTTL(this._ttl)
      .setRndTick(this.world.rndTick)
      .setDirection(this._directionAngle)
      .setEnergy(this._energy);
  }
}

Cell.VISION_RADIUS = 50;
Cell.ANGLE_THRESHOLD = (256 / 8) * VMUtils.VM2RAD;

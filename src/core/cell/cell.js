import Observable from '../../anvas/events/observable';
import Vec2 from '../../anvas/geom/vec2';
import ChemicalContents from '../chemicals/chemical-contents';
import ElementRegistry from '../chemicals/element-registry';
import Memory from '../memory/memory';
import RegistryManager from '../memory/registry-manager';
import VMUtils from '../utils/vm-utils';
import VM from '../vm/vm';
import Gene from '../genome/gene';
import Math2 from '../../anvas/utils/math2';
import SimulationConfig from '../utils/simulation-config';

export default class Cell {
  constructor(world) {
    this.world = world;

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.force = new Vec2();
    this.onSizeChanged = new Observable();
    this.onDied = new Observable();
    this.isCell = true;
    this.generation = 0;

    this._mass = 0;
    this._radius = 0;
    this._damage = 0;
    this._armor = 0;
    this._rotation = 0;
    this._energy = 0;
    this._energyCapacity = 0;
    this._speed = 0;
    this._ttl = Gene.MAX_VAL;
    this._isAlive = true;
    this._directionAngle = 0;
    this._vmUpdated = false;
    this._descendants = 0;

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

  get mass() {
    return this._mass;
  }

  get radius() {
    return this._radius;
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    this._rotation = value;
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

  get descendants() {
    return this._descendants;
  }

  get speed() {
    return this._speed;
  }

  get score() {
    const descendants = this._descendants;
    const descendantsScore = (descendants < 2 ? descendants * 50 : descendants * 100);
    const generationScore = this.generation * 5;

    let ttlScore;

    if (this._isAlive === true) {
      ttlScore = 0;
    } else {
      ttlScore = 255 - this._ttl;
    }

    let score = descendantsScore + generationScore + ttlScore;

    if (descendants === 0) {
      score *= 0.25;
    }

    return score;
  }

  reduceEnergy(amount) {
    const newEnergy = this._energy - amount;

    if (newEnergy > 0 || this._vmUpdated === false) {
      this._energy = newEnergy;
    } else {
      this._energy = 0;
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
    const speed = this._speed;
    const x = Math.cos(angle) * speed;
    const y = Math.sin(angle) * speed;

    this.force.add(x, y);
  }

  eat(angle) {
    const target = this.world.getClosestTarget(this, angle);

    if (target !== null) {
      let foodReceived;

      try {
        foodReceived = target.takeDamage(this._damage);
      } catch (e) {
        console.error(target);
        console.error(target.takeDamage);
        throw e;
      }

      this._chemicals.addMany(foodReceived);
    }
  }

  spawnChemical(elementCode, angle, count = 1, forceAmount = 500) {
    if (count === 0) {
      return false;
    }

    const element = ElementRegistry.get(elementCode);

    if (this._chemicals.spend(element.name, count) === false) {
      return false;
    }

    const chemical = this.world.create.chemical(element, count);
    const force = VMUtils
      .getDirection(angle, Vec2.temp)
      .mul(forceAmount);

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
    const energyToDivide = SimulationConfig.energyToDivide;

    if (currentEnergy < energyToDivide + 10) {
      return false;
    }

    const energy = (currentEnergy - energyToDivide) * 0.5;
    const newGenome = this.genome
      .clone()
      .mutate();

    this._energy = energy;
    this.world.registerEnergyLoss(energyToDivide);

    const cell = this.world.create.cell(newGenome);

    cell.generation = this.generation + 1;
    chemicals.divideTo(cell.chemicals);
    this.memory.copyTo(cell.memory);

    const force = VMUtils
      .randomDirection(Vec2.temp)
      .mul(500);

    cell
      .addEnergy(energy)
      .setPosition(this.position)
      .addForce(force);

    ++this._descendants;

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
      this.world.registerEnergyLoss(Math2.min(this._energy, left));
      this.reduceEnergy(left);
    }

    return food;
  }

  die() {
    if (this._isAlive === false) {
      return;
    }

    this._isAlive = false;
    this.world.registerEnergyLoss(this._energy);
    this._energy = 0;
    this.onDied.post(this);

    const chemicals = this._chemicals;

    ElementRegistry.forEach((element) => {
      const amount = chemicals.getAmount(element.name);

      this.spawnChemical(element.code, 0, amount, 0);
    })
  }

  destroy() {
    this._chemicals.onChanged.remove(this._onChemicalsChanged, this);
    this._view.destroy();
  }

  _init() {
    this._initMemory();
    this._initRegistries();
    this._initChemicals();
    this._initVM();
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
    this._updateSpeed();
    this._updateMass();
    this._updateRadius();
    this._updateDamage();
    this._updateArmor();
    this.onSizeChanged.post(this._mass, this._radius);
    // this._updateChemicalsRegistries();
  }

  _updateEnergyCapacity() {
    this._energyCapacity = Math2.min(255, 200 + this._chemicals.getAmount('dion') * 2);
    this._energy = Math2.min(this._energy, this._energyCapacity);
  }

  _updateSpeed() {
    this._speed = Math2.min(100, 50 + this._chemicals.getAmount('billanium'));
  }

  _updateMass() {
    this._mass = Math.min(2, 0.5 + this._chemicals.getAmount('chubium') * 0.1);
  }

  _updateRadius() {
    this._radius = Math.min(20, this._mass * 20);
  }

  _updateDamage() {
    this._damage = Math2.min(40, 5 + this._chemicals.getAmount('hillagen'));
  }

  _updateArmor() {
    this._armor = Math2.min(30, this._chemicals.getAmount('dion'));
  }

  _updateStats() {
    const ttl = this._ttl - 1;

    if (ttl === 0) {
      this._ttl = 0;
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

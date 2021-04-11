import Observable from '../../anvas/events/observable';
import Vec2 from '../../anvas/geom/vec2';
import ChemicalContents from '../chemicals/chemical-contents';
import Memory from '../memory/memory';
import RegistryManager from '../memory/registry-manager';
import VM from '../vm/vm';

export default class Cell {
  constructor(world) {
    this.world = world;

    this.position = new Vec2();
    this.velocity = new Vec2();
    this.force = new Vec2();
    this.onRadiusChanged = new Observable();

    this.view = null;

    this._radius = 0;
    this._rotation = 0;
    this._energy = 0;
    this._energyCapacity = 0;

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

  preUpdate() {
    this.view.preUpdate();
    this.force.setZero();
  }

  update() {
    this._vm.execute();
    this.view.update();
  }

  move(angle) {
    const speed = 50;
    const x = Math.cos(angle) * speed;
    const y = Math.sin(angle) * speed;

    this.force.add(x, y);
  }

  eat(angle) {
    const target = this.world.getTarget(this, angle);

    if (target !== null) {
      console.log(target);
    }
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

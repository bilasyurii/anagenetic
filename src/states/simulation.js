import State from '../anvas/state/state.js';
import Vec2 from '../anvas/geom/vec2.js';
import CellView from '../view/cell/cell-view.js';
import World from '../core/world/world.js';
import WorldView from '../view/world/world-view.js';
import ChemicalElement from '../core/chemicals/chemical-element.js';
import ChemicalViewFactory from '../view/chemical/chemical-view-factory.js';
import ElementRegistry from '../core/chemicals/element-registry.js';
import MutationStrategy from '../core/genome/mutation/mutation-strategy.js';
import ForceMutationStrategy from '../core/genome/mutation/force-mutation-strategy.js';
import PickMutationStrategy from '../core/genome/mutation/pick-mutation-strategy.js';
import UIMediator from '../ui/ui-mediator.js';
import Observable from '../anvas/events/observable.js';
import CellSelectorView from '../view/cell/cell-selector-view.js';
import VM from '../core/vm/vm.js';
import Random from '../core/utils/random.js';
import PermanentBestSpawnStrategy from '../core/genome/spawn/permanent-best-strategy.js';
import SpawnStrategy from '../core/genome/spawn/spawn-strategy.js';
import PermanentBestRandomSpawnStrategy from '../core/genome/spawn/permanent-best-random-strategy.js';
import SimulationConfig from '../core/utils/simulation-config.js';
import Math2 from '../anvas/utils/math2.js';
import ExtinctionBestSpawnStrategy from '../core/genome/spawn/extinction-best-strategy.js';

export default class SimulationState extends State {
  onInit() {
    this.onCellSelected = new Observable();
    this.onUpdate = new Observable();

    this._isReset = true;
    this._world = null;
    this._worldView = null;
    this._chemicalViewFactory = null;
    this._cellSelectorView = null;
    this._selectedCell = null;
    this._config = null;
    this._cellSpawnCost = 0;

    this._mutationStrategies = {
      'pick': new PickMutationStrategy(),
      'force': new ForceMutationStrategy(),
    };

    this._spawnStrategies = {
      'permanentBest': new PermanentBestSpawnStrategy(),
      'permanentBestRandom': new PermanentBestRandomSpawnStrategy(),
      'extinctionBest': new ExtinctionBestSpawnStrategy(),
    };

    this._chemicalViewFactory = new ChemicalViewFactory(this.engine);
    this._cellSelectorView = new CellSelectorView(this.engine);

    ElementRegistry.register(new ChemicalElement('billanium', 4, 'rgb(0, 0, 255)', 2, 40));
    ElementRegistry.register(new ChemicalElement('hillagen', 3, 'rgb(255, 0, 0)', 1, 0));
    ElementRegistry.register(new ChemicalElement('chubium', 1, 'rgb(0, 255, 0)', 3, 70));
    ElementRegistry.register(new ChemicalElement('dion', 2, 'rgb(255, 0, 255)', 4, 100));
    ElementRegistry.initLookup();
    ElementRegistry.initDamageQueue();

    SpawnStrategy.onSpawn.add(this._spawnCell, this);
    VM.initCommandsLookup();
    UIMediator.registerSimulation(this);

    this.engine.onUpdate.add(this._update, this);
  }

  get world() {
    return this._world;
  }

  start(config) {
    this._config = config;
    SimulationConfig.setup(config);
    this._cleanup();
    this._setup();
    UIMediator.setup();
  }

  play() {
    this._world.play();
    this.engine.physics.resume();
  }

  pause() {
    this._world.pause();
    this.engine.physics.pause();
  }

  stop() {
    this.pause();
  }

  changeSpeed(speed) {
    this.engine.dt = 1 / (60 * speed);
  }

  deselectCell() {
    this._cellSelectorView.visible = false;
  }

  _setup() {
    const config = this._config;
    const engine = this.engine;

    this._isReset = false;
    engine.physics.reset();

    const spacePartitioning = engine.physics.spacePartitioning;
    const world = this._world = new World(
      spacePartitioning,
      new Vec2(config.worldWidth, config.worldHeight)
    );
    const worldView = this._worldView = new WorldView(world);

    this.pause();
    engine.add(worldView);

    world.onCellAdded.add(this._onCellAdded, this);
    world.onCellDied.add(this._onCellDied, this);
    world.onChemicalAdded.add(this._onChemicalAdded, this);

    this._calculateCellSpawnCost();

    Random.setSeed(config.randomSeed);
    MutationStrategy.setActive(this._mutationStrategies[config.mutationStrategy]);
    SpawnStrategy.setActive(this._spawnStrategies['extinctionBest']);
    SpawnStrategy.reset(config);

    this._spawnChemicals(true);
  }

  _calculateCellSpawnCost() {
    const config = this._config;
    const contents = config.cellChemicals;
    const count = contents.length;
    let cost = config.cellsStartingEnergy;

    for (let i = 0; i < count; ++i) {
      const elementContent = contents[i];
      const element = ElementRegistry.getByName(elementContent.name);

      cost += element.energyEquivalent * elementContent.amount;
    }

    this._cellSpawnCost = cost;
  }

  _update() {
    const world = this._world;

    if (world === null || world.isRunning === false) {
      return;
    }

    const spawnCost = this._cellSpawnCost;
    const energyLoss = world.energyLoss;

    SpawnStrategy.requestSpawn(~~(energyLoss / spawnCost));
    this._spawnChemicals(false);

    this.onUpdate.post();
  }

  _onCellAdded(cell) {
    const cellView = new CellView(cell);

    this._worldView.add(cellView);
    cell.view = cellView;
    cellView.onSelected.add(this._onCellViewSelected, this);
    SpawnStrategy.onCellAdded(cell);
  }

  _onCellDied(cell) {
    SpawnStrategy.onCellDied(cell);
  }

  _onChemicalAdded(chemical) {
    const chemicalView = this._chemicalViewFactory.create(chemical);

    this._worldView.add(chemicalView);
    chemical.view = chemicalView;
  }

  _onCellViewSelected(cellView) {
    const selectorView = this._cellSelectorView;
    const cell = cellView.cell;

    cellView.select(selectorView);
    selectorView.visible = true;
    this._selectedCell = cell;
    this.onCellSelected.post(cell);
  }

  _cleanup() {
    if (this._isReset === true) {
      return;
    }

    const worldView = this._worldView;
    const cellSelectorView = this._cellSelectorView;

    if (cellSelectorView.parent !== null) {
      cellSelectorView.parent.remove(cellSelectorView);
    }

    worldView.destroy();

    this._world = null;
    this._worldView = null;

    this._isReset = true;
  }

  _spawnCell(genome, compensateEnergyLoss) {
    const config = this._config;
    const energy = config.cellsStartingEnergy;
    const chemicals = config.cellChemicals;
    const world = this._world;
    const size = world.size;
    const offset = 100;
    const fromX = offset;
    const toX = size.x - offset;
    const fromY = offset;
    const toY = size.y - offset;
    const between = Random.between;
    const cell = world.create.cell(genome);

    cell.chemicals.addMany(chemicals);
    cell
      .addEnergy(energy)
      .setPositionXY(between(fromX, toX), between(fromY, toY));

    if (compensateEnergyLoss === true) {
      this._world.compensateEnergyLoss(this._cellSpawnCost);
    }
  }

  _spawnChemicals(free) {
    const chemicals = this._config.worldChemicals;
    const elementsCount = chemicals.length;
    const world = this._world;
    const min = Math2.min;
    const getElement = ElementRegistry.getByName;

    for (let i = 0; i < elementsCount; ++i) {
      const elementConfig = chemicals[i];
      const name = elementConfig.name;
      const element = getElement(name);

      let count = elementConfig.amount;

      if (free === false) {
        const worldAmount = world.getElementAmount(name);
        const energyLoss = world.energyLoss;
        const energyEquivalent = element.energyEquivalent;
        const availableCount = ~~(energyLoss / energyEquivalent);

        count = min(count - worldAmount, availableCount);

        if (count > 0) {
          world.compensateEnergyLoss(count * energyEquivalent);
        }
      }

      while (count > 0) {
        let bunch;

        if (count < 10) {
          bunch = count;
        } else {
          bunch = 10;
        }

        count -= bunch;
        this._spawnChemical(element, bunch).randomizeTTL();
      }
    }
  }

  _spawnChemical(element, amount) {
    const world = this._world;
    const size = world.size;
    const offset = 100;
    const fromX = offset;
    const toX = size.x - offset;
    const fromY = offset;
    const toY = size.y - offset;
    const between = Random.between;

    return world.create.chemical(element, amount)
      .setPositionXY(between(fromX, toX), between(fromY, toY));
  }
}

import State from '../anvas/state/state.js';
import Vec2 from '../anvas/geom/vec2.js';
import CellView from '../view/cell/cell-view.js';
import World from '../core/world/world.js';
import WorldView from '../view/world/world-view.js';
import Genome from '../core/genome/genome.js';
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

    this._mutationStrategies = {
      'pick': new PickMutationStrategy(),
      'force': new ForceMutationStrategy(),
    };

    this._chemicalViewFactory = new ChemicalViewFactory(this.engine);
    this._cellSelectorView = new CellSelectorView(this.engine);

    ElementRegistry.register(new ChemicalElement('billanium', 4, 'rgb(0, 0, 255)'));
    ElementRegistry.register(new ChemicalElement('hillagen', 3, 'rgb(255, 0, 0)'));
    ElementRegistry.register(new ChemicalElement('chubium', 1, 'rgb(0, 255, 0)'));
    ElementRegistry.register(new ChemicalElement('dion', 2, 'rgb(255, 0, 255)'));
    ElementRegistry.initLookup();
    ElementRegistry.initDamageQueue();

    VM.initCommandsLookup();
    UIMediator.registerSimulation(this);
  }

  get world() {
    return this._world;
  }

  start(config) {
    this._config = config;

    console.log(config);
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
    const spacePartitioning = engine.physics.spacePartitioning;
    const world = this._world = new World(
      spacePartitioning,
      new Vec2(config.worldWidth, config.worldHeight)
    );
    const worldView = this._worldView = new WorldView(world);

    engine.add(worldView);

    world.onCellAdded.add(this._onCellAdded, this);
    world.onChemicalAdded.add(this._onChemicalAdded, this);

    MutationStrategy.setActive(this._mutationStrategies[config.mutationStrategy]);
    Random.setSeed(config.randomSeed);

    this._spawnCells();

    // const cell2 = world.create.cell();

    // cell2.genome = cell.genome.clone();
    // cell2.setPositionXY(130, 100);

    // world.create.chemical(element, 10)
    //   .setPositionXY(130, 100);

    engine.onUpdate.add(() => this.onUpdate.post());
  }

  _onCellAdded(cell) {
    const cellView = new CellView(cell);

    this._worldView.add(cellView);
    cell.view = cellView;
    cellView.onSelected.add(this._onCellViewSelected, this);
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

    worldView.parent.remove(worldView);

    if (cellSelectorView.parent !== null) {
      cellSelectorView.parent.remove(cellSelectorView);
    }

    this._world = null;
    this._worldView = null;

    this._isReset = true;
  }

  _spawnCells() {
    const config = this._config;
    const energy = config.cellsStartingEnergy;
    const chemicals = config.cellChemicals;
    const count = config.startingCellsAmount;

    for (let i = 0; i < count; ++i) {
      const cell = this.world.create.cell();

      cell.genome = Genome.random();
      cell.chemicals.addMany(chemicals);
      cell
        .addEnergy(energy)
        .setPositionXY(300, 300);
    }
  }
}

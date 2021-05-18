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

export default class SimulationState extends State {
  onInit() {
    this.onCellSelected = new Observable();
    this.onUpdate = new Observable();

    this._world = null;
    this._worldView = null;
    this._chemicalViewFactory = null;
    this._cellSelectorView = null;
    this._selectedCell = null;
  }

  get world() {
    return this._world;
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
    this.engine.dt = speed / 60;
  }

  deselectCell() {
    this._cellSelectorView.visible = false;
  }

  onEnter() {
    const engine = this.engine;

    const spacePartitioning = engine.physics.spacePartitioning;
    const world = this._world = new World(spacePartitioning, new Vec2(700, 400));
    const worldView = this._worldView = new WorldView(world);

    engine.add(worldView);

    ElementRegistry.register(new ChemicalElement('billanium', 4, 'rgb(0, 0, 255)'));
    ElementRegistry.register(new ChemicalElement('hillagen', 3, 'rgb(255, 0, 0)'));
    ElementRegistry.register(new ChemicalElement('chubium', 1, 'rgb(0, 255, 0)'));
    ElementRegistry.register(new ChemicalElement('dion', 2, 'rgb(255, 0, 255)'));
    ElementRegistry.initLookup();
    ElementRegistry.initDamageQueue();

    MutationStrategy.setActive(new PickMutationStrategy());
    MutationStrategy.setActive(new ForceMutationStrategy());

    this._chemicalViewFactory = new ChemicalViewFactory(engine);
    this._cellSelectorView = new CellSelectorView(engine);

    world.onCellAdded.add(this._onCellAdded, this);
    world.onChemicalAdded.add(this._onChemicalAdded, this);

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

    UIMediator.registerSimulation(this);

    engine.onUpdate.add(() => this.onUpdate.post());

    return;
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
}

import Observable from '../../anvas/events/observable';
import Bounds from '../../anvas/geom/bounds';
import Circle from '../../anvas/geom/circle';
import Vec2 from '../../anvas/geom/vec2';
import ArrayUtils from '../../anvas/utils/array-utils';
import Math2 from '../../anvas/utils/math2';
import Cell from '../cell/cell';
import ElementRegistry from '../chemicals/element-registry';
import Gene from '../genome/gene';
import Random from '../utils/random';
import EntityFactory from './entity-factory';

export default class World {
  constructor(spacePartitioning, config) {
    this.config = config;
    this.size = new Vec2(config.worldWidth, config.worldHeight);

    this.onChemicalAdded = new Observable();
    this.onCellAdded = new Observable();
    this.onCellDied = new Observable();
    this.updateInterval = 20;

    this.view = null;
    this.create = null;

    this._spacePartitioning = spacePartitioning;

    this._isRunning = false;
    this._energyLoss = 0;
    this._rndTick = 0;
    this._timeToUpdate = 1;
    this._walls = [];
    this._cells = [];
    this._chemicals = [];
    this._elementAmounts = {};
    this._oldestGeneration = 0;
    this._biggestFamily = 0;
    this._photosynthesis = 0;
    this._generations = 0;

    this._init();
  }

  get isRunning() {
    return this._isRunning;
  }

  get rndTick() {
    return this._rndTick;
  }

  get cellsCount() {
    return this._cells.length;
  }

  get chemicalsCount() {
    return this._chemicals.length;
  }

  get energyLoss() {
    return this._energyLoss;
  }

  get oldestGeneration() {
    return this._oldestGeneration;
  }

  set oldestGeneration(value) {
    if (value > this._oldestGeneration) {
      this._oldestGeneration = value;
    }
  }

  get biggestFamily() {
    return this._biggestFamily;
  }

  set biggestFamily(value) {
    if (value > this._biggestFamily) {
      this._biggestFamily = value;
    }
  }

  get photosynthesis() {
    return this._photosynthesis;
  }

  get generations() {
    return this._generations;
  }

  getElementAmount(name) {
    return this._elementAmounts[name];
  }

  play() {
    this._isRunning = true;

    return this;
  }

  pause() {
    this._isRunning = false;

    return this;
  }

  addCell(cell) {
    this._cells.push(cell);
    cell.onDied.add(this._onCellDied, this);
    this.onCellAdded.post(cell);

    return this;
  }

  addChemical(chemical) {
    this._chemicals.push(chemical);
    this._elementAmounts[chemical.element.name] += chemical.count;

    chemical.onRunOut.add(this._onChemicalRunOut, this);
    chemical.onAmountReduced.add(this._onElementAmountReduced, this);
    this.onChemicalAdded.post(chemical);

    return this;
  }

  registerEnergyLoss(loss) {
    this._energyLoss += loss;
  }

  compensateEnergyLoss(compensation) {
    this._energyLoss -= compensation;
  }

  registerPhotosynthesis(amount) {
    this._photosynthesis += amount;
  }

  update() {
    if (this._isRunning === false) {
      return;
    }

    if (--this._timeToUpdate === 0) {
      this._timeToUpdate = this.updateInterval;
      this._rndTick = Random.int() % Gene.VARIETY;
      this._photosynthesis = 0;
      this._updateCells();
      this._updateChemicals();
    }
  }

  forEachWall(callback) {
    this._walls.forEach(callback);

    return this;
  }

  getTargets(position, angle, angleThreshold) {
    const circle = Circle.temp.set(position.x, position.y, Cell.VISION_RADIUS);
    const candidates = this._spacePartitioning.getInCircle(circle);
    const count = candidates.length;
    const temp = Vec2.temp;
    const targets = [];

    for (let i = 0; i < count; ++i) {
      const body = candidates[i];
      const targetAngle = temp
        .copyFrom(body.position)
        .subVec(position)
        .radians();
      const angleDistance = Math2.angleDistanceRad(targetAngle, angle);

      if (angleDistance < angleThreshold) {
        targets.push({
          body,
          angleDistance,
        });
      }
    }

    return targets;
  }

  getClosestTarget(cell, angle) {
    const view = cell.view;
    const position = cell.position;
    const targets = this.getTargets(position, angle, Cell.ANGLE_THRESHOLD);
    const count = targets.length;

    let minDistanceSqr = Infinity;
    let minAngleDiff = Infinity;
    let bestTarget = null;

    for (let i = 0; i < count; ++i) {
      const data = targets[i];
      const body = data.body;
      const targetView = body.gameObject;

      if (targetView === view) {
        continue;
      }

      const angleDistance = data.angleDistance;

      if (angleDistance < minAngleDiff) {
        const distanceSqr = body.position.distanceSqr(position);

        if (distanceSqr < minDistanceSqr) {
          minDistanceSqr = distanceSqr;
          minAngleDiff = angleDistance;
          bestTarget = targetView.dataObject;
        }
      }
    }

    return bestTarget;
  }

  _init() {
    this._setupElementAmounts();
    this._initFactory();
    this._initWalls();
  }

  _setupElementAmounts() {
    const amounts = this._elementAmounts;

    ElementRegistry.forEach((element) => amounts[element.name] = 0);
  }

  _initFactory() {
    this.create = new EntityFactory(this);
  }

  _initWalls() {
    const size = this.size;
    const walls = this._walls;
    const padding = 50;
    const tempArr = [];
    const fakeTakeDamage = function() {
      return tempArr;
    };

    walls.push(new Bounds(-padding, -padding, 0, size.y + padding));
    walls.push(new Bounds(-padding, -padding, size.x + padding, 0));
    walls.push(new Bounds(size.x, -padding, size.x + padding, size.y + padding));
    walls.push(new Bounds(-padding, size.y, size.x + padding, size.y + padding));

    ArrayUtils.forEach(walls, function(wall) {
      wall.takeDamage = fakeTakeDamage;
    });
  }

  _updateCells() {
    const cells = this._cells;

    let count = cells.length;

    for (let i = 0; i < count; ++i) {
      cells[i].preUpdate();
    }

    for (let i = 0; i < count; ++i) {
      const cell = cells[i];

      if (cell === undefined) {
        continue;
      }

      cell.update();

      if (cell.isAlive === false) {
        --i;
        --count;
      }
    }
  }

  _updateChemicals() {
    const chemicals = this._chemicals;

    for (let i = chemicals.length - 1; i >= 0; --i) {
      chemicals[i].update();
    }
  }

  _onElementAmountReduced(elementName, amount) {
    this._elementAmounts[elementName] -= amount;
  }

  _onChemicalRunOut(chemical) {
    const chemicals = this._chemicals;
    const count = chemicals.length;

    for (let i = 0; i < count; ++i) {
      if (chemicals[i] === chemical) {
        chemicals.splice(i, 1);

        return;
      }
    }
  }

  _onCellDied(cell) {
    cell.destroy();
    ++this._generations;

    const cells = this._cells;
    const count = cells.length;

    for (let i = 0; i < count; ++i) {
      if (cells[i] === cell) {
        cells.splice(i, 1);

        break;
      }
    }

    this.onCellDied.post(cell);
  }
}

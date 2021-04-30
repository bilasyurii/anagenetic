import Observable from '../../anvas/events/observable';
import Bounds from '../../anvas/geom/bounds';
import Circle from '../../anvas/geom/circle';
import Vec2 from '../../anvas/geom/vec2';
import Math2 from '../../anvas/utils/math2';
import Cell from '../cell/cell';
import EntityFactory from './entity-factory';

export default class World {
  constructor(spacePartitioning, size) {
    this.size = size;

    this.onChemicalAdded = new Observable();
    this.onCellAdded = new Observable();
    this.updateInterval = 20;

    this.create = null;
    
    this._spacePartitioning = spacePartitioning;

    this._timeToUpdate = 1;
    this._walls = [];
    this._cells = [];
    this._chemicals = [];

    this._init();
  }

  addCell(cell) {
    this._cells.push(cell);
    this.onCellAdded.post(cell);

    return this;
  }

  addChemical(chemical) {
    this._chemicals.push(chemical);

    chemical.onRunOut.add(this._onChemicalRunOut, this);
    this.onChemicalAdded.post(chemical);

    return this;
  }

  update() {
    if (--this._timeToUpdate === 0) {
      this._timeToUpdate = this.updateInterval;

      this._updateCells();
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
    this._initFactory();
    this._initWalls();
  }

  _initFactory() {
    this.create = new EntityFactory(this);
  }

  _initWalls() {
    const size = this.size;
    const walls = this._walls;
    const padding = 50;

    walls.push(new Bounds(-padding, -padding, 0, size.y + padding));
    walls.push(new Bounds(-padding, -padding, size.x + padding, 0));
    walls.push(new Bounds(size.x, -padding, size.x + padding, size.y + padding));
    walls.push(new Bounds(-padding, size.y, size.x + padding, size.y + padding));
  }

  _updateCells() {
    const cells = this._cells;
    const count = cells.length;

    for (let i = 0; i < count; ++i) {
      cells[i].preUpdate();
    }

    for (let i = 0; i < count; ++i) {
      cells[i].update();
    }
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
}

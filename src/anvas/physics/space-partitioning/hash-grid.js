import Bounds from '../../geom/bounds';
import SpacePartitioning from './space-partitioning';
import Collisions from '../collision/collisions';

export default class HashGrid extends SpacePartitioning {
  constructor(cellSize, startingBounds) {
    super();

    this._bodies = [];
    this._bodiesToRemove = [];
    this._grid = null;
    this._cellSize = cellSize === undefined ? 50 : cellSize;
    this._cellSizeInv = 1 / this._cellSize;

    if (startingBounds === undefined) {
      this._bounds = new Bounds(-50, -50, 500, 500);
    } else {
      this._bounds = startingBounds;
    }

    const gridBounds = this._gridBounds = this._bounds
      .clone()
      .scale(this._cellSizeInv)
      .roundUp();

    this._bounds.copyFrom(gridBounds)
      .scale(this._cellSize);

    this._width = gridBounds.width + 1;
    this._height = gridBounds.height + 1;

    this._createGrid();
  }

  get cellSize() {
    return this._cellSize;
  }

  addBody(body) {
    const bounds = body.collider.getBounds();

    body._hashBounds = new Bounds();
    body.onPositionChanged.add(this._onBodyMoved, this);
    body._gridCells = [];
    this._bodies.push(body);
    this._updateHashBounds(body);

    if (this._bounds.containsBounds(bounds) === false) {
      this.expandGrid(body._hashBounds);
    }

    this._addToGrid(body);

    return this;
  }

  removeBody(body) {
    body.onPositionChanged.remove(this._onBodyMoved, this);
    this._bodiesToRemove.push(body);
    this._removeFromGrid(body);

    const bodies = this._bodies;
    const count = bodies.length;

    for (let i = 0; i < count; ++i) {
      if (bodies[i] === body) {
        bodies.splice(i, 1);

        return this;
      }
    }

    return this;
  }

  removePending() {
    const pending = this._bodiesToRemove;

    let pendingCount = pending.length;

    if (pendingCount === 0) {
      return;
    }

    const bodies = this._bodies;

    for (let i = bodies.length - 1; i >= 0; --i) {
      const body = bodies[i];

      for (let j = 0; j < pendingCount; ++j) {
        if (pending[j] === body) {
          bodies.splice[j];
          pending.splice(j, 1);

          if (--pendingCount === 0) {
            this._bodiesToRemove = [];

            return this;
          }

          break;
        }
      }
    }

    this._bodiesToRemove = [];
  }

  getInBounds(bounds) {
    const gridBounds = this._gridBounds;
    const searchBounds = Bounds.temp
      .copyFrom(bounds)
      .scale(this._cellSizeInv)
      .roundUp();

    searchBounds.intersection(gridBounds, searchBounds);

    const found = [];
    const bodiesSet = {};
    const grid = this._grid;
    const minX = gridBounds.minX;
    const minY = gridBounds.minY;
    const fromX = searchBounds.minX;
    const tillX = searchBounds.maxX + 1;
    const tillY = searchBounds.maxY + 1;

    for (let y = searchBounds.minY; y < tillY; ++y) {
      const gridY = y - minY;
      const row = grid[gridY];

      for (let x = fromX; x < tillX; ++x) {
        const cell = row[x - minX];
        const count = cell.length;

        for (let i = 0; i < count; ++i) {
          const body = cell[i];
          const id = body.id + '';

          if (bodiesSet[id] === undefined) {
            bodiesSet[id] = true;
            found.push(body);
          }
        }
      }
    }

    return found;
  }

  getInCircle(circle) {
    const circle2collider = Collisions.circle2collider;
    const bounds = circle.getBounds(Bounds.temp);
    const inBounds = this.getInBounds(bounds);
    const count = inBounds.length;
    const found = [];

    for (let i = 0; i < count; ++i) {
      const body = inBounds[i];

      if (circle2collider(circle, body.collider)) {
        found.push(body);
      }
    }

    return found;
  }

  broadPhase() {
    const bodies = this._bodies;
    const count = bodies.length;

    for (let i = 0; i < count; ++i) {
      bodies[i]._pairs = [];
    }

    const pairs = [];
    const grid = this._grid;
    const width = this._width;
    const height = this._height;

    for (let y = 0; y < height; ++y) {
      const row = grid[y];

      for (let x = 0; x < width; ++x) {
        const cell = row[x];

        if (cell.length > 1) {
          const count = cell.length;

          for (let i = 1; i < count; ++i) {
            const rb1 = cell[i];
            const rb1Pairs = rb1._pairs;
            const rb1PairsCount = rb1Pairs.length;

            for (let j = 0; j < i; ++j) {
              const rb2 = cell[j];

              let unique = true;

              for (let k = 0; k < rb1PairsCount; ++k) {
                const pair = rb1Pairs[k];

                if (pair.rb1 === rb2 || pair.rb2 === rb2) {
                  unique = false;

                  break;
                }
              }

              if (unique === true) {
                const pair = {
                  rb1,
                  rb2,
                };

                rb1Pairs.push(pair);
                pairs.push(pair);
              }
            }
          }
        }
      }
    }

    return pairs;
  }

  expandGrid(hashBounds) {
    const bounds = this._bounds;
    const gridBounds = this._gridBounds;
    const prevMinX = gridBounds.minX;
    const prevMinY = gridBounds.minY;
    const prevMaxX = gridBounds.maxX;
    const prevMaxY = gridBounds.maxY;
    const prevHeight = this._height;

    gridBounds.addBounds(hashBounds);

    const width = this._width = gridBounds.width + 1;
    this._height = gridBounds.height + 1;

    bounds
      .copyFrom(gridBounds)
      .scale(this._cellSize);

    const expandLeft = prevMinX - gridBounds.minX;
    const expandRight = gridBounds.maxX - prevMaxX;
    const expandUp = prevMinY - gridBounds.minY;
    const expandDown = gridBounds.maxY - prevMaxY;
    const grid = this._grid;

    if (expandLeft !== 0 || expandRight !== 0) {
      for (let i = 0; i < prevHeight; ++i) {
        this._expandRow(grid[i], expandLeft, expandRight);
      }
    }

    if (expandUp !== 0) {
      for (let i = 0; i < expandUp; ++i) {
        grid.unshift(this._createRow(width));
      }
    }

    if (expandDown !== 0) {
      for (let i = 0; i < expandDown; ++i) {
        grid.push(this._createRow(width));
      }
    }
  }

  _createGrid() {
    const grid = this._grid = [];
    const width = this._width;
    const height = this._height;

    for (let y = 0; y < height; ++y) {
      grid.push(this._createRow(width));
    }
  }

  _createRow(width) {
    const row = [];

    for (let i = 0; i < width; ++i) {
      row.push([]);
    }

    return row;
  }

  _expandRow(row, left, right) {
    for (let i = 0; i < left; ++i) {
      row.unshift([]);
    }

    for (let i = 0; i < right; ++i) {
      row.push([]);
    }
  }

  _addToGrid(body) {
    const hashBounds = body._hashBounds;
    const gridBounds = this._gridBounds;
    const gridCells = body._gridCells;
    const grid = this._grid;
    const minX = gridBounds.minX;
    const minY = gridBounds.minY;
    const fromX = hashBounds.minX;
    const tillX = hashBounds.maxX + 1;
    const tillY = hashBounds.maxY + 1;

    for (let y = hashBounds.minY; y < tillY; ++y) {
      const gridY = y - minY;
      const row = grid[gridY];

      for (let x = fromX; x < tillX; ++x) {
        const cell = row[x - minX];

        cell.push(body);
        gridCells.push(cell);
      }
    }
  }

  _updateHashBounds(body) {
    body._hashBounds
      .copyFrom(body.collider.getBounds())
      .scale(this._cellSizeInv)
      .roundUp();
  }

  _removeFromGrid(body) {
    const gridCells = body._gridCells;
    const cellsCount = gridCells.length;

    for (let i = 0; i < cellsCount; ++i) {
      const cell = gridCells[i];
      const count = cell.length;

      for (let j = 0; j < count; ++j) {
        const b = cell[j];

        if (b === body) {
          cell.splice(j, 1);

          break;
        }
      }
    }

    gridCells.splice(0);
  }

  _onBodyMoved(body) {
    this._updateHashBounds(body);
    this._removeFromGrid(body);

    if (this._gridBounds.containsBounds(body._hashBounds) === false) {
      this.expandGrid(body._hashBounds);
    }

    this._addToGrid(body);
  }
}

import Observable from '../events/observable.js';

export default class InputHandler {
  constructor(owner) {
    this.owner = owner;

    this.isOver = false;

    this.onDown = new Observable();
    this.onUp = new Observable();
    this.onMove = new Observable();
    this.onOver = new Observable();
    this.onOut = new Observable();

    this._enabled = true;

    this._input = null;
  }

  onAddedToScene() {
    if (this._enabled === true) {
      let input = this._input;

      if (input === null) {
        input = this._input = this.owner.engine.input;

        input.add(this);
      }
    }
  }

  handleDown(x, y) {
    if (this._handleXY(x, y) === true) {
      this.onDown.post();

      return true;
    }

    return false;
  }

  handleUp(x, y) {
    if (this._handleXY(x, y) === true) {
      this.onUp.post();

      return true;
    }

    return false;
  }

  handleMove(x, y) {
    if (this._checkOver(x, y) === true) {
      this.onMove.post();
    }
  }

  update(x, y) {
    if (this.owner.worldDirty === true) {
      this._checkOver(x, y);
    }
  }

  isEnabled() {
    return this._enabled;
  }

  enable() {
    if (this._enabled === false) {
      this._enabled = true;

      const input = this._input;

      if (input !== null) {
        input.add(this);
      }
    }
  }

  disable() {
    if (this._enabled === true) {
      this._enabled = false;

      const input = this._input;

      if (input !== null) {
        input.remove(this);
      }
    }
  }

  toggle() {
    if (this._enabled === true) {
      this.disable();
    } else {
      this.enable();
    }
  }

  destroy() {
    this.onDown.destroy();
    this.onUp.destroy();
    this.onMove.destroy();
    this.onOver.destroy();
    this.onOut.destroy();

    this.onDown = null;
    this.onUp = null;
    this.onMove = null;
    this.onOver = null;
    this.onOut = null;

    if (this._enabled === true) {
      this._enabled = false;

      const input = this._input;

      if (input !== null) {
        input.remove(this);
      }
    }

    this._input = null;
  }

  _handleXY(x, y) {
    const owner = this.owner;

    if (owner.visible === false) {
      return false;
    }

    const transform = owner.worldTransform;
    const point = transform.inverseTransformXY(x, y);
    const localBounds = owner.getLocalBounds();

    return localBounds.contains(point);
  }

  _checkOver(x, y) {
    if (this._handleXY(x, y) === true) {
      if (this.isOver === false) {
        this.isOver = true;

        this.onOver.post();
      }

      return true;
    } else {
      if (this.isOver === true) {
        this.isOver = false;

        this.onOut.post();
      }

      return false;
    }
  }
}

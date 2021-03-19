import Math2 from '../utils/math2.js';

class ScreenUtils {
  constructor() {
    this.engine = null;

    const width = this.width = 960;
    const height = this.height = 640;

    this.centerX = width * 0.5;
    this.centerY = height * 0.5;

    this.aspect = width / height;
    this.aspectInv = 1 / this.aspect;

    this.scale = 1;
    this.scaleInv = 1;

    this._canvas = null;
  }

  init(engine) {
    this.engine = engine;

    const canvas = this._canvas = engine.canvas;
    
    canvas.width = 10;
    canvas.height = 10;

    this._checkSize();
    this._update();
    
    canvas.width = this.width;
    canvas.height = this.height;
  }

  _checkSize() {
    let firstTimeStamp = null;
    let tempWidth = 0;
    let tempHeight = 0;
    let rafId = null;

    const performCheckSize = (timeStamp) => {
      if (firstTimeStamp === null) {
        firstTimeStamp = timeStamp;
      }

      if (tempWidth !== window.innerWidth || tempHeight !== window.innerHeight) {
        this._update();

        tempWidth = window.innerWidth;
        tempHeight = window.innerHeight;
      }

      if (timeStamp - firstTimeStamp < 500) {
        window.cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(performCheckSize);
      }
    };

    rafId = window.requestAnimationFrame(performCheckSize);

    window.addEventListener('resize', () => {
      firstTimeStamp = null;

      performCheckSize(0);
    });
  }

  _update() {
    const width = this.width;
    const height = this.height;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scale = this.scale = Math2.min(windowWidth / width, windowHeight / height);

    this.scaleInv = 1 / scale;

    const canvasWidth = width * scale;
    const canvasHeight = height * scale;

    const canvasStyle = this._canvas.style;

    canvasStyle.width = canvasWidth + 'px';
    canvasStyle.height = canvasHeight + 'px';
  }
}

const SU = new ScreenUtils();

export default SU;

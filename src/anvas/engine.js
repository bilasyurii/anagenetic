import Debug from './debug/debug.js';
import Renderer from './rendering/renderer.js';
import SU from './screen/screen-utils.js';
import Group from './game-objects/group.js';
import Cache from './loading/cache.js';
import Loader from './loading/loader.js';
import TextureManager from './rendering/texture-manager.js';
import ObjectsFactory from './utils/objects-factory.js';
import TimeManager from './time/timer-manager.js';
import CanvasPool from './rendering/canvas-pool.js';
import Input from './input/input.js';
import Physics from './physics/physics.js';

export default class Engine {
  constructor() {
    this.renderer = null;
    this.load = null;
    this.cache = null;
    this.textures = null;
    this.create = null;
    this.time = null;
    this.input = null;
    this.root = null;
    this.physics = null;
    this.state = null;

    this.version = '0.2.2';
    this.elapsed = 0;
    this.elapsedMS = 0;
    this.physicsElapsed = 0;
    this.physicsElapsedMS = 0;
    this.sec = 0;
    this.ms = 0;
    this.dt = 1 / 60;

    this._canvasId = null;
    this._canvas = null;
    this._bodyColor = '#ffffff';
    this._canvasColor = '#000000';
    this._canvasPoolStartingSize = 5;
    this._loop = null;
    this._prevTime = 0;
    this._accumulator = 0;
    this._states = {};
    this._startingState = null;
    this._helloMessageEnabled = true;
    this._physicsSolveIterations = 5;
  }

  get canvas() {
    return this._canvas;
  }

  setCanvasId(id) {
    this._canvasId = id;

    return this;
  }

  setBodyColor(color) {
    this._bodyColor = color;

    return this;
  }

  setCanvasColor(color) {
    this._canvasColor = color;

    return this;
  }

  setCanvasPoolStartingSize(size) {
    this._canvasPoolStartingSize = size;

    return this;
  }

  registerState(name, stateClass) {
    this._states[name] = stateClass;

    return this;
  }

  setStartingState(name) {
    this._startingState = name;

    return this;
  }

  setHelloMessageEnabled(value) {
    this._helloMessageEnabled = value;

    return this;
  }

  setPhysicsSolveIterations(count) {
    this._physicsSolveIterations = count;

    return this;
  }

  start() {
    this._showHello();

    this._configureHtml();
    this._configureBody();
    this._configureCanvas();

    this._initRoot();
    this._initCanvasPool();
    this._initScreenUtils();
    this._initTimerManager();
    this._initRenderer();
    this._initTextureManager();
    this._initCache();
    this._initLoader();
    this._initInput();
    this._initObjectsFactory();
    this._initPhysics();
    this._initStartingState();

    this._setupRAF();

    return this;
  }

  changeState(name) {
    let state = this.state;

    if (state !== null) {
      state.onLeave();
    }

    const State = this._states[name];

    state = this.state = new State(this, name);

    state.onEnter();

    return this;
  }

  add(gameObject) {
    return this.root.add(gameObject);
  }

  _showHello() {
    if (this._helloMessageEnabled === true) {
      const helloMessage = `   Anvas.js v${this.version}   `;
      console.log('%c' + helloMessage, 'background-color: black; color: yellow;');
    }
  }

  _configureHtml() {
    const html = document.getElementsByTagName('html')[0];
    
    Debug.defined(html);

    this._configureStretchStyles(html);
  }

  _configureBody() {
    const body = document.getElementsByTagName('body')[0];
    const color = this._bodyColor;

    Debug.defined(body);
    Debug.defined(color);

    this._configureStretchStyles(body);

    const style = body.style;

    style.margin = '0';
    style.display = 'flex';
    style.justifyContent = 'center';
    style.alignItems = 'center';
    style.backgroundColor = color;
  }

  _configureCanvas() {
    Debug.defined(this._canvasId);

    const canvas = this._canvas = document.getElementById(this._canvasId);
    const color = this._canvasColor;

    Debug.defined(canvas);
    Debug.defined(color);

    canvas.style.backgroundColor = color;
    canvas.style.userSelect = 'none';
  }

  _initRoot() {
    const root = this.root = new Group();

    root.engine = this;
  }

  _initCanvasPool() {
    CanvasPool.init(this._canvasPoolStartingSize);
  }

  _initScreenUtils() {
    SU.init(this);
  }

  _initTimerManager() {
    this.time = new TimeManager(this);
  }

  _initRenderer() {
    this.renderer = new Renderer(this);
  }

  _initTextureManager() {
    this.textures = new TextureManager();
  }

  _initCache() {
    this.cache = new Cache(this);
  }

  _initLoader() {
    this.loader = new Loader(this.cache);
  }

  _initInput() {
    this.input = new Input(this);
  }

  _initObjectsFactory() {
    this.create = new ObjectsFactory(this);
  }

  _initPhysics() {
    this.physics = new Physics(this, this._physicsSolveIterations);
  }

  _initStartingState() {
    this.changeState(this._startingState);

    delete this._startingState;
  }

  _setupRAF() {
    this._loop = this._onLoop.bind(this);

    window.requestAnimationFrame(this._loop);
  }

  _configureStretchStyles(element) {
    element.style.width = '100%';
    element.style.height = '100%';
  }

  _onLoop(time) {
    const prevTime = this._prevTime = this.elapsedMS;

    this.elapsedMS = time;
    this.elapsed = time * 0.001;

    const ms = this.ms = time - prevTime;
    const sec = this.sec = ms * 0.001;

    this.time.update();

    this.input.update();

    this.physics.preUpdate();

    let frameTime;

    if (sec > 0.25) {
      frameTime = 0.25;
    } else {
      frameTime = sec;
    }

    let accumulator = this._accumulator + frameTime;

    const dt = this.dt;

    while (accumulator >= dt) {
      this._step();

      this.physicsElapsed += dt;
      accumulator -= dt;
    }

    this._accumulator = accumulator;
    this.physicsElapsedMS = this.physicsElapsed * 1000;

    this.physics.postUpdate();

    this.renderer.render();

    window.requestAnimationFrame(this._loop);
  }

  _step() {
    this.physics.fixedUpdate();
    this.root.fixedUpdate();
  }
}

export default class State {
  constructor(engine, name) {
    this.engine = engine;
    this.root = engine.root;
    this.load = engine.loader;
    this.create = engine.create;
    this.name = name;
  }

  changeState(name) {
    this.engine.changeState(name);

    return this;
  }

  restart() {
    const engine = this.engine;
    const state = engine.state;
    const name = this.name;

    if (state !== null && state.name !== name) {
      engine.changeState(name);
    }
  }

  add(gameObject) {
    this.root.add(gameObject);
  }

  onEnter() {}

  onLeave() {}
}

export default class DependencyInjection {
  constructor() {
    this._dependencies = {};
  }

  register(name, service) {
    this._dependencies[name] = service;

    return this;
  }

  get(name) {
    return this._dependencies[name];
  }

  process(element) {
    const registered = this._dependencies;
    const dependencies = element.dependencies;

    if (dependencies === undefined) {
      return this;
    }

    const count = dependencies.length;

    for (let i = 0; i < count; ++i) {
      const name = dependencies[i];
      const service = registered[name];

      element[name] = service;
    }

    element.onInjected();

    return this;
  }
}

import Debug from '../../anvas/debug/debug';

export default class SimulationConfig {
  constructor() {
    Debug.staticClass();
  }

  static setup(config) {
    SimulationConfig._config = config;
  }

  static get energyToDivide() {
    return SimulationConfig._config.energyToDivide;
  }
}

SimulationConfig._config = null;

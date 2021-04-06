import Registry from "./registry";

export default class RegistryManager {
  constructor() {
    this._registries = null;

    this._initRegistries();
  }

  _initRegistries() {
    this._registries = [];

    this._initOperationalRegistries();
    this._initInformationalRegistries();
  }

  _initOperationalRegistries() {
    const registries = this._registries;
    const count = RegistryManager.OPERATIONAL_COUNT;

    for (let i = 0; i < count; ++i) {
      registries.push(new Registry(true));
    }
  }

  _initInformationalRegistries() {
    const registries = this._registries;
    const count = RegistryManager.INFORMATIONAL_COUNT;

    for (let i = 0; i < count; ++i) {
      registries.push(new Registry(false));
    }
  }
}

RegistryManager.OPERATIONAL_COUNT = 4;
RegistryManager.INFORMATIONAL_COUNT = 8;

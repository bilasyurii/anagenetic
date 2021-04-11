import Gene from '../genome/gene';
import Registry from './registry';

export default class RegistryManager {
  constructor() {
    this._registries = null;
    this._lookup = null;

    this._init();
  }

  set(registryCode, value) {
    const registry = this._getRegistry(registryCode);

    if (registry.isWritable === true) {
      registry.value = value;
    }
  }

  get(registryCode) {
    return this._getRegistry(registryCode);
  }

  _init() {
    this._initRegistries();
    this._initLookup();
  }

  _initRegistries() {
    this._registries = [];

    this._initOperationalRegistries();
    this._initInformationalRegistries();
  }

  _initLookup() {
    const lookup = this._lookup = [];
    const lookupSize = Gene.VARIETY;
    const registries = this._registries;
    const registriesCount = RegistryManager.OVERALL_COUNT;

    let registryIndex = 0;

    for (let i = 0; i < lookupSize; ++i) {
      lookup.push(registries[registryIndex]);

      registryIndex = (registryIndex + 1) % registriesCount;
    }
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

  _getRegistry(code) {
    return this._lookup[code];
  }
}

RegistryManager.OPERATIONAL_COUNT = 4;
RegistryManager.INFORMATIONAL_COUNT = 8;
RegistryManager.OVERALL_COUNT = RegistryManager.OPERATIONAL_COUNT + RegistryManager.INFORMATIONAL_COUNT;

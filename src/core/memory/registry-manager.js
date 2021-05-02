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

  setTTL(value) {
    this._registries[4].value = value;

    return this;
  }

  setRndTick(value) {
    this._registries[5].value = value;

    return this;
  }

  setDirection(value) {
    this._registries[6].value = value;

    return this;
  }

  setLoad(value) {
    this._registries[7].value = value;

    return this;
  }

  setEnergy(value) {
    this._registries[8].value = value;

    return this;
  }

  setSize(value) {
    this._registries[9].value = value;

    return this;
  }

  setEventType(value) {
    this._registries[10].value = value;

    return this;
  }

  setEventAngle(value) {
    this._registries[11].value = value;

    return this;
  }

  setEvent(type, angle) {
    const registries = this._registries;

    registries[10].value = type;
    registries[11].value = angle;

    return this;
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

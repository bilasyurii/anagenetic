export default class CommandContext {
  constructor(cell, iterator) {
    this.cell = cell;
    this.iterator = iterator;
    this.world = cell.world;
    this.chemicals = cell.chemicals;
    this.registries = cell.registries;
    this.memory = cell.memory;
  }
}

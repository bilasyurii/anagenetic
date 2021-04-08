export default class CommandContext {
  constructor(cell, iterator) {
    this.cell = cell;
    this.iterator = iterator;
    this.registries = cell.registries;
  }
}

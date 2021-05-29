import Cell from '../cell/cell';
import Chemical from '../chemicals/chemical';

export default class EntityFactory {
  constructor(world) {
    this.world = world;
  }

  cell(genome) {
    const world = this.world;
    const cell = new Cell(world);

    cell.genome = genome;
    world.addCell(cell);

    return cell;
  }

  chemical(element, count) {
    const world = this.world;
    const chemical = new Chemical(world, element, count);

    world.addChemical(chemical);

    return chemical;
  }
}

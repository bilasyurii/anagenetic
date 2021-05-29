export default class ChemicalElement {
  constructor(name, damagePriority, color, energyEquivalent) {
    this.name = name;
    this.damagePriority = damagePriority;
    this.color = color;
    this.energyEquivalent = energyEquivalent;
    this.code = -1;
  }
}

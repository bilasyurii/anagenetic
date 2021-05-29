export default class ChemicalElement {
  constructor(name, damagePriority, color, energyEquivalent, ttl) {
    this.name = name;
    this.damagePriority = damagePriority;
    this.color = color;
    this.energyEquivalent = energyEquivalent;
    this.ttl = ttl;
    this.code = -1;
  }
}

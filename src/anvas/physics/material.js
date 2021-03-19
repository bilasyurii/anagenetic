export default class Material {
  constructor(restitution) {
    this.restitution = restitution;
  }
}

Material.default = new Material(1);

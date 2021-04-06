export default class Gene {
  constructor(value) {
    this.value = (value === undefined ? 0 : value);
  }

  clone() {
    return new Gene(this.value);
  }

  static random() {
    const value = ~~(Math.random() * Gene.MAX_VAL);

    return new Gene(value);
  }
}

Gene.MAX_VAL = 256;

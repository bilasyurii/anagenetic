export default class Gene {
  constructor(value) {
    this.value = (value === undefined ? 0 : value);
  }

  clone() {
    return new Gene(this.value);
  }

  static random() {
    const value = ~~(Math.random() * Gene.VARIETY);

    return new Gene(value);
  }
}

Gene.VARIETY = 256;
Gene.MAX_VAL = Gene.VARIETY - 1;

import Debug from '../../anvas/debug/debug';
import ArrayUtils from '../../anvas/utils/array-utils';
import Gene from '../genome/gene';

export default class ElementRegistry {
  constructor() {
    Debug.staticClass();
  }

  static register(element) {
    ElementRegistry._elements.push(element);
  }

  static forEach(callback) {
    ArrayUtils.forEach(ElementRegistry._elements, callback);
  }

  static get(index) {
    return ElementRegistry._lookup[index];
  }

  static getDamageQueue() {
    return ElementRegistry._damageQueue;
  }

  static initLookup() {
    const lookup = ElementRegistry._lookup = [];
    const lookupSize = Gene.VARIETY;
    const elements = ElementRegistry._elements;
    const elementsCount = elements.length;

    let elementIndex = 0;

    for (let i = 0; i < lookupSize; ++i) {
      lookup.push(elements[elementIndex]);
  
      elementIndex = (elementIndex + 1) % elementsCount;
    }
  }

  static initDamageQueue() {
    ElementRegistry._damageQueue = ElementRegistry._elements
      .slice(0)
      .sort(ElementRegistry._comparator)
      .map((element) => element.name);
  }

  static _comparator(a, b) {
    return b.damagePriority - a.damagePriority;
  }
}

ElementRegistry._elements = [];
ElementRegistry._damageQueue = null;
ElementRegistry._lookup = null;

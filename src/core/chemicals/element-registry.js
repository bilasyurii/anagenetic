import Debug from '../../anvas/debug/debug';
import Gene from '../genome/gene';

export default class ElementRegistry {
  constructor() {
    Debug.staticClass();
  }

  static register(element) {
    ElementRegistry._elements.push(element);
  }

  static get(index) {
    return ElementRegistry._lookup[index];
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
}

ElementRegistry._elements = [];
ElementRegistry._lookup = null;

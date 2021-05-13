import Debug from '../anvas/debug/debug';
import $ from 'jquery';

export default class TemplateMaster {
  constructor() {
    Debug.staticClass();
  }

  static init() {
    const templates = TemplateMaster._templates;

    $('.template').each(function() {
      const name = this.getAttribute('template-name');
      const childNodes = this.childNodes;
      const count = childNodes.length;

      this.remove();

      for (let i = 0; i < count; ++i) {
        const node = childNodes[i];

        if ((node instanceof Text) === false) {
          templates[name] = node;

          return;
        }
      }
    });
  }

  static create(name) {
    return TemplateMaster._templates[name].cloneNode(true);
  }

  static get(name) {
    return TemplateMaster._templates[name];
  }
}

TemplateMaster._templates = {};

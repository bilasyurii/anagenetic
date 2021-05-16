import Debug from '../../anvas/debug/debug';
import $ from 'jquery';

export default class TemplateMaster {
  constructor() {
    Debug.staticClass();
  }

  static init() {
    const templates = TemplateMaster._templates;

    $('ins').each(function() {
      const name = this.getAttribute('name');
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

  static createText(str) {
    return document.createTextNode(str);
  }

  static createTag(tag) {
    return document.createElement(tag);
  }
}

TemplateMaster._templates = {};
TemplateMaster._textNode = null;

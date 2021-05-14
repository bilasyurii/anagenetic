import UIFactory from '../ui-factory';
import $ from 'jquery';

export default class UIElement {
  /**
   * @param {UIFactory} factory 
   * @param {HTMLElement} dom
   */
  constructor(factory, dom) {
    this.create = factory;
    this.dom = dom;
    this.dom$ = $(dom);
    this.parent = null;
  }

  remove() {
    this.dom.remove();

    return this;
  }

  add(child) {
    child.parent = this;

    this.dom.appendChild(child.dom);

    return this;
  }

  html(html) {
    this.dom$.html(html);

    return this;
  }

  addTo(parent) {
    parent.add(this);

    return this;
  }

  inject(child, placeholderName) {
    const placeholders = this.dom$.find('placeholder');
    const count = placeholders.length;

    if (count === 0) {
      return;
    }

    let replaced = false;

    for (let i = 0; i < count; ++i) {
      const placeholder = placeholders[i];

      if (placeholder.getAttribute('name') === placeholderName) {
        placeholder.replaceWith(child.dom);

        replaced = true;

        break;
      }
    }

    if (replaced === false) {
      placeholders[0].replaceWith(child.dom);
    }

    child.parent = this;

    return this;
  }

  injectTo(parent, placeholderName) {
    parent.inject(this, placeholderName);

    return this;
  }
}

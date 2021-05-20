import UIFactory from './ui-factory';
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

    this._visibilityState = VisibilityState.Visible;
    this._visibilityClass = '';
    this._replacedPlaceholders = {};
  }

  get DI() {
    return this.create.DI;
  }

  onInjected() {}

  getVisibility() {
    return this._visibilityState;
  }

  remove() {
    this.dom.remove();
    this.parent = null;

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
    const replacedPlaceholders = this._replacedPlaceholders;
    const replacedPlaceholder = replacedPlaceholders[placeholderName];
    const dom = child.dom;

    if (replacedPlaceholder !== undefined) {
      replacedPlaceholder.replaceWith(dom);
      replacedPlaceholders[placeholderName] = dom;
      child.parent = this;

      return this;
    }

    const placeholders = this.dom$.find('placeholder');
    const count = placeholders.length;

    if (count === 0) {
      return this;
    }

    let replaced = false;

    for (let i = 0; i < count; ++i) {
      const placeholder = placeholders[i];

      if (placeholder.getAttribute('name') === placeholderName) {
        placeholder.replaceWith(dom);

        replaced = true;

        break;
      }
    }

    if (replaced === false) {
      placeholders[0].replaceWith(dom);
    }

    replacedPlaceholders[placeholderName] = dom;

    child.parent = this;

    return this;
  }

  injectTo(parent, placeholderName) {
    parent.inject(this, placeholderName);

    return this;
  }

  addClass(name) {
    this.dom$.addClass(name);

    return;
  }

  removeClass(name) {
    this.dom$.removeClass(name);

    return;
  }

  show() {
    switch (this._visibilityState) {
      case VisibilityState.Hidden:
      case VisibilityState.Invisible:
        this.removeClass(this._visibilityClass);
        break;
    }

    return this;
  }

  hide() {
    const hidden = VisibilityState.Hidden;

    switch (this._visibilityState) {
      case hidden:
        return;
      case VisibilityState.Invisible:
        this.removeClass('invisible');
        break;
    }

    this._visibilityClass = hidden;
    this.addClass(hidden);

    return this;
  }

  makeInvisible() {
    const invisible = VisibilityState.Invisible;

    switch (this._visibilityState) {
      case invisible:
        return;
      case VisibilityState.Hidden:
        this.removeClass('hidden');
        break;
    }

    this._visibilityClass = invisible;
    this.addClass(invisible);

    return this;
  }

  toggleHidden() {
    const hidden = VisibilityState.Hidden;
    const visible = VisibilityState.Visible;

    switch (this._visibilityState) {
      case VisibilityState.Invisible:
      case hidden:
        this.removeClass(this._visibilityClass);
        this._visibilityState = visible;
        break;
      case visible:
        this.addClass('hidden');
        this._visibilityState = hidden;
    }
  }
}

const VisibilityState = {
  Visible: 'visible',
  Hidden: 'hidden',
  Invisible: 'invisible',
};

UIElement.VisibilityState = VisibilityState;

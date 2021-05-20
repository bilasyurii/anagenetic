import UIElement from './ui-element';
import Button from '../shared/button';
import TextNode from '../shared/text-node';
import TemplateMaster from './template-master';

export default class UIFactory {
  constructor(di) {
    this._di = di;
  }

  get DI() {
    return this._di;
  }

  text(str = '') {
    return this._process(new TextNode(this, TemplateMaster.createText(str)));
  }

  button() {
    return this._process(new Button(this, TemplateMaster.create('button')));
  }

  tag(tag) {
    return this._process(new UIElement(this, TemplateMaster.createTag(tag)));
  }

  block() {
    return this._process(new UIElement(this, TemplateMaster.createTag('div')));
  }

  template(name) {
    return this._process(new UIElement(this, TemplateMaster.create(name)));
  }

  custom(name, elementClass) {
    return this._process(new elementClass(this, TemplateMaster.create(name)));
  }

  _process(element) {
    this._di.process(element);

    return element;
  }
}

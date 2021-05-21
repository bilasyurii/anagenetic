import UIElement from './ui-element';
import Button from '../shared/button';
import TextNode from '../shared/text-node';
import TemplateMaster from './template-master';
import TextInput from '../shared/text-input';
import FormItem from '../shared/form-item';
import SelectInput from '../shared/select-input';

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

  textInput() {
    return this._process(new TextInput(this, TemplateMaster.create('text-input')));
  }

  numberInput() {
    return this._process(new TextInput(this, TemplateMaster.create('number-input')));
  }

  selectInput() {
    return this._process(new SelectInput(this, TemplateMaster.create('select-input')));
  }

  formItem() {
    return this._process(new FormItem(this, TemplateMaster.create('form-item')));
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

  /**
   * @param {T} element 
   * @returns {T}
   * @template T
   */
  _process(element) {
    this._di.process(element);

    return element;
  }
}

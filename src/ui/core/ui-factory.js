import UIElement from './ui-element';
import Button from '../shared/button';
import TextNode from '../shared/text-node';
import TemplateMaster from './template-master';

export default class UIFactory {
  constructor() {
  }

  text(str = '') {
    return new TextNode(this, TemplateMaster.createText(str));
  }

  button() {
    return new Button(this, TemplateMaster.create('button'));
  }

  tag(tag) {
    return new UIElement(this, TemplateMaster.createTag(tag));
  }

  block() {
    return new UIElement(this, TemplateMaster.createTag('div'));
  }

  template(name) {
    return new UIElement(this, TemplateMaster.create(name));
  }

  custom(name, elementClass) {
    return new elementClass(this, TemplateMaster.create(name));
  }
}
import UIElement from './core/ui-element';
import Button from './shared/button';
import SidePanel from './side-panel/side-panel';
import TemplateMaster from './template-master';

export default class UIFactory {
  constructor() {
  }

  button() {
    return new Button(this, TemplateMaster.create('button'));
  }

  template(name) {
    return new UIElement(this, TemplateMaster.create(name));
  }

  custom(name, elementClass) {
    return new elementClass(this, TemplateMaster.create(name));
  }
}

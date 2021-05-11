import './main.scss';
import $ from 'jquery';

export default class UI {
  constructor() {
    console.log($('body').html());
  }
}

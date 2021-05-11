import './main.scss';
import '../../node_modules/milligram/dist/milligram.min.css';
import $ from 'jquery';

export default class UI {
  constructor() {
    console.log($('body').html());
  }
}

import UIElement from '../../core/ui-element';
import $ from 'jquery';
import Observable from '../../../anvas/events/observable';
import GenomePickerItem from './genome-picker-item';
import ArrayUtils from '../../../anvas/utils/array-utils';

export default class SimulationGenomePicker extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onAdd = new Observable();

    this._items = [];
    this._genomesContainer$ = null;
    this._addButton$ = null;
    this._removeButton$ = null;
    this._selectedItem = null;

    this._init();
  }

  addGenome(genome) {
    const item = this.create
      .custom('genome-picker-item', GenomePickerItem)
      .setGenome(genome);

    item.onClick.add(this._onItemClicked, this);
    this._items.push(item);
    this._genomesContainer$.append(item.dom);

    return this;
  }

  _init() {
    this._setupNodes();
    this._setupEvents();
  }

  _setupNodes() {
    const dom$ = this.dom$;

    this._genomesContainer$ = $(dom$.find('.genomes-wrapper')[0]);
    this._addButton$ = $(dom$.find('.add-genome')[0]);
    this._removeButton$ = $(dom$.find('.remove-genome')[0]);
  }

  _setupEvents() {
    this._addButton$.click(() => this._add());
    this._removeButton$.click(() => this._remove());
  }

  _add() {
    this.onAdd.post();
  }

  _remove() {
    const selected = this._selectedItem;

    if (selected === null) {
      return this;
    }

    selected.dom$.remove();
    ArrayUtils.removeByValue(this._items, selected);
    this._selectedItem = null;

    return this;
  }

  _onItemClicked(item) {
    // console.log(item);
    const selected = this._selectedItem;

    if (selected !== null) {
      selected.deselect();
    }

    if (selected !== item) {
      this._selectedItem = item;
      item.select();
    } else {
      this._selectedItem = null;
    }

    return this;
  }
}

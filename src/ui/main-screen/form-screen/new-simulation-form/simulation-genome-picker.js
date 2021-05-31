import $ from 'jquery';
import GenomePickerItem from './genome-picker-item';
import ArrayUtils from '../../../../anvas/utils/array-utils';
import Observable from '../../../../anvas/events/observable';
import UIElement from '../../../core/ui-element';

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

  reset() {
    this._items = [];
    this._genomesContainer$.children().remove();
  }

  getGenomes() {
    return ArrayUtils.map(this._items, function(item) {
      return item.getGenome();
    });
  }

  addGenome(genome) {
    const items = this._items;

    if (ArrayUtils.find(items, function(item) {
      return item.getGenome().compare(genome) === 0;
    })) {
      return this;
    }

    const item = this.create
      .custom('genome-picker-item', GenomePickerItem)
      .setGenome(genome);

    item.onClick.add(this._onItemClicked, this);
    items.push(item);
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

import Observable from '../../../anvas/events/observable';
import UIElement from '../../core/ui-element';
import $ from 'jquery';

export default class SimulationControls extends UIElement {
  constructor(factory, dom) {
    super(factory, dom);

    this.onPlay = new Observable();
    this.onPause = new Observable();
    this.onStop = new Observable();
    this.onSpeedChanged = new Observable();

    this._isPlaying = true;
    this._speed = -1;

    this._playButton$ = null;
    this._pauseButton$ = null;
    this._stopButton$ = null;
    this._speedSlider$ = null;
    this._speedText$ = null;

    this._init();
  }

  isPlaying() {
    return this._isPlaying;
  }

  play(silent) {
    if (this._isPlaying === true) {
      return this;
    }

    this._isPlaying = true;

    this._playButton$.addClass('hidden');
    this._pauseButton$.removeClass('hidden');

    if (silent !== true) {
      this.onPlay.post();
    }

    return this;
  }

  pause(silent) {
    if (this._isPlaying === false) {
      return this;
    }

    this._isPlaying = false;

    this._pauseButton$.addClass('hidden');
    this._playButton$.removeClass('hidden');

    if (silent !== true) {
      this.onPause.post();
    }

    return this;
  }

  getSpeed() {
    return this._speed;
  }

  setSpeed(speed, silent) {
    if (speed === this._speed) {
      return this;
    }

    this._speed = speed;
    this._speedText$.html('x' + speed.toFixed(2));

    if (silent !== true) {
      this.onSpeedChanged.post(speed);
    }

    return this;
  }

  _init() {
    this._setupNodes();
    this._setupEvents();
    this.setSpeed(1, true);
    this.pause(true);
  }

  _setupNodes() {
    const dom$ = this.dom$;

    this._playButton$ = $(dom$.find('.play-button')[0]);
    this._pauseButton$ = $(dom$.find('.pause-button')[0]);
    this._stopButton$ = $(dom$.find('.stop-button')[0]);
    this._speedSlider$ = $(dom$.find('.speed-slider')[0]);
    this._speedText$ = $(dom$.find('.speed-text')[0]);
  }

  _setupEvents() {
    this._playButton$.click(() => {
      this.play();
    });

    this._pauseButton$.click(() => {
      this.pause();
    });

    this._stopButton$.click(() => {
      this.onStop.post();
    });

    const speedSlider$ = this._speedSlider$;

    speedSlider$.on('input', function() {
      speedSlider$.trigger('change');
    });

    speedSlider$.change(() => {
      const speedIndex = speedSlider$.val();
      const speed = speedLookup[speedIndex];

      this.setSpeed(speed);
    });
  }
}

const speedLookup = [
  0.25,
  0.5,
  1,
  2,
  4,
];

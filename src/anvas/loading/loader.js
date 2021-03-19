import Observable from '../events/observable.js';
import Math2 from '../utils/math2.js';
import AssetFile, { FileType } from './asset-file.js';

export default class Loader {
  constructor(cache) {
    this.engine = cache.engine;

    this.isLoading = false;

    this.onStarted = new Observable();
    this.onLoaded = new Observable();
    this.onProgress = new Observable();
    this.onFileStarted = new Observable();
    this.onFileLoaded = new Observable();
    this.onError = new Observable();

    this._queue = [];
    this._loadedCount = 0;
    this._failedCount = 0;
    this._processedCount = 0;
    this._totalCount = 0;
    this._progress = 0;

    this._cache = cache;
    this._textures = cache.engine.textures;
  }

  get progress() {
    return this._progress;
  }

  get loadedCount() {
    return this._loadedCount;
  }

  get failedCount() {
    return this._failedCount;
  }

  get processedCount() {
    return this._processedCount;
  }

  get totalCount() {
    return this._totalCount;
  }

  reset() {
    this._loadedCount = 0;
    this._failedCount = 0;
    this._processedCount = 0;
    this._totalCount = 0;

    this.isLoading = false;

    this.onStarted.removeAll();
    this.onLoaded.removeAll();
    this.onFileStarted.removeAll();
    this.onFileLoaded.removeAll();
    this.onError.removeAll();

    return this;
  }

  start() {
    if (this.isLoading === true) {
      return this;
    }

    this.isLoading = true;

    this.onStarted.post(this._totalCount);

    this._updateProgress();
    this._processQueue();

    return this;
  }

  image(key, url) {
    this._addToQueue(FileType.Image, key, url);

    return this;
  }

  _addToQueue(type, key, url) {
    const file = new AssetFile(type, key, url);

    this._queue.push(file);

    ++this._totalCount;
  }

  _processQueue() {
    if (this.isLoading === false) {
      this._onFinished();

      return;
    }

    const queue = this._queue;

    for (let i = 0; i < queue.length; ++i) {
      const file = queue[i];

      if (file.isLoaded === true || file.error) {
        queue.splice(i, 1);

        --i;
      } else {
        this._loadFile(file);

        return;
      }
    }

    if (queue.length === 0) {
      this._onFinished();

      return;
    }

    this._updateProgress();
  }

  _updateProgress() {
    if (this._totalCount === 0) {
      this._progress = 1;
    } else {
      this._progress = Math2.clamp(this._processedCount / this._totalCount, 0, 1);
    }
  }

  _loadFile(file) {
    this.onFileStarted.post(file);

    const type = file.type;

    switch (type) {
      case FileType.Image:
        this._loadImage(file);
        break;
    }
  }

  _loadImage(file) {
    const image = new Image();
    const this_ = this;

    file.data = image;

    image.onload = function() {
      image.onload = null;
      image.onerror = null;
      this_._onFileLoaded(file);
    };

    image.onerror = function() {
      image.onload = null;
      image.onerror = null;
      this_._onLoadingFailed(file);
    };

    image.src = file.url;

    if (image.complete === true && image.width && image.height) {
      image.onload = null;
      image.onerror = null;
      this._onFileLoaded(file);
    }
  }

  _onFileLoaded(file) {
    const type = file.type;

    switch (type) {
      case FileType.Image:
        this._onImageLoaded(file);
        break;
    }

    ++this._loadedCount;
    ++this._processedCount;

    this._updateProgress();

    this.onFileLoaded.post(file.key, this._progress, this._loadedCount);

    this._onFileProcessed(file);
  }

  _onLoadingFailed(file) {
    file.error = `Couldn't load file ${file.key} from URL: ${file.url}.`;

    ++this._failedCount;
    ++this._processedCount;

    this._updateProgress();

    this.onError.post(file.key, file, this._progress, this._failedCount);

    this._onFileProcessed(file);
  }

  _onFileProcessed(file) {
    file.isLoaded = true;
    file.isLoading = false;

    const error = file.error;

    if (error) {
      console.error(error);
    }

    this._processQueue();
  }

  _onFinished() {
    this.isLoading = false;

    this.onLoaded.post();

    this.reset();
  }

  _onImageLoaded(file) {
    const key = file.key;
    const image = file.data;

    this._cache.addImage(key, image);

    const width = image.naturalWidth || image.width || 0;
    const height = image.naturalHeight || image.height || 0;

    this._textures.create(key, image, width, height);
  }
}

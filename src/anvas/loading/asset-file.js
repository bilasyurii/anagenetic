
export const FileType = {
  Image: 'Image',
};

export default class AssetFile {
  constructor(type, key, url) {
    this.type = type;
    this.key = key;
    this.url = url;

    this.isLoading = false;
    this.isLoaded = false;
    this.error = false;

    this.data = null;
  }
}

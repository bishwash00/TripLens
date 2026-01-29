class OfflineBannerView {
  _banner = document.querySelector('.offline-banner');

  show() {
    this._banner.classList.remove('hidden');
  }

  hide() {
    this._banner.classList.add('hidden');
  }

  update() {
    if (!navigator.onLine) {
      this.show();
    } else {
      this.hide();
    }
  }

  addNetworkListeners() {
    window.addEventListener('online', this.update.bind(this));
    window.addEventListener('offline', this.update.bind(this));
    this.update(); // Initial check
  }
}

export default new OfflineBannerView();

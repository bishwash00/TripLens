import icons from 'url:../../img/icons.svg';
import View from './View';

class loadingOverlayView extends View {
  _parentEl = document.querySelector('.loading-overlay');

  addOverlay() {
    this._parentEl.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }

  removeOverlay() {
    this._parentEl.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

export default new loadingOverlayView();

import icons from 'url:../../img/icons.svg';

export default class View {
  _parentEl = '';
  _dashboard = document.querySelector('.dashboard');
  _sidebar = document.querySelector('.sidebar');
  _data;

  render(data, viewType = '') {
    this._data = data;
    console.log(data);

    const markup = this._generateMarkup();

    if (viewType === 'error') {
      this._parentEl.querySelector('.error')?.remove();
      this._parentEl.insertAdjacentHTML('afterbegin', markup);
      this._dashboard?.classList.add('hidden');
      this._sidebar?.classList.add('hidden');
      return;
    }

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}

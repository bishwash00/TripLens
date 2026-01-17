import icons from 'url:../../img/icons.svg';

export default class View {
  _parentEl = '';
  _data;

  render(data) {
    this._data = data;

    console.log(data);

    const markup = this._generateMarkup();

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}

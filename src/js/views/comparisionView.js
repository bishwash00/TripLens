import { Handler } from 'leaflet';
import icons from 'url:../../img/icons.svg';

class comparisionView {
  _data;
  _parentEl = document.querySelector('.compare');
  _compareOverlay = document.querySelector('.compare-overlay');
  _headerCompare = document.querySelector('.header__compare');
  _warning = document.querySelector('.compare__warning');
  _compareResults = document.querySelector('.compare__results');
  _toastContainer = document.querySelector('.toast-container');
  _activeCompareEl;

  constructor() {
    this._addToggleOverlay();
  }

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();

    [...this._activeCompareEl.children].forEach(child => {
      if (!child.classList.contains('compare__search')) child.remove();
    });
    this._activeCompareEl.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup() {
    return `
       <div class="compare__card compare__card--filled">
              <div class="compare__card-content">
                <img
                  class="flag"
                  src="${this._data.countryFlag}"
                  alt="flag"
                />
                <div class="city">${this._data.capitalName}</div>
                <div class="country">${this._data.countryName}</div>
                <div class="weather">
                  <img src="https://openweathermap.org/img/wn/${this._data.weather.icon.replace(
                    'n',
                    'd',
                  )}@2x.png" alt="icon" />
                  <span class="temp">${this._data.weather.temperature.toFixed(
                    1,
                  )}°C</span>
                  <span>${this._data.weather.description.replace(/\b\w/g, c =>
                    c.toUpperCase(),
                  )}</span>
                </div>
                <div class="time">${this._data.time.time.split('T')[1].split('.')[0]}</div>
              </div>
            </div>
    `;
  }

  _addToggleOverlay() {
    this._headerCompare.addEventListener('click', () => {
      this._compareOverlay.classList.toggle('hidden');
    });

    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.compare__close');
      if (!btn) return;
      this._compareOverlay.classList.toggle('hidden');
    });
  }

  _getQuery(El) {
    const query = El.querySelector('.compare__input').value;

    return query;
  }

  _clearInput(El) {
    const input = El.querySelector('.compare__input');
    input.value = '';
    input.blur();
  }

  addHandlerSubmit(handler) {
    const forms = this._parentEl.querySelectorAll('.compare__search');
    forms.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();

        const query =
          this._getQuery(form) === '' ? undefined : this._getQuery(form);

        this._activeCompareEl = form.parentElement;

        if (this._activeCompareEl.classList.contains('compare__selection--1'))
          handler(query, 1);
        else handler(query, 2);

        this._clearInput(form);
      });
    });
  }

  addHandlerCompareBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.compare__submit-main');
      if (!btn) return;

      handler();
    });
  }

  addWarning() {
    this._warning.classList.remove('hidden');

    const markup = `
    <div class="toast toast--warning">
      <span class="toast__icon">⚠️</span>
      <div class="toast__content">
        <div class="toast__title">Warning</div>
        <div class="toast__message">Please check your input.</div>
      </div>
      <button class="toast__close">&times;</button>
    </div>
    `;

    this._toastContainer.insertAdjacentHTML('beforeend', markup);
    this._toastListner();
  }

  _toastListner() {
    const btns = this._toastContainer.querySelectorAll('.toast__close');
    btns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const toast = btn.closest('.toast');
        if (!toast) return;
        toast.classList.add('removing');
        setTimeout(() => {
          toast.remove();
        }, 300);
      });
    });
  }

  renderComparison(data) {
    this._compareResults.innerHTML = '';
    this._warning.classList.add('hidden');

    const markup = `
          <h3 class="compare__results-title">Comparison Results</h3>
          <div class="compare__table">
            <div class="compare__row compare__row--header">
              <span class="compare__cell">Metric</span>
              <!-- Main Compare Submit Button -->

              <span class="compare__cell compare__cell--1">${data.trip1.countryName}</span>
              <span class="compare__cell compare__cell--2">${data.trip2.countryName}</span>
            </div>
            <div class="compare__row">
              <span class="compare__cell compare__cell--label"
                >Temperature</span
              >
              <span class="compare__cell compare__cell--1">${data.trip1.weather.temperature}°C</span>
              <span class="compare__cell compare__cell--2">${data.trip2.weather.temperature}°C</span>
            </div>
            <div class="compare__row">
              <span class="compare__cell compare__cell--label">Weather</span>
              <span class="compare__cell compare__cell--1">${data.trip1.weather.description.replace(
                /\b\w/g,
                c => c.toUpperCase(),
              )}</span>
              <span class="compare__cell compare__cell--2">${data.trip2.weather.description.replace(
                /\b\w/g,
                c => c.toUpperCase(),
              )}</span>
            </div>
            <div class="compare__row">
              <span class="compare__cell compare__cell--label">Local Time</span>
              <span class="compare__cell compare__cell--1">${data.trip1.time.time.split('T')[1].split('.')[0]}</span>
              <span class="compare__cell compare__cell--2">${data.trip2.time.time.split('T')[1].split('.')[0]}</span>
            </div>
            <div class="compare__row">
              <span class="compare__cell compare__cell--label">Population</span>
              <span class="compare__cell compare__cell--1">${(data.trip1.population / 1000000).toFixed(1)}M</span>
              <span class="compare__cell compare__cell--2">${(data.trip2.population / 1000000).toFixed(1)}M</span>
            </div>
            <div class="compare__row">
              <span class="compare__cell compare__cell--label">Currency</span>
              <span class="compare__cell compare__cell--1">${data.trip1.currency.name} (${data.trip1.currency.symbol})</span>
              <span class="compare__cell compare__cell--2">${data.trip2.currency.name} (${data.trip2.currency.symbol})</span>
            </div>
            <div class="compare__row">
              <span class="compare__cell compare__cell--label">Language</span>
              <span class="compare__cell compare__cell--1">${data.trip1.language}</span>
              <span class="compare__cell compare__cell--2">${data.trip2.language}</span>
            </div>
          </div>`;

    this._compareResults.insertAdjacentHTML('beforeend', markup);
  }
}

export default new comparisionView();

import icons from 'url:../../img/icons.svg';
import View from './View';

class destinationView extends View {
  _parentEl = document.querySelector('.destination');

  _generateMarkup() {
    this.updateBookmarkIcons();

    return `
    <div class="destination__header">
                <img
                  class="destination__flag"
                  src="${this._data.countryFlag}"
                  alt="Country flag"
                  loading="lazy"
                />
                <div class="destination__titles">
                  <h3 class="destination__city">${this._data.capitalName}</h3>
                  <p class="destination__country">${this._data.countryName}</p>
                </div>
              </div>
              <div class="destination__info">
                <div class="destination__info-item">
                  <svg class="destination__info-icon">
                    <use href="${icons}#icon-population"></use>
                  </svg>
                  <span class="destination__label">Population</span>
                  <span class="destination__value">${(
                    this._data.population / 1000000
                  ).toFixed(1)}M</span>
                </div>
                <div class="destination__info-item">
                  <svg class="destination__info-icon">
                    <use href="${icons}#icon-home"></use>
                  </svg>
                  <span class="destination__label">Capital</span>
                  <span class="destination__value">${
                    this._data.capitalName
                  }</span>
                </div>
                <div class="destination__info-item">
                  <svg class="destination__info-icon">
                    <use href="${icons}#icon-globe"></use>
                  </svg>
                  <span class="destination__label">Region</span>
                  <span class="destination__value">${this._data.region}</span>
                </div>
                <div class="destination__info-item">
                  <svg class="destination__info-icon">
                    <use href="${icons}#icon-language"></use>
                  </svg>
                  <span class="destination__label">Language</span>
                  <span class="destination__value">${this._data.language}</span>
                </div>
                <div class="destination__info-item">
                  <svg class="destination__info-icon">
                    <use href="${icons}#icon-currency"></use>
                  </svg>
                  <span class="destination__label">Currency</span>
                  <span class="destination__value">${
                    this._data.currency.name
                  } (${this._data.currency.symbol})</span>
                </div>
                <div class="destination__info-item">
                  <svg class="destination__info-icon">
                    <use href="${icons}#icon-coordinates"></use>
                  </svg>
                  <span class="destination__label">Coordinates</span>
                  <span class="destination__value">${
                    this._data.coordinates[0]
                  }°N, ${this._data.coordinates[1]}°E</span>
                </div>
              </div>
            </div>`;
  }

  renderSkeletonLoading() {
    const markup = `
    <div class="skeleton skeleton--destination">
              <div class="skeleton__flag"></div>
              <div class="skeleton__line skeleton__line--lg"></div>
              <div class="skeleton__line skeleton__line--md"></div>
              <div class="skeleton__grid">
                <div class="skeleton__box"></div>
                <div class="skeleton__box"></div>
                <div class="skeleton__box"></div>
                <div class="skeleton__box"></div>
                <div class="skeleton__box"></div>
                <div class="skeleton__box"></div>
              </div>
            </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new destinationView();

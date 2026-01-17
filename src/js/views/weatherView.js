import icons from 'url:../../img/icons.svg';
import View from './View';

class weatherView extends View {
  _parentEl = document.querySelector('.weather');

  _formatForecastLabel(dateStr) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === tomorrowStr) return 'Tomorrow';

    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  }

  _generateMarkup() {
    return `
    <div class="weather__current">
                <img
                  class="weather__icon"
                  src="https://openweathermap.org/img/wn/${this._data.current.icon.replace(
                    'n',
                    'd'
                  )}@2x.png"
                  alt="Weather icon"
                />
                <div class="weather__temp">${this._data.current.temperature.toFixed(
                  1
                )}°C</div>
                <div class="weather__condition">${this._data.current.description.replace(
                  /\b\w/g,
                  c => c.toUpperCase()
                )}</div>
                <div class="weather__details">
                ${['wind', 'humidity', 'pressure']
                  .map(type => {
                    const units = {
                      wind: 'm/s',
                      humidity: '%',
                      pressure: 'hPa',
                    };
                    return `
                  <div class="weather__detail">
                    <svg><use href="${icons}#icon-${type}"></use></svg>
                    <span class="weather__detail-label">${type}</span>
                    <span class="weather__detail-value">${this._data.current[type]} ${units[type]}</span>
                  </div>
                  `;
                  })
                  .join('')}
                </div>
              </div>
              <div class="weather__forecast">
                <h4 class="weather__forecast-title">5-Day Forecast</h4>
                <div class="forecast__list">
                ${this._data.forecast
                  .map(data => {
                    return `
                    <div class="forecast__day">
                    <span class="forecast__date">${this._formatForecastLabel(
                      data.date
                    )}</span>
                    <img
                      class="forecast__icon"
                      src="https://openweathermap.org/img/wn/${
                        data.icon
                      }@2x.png"
                      alt="Weather"
                    />
                    <span class="forecast__condition">${data.description?.replace(
                      /\b\w/g,
                      c => c.toUpperCase()
                    )}</span>
                    <span class="forecast__temp">${data.max}° / ${
                      data.min
                    }°</span>
                  </div>
                    `;
                  })
                  .join('')}
                </div>
              </div>
            </div>`;
  }

  renderSkeletonLoading() {
    const markup = `
    <div class="skeleton skeleton--weather">
              <div class="skeleton__weather-main">
                <div class="skeleton__circle"></div>
                <div class="skeleton__line skeleton__line--xl"></div>
                <div class="skeleton__line skeleton__line--md"></div>
              </div>
              <div class="skeleton__weather-details">
                <div class="skeleton__box"></div>
                <div class="skeleton__box"></div>
              </div>
            </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new weatherView();

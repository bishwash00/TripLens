import icons from 'url:../../img/icons.svg';
import View from './View';

class localTimeView extends View {
  _parentEl = document.querySelector('.timezone');
  _timerInterval = null;

  _getLocalTime() {
    const now = new Date();
    const utcString = this._data.localTime.utc;

    const match = utcString.match(/([+-]?)(\d+):?(\d*)/);
    if (!match) return now;

    const sign = match[1] === '-' ? -1 : 1;
    const hours = parseInt(match[2], 10) || 0;
    const minutes = parseInt(match[3], 10) || 0;
    const utcOffsetMinutes = sign * (hours * 60 + minutes);

    return new Date(
      now.getTime() + (utcOffsetMinutes + now.getTimezoneOffset()) * 60000,
    );
  }

  _generateMarkup() {
    return `
    <div class="timezone__time">${this._getLocalTime().toLocaleTimeString(
      'en-GB',
      {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      },
    )}</div>
              <div class="timezone__date">${this._data.localTime.date}</div>
              <div class="timezone__zone">${this._data.localTime.effTimeZone}</div>
              <div class="timezone__offset">UTC${this._data.localTime.utc}</div>
              <div class="timezone__sun">
                <div class="timezone__sun-item">
                  <svg><use href="${icons}#icon-sunrise"></use></svg>
                  <span class="timezone__sun-label">Sunrise</span>
                  <span class="timezone__sun-value">${this._data.weather.current.sunrise}</span>
                </div>
                <div class="timezone__sun-item">
                  <svg><use href="${icons}#icon-sunset"></use></svg>
                  <span class="timezone__sun-label">Sunset</span>
                  <span class="timezone__sun-value">${this._data.weather.current.sunset}</span>
                </div>
              </div>`;
  }

  renderSkeletonLoading() {
    const markup = `
     <div class="skeleton skeleton--timezone hidden">
              <div class="skeleton__line skeleton__line--xl"></div>
              <div class="skeleton__line skeleton__line--md"></div>
              <div class="skeleton__line skeleton__line--sm"></div>
              <div class="skeleton__sun-times">
                <div class="skeleton__box"></div>
                <div class="skeleton__box"></div>
              </div>
            </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  startClock() {
    if (this._timerInterval) clearInterval(this._timerInterval);

    this._timerInterval = setInterval(() => {
      const timeEl = this._parentEl.querySelector('.timezone__time');
      if (timeEl && this._data?.localTime) {
        timeEl.textContent = this._getLocalTime().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      }
    }, 1000);
  }

  stopClock() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  }
}

export default new localTimeView();

import icons from 'url:../../img/icons.svg';
import View from './View';

class recentSearchesView extends View {
  _parentEl = document.querySelector('.recent-searches');
  _search = document.querySelector('.header__search');

  _generateMarkup() {
    if (this._data.length === 0)
      return `
    <div class="recent-searches__empty">
                <svg><use href="${icons}#icon-search"></use></svg>
                <p>No recent searches</p>
                <span>Your search history will appear here</span>
              </div>
    `;

    return `
    <div class="recent-searches__list">
    ${this._data
      .map(
        data => `
            <button class="search-item" data-query="${data.capitalName}, ${data.countryCode}">
                  <svg class="search-item__icon">
                    <use href="${icons}#icon-search"></use>
                  </svg>
                  <span class="search-item__text">${data.capitalName}, ${data.countryCode}</span>
                  <span class="search-item__time">${this._formatSearchTime(data.searchedTime)}</span>
                </button>
              </div>
            `,
      )
      .join('')}
    `;
  }

  _formatSearchTime(time) {
    const min = Math.floor((new Date() - new Date(time)) / 1000 / 60);
    if (min >= 60) {
      const hr = Math.floor(min / 60);
      if (hr >= 24) {
        const day = Math.floor(hr / 24);
        return `${day} days ago`;
      }
      return `${hr} hours ago`;
    }
    return `${min} min ago`;
  }

  addHandlerRecentSearch() {
    this._search.addEventListener('submit', e => {
      e.preventDefault();
    });
  }

  addHandlerClearSearch(handler) {
    this._searchClearBtn.addEventListener('click', handler);
  }

  addHandlerRecentSearchClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search-item');
      if (!btn) return;
      const [capitalName, countryCode] = btn.dataset.query
        .split(',')
        .map(s => s.trim());
      if (handler) handler(capitalName, countryCode);
    });
  }
}

export default new recentSearchesView();

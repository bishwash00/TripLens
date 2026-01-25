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
                  <span class="search-item__time">2 min ago</span>
                </button>
              </div>
            `,
      )
      .join('')}
    `;
  }

  addHandlerRecentSearch() {
    this._search.addEventListener('submit', e => {
      e.preventDefault();
    });
  }

  addHandlerClearSearch(handler) {
    this._searchClearBtn.addEventListener('click', handler);
  }
}

export default new recentSearchesView();

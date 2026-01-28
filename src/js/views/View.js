import icons from 'url:../../img/icons.svg';

export default class View {
  _parentEl = '';
  _dashboard = document.querySelector('.dashboard');
  _searchBar = document.querySelector('.header__search-input');
  _sidebar = document.querySelector('.sidebar');
  _bookmarksCountEl = document.querySelector('.card__count');
  _bookmarkSVG = document.querySelector('.btn--save').querySelector('use');
  _searchClearBtn = document.querySelector('.card__clear');
  _data;

  render(data, viewType = '') {
    this._data = data;

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

  checkBookmarkIcon() {
    if (this._data.bookmarked) {
      this._bookmarkSVG.setAttribute('href', `${icons}#icon-bookmark-fill`);
      console.log(true);
    } else {
      this._bookmarkSVG.setAttribute('href', `${icons}#icon-bookmark`);
      console.log(false);
    }
  }

  updateBookmarkIcons() {
    if (!Array.isArray(this._data)) {
      if (this._data && this._data.bookmarked) {
        this._bookmarkSVG.setAttribute('href', `${icons}#icon-bookmark-fill`);
      } else {
        this._bookmarkSVG.setAttribute('href', `${icons}#icon-bookmark`);
      }
    } else {
      const currentCountry = this._dashboard.querySelector(
        '.destination__country',
      ).textContent;
      if (this._data.length === 0) {
        this._bookmarkSVG.setAttribute('href', `${icons}#icon-bookmark`);
        return;
      }

      const isBookmarked = this._data.some(
        bookmark => bookmark.countryName === currentCountry,
      );
      if (isBookmarked) {
        this._bookmarkSVG.setAttribute('href', `${icons}#icon-bookmark-fill`);
      } else {
        this._bookmarkSVG.setAttribute('href', `${icons}#icon-bookmark`);
      }
    }
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}

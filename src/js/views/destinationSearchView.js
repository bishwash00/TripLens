class destinationSearchView {
  _parentEL = document.querySelector('.header__search');
  _suggestionsEl = document.querySelector('.suggestions__list');

  constructor() {
    this._addHandlerSearch();
  }

  _getQuery() {
    const query = this._parentEL.querySelector('.header__search-input').value;
    return query;
  }

  _clearInput() {
    const input = this._parentEL.querySelector('.header__search-input');
    input.value = '';
    input.blur();
  }

  _addHandlerSearch() {
    this._parentEL.addEventListener('submit', e => {
      e.preventDefault();
      this._suggestionsEl.classList.add('hidden');

      const query = this._getQuery() === '' ? undefined : this._getQuery();
      window.location.hash = `search=${encodeURIComponent(query)}`;

      this._clearInput();
    });
  }

  addHandlerHash(handler) {
    window.addEventListener('hashchange', handler);
  }
}

export default new destinationSearchView();

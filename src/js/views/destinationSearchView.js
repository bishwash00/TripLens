class destinationSearchView {
  _parentEL = document.querySelector('.header__search');

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

      const query = this._getQuery() === '' ? undefined : this._getQuery();
      console.log(query);
      window.location.hash = `search=${encodeURIComponent(query)}`;

      this._clearInput();
    });
  }

  addHandlerHash(handler) {
    window.addEventListener('hashchange', handler);
  }
}

export default new destinationSearchView();

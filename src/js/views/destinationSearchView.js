class destinationSearchView {
  _parentEL = document.querySelector('.header__search');

  getQuery() {
    const query = this._parentEL.querySelector('.header__search-input').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    const input = this._parentEL.querySelector('.header__search-input');
    input.value = '';
    input.blur();
  }

  addHandlerSearch(handler) {
    this._parentEL.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new destinationSearchView();

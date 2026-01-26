import icons from 'url:../../img/icons.svg';
import View from './View';

class bookmarksView extends View {
  _parentEl = document.querySelector('.saved-trips');

  _generateMarkup() {
    this._bookmarksCountEl.textContent = this._data.length;
    this._headerBookmarksCountEl.textContent = this._data.length;

    if (this._data.length === 0)
      return `
    <div class="saved-trips__empty">
                <svg><use href="${icons}#icon-bookmark"></use></svg>
                <p>No saved trips yet</p>
                <span
                  >Search for a destination and click the bookmark icon to save
                  it</span
                >
              </div>`;

    return `<div class="saved-trips__list">
            ${this._data
              .map(
                data => `
       <div class="trip" data-city="${data.capitalName}" data-country="${data.countryName}">
                  <img
                    class="trip__flag"
                    src="${data.countryFlag}"
                    alt="Country flag"
                  />
                  <div class="trip__info">
                    <h4 class="trip__city">${data.capitalName}</h4>
                    <p class="trip__country">${data.countryName}</p>
                  </div>
                  <button class="trip__remove" aria-label="Remove trip">
                    <svg><use href="${icons}#icon-close"></use></svg>
                  </button>
                </div>`,
              )
              .join('')}
            </div>
    `;
  }

  addHandlerBookmarkAdd(handler) {
    const btnAdd = document.querySelector('.btn--save');
    btnAdd.addEventListener('click', () => {
      handler();
      this.updateBookmarkIcons();
    });
  }

  addHandlerBookmarkRemove(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.trip__remove');
      if (!btn) return;

      const tripEl = btn.closest('.trip');
      const countryName = tripEl.dataset.country;
      console.log(countryName);
      handler(countryName);
      this.updateBookmarkIcons();
    });
  }

  addHandlerBookmarkClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const trip = e.target.closest('.trip');
      if (!trip) return;

      console.log(trip);
    });
  }
}

export default new bookmarksView();

import icons from 'url:../../img/icons.svg';
import View from './View';

class suggestionsView extends View {
  _parentEl = document.querySelector('.suggestions__list');

  _generateMarkup() {
    if (this._data.length === 0)
      return `
      <div class="suggestion-item suggestion-item--empty">
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        <span class="suggestion-item__text">No suggestions found.</span>
      </div>
    `;
    return `  
            ${this._data
              .map(
                data => `
                <div class="suggestion-item">
                <svg>
                  <use href="${icons}#icon-search"></use>
                </svg>
                <span class="suggestion-item__text" data-country="${data.countryName}">${data.capitalName}, ${data.countryName}</span>
                <span class="suggestion-item__type">Country</span>
              </div>
              `,
              )
              .join('')}
              `;
  }

  addHandlerInput(handler) {
    this._searchBar.addEventListener('input', e => {
      this._parentEl.classList.remove('hidden');
      const input = e.target.value;
      if (input.trim() !== '') {
        handler(input);
      } else {
        this._parentEl.classList.add('hidden');
      }
    });
  }

  addHandlerClickSearch() {
    this._parentEl.addEventListener('click', e => {
      const el = e.target.closest('.suggestion-item__text');
      if (!el) return;
      const query = el.dataset.country;
      console.log(query);

      window.location.hash = `search=${encodeURIComponent(query)}`;
      this._searchBar.value = '';
      this._parentEl.classList.add('hidden');
    });
  }
}

export default new suggestionsView();

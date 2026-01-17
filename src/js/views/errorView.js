import icons from 'url:../../img/icons.svg';
import View from './View';

class errorView extends View {
  _parentEl = document.querySelector('.container');

  _generateMarkup() {
    return `
   <div class="error ">
        <div class="error__content">
          <svg class="error__icon">
            <use href="${icons}#icon-error"></use>
          </svg>
          <h3 class="error__title">${this._data.message}</h3>
          <p class="error__message">
            We couldn't fetch data for the destination you're looking for. Please try
            another city or country name.
          </p>
          <button class="error__btn btn btn--primary">Try Again</button>
        </div>
      </div>`;
  }
}

export default new errorView();

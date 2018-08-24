// search VIEW
import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPag.innerHTML = '';
};

export const highlightSelected = id => {
  document.querySelectorAll('.results__link').forEach(el => el.classList.remove('results__link--active'));
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

// shorten title to fit in one line = to have max 17 characters
const limitRecipeTitle = (title, limit = 17) => {
  if (title.length > limit) {
    title = title.split(' ').reduce((acc, el) => {
      if (`${acc} ${el}`.length <= limit) {
        return acc += ' ' + el;
      }
      return acc;
    });
    return `${title}...`;
  }
  return title;
};

export const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
  `
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// Create html template for button
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`;

const renderButtons = (page, numOfRes, resPerPage) => {
  // amount of pages for pagination
  const pages = Math.ceil(numOfRes / resPerPage);
  if (pages === 1) return;
  
  let button;
  if (page === 1 && pages > 1) {
    // Render next btn
    button = createButton(page, 'next');
  } else if (page > 1 && page < pages) {
    // Render both btns
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
      `;
    } else {
      // Render prev btn
      button = createButton(page, 'prev');
  }
  elements.searchResPag.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // first result per page, start of extracting part for slice (included)
  const start = (page - 1) * resPerPage;
  // end of extracting part for slice (excluded)
  const end = page * resPerPage;

  // slicing arr with results to fit only limited amount of results per page
  recipes.slice(start, end).forEach(renderRecipe);
  // slice doesn't modify original array so we can use recipes.length ( = 30)
  renderButtons(page, recipes.length, resPerPage);
};


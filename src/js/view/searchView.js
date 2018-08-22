// search VIEW
import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
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
}

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
}

export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
}

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
}
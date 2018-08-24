import Search from './models/Search';
import Recipe from './models/Recipe';
import {
  elements,
  renderLoader,
  removeLoader
} from './view/base';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

// APP CONTROLLERS
/**
 * SEARCH CONTROLLER
 */
// Handler for searching for a recipe, has to be async because we awaiting for the results and then displaying it
const controlSearch = async () => {
  // 1) Get query from View
  const query = searchView.getInput();

  if (query) {
    // 2) Create new search object with a given query and save in state
    state.search = new Search(query);

    // 3) Clear and prepare UI for new results, display loader spinner in results container while waiting for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResCont);

    try {
      // 4) Search for new recipes
      // getResults method is async and returns a promise so we have to await until it is resolved to display the results from it
      await state.search.getResults();
      removeLoader();
      
      // 5) Render recipes on UI
      searchView.renderResults(state.search.recipes);
    } catch (error) {
      // Handling an error if getResults end up being resolved as rejected
      alert('Something went wronf with processing the search.');
      removeLoader();
    }

  }
}

// Event listener for searching
elements.searchForm.addEventListener('submit', e => {
  // prevent reloading page after submitting the form
  e.preventDefault();
  controlSearch();
});

// Event listener for clicking pagination buttons
elements.searchResPag.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    // Grab custom data-goto attribute value
    const goToPage = parseInt(btn.dataset.goto, 10);
    // Clear results from previous page
    searchView.clearResults();
    // Render results for page which clicked btn leads to
    searchView.renderResults(state.search.recipes, goToPage)
  }
});

/**
 * RECIPE CONTROLLER
 */
// Function has to be async because we are awaiting inside for getRecipe to resolve
const controlRecipe = async () => {
  // 1) Get id from url
  const id = window.location.hash.replace('#', '');
  console.log(id);
  if (id) {
    // 2) Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // 3) Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // 4) Get recipe data (we await to first get data and then execute the rest of the code) and format the ingredients
      await state.recipe.getRecipe();
      console.log('hello');
      state.recipe.parseIngredients();
      // 5) Get prep time and servings
      state.recipe.calcPrepTime();
      state.recipe.calcServings();
      
      // 6) Render recipe in the UI
      removeLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      // Handling an error if getRecipe end up being resolved as rejected
      alert('Error processing recipe!');
    }
  }
};

// Hashchange event is available on window object whenever hash changes
// window.addEventListener('hashchange', controlRecipe);
// In case user reloads the page we want him to see results too
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
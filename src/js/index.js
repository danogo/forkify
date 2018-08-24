import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, removeLoader } from './view/base';
import * as searchView from './view/searchView';

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
// handler for searching for a recipe, has to be async because we awaiting for the results and then displaying it
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

    // 4) Search for new recipes
    // getResults method is async and returns a promise so we have to await until it is resolved to display the results from it
    await state.search.getResults();
    removeLoader();

    // 5) Render recipes on UI
    searchView.renderResults(state.search.recipes);
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
    // grab custom data-goto attribute value
    const goToPage = parseInt(btn.dataset.goto, 10);
    // clear results from previous page
    searchView.clearResults();
    // render results for page which clicked btn leads to
    searchView.renderResults(state.search.recipes, goToPage)
  }
});

/**
 * RECIPE CONTROLLER
*/
const r = new Recipe(54454);
r.getRecipe().then(res => {
  console.log(res);
});

// APP CONTROLLER
import Search from './models/Search';
import { elements } from './view/base';
import * as searchView from './view/searchView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};


// handler for searching for a recipe, has to be async because we awaiting for the results and then displaying it
const controlSearch = async () => {
  // 1) Get query from View
  const query = searchView.getInput();

  if (query) {
    // 2) Create new search object with a given query and save in state
    state.search = new Search(query);
    
    // 3) Clear and prepare UI for new results
    searchView.clearInput();
    searchView.clearResults();

    // 4) Search for new recipes
    // getResults method is async and returns a promise so we have to await until it is resolved to display the results from it
    await state.search.getResults();

    // 5) Render recipes on UI
    searchView.renderResults(state.search.recipes);
  }
}

elements.searchForm.addEventListener('submit', e => {
  // prevent reloading page after submitting the form
  e.preventDefault();
  controlSearch();
});

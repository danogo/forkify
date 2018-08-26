import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {
  elements,
  renderLoader,
  removeLoader
} from './view/base';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes object
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
      alert('Something went wrong with processing the search.');
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
  if (id) {
    // 2) Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    if (state.search) searchView.highlightSelected(id);
    // 3) Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // 4) Get recipe data (we await to first get data and then execute the rest of the code) and format the ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // 5) Get prep time and servings
      state.recipe.calcPrepTime();
      state.recipe.calcServings();
      
      // 6) Render recipe in the UI
      removeLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );
    } catch (error) {
      // Handling an error if getRecipe end up being resolved as rejected
      console.log(error);
      alert('Error processing recipe!');
    }
  }
};
// Hashchange event is available on window object whenever hash changes
// window.addEventListener('hashchange', controlRecipe);
// In case user reloads the page we want him to see results too
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
 const controlList = () => {
   // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // Clear old list from model and view if exist
  state.list.clearList();
  listView.clearList();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(ing => {
    const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
    listView.renderItem(item);
  });
 };

// Handling deleting and updating shopping list item
elements.list.addEventListener('click', event => {
  // grab id from the first ancestor with that id
  const id = event.target.closest('.shopping__item').dataset.itemid;
  if (event.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete item from the model
    state.list.deleteItem(id);
    // delete item from the UI
    listView.deleteItem(id);
  } else if (event.target.matches('.shopping__count-value')) {
    // update model with the new value
    const val = parseFloat(event.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**
 * LIKES CONTROLLER
 */
const controlLikes = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT liked current recipe yet, now wants to like
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      state.recipe.id,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    )
    // Toggle the like button to full img
    likesView.toggleLikeBtn(true);
    // Add like to the likes UI list
    likesView.renderLike(newLike);
    // User HAS liked current recipe already, now wants to dislike
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button to empty img
    likesView.toggleLikeBtn(false);
    // Remove like from the likes UI list
    likesView.deleteLike(currentID);
  }
  // If there are no likes, hide btn for likes menu
  likesView.toggleLikesMenuBtn(state.likes.getNumLikes());
}

// Retrieve likes data from localStorage on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  // read likes from LS
  state.likes.readStorage();
  // toggle button according to likes existence
  likesView.toggleLikesMenuBtn(state.likes.getNumLikes());
  // render initial likes
  state.likes.likes.forEach(lk => likesView.renderLike(lk));
});

// Handling clicking on various buttons inside recipe UI
elements.recipe.addEventListener('click', event => {
  // Choose action based on matching selector for clicked element
  if (event.target.matches('.btn-decrease, .btn-decrease *')) {
    // .btn * means all elements inside btn class
    if (state.recipe.servings > 1) {
      // update model
      state.recipe.updateServings('dec');
      // update UI
      recipeView.updateServings(state.recipe);
    }
  } else if (event.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServings(state.recipe);
  } else if (event.target.matches('.recipe__btn--list, .recipe__btn--list *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (event.target.matches('.recipe__love, .recipe__love *')) {
    controlLikes();
  }
})



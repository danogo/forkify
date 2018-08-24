import axios from 'axios';
import { proxy, key } from '../config';

/**
 * RECIPE MODEL
*/
export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  
  async getRecipe() {
    try {
      const res = await axios.get(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      return res;
    } catch (error) {
      console.log(error);
      alert('Something went wrong! :(')
    }
  }

  calcPrepTime() {
    // Assuming that we need 5 min for each ingredient
    const numIng = this.ingredients.length
    this.time = numIng * 5;
  }

  getServings() {
    this.servings = 4;
  }
}
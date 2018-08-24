import axios from 'axios';
import {
  proxy,
  key
} from '../config';

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

  calcServings() {
    this.servings = 4;
  }

  // Formatting ingredients to look the same way
  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const newIngredients = this.ingredients.map(el => {
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      })

      // 2) Remove parantheses
      ingredient = ingredient.replace(/ *\([^)]*\)/g, '');

      // 3) Parse ingredients into count, unit and ingredient
      // Split string into array of words
      const arrIng = ingredient.split(' ');
      // check if that array contains any string from unitsShort and if does find index of it
      const unitIndex = arrIng.findIndex(el => unitsShort.includes(el));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit, eg. "2 cups of something"
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          // Eg. 4 cups 
          // In edge case like 4-1/2 wich suppose to mean 4.5
          // We make it 4+1/2 and evaluate using eval to 4.5
          count = eval(arrCount[0].replace('-', '+'));
        } else {
          // Eg. 4 1/2 cups
          count = eval(arrCount.join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.splice(unitIndex + 1).join(' ')
        }
      } else if (parseInt(arrIng[0], 10)) { // if it is a number it parses to number and than truthy value to true, otherwise it's NaN and evaluates to false
        // There is NO unit, but 1st element is a number, eg. 4 tomatoes
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // There is NO unit and NO number in 1st position, eg. corn
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
}
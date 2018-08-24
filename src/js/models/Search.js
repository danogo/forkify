import axios from 'axios';
import { proxy, key } from '../config';

/**
 * SEARCH MODEL
*/
export default class Search {
  constructor(query) {
    this.query = query;
  }
  // method to fetch recipes, it's async so it returns a promise
  async getResults() {
    try {
      const res = await axios.get(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.recipes = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}

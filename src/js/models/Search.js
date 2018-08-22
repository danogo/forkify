import axios from 'axios';

// MODEL
export default class Search {
  constructor(query) {
    this.query = query;
  }
  // method to fetch recipes, it's async so it returns a promise
  async getResults() {
    try {
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const key = 'c39761532888c2360b45a96ac3894b04';
      const res = await axios.get(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.recipes = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}

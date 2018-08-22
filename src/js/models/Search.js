import axios from 'axios';

// MODEL
export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const key = 'c39761532888c2360b45a96ac3894b04'
      const res = await axios.get(`http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      console.log(res);
      this.recipes = res.data.recipes;
      console.log(this.recipes);
    } catch (error) {
      console.log(error);
    }
  }
}

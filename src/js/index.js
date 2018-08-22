import axios from 'axios';

async function getResults(query) {
  try {
    const key = 'c39761532888c2360b45a96ac3894b04'
    const res = await axios.get(`http://food2fork.com/api/search?key=${key}&q=${query}`);
    console.log(res);
    const recipes = res.data.recipes;
    console.log(recipes);
  } catch (error) {
    console.log(error);
  }
}

getResults('pasta');
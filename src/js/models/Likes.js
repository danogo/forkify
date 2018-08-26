export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img};
    this.likes.push(like);
    // Save data in local storage
    this.persistData();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(lk => lk.id === id);
    this.likes.splice(index, 1);
    // Save data in local storage
    this.persistData();
  }

  isLiked(id) {
    // If there is no lk with this id in likes arr, findIndex will return -1
    return this.likes.findIndex(lk => lk.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage() {
    const storageLikes = JSON.parse(localStorage.getItem('likes'));
    // If it won't find this item getItem will return null
    if (storageLikes) {
      // Restoring likes from the localStorage
      this.likes = storageLikes;
    }
  }
};
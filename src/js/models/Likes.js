export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img};
    this.likes.push(like);
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(lk => lk.id === id);
    this.likes.splice(index, 1);
  }

  isLiked(id) {
    // If there is no lk with this id in likes arr, findIndex will return -1
    return this.likes.findIndex(lk => lk.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }
};
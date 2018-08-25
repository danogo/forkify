// Reusable features
export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResList: document.querySelector('.results__list'),
  searchResCont: document.querySelector('.results'),
  searchResPag: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  list: document.querySelector('.shopping__list')
};

export const elSelectors = {
  loader: 'loader'
}

export const renderLoader = parent => {
  const loader = `
    <div class="${elSelectors.loader}">
      <svg>
        <use  href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

export const removeLoader = () => {
  const loader = document.querySelector(`.${elSelectors.loader}`)
  if (loader) {
    loader.remove();
  } 
}
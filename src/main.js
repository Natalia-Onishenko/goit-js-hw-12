import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');

let query = '';
let page = 1;
let totalHits = 0;

hideLoader();
hideLoadMoreBtn();

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  query = e.currentTarget.searchQuery.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Увага',
      message: 'Введіть пошуковий запит!',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  totalHits = 0;
  clearGallery();
  hideLoadMoreBtn();
  e.currentTarget.searchQuery.value = '';

  try {
    showLoader();
    const data = await fetchImages(query, page);

    if (!data || data.hits.length === 0) {
      iziToast.info({
        title: 'Немає результатів',
        message: 'За вашим запитом нічого не знайдено.',
        position: 'topRight',
      });
      return;
    }

    totalHits = data.totalHits;
    renderGallery(data.hits);

    
    if (totalHits > 15) {
      showLoadMoreBtn();
    } else {
      iziToast.info({
        title: 'Кінець',
        message: 'Більше зображень немає.',
        position: 'topRight',
      });
    }

  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити зображення. Спробуйте пізніше.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;

 
  loadMoreBtn.hidden = true;
  loader.textContent = 'Loading my images. Wait, please';
  loader.hidden = false;

  try {
    const data = await fetchImages(query, page);
    renderGallery(data.hits);

   
    if (gallery.firstElementChild) {
      const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
    }

    const totalPages = Math.ceil(totalHits / 15);
    if (page >= totalPages) {
      iziToast.info({
        title: 'Кінець',
        message: 'Більше зображень немає.',
        position: 'topRight',
      });
      hideLoadMoreBtn();
    } else {
      loader.hidden = true;
      loadMoreBtn.hidden = false;
    }

  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити більше зображень.',
      position: 'topRight',
    });
    loader.hidden = true;
    loadMoreBtn.hidden = false;
  }
}
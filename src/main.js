import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  smoothScroll,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;


hideLoader();

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  query = e.currentTarget.searchQuery.value.trim();
  page = 1;
  clearGallery();
  hideLoadMoreBtn();

  if (!query) {
    iziToast.warning({
      title: 'Увага',
      message: 'Введіть пошуковий запит!',
      position: 'topRight',
    });
    return;
  }

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
  showLoader();
  loadMoreBtn.disabled = true;

  try {
    const data = await fetchImages(query, page);
    renderGallery(data.hits);
    smoothScroll();

    const totalPages = Math.ceil(totalHits / 15);
    if (page >= totalPages) {
      hideLoadMoreBtn();
      iziToast.info({
        title: 'Кінець',
        message: 'Більше зображень немає.',
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити більше зображень.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    loadMoreBtn.disabled = false;
  }
}
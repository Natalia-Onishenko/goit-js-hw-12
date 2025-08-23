import { getImagesByQuery } from "./js/pixabay-api.js";
import { createGallery, clearGallery, showLoadMoreButton, hideLoadMoreButton, showLoader, hideLoader } from "./js/render-functions.js";

const form = document.querySelector(".form");
const input = document.querySelector(".search-input");
const loadMoreBtn = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

let currentQuery = "";
let currentPage = 1;
let totalHits = 0;
let loadedImages = 0;
let isLoading = false;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  currentQuery = input.value.trim();
  if (!currentQuery) return;

  clearGallery();
  hideLoadMoreButton();
  currentPage = 1;
  loadedImages = 0;

  await fetchImages();
}

async function onLoadMore() {
  currentPage += 1;
  await fetchImages();
}

async function fetchImages() {
  if (isLoading) return;
  isLoading = true;

  showLoader();
  loadMoreBtn.disabled = true;

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data || data.hits.length === 0) {
      if (currentPage === 1) {
        clearGallery();
        gallery.insertAdjacentHTML(
          "beforeend",
          `<li class="gallery-item no-results">Нічого не знайдено</li>`
        );
      }
      return;
    }

    createGallery(data.hits);
    loadedImages += data.hits.length;
    totalHits = data.totalHits;

    if (loadedImages < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }

    smoothScroll();
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
    loadMoreBtn.disabled = false;
    isLoading = false;
  }
}

function smoothScroll() {
  if (!gallery.firstElementChild) return;
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";
import Notiflix from "notiflix";

const form = document.querySelector("#search-form");
const loadMoreBtn = document.querySelector("#load-more");

let currentQuery = "";
let currentPage = 1;
let totalHits = 0;
let loadedImages = 0;
let isLoading = false;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  currentQuery = e.target.elements["search-input"].value.trim();
  if (!currentQuery) {
    Notiflix.Notify.info("Please enter a search query.");
    return;
  }

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

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data || data.hits.length === 0) {
      Notiflix.Notify.failure("Sorry, no images found.");
      return;
    }

    createGallery(data.hits);
    loadedImages += data.hits.length;
    totalHits = data.totalHits;

    if (loadedImages < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      if (currentPage > 1) {
        Notiflix.Notify.info("You've reached the end of results.");
      }
    }

    smoothScroll();
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure("Error loading images. Try again later.");
  } finally {
    hideLoader();
    isLoading = false;
  }
}

function smoothScroll() {
  const gallery = document.querySelector(".gallery");
  if (!gallery.firstElementChild) return;

  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
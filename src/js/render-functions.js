import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more");

let lightbox;

export function createGallery(images) {
  const markup = images
    .map(
      (img) => `
      <li class="gallery-item">
        <a href="${img.largeImageURL}">
          <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        </a>
        <p class="photo-caption">${img.tags}</p>
      </li>`
    )
    .join("");
  gallery.insertAdjacentHTML("beforeend", markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox(".gallery a", {
      captionsData: "alt",
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  gallery.innerHTML = "";
}

export function showLoader() {
  loader.style.display = "inline-block";
}

export function hideLoader() {
  loader.style.display = "none";
}

export function showLoadMoreButton() {
  loadMoreBtn.hidden = false;
}

export function hideLoadMoreButton() {
  loadMoreBtn.hidden = true;
}
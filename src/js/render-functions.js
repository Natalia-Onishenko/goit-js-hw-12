import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let lightbox;

export function createGalleryItem(image) {
  const li = document.createElement("li");
  li.classList.add("gallery-item");

  const link = document.createElement("a");
  link.href = image.largeImageURL;

  const img = document.createElement("img");
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = "lazy";

  link.appendChild(img);
  li.appendChild(link);

  const caption = document.createElement("p");
  caption.classList.add("caption");
  const tags = image.tags.split(",").map(tag => tag.trim());
  caption.textContent = tags.slice(0, 3).join(", ");

  li.appendChild(caption);
  return li;
}

export function renderGallery(images) {
  const fragment = document.createDocumentFragment();
  images.forEach(image => {
    fragment.appendChild(createGalleryItem(image));
  });
  gallery.appendChild(fragment);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.hidden = false;
}

export function hideLoader() {
  loader.hidden = true;
}

export function showLoadMoreBtn() {
  loadMoreBtn.hidden = false;
}

export function hideLoadMoreBtn() {
  loadMoreBtn.hidden = true;
}

export function smoothScroll() {
  if (!gallery.firstElementChild) return;
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
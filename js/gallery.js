'use strict';
const galleryFilters = [...document.querySelectorAll('[data-gallery-filter]')];
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const galleryDialog = document.getElementById('gallery-dialog');
let selectedPhoto = 0;
let visiblePhotos = galleryItems;
galleryFilters.forEach(button => {
  button.addEventListener('click', () => {
    galleryFilters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    galleryItems.forEach(item => {
      item.hidden = button.dataset.galleryFilter !== 'all' && item.dataset.category !== button.dataset.galleryFilter;
    });
    visiblePhotos = galleryItems.filter(item => !item.hidden);
    document.getElementById('gallery-count').textContent = `Showing ${visiblePhotos.length} of ${galleryItems.length} representative photographs`;
  });
});
function showPhoto(index) {
  selectedPhoto = (index + visiblePhotos.length) % visiblePhotos.length;
  const item = visiblePhotos[selectedPhoto];
  const image = item.querySelector('img');
  const target = document.getElementById('lightbox-image');
  target.src = item.querySelector('a').href;
  target.alt = image.alt;
  document.getElementById('lightbox-caption').textContent = `${selectedPhoto + 1} / ${visiblePhotos.length} — ${item.querySelector('figcaption').firstChild.textContent}. Representative photograph.`;
}
galleryItems.forEach(item => {
  const link = item.querySelector('a');
  link.addEventListener('click', event => {
    if (typeof galleryDialog.showModal !== 'function') return;
    event.preventDefault();
    showPhoto(visiblePhotos.indexOf(item));
    window.GKDialog.open(galleryDialog, link);
  });
});
document.getElementById('photo-prev').addEventListener('click', () => showPhoto(selectedPhoto - 1));
document.getElementById('photo-next').addEventListener('click', () => showPhoto(selectedPhoto + 1));
galleryDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(selectedPhoto + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

'use strict';
// Duplicate the visual row for a seamless ticker; assistive technology and
// keyboard users encounter each update only once.
const updates = document.querySelector('.updates-items');
if (updates) {
  const viewport = document.createElement('div');
  viewport.className = 'updates-viewport';
  const track = document.createElement('div');
  track.className = 'updates-track';
  const copy = updates.cloneNode(true);
  copy.classList.add('updates-copy');
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('a').forEach(link => link.tabIndex = -1);
  updates.before(viewport);
  viewport.append(track);
  track.append(updates, copy);
}
const slider = document.querySelector('.photo-slider');
if (slider) {
  const slides = [...slider.querySelectorAll('.photo-slide')];
  const counter = slider.querySelector('.slide-counter');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let playing = !reducedMotion.matches;
  let timer;
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      if (i === current || i === (current + 1) % slides.length) {
        const image = slide.querySelector('img');
        if (image.dataset.src) {
          image.src = image.dataset.src;
          delete image.dataset.src;
        }
      }
    });
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
  }
  function schedule() {
    clearInterval(timer);
    if (playing && !document.hidden && !slider.matches(':hover') && !slider.contains(document.activeElement)) {
      timer = setInterval(() => showSlide(current + 1), 6000);
    }
  }
  slider.querySelector('[data-slide-prev]').addEventListener('click', () => { showSlide(current - 1); schedule(); });
  slider.querySelector('[data-slide-next]').addEventListener('click', () => { showSlide(current + 1); schedule(); });
  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
      schedule();
    }
  });
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', schedule);
  slider.addEventListener('focusin', () => clearInterval(timer));
  slider.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { playing = !reducedMotion.matches; schedule(); });
  showSlide(0);
  schedule();
}

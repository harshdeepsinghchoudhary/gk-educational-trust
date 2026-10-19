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
  let requested = 0;
  let revision = 0;
  let fade;
  let onScreen = true;
  let playing = !reducedMotion.matches;
  let timer;
  function imageFor(index) {
    const image = slides[index].querySelector('img');
    if (image.dataset.src) {
      image.src = image.dataset.src;
      delete image.dataset.src;
    }
    return image;
  }
  function settle() {
    fade?.cancel();
    fade = null;
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      slide.style.zIndex = '';
      slide.setAttribute('aria-hidden', String(i !== current));
    });
  }
  async function showSlide(index, animate = true) {
    const ticket = ++revision;
    const next = (index + slides.length) % slides.length;
    requested = next;
    const image = imageFor(next);
    // Keep the existing photo visible while its successor downloads/decodes.
    try { if (image.decode) await image.decode(); } catch { return; }
    if (ticket !== revision) return;
    settle();
    const previous = current;
    current = next;
    const incoming = slides[current];
    incoming.hidden = false;
    incoming.setAttribute('aria-hidden', 'false');
    if (animate && previous !== current && !reducedMotion.matches && incoming.animate) {
      slides[previous].setAttribute('aria-hidden', 'true');
      incoming.style.zIndex = '1';
      fade = incoming.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 650, easing: 'cubic-bezier(.22,1,.36,1)'
      });
      const activeFade = fade;
      activeFade.finished.then(() => { if (fade === activeFade) settle(); }).catch(() => {});
    } else settle();
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
    imageFor((current + 1) % slides.length);
  }
  function schedule() {
    clearInterval(timer);
    if (playing && onScreen && !document.hidden && !slider.matches(':hover') && !slider.contains(document.activeElement)) {
      timer = setInterval(() => showSlide(current + 1), 6000);
    }
  }
  slider.querySelector('[data-slide-prev]').addEventListener('click', () => { showSlide(requested - 1); schedule(); });
  slider.querySelector('[data-slide-next]').addEventListener('click', () => { showSlide(requested + 1); schedule(); });
  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(requested + (event.key === 'ArrowRight' ? 1 : -1));
      schedule();
    }
  });
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', schedule);
  slider.addEventListener('focusin', () => clearInterval(timer));
  slider.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { playing = !reducedMotion.matches; settle(); schedule(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    }).observe(slider);
  }
  showSlide(0, false);
  schedule();
}

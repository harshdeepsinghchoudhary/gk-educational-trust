'use strict';

(() => {
  // Deep links should reveal their destination immediately. With no JavaScript,
  // no loading layer is created and the ordinary page stays available.
  if (!document.body || location.hash || document.readyState === 'complete') return;
  // If this script arrived late, do not cover content already being read.
  if (performance.now() > 1500 && performance.getEntriesByName('first-contentful-paint').length) return;

  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const started = performance.now();
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.innerHTML = '<span class="page-loader-mark" aria-hidden="true"><img src="assets/images/trust-logo-gkiti.png" alt="" width="70" height="76"></span><span class="page-loader-label">Loading...</span>';

  let removed = false;
  let leaving = false;
  let minimumTimer;
  let removalTimer;
  const interactions = ['pointerdown', 'keydown', 'focusin', 'wheel'];
  // A stalled image or font must never leave the page covered indefinitely.
  const deadline = setTimeout(() => finish(), 3000);

  function remove() {
    if (removed) return;
    removed = true;
    clearTimeout(deadline);
    clearTimeout(minimumTimer);
    clearTimeout(removalTimer);
    loader.remove();
    root.classList.remove('page-loading');
    window.removeEventListener('load', onLoad);
    window.removeEventListener('pagehide', remove);
    window.removeEventListener('pageshow', onPageShow);
    preference.removeEventListener('change', onPreference);
    interactions.forEach(type => document.removeEventListener(type, remove, true));
    document.dispatchEvent(new Event('gk:page-ready'));
  }

  function finish() {
    if (removed || leaving) return;
    if (preference.matches) { remove(); return; }
    clearTimeout(minimumTimer);
    minimumTimer = setTimeout(() => {
      leaving = true;
      loader.classList.add('is-leaving');
      removalTimer = setTimeout(remove, 260);
    }, Math.max(0, 400 - (performance.now() - started)));
  }

  function onLoad() { finish(); }
  function onPageShow(event) { if (event.persisted) remove(); }
  function onPreference() { if (preference.matches) remove(); }

  window.addEventListener('load', onLoad, { once: true });
  window.addEventListener('pagehide', remove, { once: true });
  window.addEventListener('pageshow', onPageShow);
  preference.addEventListener('change', onPreference);
  interactions.forEach(type => document.addEventListener(type, remove, { capture: true, passive: true }));
  document.body.prepend(loader);
  // A missing stylesheet should leave the ordinary page, not an unstyled logo.
  if (getComputedStyle(loader).position !== 'fixed') { remove(); return; }
  root.classList.add('page-loading');
})();

'use strict';

// Progressive enhancement: nothing is hidden in CSS while waiting for this file,
// the observer, an image, or an animation. Cancelled animations reveal normal HTML.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 760px)');
  const running = new Map();
  const seen = new WeakSet();
  const targets = new Map();
  const supported = typeof Element.prototype.animate === 'function';

  function finish(element) {
    running.get(element)?.cancel();
    running.delete(element);
  }

  function entrance(element, variant = 'rise', delay = 0, duration = 580) {
    if (!supported || preference.matches || element.hidden || element.closest('[hidden]')) return;
    // Never move a field, button or link while someone is using it.
    if (element.contains(document.activeElement)) return;
    finish(element);
    const distance = compact.matches ? 9 : 20;
    const start = {
      rise: `translateY(${distance}px)`,
      left: compact.matches ? `translateY(${distance}px)` : 'translateX(-16px)',
      right: compact.matches ? `translateY(${distance}px)` : 'translateX(16px)',
      image: 'scale(.975)',
      quiet: 'translateY(5px)',
      scale: 'scale(.97)'
    }[variant] || 'translateY(12px)';
    const animation = element.animate([
      { opacity: 0.16, transform: start },
      { opacity: 1, transform: 'none' }
    ], {
      duration: compact.matches ? Math.min(duration, 430) : duration,
      delay: compact.matches ? Math.min(delay, 100) : delay,
      easing: 'cubic-bezier(.22,1,.36,1)',
      fill: 'backwards'
    });
    running.set(element, animation);
    animation.finished.then(() => {
      if (running.get(element) === animation) finish(element);
    }).catch(() => {});
  }

  function register(selector, variant = 'rise', stagger = 0) {
    document.querySelectorAll(selector).forEach(element => {
      if (targets.has(element)) return;
      const siblings = [...element.parentElement.children];
      const index = siblings.indexOf(element);
      const options = { variant, delay: Math.min(index % 4 * stagger, 210) };
      // Existing/custom attributes allow a section to opt into another variant.
      element.dataset.motion ||= variant;
      targets.set(element, options);
    });
  }

  register('.hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > p', 'rise', 75);
  register('.hero-copy .buttons > a', 'quiet', 90);
  register('.notification-panel', 'right');
  register('.page-banner .breadcrumb, .page-banner h1, .page-banner p', 'rise', 70);
  register('.section-head, .center-head, .intro-copy, .gallery-heading', 'quiet');
  register('.quick-grid > *, .cards > *, .objectives > *', 'rise', 80);
  register('.split > div:has(.feature-image) .feature-image', 'image');
  register('.split > div:not(:has(.feature-image))', 'left');
  register('.process-item', 'rise', 90);
  register('.gallery-preview > a, .gallery-grid > figure', 'scale', 70);
  register('.featured-news > img', 'image');
  register('.featured-news > .card-body', 'right');
  register('.contact-grid > div:first-child, .office-grid > *', 'rise', 80);
  // Keep the form itself stationary; only its heading receives an entrance.
  register('.form-card > h2', 'quiet');
  register('.announcement, .cta .container > *, .footer-grid > *', 'quiet', 80);
  register('[data-motion]');

  if ('IntersectionObserver' in window && supported) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (seen.has(entry.target)) { observer.unobserve(entry.target); return; }
        seen.add(entry.target);
        observer.unobserve(entry.target);
        const options = targets.get(entry.target);
        entrance(entry.target, entry.target.dataset.motion, options.delay);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -18px 0px' });
    targets.forEach((_, element) => observer.observe(element));

    // Hash navigation and keyboard focus always take priority over entrances.
    document.addEventListener('focusin', event => {
      for (const element of running.keys()) {
        if (element.contains(event.target)) finish(element);
      }
    });
  }

  function stopMotion() {
    if (!preference.matches) return;
    for (const element of running.keys()) finish(element);
  }
  preference.addEventListener('change', stopMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) for (const element of running.keys()) finish(element);
  });

  // Filters control visibility immediately; only the newly rendered cards animate.
  // Cancel any one-time observer entrances so the two effects cannot stack.
  document.addEventListener('gk:filtered', event => {
    // Read geometry as a batch, then animate only visible results. Offscreen
    // results retain their one-time observer reveal when the user reaches them.
    const visible = [...event.detail.items].filter(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.top < window.innerHeight && bounds.bottom > 0;
    });
    visible.forEach((element, index) => {
      seen.add(element);
      finish(element);
      entrance(element, 'quiet', Math.min(index, 3) * 45, 300);
    });
  });
})();

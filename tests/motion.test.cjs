// Dependency-free behavioral tests. These do not replace real-browser visual QA.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function events(target = {}) {
  const handlers = new Map();
  target.addEventListener = (type, fn) => {
    if (!handlers.has(type)) handlers.set(type, []);
    handlers.get(type).push(fn);
  };
  target.emit = (type, event = {}) => handlers.get(type)?.forEach(fn => fn(event));
  return target;
}
function motionEnvironment({ reduced = false, observerAvailable = true } = {}) {
  const preference = events({ matches: reduced });
  const active = [];
  class Element {
    constructor() {
      this.dataset = {};
      this.hidden = false;
      this.parentElement = { children: [this] };
    }
    closest() { return null; }
    contains(value) { return value === this; }
    animate(frames, options) {
      const animation = { frames, options, cancelled: false, cancel() { this.cancelled = true; }, finished: new Promise(() => {}) };
      active.push(animation);
      return animation;
    }
    getBoundingClientRect() { return { top: 100, bottom: 200 }; }
  }
  const heading = new Element();
  const document = events({ activeElement: null, hidden: false,
    querySelectorAll: selector => selector.includes('.hero-copy >') ? [heading] : []
  });
  let observed;
  const window = { innerHeight: 900, matchMedia: query => query.includes('reduced') ? preference : { matches: false } };
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observed = this; }
    observe(element) { this.targets.add(element); }
    unobserve(element) { this.targets.delete(element); }
  }
  if (observerAvailable) window.IntersectionObserver = Observer;
  const context = { document, window, Element, IntersectionObserver: Observer };
  vm.runInNewContext(fs.readFileSync('js/motion.js', 'utf8'), context);
  return { document, heading, preference, active, observed };
}
test('content stays visible until observed and entrances run only once', () => {
  const env = motionEnvironment();
  assert.equal(env.heading.hidden, false);
  assert.equal(env.active.length, 0);
  env.observed.callback([{ target: env.heading, isIntersecting: false }]);
  assert.equal(env.active.length, 0);
  env.observed.callback([{ target: env.heading, isIntersecting: true }]);
  assert.equal(env.active.length, 1);
  assert.equal(env.observed.targets.size, 0);
  env.observed.callback([{ target: env.heading, isIntersecting: true }]);
  assert.equal(env.active.length, 1);
  assert.equal(env.heading.hidden, false);
});
test('reduced motion and missing IntersectionObserver keep content visible without entrances', () => {
  const reduced = motionEnvironment({ reduced: true });
  reduced.observed.callback([{ target: reduced.heading, isIntersecting: true }]);
  assert.equal(reduced.active.length, 0);
  assert.equal(reduced.heading.hidden, false);
  const fallback = motionEnvironment({ observerAvailable: false });
  assert.equal(fallback.active.length, 0);
  assert.equal(fallback.heading.hidden, false);
});
test('keyboard focus, hidden tabs and live motion preference changes cancel active motion', () => {
  for (const reason of ['focus', 'hidden', 'preference']) {
    const env = motionEnvironment();
    env.observed.callback([{ target: env.heading, isIntersecting: true }]);
    if (reason === 'focus') env.document.emit('focusin', { target: env.heading });
    if (reason === 'hidden') { env.document.hidden = true; env.document.emit('visibilitychange'); }
    if (reason === 'preference') { env.preference.matches = true; env.preference.emit('change'); }
    assert.equal(env.active[0].cancelled, true, reason);
    assert.equal(env.heading.hidden, false);
  }
});
test('filter feedback animates only visible results without hiding offscreen content', () => {
  const env = motionEnvironment();
  const offscreen = new env.heading.constructor();
  offscreen.getBoundingClientRect = () => ({ top: 2000, bottom: 2200 });
  env.document.emit('gk:filtered', { detail: { items: [env.heading, offscreen] } });
  assert.equal(env.active.length, 1);
  assert.equal(offscreen.hidden, false);
  assert.equal(env.heading.hidden, false);
});

const flush = () => new Promise(resolve => setImmediate(resolve));
function sliderEnvironment() {
  const callbacks = new Map();
  const buttons = Object.fromEntries(['prev','next'].map(name => [name, events()]));
  const preference = events({ matches: false });
  const images = [0,1,2].map(() => ({ dataset: {}, decode: () => Promise.resolve() }));
  const slides = images.map((image, index) => ({ hidden: index !== 0, style: {}, querySelector: () => image,
    setAttribute() {}, animate() { return { cancel() {}, finished: new Promise(() => {}) }; }
  }));
  const counter = { textContent: '' };
  const slider = events({ querySelectorAll: () => slides,
    querySelector: selector => selector === '.slide-counter' ? counter : buttons[selector.includes('prev') ? 'prev' : 'next'],
    matches: () => false, contains: () => false
  });
  const document = events({ hidden: false, activeElement: null, querySelector: selector => selector === '.photo-slider' ? slider : null });
  const window = { matchMedia: () => preference };
  let id = 0;
  const context = { document, window, setTimeout, clearInterval: key => callbacks.delete(key),
    setInterval: callback => { callbacks.set(++id, callback); return id; }
  };
  vm.runInNewContext(fs.readFileSync('js/home.js','utf8'), context);
  return { slides, images, buttons, preference, counter, slider, callbacks };
}
test('slideshow keeps current photo while loading and ignores stale rapid-navigation decodes', async () => {
  const env = sliderEnvironment();
  await flush();
  let resolveFirst, resolveSecond;
  env.images[1].decode = () => new Promise(resolve => { resolveFirst = resolve; });
  env.images[2].decode = () => new Promise(resolve => { resolveSecond = resolve; });
  env.buttons.next.emit('click');
  assert.equal(env.slides[0].hidden, false);
  env.buttons.next.emit('click');
  resolveSecond();
  await flush();
  assert.equal(env.counter.textContent, '03 / 3');
  resolveFirst();
  await flush();
  assert.equal(env.counter.textContent, '03 / 3');
  assert.equal(env.slides[1].hidden, true);
  env.preference.matches = true;
  env.preference.emit('change');
  assert.equal(env.callbacks.size, 0);
  assert.equal(env.slides[0].hidden, true);
  assert.equal(env.slides[2].hidden, false);
});
test('slideshow pauses on hover and resumes on leaving; image failures retain current slide', async () => {
  const env = sliderEnvironment();
  await flush();
  assert.equal(env.callbacks.size, 1);
  env.slider.emit('mouseenter');
  assert.equal(env.callbacks.size, 0);
  env.slider.emit('mouseleave');
  assert.equal(env.callbacks.size, 1);
  env.images[1].decode = () => Promise.reject(new Error('failed image'));
  env.buttons.next.emit('click');
  await flush();
  assert.equal(env.slides[0].hidden, false);
  assert.equal(env.counter.textContent, '01 / 3');
});

test('autoplay advances past a failed image and keeps cycling', async () => {
  const env = sliderEnvironment();
  await flush();
  env.images[1].decode = () => Promise.reject(new Error('failed image'));
  const tick = () => [...env.callbacks.values()].forEach(callback => callback());

  tick();
  await flush();
  assert.equal(env.counter.textContent, '01 / 3');
  assert.equal(env.slides[0].hidden, false);
  assert.equal(env.slides[1].hidden, true);

  tick();
  await flush();
  assert.equal(env.counter.textContent, '03 / 3');
  assert.equal(env.slides[2].hidden, false);
  assert.equal(env.slides[1].hidden, true);

  tick();
  await flush();
  assert.equal(env.counter.textContent, '01 / 3');
  assert.equal(env.slides[0].hidden, false);
});

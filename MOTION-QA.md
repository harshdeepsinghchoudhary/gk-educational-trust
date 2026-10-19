# Motion and interaction update

## Implemented across all six pages

The existing content, colors, images, links, form fields, three-column footer and page structure are preserved. Only motion assets were added to the HTML heads. A comparison against the committed HTML verified content preservation on every page.

- Home: staggered heading/copy/CTA entrances, notification-panel entrance, image-safe slideshow crossfades, quick-access cards, training/news cards, process steps and gallery-preview reveals.
- About: page-title entrance, subtle image and text reveals, objective cards and learning-process progression.
- Trainings: staggered programme cards, filter-result entrances, selected-filter feedback, native dialog entrance and disclosure styling.
- News & Events: title and featured-story entrances, card reveals and filter-result feedback.
- Contact: introduction and office-card reveals, stationary form fields with focus feedback, and demo-result entrance.
- Gallery: staggered photo reveals, contained hover zoom, expand-control feedback, filter-result entrances and lightbox entrance.
- Shared: animated navigation underlines, button arrow movement, restrained card elevation, footer-column entrances/link feedback, mobile-menu opening and back-to-top appearance.

## Motion behavior

`js/motion.js` uses IntersectionObserver and the browser's native Web Animations API. Nothing is pre-hidden by motion CSS. No observer or animation support means ordinary visible content. Entrances happen once, with short distances and capped stagger delays; mobile motion is reduced. Focus cancels motion on the element being used. Changing to reduced motion or hiding the tab cancels active entrances. Reduced motion also disables CSS animations/transitions and slideshow autoplay.

Slideshow images decode before replacement; the previous image stays visible during loading. A request counter prevents older image loads from overriding newer navigation. The existing hover/focus pause remains, and autoplay suspends when the slider is outside the viewport. No new framework, runtime dependency or continuous decorative animation was added.

## Source-review refinements

- Tablet navigation uses the existing menu through 1024px, avoiding competition between logo, six links and enlarged text. JavaScript and CSS now use matching 1025px desktop breakpoints.
- Small-screen CTA labels, notification headings, gallery captions and phone rows can wrap instead of clipping.
- Lightbox footer controls wrap with the caption beneath them on small screens.
- Grid children have explicit shrink-safe sizing; no global horizontal-overflow hiding is used.
- Filter animations are limited to results currently within the viewport; offscreen content is left visible and available for normal one-time reveals.

These are code-review fixes, not claims of visually verified rendering.

## Checks actually performed

- All JavaScript syntax checks passed.
- `node qa-check.cjs` passed: six pages, 360 local references, 97 image elements, valid fragments, headings, landmarks, consistent footer and demo-form safeguards.
- All six pages and both new motion assets returned HTTP 200 from the local preview.
- HTML content comparison against the committed version passed for all six pages.
- Motion CSS block-structure check passed.
- `node --test tests/motion.test.cjs` covers one-time reveals, visible fallback, reduced motion, keyboard focus, hidden-tab cancellation, viewport-limited filtering, rapid slideshow navigation, hover pausing and image-load failure behavior. These are simulated DOM behavior tests, not browser tests.

## Browser verification pending

Browser discovery returned no connected browsers or apps. A direct Chrome preview attempt returned “Browser is not available: chrome”. Browser connection was requested; no usable browser had become available during implementation.

**Actual browser viewport sizes tested: none.** No screenshots, visual reviews, layout measurements or browser console results are claimed. The requested first visual review and second review after fixes remain pending.

When browser access is available, test every page at **1920, 1440, 1280, 1024, 768, 430, 390, 375 and 320px**. Inspect the initial viewport and full-page scroll, then revisit sections to confirm entrances do not replay. Check horizontal overflow, enlarged text, keyboard navigation, all filters, gallery controls, training dialogs, the demo form, reduced-motion changes, JavaScript-disabled content and the console. Capture screenshots and repeat affected checks after visual fixes.

The local preview uses a basic loopback HTTP server; Live Server can also serve this folder. See the repository history for publication status. Browser visual verification remains pending until a browser connection is available.

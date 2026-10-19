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

These refinements were subsequently checked in the connected Chromium browser on 19 October 2026, as recorded below.

## Checks actually performed

- All JavaScript syntax checks passed.
- `node qa-check.cjs` passed: six pages, 360 local references, 97 image elements, valid fragments, headings, landmarks, consistent footer and demo-form safeguards.
- All six pages and both new motion assets returned HTTP 200 from the local preview.
- HTML content comparison against the committed version passed for all six pages.
- Motion CSS block-structure check passed.
- `node --test tests/motion.test.cjs` covers one-time reveals, visible fallback, reduced motion, keyboard focus, hidden-tab cancellation, viewport-limited filtering, rapid slideshow navigation, hover pausing and image-load failure behavior. These are simulated DOM behavior tests, not browser tests.

## Browser verification completed: 19 October 2026

Tested the deployed site at https://gk-iti.vercel.app/ in Chromium 155.0.8059.82. The initial review used the deployed assets; the two fixes below were then tested by serving the edited assets through Playwright request routing before publication. No HTML, page content, image, layout or design changes were made in this QA pass.

### Responsive and visual checks

- All six pages were loaded and scrolled at **1920, 1440, 1280, 1024, 768, 430, 390, 375 and 320px**: 54 page/width combinations. No horizontal page overflow, broken visible images or motion elements stuck invisible were found. No page errors or failed HTTP responses occurred in the baseline sweep.
- Captured initial and full-page screenshots at 1440px and 390px for every page. Reviewed desktop and mobile captures, plus targeted screenshots of the menu, training details, contact result, lightbox and slideshow. Screenshots are local QA artifacts in the ignored `.playwright-mcp/` directory.
- Tested the 20px text preference on all six pages at 320, 768, 1024 and 1280px: no horizontal overflow. Preference persistence and the maximum-size disabled control passed.
- Touch emulation at 390x844 and 844x390 passed on all six pages: no horizontal overflow, working menu controls, accessible navigation links and no desktop hover media query. Touch lightbox opening, next and close passed.
- The expanded training card retains 24px bottom padding; a settled browser measurement was approximately 24.8px including its border.

### Motion and interaction checks

- On mobile, a full scroll followed by a second pass did not replay entrance animations. Counts stayed at Home 40, About 28, Trainings 16, News 19, Contact 15 and Gallery 44. Durations were capped at 430ms and all content settled at full opacity.
- Verified navigation underlines, button elevation and arrow movement, quick-card/card/objective/office elevation, card/gallery image zoom, notification hover, footer link/heading feedback, field focus styling and back-to-top feedback using computed styles before and after interaction.
- Ticker pauses on hover; keyboard focus switches it to stationary readable content without overflow. The notification panel scrolls by keyboard.
- All 35 slideshow photographs loaded. Next/previous buttons, keyboard arrows, both wrap directions, single visible settled slide, proportional cover sizing and 44px mobile arrows passed. Autoplay advances normally, pauses on hover/focus/offscreen, resumes after pointer exit and stops for reduced motion while manual navigation remains available.
- Training search, all categories, empty state and reset passed. All six dialogs opened without overflow at 1440px and 320px; Escape restored the opening link. Native dialog navigation did not expose background controls; Chromium may move Tab focus to browser chrome at the end of a cycle.
- News filters returned 2 updates, 2 training entries, 1 event, 1 announcement and 6 total entries. All six detail links opened their native disclosures at desktop and mobile widths.
- Gallery filters returned 4 classroom, 2 practical, 5 workshops, 24 skill and 35 total photos. Lightbox sizing, image loading, next/previous wraparound, arrow keys, Escape and restored focus passed at 1440px and 320px.
- Contact validation rejected empty required fields, invalid email, invalid optional phone and missing consent. A valid sample preview displayed the existing status, focused it and reset the form; editing hid stale status. No non-GET request was made. The form remains a preview without a submission backend.
- Mobile menu open, Escape, outside click, every navigation destination, active-page indication and the tablet/desktop breakpoint passed. Skip-to-main and back-to-top focus behavior passed.
- Reduced motion on all six pages produced zero running animations, no invisible motion content and no overflow. JavaScript-disabled pages retained their headings and six navigation links; native training disclosures and gallery image links worked, and the form submit remained disabled.
- The connected page's console contained zero errors or warnings across the ordinary browser checks. The separate failed-image test intentionally aborted one image request.

### Fixes and regression results

1. **Autoplay recovery:** use the last requested slide index for the next timed advance. A failed image leaves the current photo visible and the following tick proceeds to the next photo instead of retrying the failure forever. Verified by blocking photo 2 in the browser: photo 1 stayed visible, then autoplay reached photo 3. Added a failure-and-wraparound behavior test.
2. **JavaScript-disabled controls:** scope the slideshow control display rule to `.js`. Inactive arrows are now hidden when JavaScript is unavailable, while the first photo and gallery fallback remain visible. Normal slideshow appearance and controls are unchanged.

After the fixes, all seven dependency-free behavior tests, all JavaScript syntax checks, `node qa-check.cjs` and `git diff --check` passed. The source audit checked six pages, 360 local references and 97 images.

### Scope limits

These results cover Chromium and emulated viewport/touch settings. Physical devices, Safari/WebKit and Firefox were not tested. This is a functional and visual QA pass, not a performance benchmark or formal accessibility certification.

## Page loading animation: 19 October 2026

Added a white loading layer with the existing logo, a saffron rotating ring and a short loading label to all six pages. It fades on window load (400ms minimum display plus a 260ms fade), with a three-second fallback that starts dismissal even if an image stalls. Interaction dismisses it immediately. Reduced motion disables rotation, fading and the minimum delay. Deep links bypass it, restored pages are clear, and a late-arriving loader script does not cover content already being read. No layout, page content or existing design was changed.

The observer for existing entrance animations now waits for `gk:page-ready`, avoiding animations running unseen behind the loading layer. A regression test covers this sequencing; all eight behavior tests pass. Source QA passes six pages, 372 local references and 97 HTML image elements.

Browser verification used the edited assets through Playwright request routing in Chromium:

- All six pages at 1440px and 390px showed the loader, cleared it once, then ran entrances. No early entrances, page errors or horizontal overflow occurred.
- Reviewed loader screenshots at 1440px and 320px.
- A deliberately stalled initial image did not prevent fallback dismissal; the document was still loading after the layer was removed.
- Reduced motion produced no ring animation or fade and cleared immediately after load.
- Early Tab dismissed the loader and focused the skip link; an early click dismissed it and opened the mobile menu.
- A delayed loader script skipped the layer after content had already painted. Deep-linked training details opened without a loader. Back navigation left the page usable without a retained loading flag.
- Disabled JavaScript created no overlay and retained all navigation links. Blocking either the loader CSS or loader JavaScript left the page visible and usable; restoring the assets restored normal loading and entrance behavior.

## Selected slides and close-button correction

The homepage now retains the user's 15 selected photographs, while the gallery keeps all 35. Fixed the initially hidden first slide and its missing `src`, renumbered the static labels and counter, and made runtime labels follow the actual collection. The source audit now accepts a selected homepage subset, verifies first-slide visibility and labels, and ignores formatting-only footer differences.

Centered both dialog close controls with grid alignment, zero padding and a unit line height. Restricted gallery navigation padding to the footer buttons so it no longer shifts the close icon.

Validation was code-only at the user's request: `node --check js/home.js`, all eight behavior tests, source QA (six pages, 352 local references, 77 image elements) and `git diff --check` passed. No browser tests were run for these latest changes; earlier browser results above describe the earlier site version.

# GK Educational Trust — website demonstration

A complete six-page client presentation built with HTML5, CSS3 and vanilla JavaScript. No framework, package installation, build step, backend or CMS is required.

## Run locally

Open this folder in VS Code, then right-click `index.html` and choose **Open with Live Server**. Alternatively, serve this folder with any basic static HTTP server. If Python is already installed, run `python -m http.server 8080` and visit `http://localhost:8080`.

Opening `index.html` directly also supports the core content and navigation: shared content is written into each HTML file and does not depend on imports or JavaScript rendering. A local HTTP server is recommended for presentation and testing.

Public Sans is requested from Google Fonts with `display=swap`. If the network is unavailable, the site uses Segoe UI or Arial. Noto Sans Devanagari is included in the fallback stack for future Hindi content; translations are not currently provided. No external JavaScript is loaded.

## Pages and structure

- `index.html`: the complete homepage in the specified section order.
- `about.html`: proposed institutional profile, objectives and learning approach.
- `trainings.html`: six illustrative programmes, search, category filter, reset, empty state, accessible native detail dialog and permanent HTML details.
- `news-events.html`: featured sample update, six filtered entries and expandable announcement details.
- `contact.html`: client-supplied office addresses, clickable email and phone contacts, a validated demonstration form and visit information.
- `gallery.html`: all 35 supplied photographs, category filtering and a keyboard-operable lightbox.
- `css/style.css`: shared design system and component/page styles.
- `css/responsive.css`: layouts for desktop, tablet and small mobile screens.
- `css/header-home.css`: white-header navigation, full-width photo slider and scrollable notification panel.
- `js/home.js`: slideshow navigation, playback and motion/accessibility handling.
- `js/`: shared behavior and four page-specific scripts.
- `assets/images/`: optimized copies of selected workspace photos.
- `assets/icons/favicon.svg`: temporary GK monogram. Other icons are inline SVG.
- `qa-check.cjs`: optional dependency-free source audit. Run `node qa-check.cjs` if Node is already available; Node is not needed to run the website.

## Features and interaction

The header includes a utility bar with a skip link, working text-size controls (14–20px base size) and the English label. Navigation now sits beside the supplied Trust logo in the white identity header, aligned to the same 1240px maximum container width as the sections. The separate blue navigation strip and affiliation block have been removed as requested. The mobile menu supports Escape and exposes its expanded state. Navigation remains visible without JavaScript.

A full-width, viewport-height photo slider appears before the introductory hero. It includes all 35 supplied photographs, left/right edge arrows and a counter, with no pause/play button. Photos fill the frame using proportional cropping. Playback pauses on hover, keyboard focus and hidden tabs; reduced-motion users start with playback paused. Only the current/next photo is loaded by the slideshow, avoiding an upfront download of the entire collection. Without JavaScript, the first photo and a link to the complete gallery remain available.

The introductory hero now has a keyboard-focusable, vertically scrollable notification panel instead of its previous right-side image. Notifications remain clearly marked as illustrative and link to the corresponding sample news details.

Text-size preferences alone are saved in browser local storage when available. The back-to-top control appears after scrolling. Reduced-motion preferences are respected.

Training detail and gallery viewers use native modal dialogs, which provide keyboard focus containment. Close buttons, Escape and outside clicks close them and return focus to the opening link. Gallery left/right arrow keys navigate the current filtered set and wrap at its ends. Training and news details also exist as native HTML disclosures, and gallery links open image files when JavaScript is unavailable.

The enquiry form uses native required, email, length, phone and consent validation. Its submit button remains disabled until the submit-prevention handler is installed. Form controls have no submission names. There is no network request, email service, analytics or database. On a valid preview, the form clears and displays exactly:

> This is a demonstration form. Your information has not been submitted or stored.

Use sample information only. No production privacy or accessibility certification is claimed.

## Photography and rights

All 36 supplied files in `images/` are now used: 35 photographs in the homepage slider and gallery, plus the institutional logo in the header. Five HEIC photographs were converted to JPEG with a temporary development-only converter; the website has no conversion dependency. Copies have a maximum dimension of 1600 pixels (320 for the logo). The 35 photos total approximately 9.25 MiB and are loaded progressively. Original files remain unchanged. `assets/images/sources.json` maps every original to its browser-compatible copy. The earlier nine optimized images remain in use in other page sections; their mapping follows.

These are **user-supplied assets, not independently licensed stock images**. Their copyright, participant permissions and institutional context have not been verified. Use is limited to this local presentation until the client confirms rights and consent. Captions describe visible scenes without asserting that they document Trust activities. No dates or achievements were inferred from filenames.

| Demo image | Supplied source in `images/` |
| --- | --- |
| learning-1.jpg | IMG_20240104_125130.jpg |
| learning-2.jpg | IMG20230504130206.jpg |
| learning-3.jpg | IMG20230617115235.jpg |
| learning-4.jpg | IMG20230504130129.jpg |
| learning-5.jpg | IMG20230613124132.jpg |
| learning-6.jpg | IMG20230304113145.jpg |
| learning-7.jpg | IMG20230304113340.jpg |
| learning-8.jpg | IMG_20240104_123733.jpg |
| learning-9.jpg | IMG-20250711-WA0006.jpg |

The supplied Trust logo is now used in the header. The temporary GK monogram remains in the footer/favicon. No separate official government emblem, NSDC logo, ministry logo or certification mark has been added to the interface. Supplied photographs include incidental signage and need a final client review before public publication.

## Client information needed before production

1. Verified legal identity, registration details, approved institutional profile and governance information.
2. Documentary verification of the supplied NSDC affiliation and ministry-related wording; approved wording and any authorized branding assets. The current language is explicitly labelled unverified, and the site does not represent the Trust as a government department.
3. Approved vision, mission, objectives and actual learning workflow.
4. Confirmed programmes, curricula, availability, requirements, delivery format, fees and duration, and evidence for any certification statements.
5. Office hours and precise map locations. Both postal addresses, two emails and six role-labelled phone numbers have now been supplied and added across the site.
6. Approved news, actual event descriptions and publication dates.
7. Approved photographs, copyright/usage permissions, participant consent and accurate captions.
8. Production logo, domain and hosting decisions.
9. An approved privacy notice and secure enquiry handling service if real submissions are required. The current form intentionally does not submit.
10. Reviewed translations if Hindi support is desired, and a browser/accessibility review before public launch.

## Validation and limitations

See `QA.md` for checks performed and the remaining browser test checklist. The latest source audit passes for six pages, 342 local references and 97 image elements, plus all supplied-image mappings. Every JavaScript file passes `node --check`. The initial version's six page routes returned HTTP 200 from a temporary local server; the revised layout has been source-checked only.

**Browser verification remains outstanding.** The session's browser inventory was empty and the preview browser was unavailable. Responsive layouts at 1440, 1280, 1024, 768, 390 and 320 pixels, keyboard/focus behavior, live filtering, native validation, console errors and visual appearance have therefore not been observed in a browser. Code inspection is not a substitute for those checks.

This is a local demonstration, not a published or production website. All sample content and provisional statements require client approval.

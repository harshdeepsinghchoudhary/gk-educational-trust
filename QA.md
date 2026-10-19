# QA record

## Header and homepage revision

- Removed the separate blue navigation bar and the affiliation block from all six headers; placed navigation beside the supplied logo.
- Slider photos fill the frame; navigation arrows sit at the left/right edges, with hover/focus pausing and no pause button. Header maximum width is 1240px.
- Added all 35 supplied photos to a full-width slider above the hero and to the gallery. Converted the five HEIC files to JPEG, optimized all copies and preserved originals.
- Replaced the hero image with a scrollable six-item sample notification panel.
- Source audit passes: six pages, 342 local references, 97 image elements, all 36 source assets accounted for, no old navigation/affiliation wrappers, and 35 slider/gallery items.
- Updated scripts pass syntax checking. Inspected converted HEIC previews to write descriptive captions.
- Browser discovery again returned no connected browsers. Visual appearance, carousel playback, responsive behavior and interactive checks remain unverified.
- Additional browser checks: use edge-mounted previous/next arrows and arrow keys; hover/focus suspension; reduced-motion startup; all 35 slides; notification scrolling using mouse, touch and keyboard; white-header navigation at each reference width.

## Performed

- Reviewed the supplied brief and existing image assets before creating files.
- Generated a visual contact sheet to select suitable photos; reviewed the photo previews.
- Preserved every original image and created nine optimized local copies.
- Ran syntax checks on `main.js`, `trainings.js`, `news-events.js`, `gallery.js` and `contact.js`: all passed.
- Ran `node qa-check.cjs`: passed for six pages, 235 local references and 31 image elements.
- Checked each local file/fragment target, one H1 per page, required landmarks, unique IDs, active navigation, image alternatives/dimensions and identical footer markup.
- Checked the expected six training examples, six news entries and nine gallery photographs.
- Checked for dead `href="#"` links, Lorem ipsum and inline event attributes: none found.
- Inspected the contact script for submission prevention and absence of network/storage calls; verified no submission field names and a disabled-by-default submit control.
- Served the site with a temporary loopback HTTP server and checked the six HTML routes for HTTP 200.
- Reviewed responsive rules, reduced-motion support, native-dialog fallback links, keyboard handlers and the no-JavaScript content path in source.

## Browser limitation

Attempted to open the local preview in the in-app browser. The tool returned “Browser is not available: iab”. Browser discovery returned an empty browser inventory. No visual rendering, actual interaction, accessibility-tree or console checks could be performed. Responsive source review does not certify absence of overflow.

## Browser acceptance checklist before presentation

1. Inspect all pages at 1440, 1280, 1024, 768, 390 and 320px. Verify no horizontal scrolling or clipped text, including with A+ at its largest setting and browser zoom at 200%.
2. Check all six navigation links, breadcrumbs, page deep links and footer links.
3. At mobile widths, open the menu, navigate, close with Escape and verify expanded state and focus visibility.
4. Use A−, A and A+; navigate to another page and verify the preference. Repeat with browser storage unavailable.
5. Search for “computer”, select each training category, combine search with category, try a no-match query and reset. Verify counts and empty state.
6. Open each training dialog. Tab and Shift+Tab through it, close by button and Escape, and confirm focus returns to its trigger. Open direct detail links.
7. Apply each news filter and open every sample detail link.
8. Apply every gallery filter, open a photograph, navigate with buttons and arrow keys, confirm wraparound within the filter, close with Escape and verify focus restoration.
9. Try empty/invalid form values, invalid email, short name/message, optional phone and missing consent. Then preview with valid sample values. Confirm the exact demo message and no network submission or form storage.
10. Disable JavaScript: verify navigation/content remain usable, details can expand, images open directly and the form cannot submit.
11. Test skip-to-content, back-to-top, visible focus, reduced-motion mode and a screen reader. Review contrast, text sizes and useful image descriptions.
12. Check the console and network panels for runtime errors or missing resources. Confirm fallback typography with Google Fonts blocked.

## Content approval outstanding

Institutional statements, affiliation wording, programme details, contact details, image permissions and news are provisional. No formal WCAG/GIGW compliance, verified affiliation, real event history or production readiness is claimed.


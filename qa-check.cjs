// Dependency-free source checks; not a replacement for browser testing.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const pages = ['index.html','about.html','trainings.html','news-events.html','contact.html','gallery.html'];
let checkedLinks = 0;
let checkedImages = 0;
const contents = Object.fromEntries(pages.map(p => [p, fs.readFileSync(p, 'utf8')]));
for (const [file, html] of Object.entries(contents)) {
  assert.equal((html.match(/<h1[ >]/g)||[]).length, 1, `${file}: one H1`);
  for (const landmark of ['header','main','footer']) assert(html.includes(`<${landmark}`), `${file}: ${landmark}`);
  assert(!/href="#"|Lorem ipsum|on(click|change|submit)=/i.test(html), `${file}: no dead links, filler or inline handlers`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: unique IDs`);
  assert.equal((html.match(/aria-current="page"/g)||[]).length, file === 'index.html' ? 1 : 2, `${file}: active nav and breadcrumb`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const [relative, hash] = ref.split('#');
    const target = relative || file;
    assert(fs.existsSync(target), `${file}: missing ${target}`);
    if (hash) assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`), `${file}: missing fragment ${ref}`);
    checkedLinks++;
  }
  for (const match of html.matchAll(/<img\b[^>]+>/g)) {
    assert(/\balt="[^"]*"/.test(match[0]), `${file}: image alternative text`);
    assert(/\bwidth="\d+"/.test(match[0]) && /\bheight="\d+"/.test(match[0]), `${file}: image dimensions`);
    checkedImages++;
  }
}
assert.equal((contents['trainings.html'].match(/data-training=/g)||[]).length,6);
const imageSources = JSON.parse(fs.readFileSync('assets/images/sources.json','utf8'));
const suppliedPhotos = imageSources.filter(image => !image.logo);
assert.equal((contents['gallery.html'].match(/class="gallery-item"/g)||[]).length,suppliedPhotos.length);
assert.equal((contents['index.html'].match(/class="photo-slide"/g)||[]).length,suppliedPhotos.length);
for (const image of imageSources) {
  assert(fs.existsSync(image.output), `Missing converted asset: ${image.source}`);
  assert(contents['index.html'].includes(image.output), `Image not used: ${image.source}`);
}
for (const html of Object.values(contents)) {
  assert(!html.includes('class="nav-shell"'), 'Old blue navigation removed');
  assert(!html.includes('class="affiliation"'), 'Header affiliation replaced by navigation');
}
assert.equal((contents['news-events.html'].match(/class="card news-card"/g)||[]).length,6);
const contactJS=fs.readFileSync('js/contact.js','utf8');
assert(contactJS.includes('event.preventDefault()'));
assert(!/fetch\s*\(|XMLHttpRequest|localStorage\.|sessionStorage\.|sendBeacon/.test(contactJS));
assert(!/<(?:input|select|textarea)[^>]*\bname=/.test(contents['contact.html']));
assert(/id="demo-submit" disabled/.test(contents['contact.html']));
const footer=contents['index.html'].match(/<footer[\s\S]*?<\/footer>/)[0];
for (const html of Object.values(contents)) assert.equal(html.match(/<footer[\s\S]*?<\/footer>/)[0],footer);
console.log(`PASS: 6 pages, ${checkedLinks} local references, ${checkedImages} image elements, unique IDs, headings, landmarks, page navigation, consistent footer and demo form source safeguards.`);

'use strict';
document.documentElement.classList.add('js');

// The navigation remains fully visible when JavaScript is unavailable.
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
function closeMenu(returnFocus = false) {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-inner')) closeMenu();
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

// Only a presentation preference is stored; no form data is accessed here.
let textSize = 16;
try {
  const saved = Number(localStorage.getItem('gk-text-size'));
  if ([14, 16, 18, 20].includes(saved)) textSize = saved;
} catch { /* The site remains usable when storage is disabled. */ }
function applyTextSize() {
  document.documentElement.style.fontSize = `${textSize}px`;
  document.querySelector('[data-font="smaller"]').disabled = textSize === 14;
  document.querySelector('[data-font="larger"]').disabled = textSize === 20;
}
applyTextSize();
document.querySelectorAll('[data-font]').forEach(button => {
  button.addEventListener('click', () => {
    textSize = button.dataset.font === 'reset' ? 16 : Math.max(14, Math.min(20, textSize + (button.dataset.font === 'larger' ? 2 : -2)));
    applyTextSize();
    try { localStorage.setItem('gk-text-size', String(textSize)); } catch { /* Optional preference only. */ }
  });
});

const backTop = document.querySelector('.back-top');
function updateBackTop() { backTop.hidden = window.scrollY < 550; }
window.addEventListener('scroll', updateBackTop, { passive: true });
updateBackTop();
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.querySelector('.utility a').focus({ preventScroll: true });
});

// Native dialogs supply focus containment and Escape handling. Restore focus
// explicitly so closing via a button, backdrop or keyboard behaves consistently.
window.GKDialog = {
  open(dialog, trigger) {
    dialog.returnFocus = trigger || document.activeElement;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    dialog.querySelector('.close-dialog').focus();
  }
};
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (dialog.returnFocus?.isConnected) dialog.returnFocus.focus();
  });
});

// Deep links also reveal native, non-JavaScript-dependent programme/news details.
function revealDetails() {
  let target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
  if (target?.tagName === 'DETAILS') {
    target.open = true;
    target.scrollIntoView();
  }
}
window.addEventListener('hashchange', revealDetails);
revealDetails();

'use strict';
const search = document.getElementById('training-search');
const category = document.getElementById('training-category');
const trainingCards = [...document.querySelectorAll('.training-card')];
const trainingCount = document.getElementById('training-count');
function filterTrainings() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  trainingCards.forEach(card => {
    const matches = (category.value === 'all' || card.dataset.category === category.value) && card.dataset.search.toLocaleLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) count++;
  });
  trainingCount.textContent = `Showing ${count} of 6 illustrative programmes`;
  document.getElementById('training-empty').hidden = count !== 0;
}
search.addEventListener('input', filterTrainings);
category.addEventListener('change', filterTrainings);
document.getElementById('reset-training').addEventListener('click', () => {
  search.value = '';
  category.value = 'all';
  filterTrainings();
  search.focus();
});
function applyCategoryHash() {
  const hash = location.hash.slice(1);
  if (['digital', 'technical', 'employability'].includes(hash)) {
    category.value = hash;
    search.value = '';
    filterTrainings();
  }
}
applyCategoryHash();
window.addEventListener('hashchange', applyCategoryHash);
const trainingDialog = document.getElementById('training-dialog');
document.querySelectorAll('[data-training]').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof trainingDialog.showModal !== 'function') return;
    event.preventDefault();
    const details = document.getElementById(`detail-${link.dataset.training}`);
    document.getElementById('training-dialog-title').textContent = details.querySelector('summary').textContent;
    document.getElementById('training-dialog-content').innerHTML = details.querySelector('.programme-detail').innerHTML;
    window.GKDialog.open(trainingDialog, link);
  });
});

'use strict';
const newsFilters = [...document.querySelectorAll('[data-news-filter]')];
const newsCards = [...document.querySelectorAll('.news-card')];
newsFilters.forEach(button => {
  button.addEventListener('click', () => {
    newsFilters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    let count = 0;
    newsCards.forEach(card => {
      card.hidden = button.dataset.newsFilter !== 'all' && card.dataset.category !== button.dataset.newsFilter;
      if (!card.hidden) count++;
    });
    document.getElementById('news-count').textContent = `Showing ${count} of 6 sample entries`;
    document.dispatchEvent(new CustomEvent('gk:filtered', { detail: { items: newsCards.filter(card => !card.hidden) } }));
  });
});

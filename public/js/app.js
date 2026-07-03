import { injectLayout } from './components/layout.js';
import { createSearchUI, fuzzySearch } from './search.js';
import { searchIndex } from './data/index.js';

export function initApp(options = {}) {
  const { searchSlot } = injectLayout(options);

  if (searchSlot) {
    createSearchUI(searchSlot, (q) => fuzzySearch(q, searchIndex), {
      placeholder: 'Search locations, food, clubs, lecturers...',
    });
  }

  const panel = document.getElementById('global-search-panel');
  const openBtn = document.getElementById('open-search-panel');
  const closeBtn = document.getElementById('close-search-panel');

  function openPanel() {
    panel?.classList.add('is-open');
    panel?.setAttribute('aria-hidden', 'false');
    searchSlot?.querySelector('input')?.focus();
  }

  function closePanel() {
    panel?.classList.remove('is-open');
    panel?.setAttribute('aria-hidden', 'true');
  }

  openBtn?.addEventListener('click', openPanel);
  closeBtn?.addEventListener('click', closePanel);
  panel?.addEventListener('click', (e) => {
    if (e.target === panel) closePanel();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  return { openSearch: openPanel, searchSlot };
}

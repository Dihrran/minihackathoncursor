import { initApp } from '../app.js';
import { createFilterBar, createSelectFilter } from '../components/filter-bar.js';
import { createStudySpaceCard, createEmptyState } from '../components/card.js';
import { studySpaces } from '../data/study-spaces.js';

const FILTERS = [
  { id: 'open', label: 'Open Now' },
  { id: 'power', label: 'Has Power' },
  { id: 'quiet', label: 'Quiet (4+)' },
  { id: 'library', label: 'Library Only' },
];

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'study-spaces' });

  const grid = document.getElementById('spaces-grid');
  const empty = document.getElementById('empty-state');
  let activeFilters = [];
  let sortBy = 'availability';

  function filterAndSort() {
    let list = [...studySpaces];

    if (activeFilters.includes('open')) list = list.filter((s) => s.isOpen);
    if (activeFilters.includes('power')) list = list.filter((s) => s.hasPower);
    if (activeFilters.includes('quiet')) list = list.filter((s) => s.quietness >= 4);
    if (activeFilters.includes('library')) list = list.filter((s) => s.isLibrary);

    if (sortBy === 'availability') {
      list.sort((a, b) => (a.capacity - a.occupied) - (b.capacity - b.occupied));
      list.reverse();
    } else if (sortBy === 'quietness') {
      list.sort((a, b) => b.quietness - a.quietness);
    }

    grid.innerHTML = '';
    if (!list.length) {
      empty.hidden = false;
      empty.innerHTML = '';
      empty.appendChild(createEmptyState('No study spaces match your filters.'));
      return;
    }
    empty.hidden = true;
    list.forEach((s) => grid.appendChild(createStudySpaceCard(s)));
  }

  const { container } = createFilterBar(FILTERS, (filters) => {
    activeFilters = filters;
    filterAndSort();
  });
  document.getElementById('filters').appendChild(container);

  const sortWrap = document.getElementById('sort-wrap');
  sortWrap.appendChild(createSelectFilter('Sort by...', [
    { value: 'availability', label: 'Most seats available' },
    { value: 'quietness', label: 'Quietest first' },
  ], (val) => {
    sortBy = val || 'availability';
    filterAndSort();
  }));

  filterAndSort();
});

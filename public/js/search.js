export function createSearchUI(container, searchFn, options = {}) {
  const { placeholder = 'Search campus...', onSelect } = options;

  const wrap = document.createElement('div');
  wrap.className = 'ds-search-wrap';
  wrap.innerHTML = `
    <span class="ds-search-icon" aria-hidden="true">🔍</span>
    <input type="search" class="ds-search-input" placeholder="${placeholder}" autocomplete="off" aria-label="Search" aria-expanded="false" aria-controls="search-results">
    <div class="ds-search-results" id="search-results" role="listbox"></div>
  `;

  const input = wrap.querySelector('input');
  const results = wrap.querySelector('.ds-search-results');
  let activeIndex = -1;
  let currentItems = [];

  function renderResults(items) {
    currentItems = items;
    activeIndex = -1;
    if (!items.length) {
      results.classList.remove('is-open');
      input.setAttribute('aria-expanded', 'false');
      results.innerHTML = '';
      return;
    }

    const grouped = {};
    items.forEach((item) => {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    });

    results.innerHTML = Object.entries(grouped).map(([type, group]) => `
      <div class="ds-search-group-title">${type}</div>
      ${group.map((item, i) => {
        const idx = items.indexOf(item);
        return `<button type="button" class="ds-search-item" role="option" data-idx="${idx}">${item.title}</button>`;
      }).join('')}
    `).join('');

    results.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
  }

  function selectItem(item) {
    if (onSelect) onSelect(item);
    else if (item.url) window.location.href = item.url;
    results.classList.remove('is-open');
    input.value = '';
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (q.length < 2) {
      renderResults([]);
      return;
    }
    renderResults(searchFn(q));
  });

  input.addEventListener('keydown', (e) => {
    if (!currentItems.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, currentItems.length - 1);
      updateActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActive();
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectItem(currentItems[activeIndex]);
    } else if (e.key === 'Escape') {
      renderResults([]);
    }
  });

  function updateActive() {
    results.querySelectorAll('.ds-search-item').forEach((el, i) => {
      el.classList.toggle('is-active', i === activeIndex);
    });
  }

  results.addEventListener('click', (e) => {
    const btn = e.target.closest('.ds-search-item');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    selectItem(currentItems[idx]);
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) renderResults([]);
  });

  container.appendChild(wrap);
  return { input, wrap };
}

export function fuzzySearch(query, index) {
  const q = query.toLowerCase();
  return index
    .filter((item) => {
      const hay = `${item.title} ${item.keywords || ''} ${item.type}`.toLowerCase();
      return hay.includes(q);
    })
    .slice(0, 12);
}

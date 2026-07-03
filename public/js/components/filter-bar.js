export function createFilterBar(filters, onChange) {
  const container = document.createElement('div');
  container.className = 'ds-filter-bar';
  const active = new Set();

  filters.forEach(({ id, label }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ds-chip';
    btn.textContent = label;
    btn.dataset.filterId = id;
    btn.addEventListener('click', () => {
      if (active.has(id)) {
        active.delete(id);
        btn.classList.remove('is-active');
      } else {
        active.add(id);
        btn.classList.add('is-active');
      }
      onChange(Array.from(active));
    });
    container.appendChild(btn);
  });

  return { container, getActive: () => Array.from(active) };
}

export function createSelectFilter(label, options, onChange) {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '0.5rem';
  const select = document.createElement('select');
  select.className = 'ds-search-input';
  select.style.padding = '0.5rem 1rem';
  select.style.width = 'auto';
  select.innerHTML = `<option value="">${label}</option>${options.map((o) => `<option value="${o.value}">${o.label}</option>`).join('')}`;
  select.addEventListener('change', () => onChange(select.value));
  wrap.appendChild(select);
  return wrap;
}

import { initApp } from '../app.js';
import { createEmptyState } from '../components/card.js';
import { createBadge, badgeVariantForRecruitment } from '../components/badge.js';
import { clubs, clubCategories } from '../data/clubs.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'clubs' });

  const params = new URLSearchParams(window.location.search);
  const detailId = params.get('id');
  if (detailId) {
    showDetail(detailId);
    return;
  }

  const listEl = document.getElementById('clubs-list');
  const emptyEl = document.getElementById('empty-state');
  let activeCategory = 'all';
  let query = '';

  function renderList() {
    let list = [...clubs];

    if (activeCategory !== 'all') {
      list = list.filter((c) => c.category === activeCategory);
    }

    if (query) {
      const q = query.toLowerCase();
      list = list.filter((c) =>
        `${c.name} ${c.category} ${c.description} ${c.recruitment}`.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

    listEl.innerHTML = '';

    if (!list.length) {
      emptyEl.hidden = false;
      emptyEl.innerHTML = '';
      emptyEl.appendChild(createEmptyState('No clubs match your search.'));
      return;
    }

    emptyEl.hidden = true;

    let currentCategory = '';
    list.forEach((club) => {
      if (club.category !== currentCategory) {
        currentCategory = club.category;
        const heading = document.createElement('h2');
        heading.className = 'ds-section-title';
        heading.style.marginTop = currentCategory === list[0].category ? '0' : '2rem';
        heading.textContent = currentCategory;
        listEl.appendChild(heading);
      }

      listEl.appendChild(createClubListItem(club));
    });
  }

  const filterWrap = document.getElementById('category-filters');
  filterWrap.className = 'ds-filter-bar';

  const allFilters = [{ id: 'all', label: 'All' }, ...clubCategories.map((c) => ({ id: c, label: c }))];
  const chips = [];

  allFilters.forEach(({ id, label }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `ds-chip${id === 'all' ? ' is-active' : ''}`;
    btn.textContent = label;
    btn.addEventListener('click', () => {
      activeCategory = id;
      chips.forEach((c) => c.classList.toggle('is-active', c === btn));
      renderList();
    });
    chips.push(btn);
    filterWrap.appendChild(btn);
  });

  const searchWrap = document.getElementById('club-search');
  searchWrap.innerHTML = `
    <div class="ds-search-wrap">
      <span class="ds-search-icon">🔍</span>
      <input type="search" class="ds-search-input" placeholder="Search clubs..." aria-label="Search clubs">
    </div>
  `;
  searchWrap.querySelector('input').addEventListener('input', (e) => {
    query = e.target.value.trim().toLowerCase();
    renderList();
  });

  renderList();
});

function createClubListItem(club) {
  const a = document.createElement('a');
  a.href = `/clubs.html?id=${club.id}`;
  a.className = 'club-list-item';
  const initials = club.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const badge = createBadge(club.recruitment, badgeVariantForRecruitment(club.recruitment));

  a.innerHTML = `
    <span class="club-list-logo" style="background:${club.logoColor};">${initials}</span>
    <span class="club-list-body">
      <span class="club-list-header">
        <span class="club-list-name">${club.name}</span>
        <span class="club-list-badge"></span>
      </span>
      <span class="club-list-desc">${club.description}</span>
      <span class="club-list-meta">${club.email} · ${club.instagram}</span>
    </span>
    <span class="club-list-arrow" aria-hidden="true">→</span>
  `;

  a.querySelector('.club-list-badge').appendChild(badge);
  return a;
}

function showDetail(id) {
  const club = clubs.find((c) => c.id === id);
  if (!club) {
    window.location.href = '/clubs.html';
    return;
  }

  document.getElementById('explorer-view').hidden = true;
  document.getElementById('page-banner')?.setAttribute('hidden', '');
  const detail = document.getElementById('detail-view');
  detail.hidden = false;

  detail.innerHTML = `
    <a href="/clubs.html" class="club-back-link">← Back to Club Explorer</a>
    <div class="ds-card ds-card-static" style="padding:1.5rem;">
      <div style="display:flex;gap:1.25rem;align-items:flex-start;flex-wrap:wrap;margin-bottom:1.5rem;">
        <div style="width:4.5rem;height:4.5rem;background:${club.logoColor};display:flex;align-items:center;justify-content:center;color:white;font-size:1.25rem;font-weight:700;border:2px solid var(--ds-black);">
          ${club.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </div>
        <div>
          <h1 style="margin:0 0 0.35rem;font-size:1.75rem;">${club.name}</h1>
          <p style="margin:0 0 0.5rem;color:var(--ds-text-muted);">${club.category}</p>
          <span class="ds-badge ds-badge-${badgeVariantForRecruitment(club.recruitment)}">Recruitment: ${club.recruitment}</span>
        </div>
      </div>
      <p style="margin:0 0 1.5rem;line-height:1.7;">${club.description}</p>

      <h2 class="ds-section-title">Committee</h2>
      <table style="width:100%;margin-bottom:1.5rem;border-collapse:collapse;font-size:0.9rem;">
        ${club.committee.map((m) => `<tr style="border-bottom:1px solid var(--ds-border);"><td style="padding:0.5rem 0;font-weight:600;width:40%;">${m.role}</td><td style="padding:0.5rem 0;color:var(--ds-text-muted);">${m.name}</td></tr>`).join('')}
      </table>

      <h2 class="ds-section-title">Contact</h2>
      <p style="margin:0 0 0.25rem;">✉️ <a href="mailto:${club.email}">${club.email}</a></p>
      <p style="margin:0 0 0.25rem;">📸 ${club.instagram}</p>
      ${club.discord ? `<p style="margin:0 0 1rem;">💬 ${club.discord}</p>` : '<p style="margin:0 0 1rem;"></p>'}

      <h2 class="ds-section-title">Upcoming Activities</h2>
      <ul style="margin:0;padding-left:1.25rem;color:var(--ds-text-muted);">
        ${club.activities.map((act) => `<li style="margin-bottom:0.35rem;">${act}</li>`).join('')}
      </ul>
    </div>
  `;
}

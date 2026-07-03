import { initApp } from '../app.js';
import { createFilterBar } from '../components/filter-bar.js';
import { createVenueCard, createEmptyState } from '../components/card.js';
import { createBadge } from '../components/badge.js';
import { foodVenues } from '../data/food-venues.js';

const FILTERS = [
  { id: 'open', label: 'Open Now' },
  { id: 'budget', label: 'Budget' },
  { id: 'halal', label: 'Halal' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'walking', label: 'Walking Distance' },
];

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'food' });

  const params = new URLSearchParams(window.location.search);
  const detailId = params.get('id');

  if (detailId) {
    showDetail(detailId);
    return;
  }

  const grid = document.getElementById('venues-grid');
  const empty = document.getElementById('empty-state');
  let activeFilters = [];

  function renderList() {
    let list = [...foodVenues];
    if (activeFilters.includes('open')) list = list.filter((v) => v.isOpen);
    if (activeFilters.includes('budget')) list = list.filter((v) => v.budget);
    if (activeFilters.includes('halal')) list = list.filter((v) => v.halal);
    if (activeFilters.includes('vegetarian')) list = list.filter((v) => v.vegetarian);
    if (activeFilters.includes('coffee')) list = list.filter((v) => v.coffee);
    if (activeFilters.includes('dessert')) list = list.filter((v) => v.dessert);
    if (activeFilters.includes('walking')) list = list.filter((v) => v.walkingDistance);

    grid.innerHTML = '';
    if (!list.length) {
      empty.hidden = false;
      empty.innerHTML = '';
      empty.appendChild(createEmptyState('No venues match your filters.'));
      return;
    }
    empty.hidden = true;

    list.forEach((v) => {
      const badges = [];
      if (v.isOpen) badges.push(createBadge('Open now', 'open'));
      if (v.halal) badges.push(createBadge('Halal', 'halal'));
      if (v.vegetarian) badges.push(createBadge('Vegetarian', 'veg'));
      if (v.budget) badges.push(createBadge('Budget', 'budget'));

      grid.appendChild(createVenueCard({
        href: `/food.html?id=${v.id}`,
        name: v.name,
        meta: `${v.cuisine} · ${v.priceRange} · ⭐ ${v.rating} · ${v.walkMinutes} min walk`,
        badges,
        imageColor: v.imageColor,
      }));
    });
  }

  const { container } = createFilterBar(FILTERS, (filters) => {
    activeFilters = filters;
    renderList();
  });
  document.getElementById('filters').appendChild(container);
  renderList();
});

function showDetail(id) {
  const venue = foodVenues.find((v) => v.id === id);
  if (!venue) {
    window.location.href = '/food.html';
    return;
  }

  document.getElementById('list-view').hidden = true;
  document.getElementById('list-banner')?.setAttribute('hidden', '');
  const detail = document.getElementById('detail-view');
  detail.hidden = false;

  const hoursRows = Object.entries(venue.hours).map(([day, h]) =>
    `<tr><td style="padding:0.35rem 0;font-weight:600;text-transform:capitalize;">${day}</td><td style="padding:0.35rem 0;color:var(--ds-text-muted);">${h}</td></tr>`
  ).join('');

  detail.innerHTML = `
    <a href="/food.html" style="display:inline-flex;align-items:center;gap:0.35rem;margin-bottom:1rem;font-weight:500;">← Back to Food Guide</a>
    <div class="ds-card ds-card-static overflow-hidden">
      <div style="height:12rem;background:${venue.imageColor};display:flex;align-items:center;justify-content:center;font-size:4rem;">🍽️</div>
      <div style="padding:1.5rem;">
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
          ${venue.isOpen ? '<span class="ds-badge ds-badge-open">Open now</span>' : '<span class="ds-badge ds-badge-closed">Closed</span>'}
          ${venue.halal ? '<span class="ds-badge ds-badge-halal">Halal</span>' : ''}
          ${venue.vegetarian ? '<span class="ds-badge ds-badge-veg">Vegetarian options</span>' : ''}
        </div>
        <h1 style="margin:0 0 0.5rem;font-size:1.75rem;">${venue.name}</h1>
        <p style="margin:0 0 1rem;color:var(--ds-text-muted);">${venue.cuisine} · ${venue.priceRange} · ⭐ ${venue.rating} · ${venue.walkMinutes} min walk</p>
        <p style="margin:0 0 1.5rem;line-height:1.7;">${venue.description}</p>
        <h2 style="font-size:1rem;margin:0 0 0.5rem;">Popular Items</h2>
        <ul style="margin:0 0 1.5rem;padding-left:1.25rem;color:var(--ds-text-muted);">
          ${venue.popularItems.map((i) => `<li>${i}</li>`).join('')}
        </ul>
        <h2 style="font-size:1rem;margin:0 0 0.5rem;">Opening Hours</h2>
        <table style="width:100%;margin-bottom:1.5rem;border-collapse:collapse;">${hoursRows}</table>
        <p style="margin:0 0 0.25rem;"><strong>Address:</strong> ${venue.address}</p>
        <p style="margin:0 0 1rem;color:var(--ds-text-muted);"><strong>Phone:</strong> ${venue.phone}</p>
            <a href="/map.html" class="ds-btn ds-btn-primary" style="text-decoration:none;display:inline-flex;">View on Campus Map</a>
      </div>
    </div>
  `;
}

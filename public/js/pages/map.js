import { initApp } from '../app.js';
import { createFilterBar } from '../components/filter-bar.js';
import { createDetailPanel } from '../components/modal.js';
import { campusLocations, categoryLabels, categoryColors, CAMPUS_CENTER } from '../data/campus-locations.js';

const categoryFilters = Object.entries(categoryLabels).map(([id, label]) => ({ id, label }));

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'map' });

  const map = L.map('campus-map').setView([CAMPUS_CENTER.lat, CAMPUS_CENTER.lng], CAMPUS_CENTER.zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  const panelContainer = document.getElementById('map-panel');
  const panel = createDetailPanel(panelContainer);

  let activeCategories = new Set(Object.keys(categoryLabels));
  let searchQuery = '';
  const markers = [];

  function showLocation(loc) {
    const directionsUrl = loc.isMain
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CAMPUS_CENTER.address)}`
      : `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
    panel.show(`
      <h2 style="margin:0 0 0.5rem;font-size:1.15rem;">${loc.name}</h2>
      <span class="ds-badge ds-badge-halal" style="margin-bottom:0.75rem;display:inline-block;">${categoryLabels[loc.category] || loc.category}</span>
      <p style="margin:0 0 0.5rem;color:var(--ds-text-muted);font-size:0.9rem;">📍 ${loc.building}${loc.floor ? `, ${loc.floor}` : ''}</p>
      ${loc.isMain ? `<p style="margin:0 0 0.5rem;font-size:0.85rem;line-height:1.5;">${CAMPUS_CENTER.address}</p>` : ''}
      <p style="margin:0 0 0.5rem;color:var(--ds-text-muted);font-size:0.9rem;">🕐 ${loc.hours}</p>
      <p style="margin:0 0 1rem;font-size:0.9rem;line-height:1.6;">${loc.description}</p>
      <a href="${directionsUrl}" target="_blank" rel="noopener" class="ds-btn ds-btn-primary" style="text-decoration:none;display:inline-flex;width:100%;justify-content:center;">Get Directions</a>
    `);
  }

  function createMarkerIcon(loc) {
    const color = loc.isMain ? '#000000' : (categoryColors[loc.category] || '#3b82f6');
    const size = loc.isMain ? 20 : 14;
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${loc.isMain ? '#ffcd00' : 'white'};box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  function updateMarkers() {
    markers.forEach((m) => map.removeLayer(m));
    markers.length = 0;

    campusLocations
      .filter((loc) => activeCategories.has(loc.category))
      .filter((loc) => {
        if (!searchQuery) return true;
        const hay = `${loc.name} ${loc.building} ${loc.description} ${CAMPUS_CENTER.address}`.toLowerCase();
        return hay.includes(searchQuery);
      })
      .forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], { icon: createMarkerIcon(loc), zIndexOffset: loc.isMain ? 1000 : 0 }).addTo(map);
        marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.building}`);
        marker.on('click', () => showLocation(loc));
        markers.push(marker);
      });
  }

  const { container } = createFilterBar(categoryFilters, (filters) => {
    if (filters.length === 0) {
      activeCategories = new Set(Object.keys(categoryLabels));
      container.querySelectorAll('.ds-chip').forEach((c) => c.classList.remove('is-active'));
    } else {
      activeCategories = new Set(filters);
    }
    updateMarkers();
  });
  document.getElementById('map-filters').appendChild(container);

  const searchWrap = document.getElementById('map-search');
  searchWrap.innerHTML = `
    <div class="ds-search-wrap">
      <span class="ds-search-icon">🔍</span>
      <input type="search" class="ds-search-input" placeholder="Search locations..." aria-label="Search map">
    </div>
  `;
  searchWrap.querySelector('input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    updateMarkers();
  });

  updateMarkers();
  showLocation(campusLocations.find((l) => l.isMain) || campusLocations[0]);

  const highlight = new URLSearchParams(window.location.search).get('highlight');
  if (highlight) {
    const loc = campusLocations.find((l) => l.id === highlight);
    if (loc) {
      map.setView([loc.lat, loc.lng], 18);
      showLocation(loc);
    }
  }
});

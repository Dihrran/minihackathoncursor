import { initApp } from '../app.js';
import { announcements, studySpaces, foodVenues, events } from '../data/index.js';

const QUICK_ACCESS = [
  { href: '/map.html', icon: '🗺️', title: 'Campus Map', description: 'Find buildings, labs, and facilities' },
  { href: '/study-spaces.html', icon: '📚', title: 'Study Spaces', description: 'Check seats, Wi-Fi, and quiet zones' },
  { href: '/food.html', icon: '🍜', title: 'Food Guide', description: 'Halal, budget, and open-now filters' },
  { href: '/clubs.html', icon: '🎯', title: 'Club Explorer', description: 'Discover clubs and societies' },
  { href: '/lecturers.html', icon: '👩‍🏫', title: 'Lecturers', description: 'Office hours and appointments' },
  { href: '/services.html', icon: '🏛️', title: 'Services', description: 'IT, finance, health, and more' },
  { href: '/events.html', icon: '📅', title: 'Events', description: 'Workshops, fairs, and club events' },
  { href: '/freshman.html', icon: '🎓', title: 'Freshman Guide', description: 'Survival tips and campus FAQs' },
];

document.addEventListener('DOMContentLoaded', () => {
  const { openSearch } = initApp({ activePage: 'home' });

  document.getElementById('hero-filter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const section = document.getElementById('filter-section').value;
    if (section) {
      window.location.href = section;
      return;
    }
    openSearch();
  });

  const quickAccess = document.getElementById('quick-access');
  QUICK_ACCESS.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'home-quick-card';
    a.innerHTML = `
      <div class="home-quick-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;
    quickAccess.appendChild(a);
  });

  const annContainer = document.getElementById('announcements');
  announcements.forEach((a) => {
    const div = document.createElement('div');
    div.className = 'home-announce';
    div.innerHTML = `
      <p class="home-announce-title">${a.title}</p>
      <p class="home-announce-body">${a.body}</p>
    `;
    annContainer.appendChild(div);
  });

  const highlights = document.getElementById('highlights');
  const today = new Date().toISOString().slice(0, 10);
  const nextEvent = events.find((e) => e.date === today) || events.find((e) => e.date >= today);
  const bestSpace = [...studySpaces].filter((s) => s.isOpen).sort((a, b) => (b.capacity - b.occupied) - (a.capacity - a.occupied))[0];
  const openFood = foodVenues.filter((v) => v.isOpen)[0];

  [
    nextEvent && { label: 'Next Event', value: nextEvent.title, sub: `${nextEvent.time} · ${nextEvent.venue}` },
    bestSpace && { label: 'Most Seats Available', value: bestSpace.name, sub: `${bestSpace.capacity - bestSpace.occupied} seats free · Quietness ${bestSpace.quietness}/5` },
    openFood && { label: 'Open Now — Food', value: openFood.name, sub: `${openFood.cuisine} · ${openFood.walkMinutes} min walk · ${openFood.priceRange}` },
  ].filter(Boolean).forEach((item) => {
    const div = document.createElement('div');
    div.className = 'home-highlight-card';
    div.innerHTML = `
      <p class="home-highlight-label">${item.label}</p>
      <p class="home-highlight-value">${item.value}</p>
      <p class="home-highlight-sub">${item.sub}</p>
    `;
    highlights.appendChild(div);
  });
});

import { initApp } from '../app.js';
import { createServiceCard } from '../components/card.js';
import { services } from '../data/services.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'services' });
  const grid = document.getElementById('services-grid');
  services.forEach((s) => grid.appendChild(createServiceCard(s)));
});

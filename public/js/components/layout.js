export const NAV_ITEMS = [
  { href: '/index.html', label: 'Home', icon: '🏠', id: 'home' },
  { href: '/map.html', label: 'Map', icon: '🗺️', id: 'map' },
  { href: '/study-spaces.html', label: 'Study', icon: '📚', id: 'study-spaces' },
  { href: '/food.html', label: 'Food', icon: '🍜', id: 'food' },
  { href: '/clubs.html', label: 'Clubs', icon: '🎯', id: 'clubs' },
  { href: '/lecturers.html', label: 'Lecturers', icon: '👩‍🏫', id: 'lecturers' },
  { href: '/services.html', label: 'Services', icon: '🏛️', id: 'services' },
  { href: '/events.html', label: 'Events', icon: '📅', id: 'events' },
  { href: '/freshman.html', label: 'Freshman', icon: '🎓', id: 'freshman' },
];

const LOGO_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L2 9v12h8v-6h4v6h8V9L12 3zm0 2.5L18 10v9h-4v-6H10v6H6v-9l6-4.5z"/></svg>`;

export function getCurrentPageId() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  if (file === 'index.html' || file === '') return 'home';
  return file.replace('.html', '');
}

export function injectLayout(options = {}) {
  const { activePage } = options;
  const pageId = activePage || getCurrentPageId();
  const isHome = pageId === 'home';

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';

  const header = document.createElement('header');
  header.className = 'ds-header';
  header.innerHTML = `
    <div class="ds-header-inner">
      <a href="/index.html" class="ds-logo" aria-label="UniGuide home">
        <span class="ds-logo-mark" aria-hidden="true">${LOGO_SVG}</span>
        <span class="ds-logo-text">UniGuide</span>
      </a>
      <nav class="ds-nav-desktop" aria-label="Main navigation">
        ${NAV_ITEMS.filter((i) => !isHome || i.id !== 'home').map((item) => `
          <a href="${item.href}" class="ds-nav-link${pageId === item.id ? ' is-active' : ''}">${item.label}</a>
        `).join('')}
      </nav>
      <div class="ds-header-search">
        <button type="button" class="ds-search-campus" id="open-search-panel">
          Search Campus <span aria-hidden="true">🔍</span>
        </button>
      </div>
      <div class="ds-header-actions">
        <button type="button" class="ds-menu-toggle" id="mobile-menu-btn" aria-label="Open menu" aria-expanded="false">☰</button>
      </div>
    </div>
  `;

  document.body.prepend(header);
  document.body.prepend(skipLink);

  const searchPanel = document.createElement('div');
  searchPanel.className = 'ds-search-panel';
  searchPanel.id = 'global-search-panel';
  searchPanel.setAttribute('role', 'dialog');
  searchPanel.setAttribute('aria-label', 'Search campus');
  searchPanel.setAttribute('aria-hidden', 'true');
  searchPanel.innerHTML = `
    <div class="ds-search-panel-inner">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <strong style="text-transform:uppercase;letter-spacing:0.05em;">Search Campus</strong>
        <button type="button" id="close-search-panel" class="ds-theme-toggle" aria-label="Close search">✕</button>
      </div>
      <div id="global-search-slot"></div>
    </div>
  `;
  document.body.appendChild(searchPanel);

  const drawer = document.createElement('div');
  drawer.className = 'ds-mobile-drawer';
  drawer.id = 'mobile-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <nav aria-label="Mobile navigation">
      ${NAV_ITEMS.map((item) => `
        <a href="${item.href}" class="ds-mobile-nav-link${pageId === item.id ? ' is-active' : ''}">${item.icon} ${item.label}</a>
      `).join('')}
    </nav>
  `;
  document.body.appendChild(drawer);

  const bottomNav = document.createElement('nav');
  bottomNav.className = 'ds-bottom-nav';
  bottomNav.setAttribute('aria-label', 'Quick navigation');
  bottomNav.innerHTML = NAV_ITEMS.slice(0, 5).map((item) => `
    <a href="${item.href}" class="ds-bottom-nav-link${pageId === item.id ? ' is-active' : ''}">
      <span class="ds-bottom-nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join('');
  document.body.appendChild(bottomNav);

  const footer = document.createElement('footer');
  footer.className = 'ds-footer';
  footer.innerHTML = `
    <p><strong>UniGuide</strong> — Your UOW Malaysia campus companion</p>
    <p style="margin-top:0.5rem;font-size:0.8rem;opacity:0.7;">Glenmarie Campus, Shah Alam · Built for students, by students</p>
  `;
  document.body.appendChild(footer);

  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const open = drawer.classList.toggle('is-open');
    menuBtn?.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  });

  return {
    searchSlot: document.getElementById('global-search-slot'),
  };
}

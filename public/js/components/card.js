export function createQuickAccessCard({ href, icon, title, description, stagger = '' }) {
  const a = document.createElement('a');
  a.href = href;
  a.className = `ds-card block p-5 no-underline animate-in ${stagger}`;
  a.style.color = 'inherit';
  a.innerHTML = `
    <div style="font-size:1.75rem;margin-bottom:0.75rem;">${icon}</div>
    <h3 style="margin:0 0 0.35rem;font-size:1rem;font-weight:700;">${title}</h3>
    <p style="margin:0;font-size:0.85rem;color:var(--ds-text-muted);">${description}</p>
  `;
  return a;
}

export function createStatCard({ label, value, sub, icon }) {
  const div = document.createElement('div');
  div.className = 'ds-card ds-card-static p-4';
  div.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;">
      <div>
        <p style="margin:0;font-size:0.8rem;color:var(--ds-text-muted);">${label}</p>
        <p style="margin:0.25rem 0 0;font-size:1.25rem;font-weight:700;">${value}</p>
        ${sub ? `<p style="margin:0.25rem 0 0;font-size:0.8rem;color:var(--ds-text-muted);">${sub}</p>` : ''}
      </div>
      ${icon ? `<span style="font-size:1.5rem;">${icon}</span>` : ''}
    </div>
  `;
  return div;
}

export function createVenueCard({ href, name, meta, badges = [], imageColor = '#dbeafe' }) {
  const a = document.createElement('a');
  a.href = href;
  a.className = 'ds-card block overflow-hidden no-underline';
  a.style.color = 'inherit';
  a.innerHTML = `
    <div style="height:7rem;background:${imageColor};display:flex;align-items:center;justify-content:center;font-size:2.5rem;">🍽️</div>
    <div style="padding:1rem;">
      <h3 style="margin:0 0 0.35rem;font-size:1rem;font-weight:700;">${name}</h3>
      <p style="margin:0 0 0.5rem;font-size:0.85rem;color:var(--ds-text-muted);">${meta}</p>
      <div style="display:flex;flex-wrap:wrap;gap:0.35rem;"></div>
    </div>
  `;
  const badgeContainer = a.querySelector('div:last-child div');
  badges.forEach((b) => badgeContainer.appendChild(b));
  return a;
}

export function createServiceCard({ name, location, hours, phone, email, helps, ctaLabel, ctaHref }) {
  const div = document.createElement('div');
  div.className = 'ds-card ds-card-static p-5';
  div.innerHTML = `
    <h3 style="margin:0 0 0.5rem;font-size:1.1rem;font-weight:700;">${name}</h3>
    <p style="margin:0 0 0.25rem;font-size:0.85rem;color:var(--ds-text-muted);">📍 ${location}</p>
    <p style="margin:0 0 0.25rem;font-size:0.85rem;color:var(--ds-text-muted);">🕐 ${hours}</p>
    <p style="margin:0 0 0.75rem;font-size:0.85rem;color:var(--ds-text-muted);">📞 ${phone} · ✉️ ${email}</p>
    <ul style="margin:0 0 1rem;padding-left:1.25rem;font-size:0.85rem;color:var(--ds-text-muted);">
      ${helps.map((h) => `<li>${h}</li>`).join('')}
    </ul>
    <a href="${ctaHref}" class="ds-btn ds-btn-primary" style="text-decoration:none;display:inline-flex;">${ctaLabel}</a>
  `;
  return div;
}

export function createProfileCard({ href, name, title, faculty, courses, office, hours }) {
  const a = document.createElement('a');
  a.href = href;
  a.className = 'ds-card block p-5 no-underline';
  a.style.color = 'inherit';
  a.innerHTML = `
    <div style="display:flex;gap:1rem;align-items:flex-start;">
      <div style="width:3rem;height:3rem;border-radius:50%;background:var(--ds-primary-light);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--ds-primary);flex-shrink:0;">
        ${name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
      </div>
      <div>
        <h3 style="margin:0 0 0.15rem;font-size:1rem;font-weight:700;">${name}</h3>
        <p style="margin:0 0 0.25rem;font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">${title}</p>
        <p style="margin:0 0 0.25rem;font-size:0.8rem;color:var(--ds-text-muted);">${faculty}</p>
        <p style="margin:0;font-size:0.8rem;color:var(--ds-text-muted);">${courses.join(', ')}</p>
        <p style="margin:0.35rem 0 0;font-size:0.8rem;color:var(--ds-text-muted);">📍 ${office} · 🕐 ${hours}</p>
      </div>
    </div>
  `;
  return a;
}

export function createStudySpaceCard(space) {
  const pct = Math.round((space.occupied / space.capacity) * 100);
  const free = space.capacity - space.occupied;
  const occClass = pct < 50 ? 'ds-occupancy-low' : pct < 80 ? 'ds-occupancy-mid' : 'ds-occupancy-high';
  const div = document.createElement('div');
  div.className = 'ds-card ds-card-static p-5';
  div.dataset.id = space.id;
  div.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
      <div>
        <h3 style="margin:0 0 0.25rem;font-size:1rem;font-weight:700;">${space.name}</h3>
        <p style="margin:0;font-size:0.85rem;color:var(--ds-text-muted);">${space.building} · ${space.floor}</p>
      </div>
      <span class="ds-badge ${space.isOpen ? 'ds-badge-open' : 'ds-badge-closed'}">${space.isOpen ? 'Open now' : 'Closed'}</span>
    </div>
    <div style="margin-bottom:0.75rem;">
      <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:0.35rem;">
        <span>${free} seats free</span>
        <span style="color:var(--ds-text-muted);">${pct}% full</span>
      </div>
      <div class="ds-occupancy"><div class="ds-occupancy-fill ${occClass}" style="width:${pct}%;"></div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.8rem;">
      <div><span style="color:var(--ds-text-muted);">Quietness</span><div class="ds-quiet-dots" data-quiet="${space.quietness}"></div></div>
      <div><span style="color:var(--ds-text-muted);">Power</span><p style="margin:0.15rem 0 0;font-weight:600;">${space.power}</p></div>
      <div><span style="color:var(--ds-text-muted);">Wi-Fi</span><p style="margin:0.15rem 0 0;font-weight:600;">${space.wifi}</p></div>
      <div><span style="color:var(--ds-text-muted);">Hours</span><p style="margin:0.15rem 0 0;font-weight:600;">${space.hours}</p></div>
    </div>
  `;
  const dots = div.querySelector('.ds-quiet-dots');
  for (let i = 1; i <= 5; i++) {
    const dot = document.createElement('span');
    dot.className = `ds-quiet-dot${i <= space.quietness ? ' filled' : ''}`;
    dots.appendChild(dot);
  }
  return div;
}

export function createAnnouncementBanner({ title, body, type = 'info' }) {
  const div = document.createElement('div');
  div.className = 'ds-card ds-card-static p-4 animate-in';
  div.style.borderLeft = '4px solid var(--ds-primary)';
  div.innerHTML = `
    <p style="margin:0 0 0.25rem;font-weight:700;font-size:0.9rem;">${title}</p>
    <p style="margin:0;font-size:0.85rem;color:var(--ds-text-muted);">${body}</p>
  `;
  return div;
}

export function createEmptyState(message) {
  const div = document.createElement('div');
  div.className = 'ds-empty';
  div.innerHTML = `<p style="font-size:2rem;margin:0 0 0.5rem;">🔍</p><p>${message}</p>`;
  return div;
}

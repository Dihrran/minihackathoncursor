import { initApp } from '../app.js';
import { freshmanGuide } from '../data/freshman.js';

const SECTIONS = [
  { id: 'tips', label: 'Survival Tips' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'parking', label: 'Parking' },
  { id: 'library', label: 'Library' },
  { id: 'lms', label: 'LMS Guide' },
  { id: 'links', label: 'Useful Links' },
];

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'freshman' });

  const tabs = document.getElementById('guide-tabs');
  const content = document.getElementById('guide-content');
  let activeSection = window.location.hash.replace('#', '') || 'tips';
  let searchQuery = '';

  function renderTips() {
    const items = freshmanGuide.tips.filter((t) =>
      !searchQuery || `${t.title} ${t.body}`.toLowerCase().includes(searchQuery)
    );
    const wrap = document.createElement('div');
    wrap.id = 'tips';
    items.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'ds-accordion-item is-open';
      item.innerHTML = `
        <button type="button" class="ds-accordion-trigger" aria-expanded="true">
          <span>${i + 1}. ${t.title}</span>
          <span class="ds-accordion-chevron">▼</span>
        </button>
        <div class="ds-accordion-panel">${t.body}</div>
      `;
      item.querySelector('.ds-accordion-trigger').addEventListener('click', () => {
        item.classList.toggle('is-open');
      });
      wrap.appendChild(item);
    });
    if (!items.length) wrap.innerHTML = '<p style="color:var(--ds-text-muted);">No tips match your search.</p>';
    return wrap;
  }

  function renderFaqs() {
    const wrap = document.createElement('div');
    wrap.id = 'faqs';
    freshmanGuide.faqs
      .filter((f) => !searchQuery || `${f.q} ${f.a}`.toLowerCase().includes(searchQuery))
      .forEach((f) => {
        const item = document.createElement('div');
        item.className = 'ds-accordion-item';
        item.innerHTML = `
          <button type="button" class="ds-accordion-trigger" aria-expanded="false">
            <span>${f.q}</span>
            <span class="ds-accordion-chevron">▼</span>
          </button>
          <div class="ds-accordion-panel">${f.a}</div>
        `;
        item.querySelector('.ds-accordion-trigger').addEventListener('click', () => {
          item.classList.toggle('is-open');
        });
        wrap.appendChild(item);
      });
    return wrap;
  }

  function renderGuideSection(section) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<h2 style="font-size:1.25rem;margin:0 0 1rem;">${section.title}</h2>`;
    section.sections.forEach((s) => {
      const div = document.createElement('div');
      div.className = 'ds-card ds-card-static';
      div.style.cssText = 'padding:1.25rem;margin-bottom:0.75rem;';
      div.innerHTML = `<h3 style="margin:0 0 0.5rem;font-size:1rem;">${s.heading}</h3><p style="margin:0;color:var(--ds-text-muted);">${s.content}</p>`;
      wrap.appendChild(div);
    });
    return wrap;
  }

  function renderLinks() {
    const wrap = document.createElement('div');
    wrap.className = 'ds-grid-2';
    freshmanGuide.links.forEach((l) => {
      const a = document.createElement('a');
      a.href = l.url;
      a.className = 'ds-card block p-5 no-underline';
      a.style.color = 'inherit';
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `
        <h3 style="margin:0 0 0.35rem;font-size:1rem;font-weight:700;color:var(--ds-primary);">${l.label}</h3>
        <p style="margin:0;font-size:0.85rem;color:var(--ds-text-muted);">${l.desc}</p>
      `;
      wrap.appendChild(a);
    });
    return wrap;
  }

  function render() {
    content.innerHTML = '';
    if (activeSection === 'tips') content.appendChild(renderTips());
    else if (activeSection === 'faqs') content.appendChild(renderFaqs());
    else if (activeSection === 'parking') content.appendChild(renderGuideSection(freshmanGuide.parking));
    else if (activeSection === 'library') content.appendChild(renderGuideSection(freshmanGuide.library));
    else if (activeSection === 'lms') content.appendChild(renderGuideSection(freshmanGuide.lms));
    else if (activeSection === 'links') content.appendChild(renderLinks());

    tabs.querySelectorAll('.ds-chip').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.section === activeSection);
    });
  }

  SECTIONS.forEach(({ id, label }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ds-chip';
    btn.dataset.section = id;
    btn.textContent = label;
    btn.addEventListener('click', () => {
      activeSection = id;
      window.location.hash = id;
      render();
    });
    tabs.appendChild(btn);
  });

  const searchWrap = document.getElementById('guide-search');
  searchWrap.innerHTML = `
    <div class="ds-search-wrap">
      <span class="ds-search-icon">🔍</span>
      <input type="search" class="ds-search-input" placeholder="Search tips and FAQs..." aria-label="Search guide">
    </div>
  `;
  searchWrap.querySelector('input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    if (activeSection !== 'tips' && activeSection !== 'faqs') activeSection = 'tips';
    render();
  });

  if (window.location.hash) activeSection = window.location.hash.replace('#', '') || 'tips';
  render();
});

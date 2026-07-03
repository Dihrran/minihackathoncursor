import { initApp } from '../app.js';
import { createSelectFilter } from '../components/filter-bar.js';
import { createProfileCard, createEmptyState } from '../components/card.js';
import { lecturers, faculties } from '../data/lecturers.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'lecturers' });

  const params = new URLSearchParams(window.location.search);
  const detailId = params.get('id');
  if (detailId) {
    showDetail(detailId);
    return;
  }

  const grid = document.getElementById('lecturers-grid');
  const empty = document.getElementById('empty-state');
  let query = '';
  let faculty = '';

  function render() {
    let list = [...lecturers];
    if (faculty) list = list.filter((l) => l.faculty === faculty);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((l) =>
        `${l.name} ${l.faculty} ${l.courses.join(' ')} ${l.title}`.toLowerCase().includes(q)
      );
    }

    grid.innerHTML = '';
    if (!list.length) {
      empty.hidden = false;
      empty.innerHTML = '';
      empty.appendChild(createEmptyState('No lecturers match your search.'));
      return;
    }
    empty.hidden = true;

    list.forEach((l) => {
      grid.appendChild(createProfileCard({
        href: `/lecturers.html?id=${l.id}`,
        name: l.name,
        title: l.title,
        faculty: l.faculty,
        courses: l.courses,
        office: l.office,
        hours: l.hours,
      }));
    });
  }

  const searchWrap = document.getElementById('search-wrap');
  searchWrap.innerHTML = `
    <div class="ds-search-wrap">
      <span class="ds-search-icon">🔍</span>
      <input type="search" class="ds-search-input" placeholder="Search by name or course..." aria-label="Search lecturers">
    </div>
  `;
  searchWrap.querySelector('input').addEventListener('input', (e) => {
    query = e.target.value;
    render();
  });

  const facultyFilter = document.getElementById('faculty-filter');
  facultyFilter.appendChild(createSelectFilter('All faculties', faculties.map((f) => ({ value: f, label: f })), (val) => {
    faculty = val;
    render();
  }));

  render();
});

function showDetail(id) {
  const lecturer = lecturers.find((l) => l.id === id);
  if (!lecturer) {
    window.location.href = '/lecturers.html';
    return;
  }

  document.getElementById('list-view').hidden = true;
  document.getElementById('list-banner')?.setAttribute('hidden', '');
  const detail = document.getElementById('detail-view');
  detail.hidden = false;

  detail.innerHTML = `
    <a href="/lecturers.html" style="display:inline-flex;align-items:center;gap:0.35rem;margin-bottom:1rem;font-weight:500;">← Back to Directory</a>
    <div class="ds-card ds-card-static" style="padding:1.5rem;">
      <div style="display:flex;gap:1.25rem;align-items:flex-start;flex-wrap:wrap;">
        <div style="width:5rem;height:5rem;border-radius:50%;background:var(--ds-primary-light);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:var(--ds-primary);">
          ${lecturer.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>
        <div style="flex:1;min-width:16rem;">
          <h1 style="margin:0 0 0.25rem;font-size:1.75rem;">${lecturer.name}</h1>
          <p style="margin:0 0 0.25rem;color:var(--ds-primary);font-weight:600;">${lecturer.title}</p>
          <p style="margin:0 0 1rem;color:var(--ds-text-muted);">${lecturer.faculty}</p>
        </div>
      </div>
      <div class="ds-grid-2" style="margin-bottom:1.5rem;">
        <div><strong>Office</strong><p style="margin:0.25rem 0 0;color:var(--ds-text-muted);">${lecturer.office}</p></div>
        <div><strong>Consultation Hours</strong><p style="margin:0.25rem 0 0;color:var(--ds-text-muted);">${lecturer.hours}</p></div>
        <div><strong>Email</strong><p style="margin:0.25rem 0 0;"><a href="mailto:${lecturer.email}">${lecturer.email}</a></p></div>
        <div><strong>Courses</strong><p style="margin:0.25rem 0 0;color:var(--ds-text-muted);">${lecturer.courses.join(', ')}</p></div>
      </div>
      <a href="${lecturer.appointment}" target="_blank" rel="noopener" class="ds-btn ds-btn-primary" style="text-decoration:none;display:inline-flex;">Book Appointment</a>
    </div>
  `;
}

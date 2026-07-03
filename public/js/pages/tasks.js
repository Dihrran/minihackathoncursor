import { initApp } from '../app.js';

const STORAGE_KEY = 'uniguide-tasks';
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Done' },
];

let tasks = [];
let filter = 'all';

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(tasks)) tasks = [];
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function visibleTasks() {
  if (filter === 'active') return tasks.filter((t) => !t.completed);
  if (filter === 'done') return tasks.filter((t) => t.completed);
  return tasks;
}

function renderFilters(container) {
  container.innerHTML = FILTERS.map(
    (f) => `
      <button
        type="button"
        class="ds-chip${filter === f.id ? ' is-active' : ''}"
        data-filter="${f.id}"
        role="tab"
        aria-selected="${filter === f.id}"
      >${f.label}</button>
    `,
  ).join('');

  container.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      renderFilters(container);
      render();
    });
  });
}

function renderStats(el) {
  const active = tasks.filter((t) => !t.completed).length;
  const done = tasks.filter((t) => t.completed).length;
  el.textContent = `${active} active · ${done} done`;
}

function renderList(listEl, emptyEl) {
  const items = visibleTasks();

  if (items.length === 0) {
    listEl.innerHTML = '';
    emptyEl.hidden = false;
    emptyEl.querySelector('p').textContent =
      filter === 'all'
        ? 'No tasks yet. Add one above to get started.'
        : filter === 'active'
          ? 'No active tasks — you are all caught up.'
          : 'No completed tasks yet.';
    return;
  }

  emptyEl.hidden = true;
  listEl.innerHTML = items
    .map(
      (task) => `
        <li class="task-item${task.completed ? ' is-done' : ''}" data-id="${task.id}">
          <input
            type="checkbox"
            class="task-check"
            ${task.completed ? 'checked' : ''}
            aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}"
          >
          <div class="task-body">
            <p class="task-title">${escapeHtml(task.title)}</p>
            <p class="task-meta">Added ${formatDate(task.createdAt)}</p>
          </div>
          <button type="button" class="task-delete" aria-label="Delete task">×</button>
        </li>
      `,
    )
    .join('');

  listEl.querySelectorAll('.task-item').forEach((row) => {
    const id = row.dataset.id;
    row.querySelector('.task-check')?.addEventListener('change', (e) => {
      toggleTask(id, e.target.checked);
    });
    row.querySelector('.task-delete')?.addEventListener('click', () => {
      deleteTask(id);
    });
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function addTask(title) {
  tasks.unshift({
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  });
  saveTasks();
  render();
}

function toggleTask(id, completed) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.completed = completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function render() {
  renderStats(document.getElementById('task-stats'));
  renderList(document.getElementById('task-list'), document.getElementById('task-empty'));
}

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'tasks' });
  loadTasks();
  renderFilters(document.getElementById('task-filters'));
  render();

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    addTask(title);
    input.value = '';
    input.focus();
  });
});

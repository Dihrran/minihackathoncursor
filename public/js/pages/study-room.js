import { initApp } from '../app.js';

/* ── URL params ── */
const params = new URLSearchParams(window.location.search);
let roomId = sanitizeId(params.get('room') || 'main-hall');
let userName = sanitizeName(params.get('user') || '');

function sanitizeId(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 40) || 'main-hall';
}

function sanitizeName(str) {
  return str.trim().replace(/[<>]/g, '').slice(0, 30);
}

function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('room', roomId);
  if (userName) url.searchParams.set('user', userName);
  else url.searchParams.delete('user');
  history.replaceState(null, '', url);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Room join UI ── */
function initRoomJoin() {
  const roomInput = document.getElementById('room-input');
  const userInput = document.getElementById('user-input');
  const hint = document.getElementById('room-hint');

  roomInput.value = roomId;
  userInput.value = userName;

  if (!userName) {
    userName = `Student${Math.floor(Math.random() * 9000 + 1000)}`;
    userInput.value = userName;
    updateUrl();
  }

  const refreshHint = () => {
    hint.textContent = `Room "${roomId}" · Share: ${window.location.origin}/study-room.html?room=${encodeURIComponent(roomId)}&user=YourName`;
  };
  refreshHint();

  document.getElementById('join-room').addEventListener('click', () => {
    roomId = sanitizeId(roomInput.value);
    userName = sanitizeName(userInput.value) || userName;
    roomInput.value = roomId;
    userInput.value = userName;
    updateUrl();
    refreshHint();
    loadTasks();
    renderTasks();
    renderChat();
    renderOnline();
    heartbeat();
  });
}

/* ── Tasks ── */
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Done' },
];

let tasks = [];
let filter = 'all';

function taskKey() {
  return `uniguide-tasks-${userName}`;
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(taskKey());
    tasks = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(tasks)) tasks = [];
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(taskKey(), JSON.stringify(tasks));
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function visibleTasks() {
  if (filter === 'active') return tasks.filter((t) => !t.completed);
  if (filter === 'done') return tasks.filter((t) => t.completed);
  return tasks;
}

function renderFilters(container) {
  container.innerHTML = FILTERS.map(
    (f) => `<button type="button" class="ds-chip${filter === f.id ? ' is-active' : ''}" data-filter="${f.id}" role="tab">${f.label}</button>`,
  ).join('');
  container.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      renderFilters(container);
      renderTasks();
    });
  });
}

function renderTasks() {
  renderStats(document.getElementById('task-stats'));
  renderList(document.getElementById('task-list'), document.getElementById('task-empty'));
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
    return;
  }
  emptyEl.hidden = true;
  listEl.innerHTML = items
    .map(
      (task) => `
        <li class="task-item${task.completed ? ' is-done' : ''}" data-id="${task.id}">
          <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''} aria-label="Toggle task">
          <div class="task-body">
            <p class="task-title">${escapeHtml(task.title)}</p>
            <p class="task-meta">${formatDate(task.createdAt)}</p>
          </div>
          <button type="button" class="task-delete" aria-label="Delete">×</button>
        </li>`,
    )
    .join('');

  listEl.querySelectorAll('.task-item').forEach((row) => {
    const id = row.dataset.id;
    row.querySelector('.task-check')?.addEventListener('change', (e) => {
      const task = tasks.find((t) => t.id === id);
      if (task) { task.completed = e.target.checked; saveTasks(); renderTasks(); }
    });
    row.querySelector('.task-delete')?.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      renderTasks();
    });
  });
}

function initTasks() {
  loadTasks();
  renderFilters(document.getElementById('task-filters'));
  renderTasks();
  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const title = input.value.trim();
    if (!title) return;
    tasks.unshift({ id: crypto.randomUUID(), title, completed: false, createdAt: new Date().toISOString() });
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
  });
}

/* ── Pomodoro ── */
const MODES = {
  focus: { label: 'Focus', minutes: 25, break: false },
  short: { label: 'Short Break', minutes: 5, break: true },
  long: { label: 'Long Break', minutes: 15, break: true },
};

let mode = 'focus';
let secondsLeft = MODES.focus.minutes * 60;
let totalSeconds = secondsLeft;
let running = false;
let timerId = null;
let sessions = 0;

function pomoSessionKey() {
  return `uniguide-pomodoro-${userName}`;
}

function loadSessions() {
  sessions = Number(localStorage.getItem(pomoSessionKey())) || 0;
}

function saveSessions() {
  localStorage.setItem(pomoSessionKey(), String(sessions));
}

function formatTime(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderPomodoro() {
  const cfg = MODES[mode];
  document.getElementById('pomo-label').textContent = cfg.label;
  document.getElementById('pomo-display').textContent = formatTime(secondsLeft);
  const progress = document.getElementById('pomo-progress');
  progress.style.width = `${totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0}%`;
  progress.classList.toggle('is-break', cfg.break);
  document.getElementById('pomo-start').textContent = running ? 'Pause' : 'Start';
  document.getElementById('pomo-session').innerHTML = `Sessions: <strong>${sessions}</strong>`;

  const modesEl = document.getElementById('pomo-modes');
  modesEl.innerHTML = Object.entries(MODES)
    .map(([id, c]) => `<button type="button" class="ds-chip${mode === id ? ' is-active' : ''}" data-mode="${id}">${c.label}</button>`)
    .join('');
  modesEl.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (running) return;
      mode = btn.dataset.mode;
      totalSeconds = MODES[mode].minutes * 60;
      secondsLeft = totalSeconds;
      renderPomodoro();
    });
  });

  if (running) document.title = `${formatTime(secondsLeft)} — Study Room`;
  else document.title = 'Study Room — UniGuide';
}

function pomoTick() {
  if (secondsLeft <= 0) {
    pomoPause();
    if (mode === 'focus') {
      sessions += 1;
      saveSessions();
      mode = sessions % 4 === 0 ? 'long' : 'short';
    } else {
      mode = 'focus';
    }
    totalSeconds = MODES[mode].minutes * 60;
    secondsLeft = totalSeconds;
    renderPomodoro();
    return;
  }
  secondsLeft -= 1;
  renderPomodoro();
}

function pomoStart() {
  if (running) return;
  running = true;
  timerId = setInterval(pomoTick, 1000);
  renderPomodoro();
}

function pomoPause() {
  running = false;
  clearInterval(timerId);
  timerId = null;
}

function initPomodoro() {
  loadSessions();
  renderPomodoro();
  document.getElementById('pomo-start').addEventListener('click', () => {
    if (running) pomoPause(); else pomoStart();
    renderPomodoro();
  });
  document.getElementById('pomo-reset').addEventListener('click', () => {
    pomoPause();
    totalSeconds = MODES[mode].minutes * 60;
    secondsLeft = totalSeconds;
    renderPomodoro();
  });
}

/* ── Chat (mock multi-user via localStorage) ── */
function chatKey() {
  return `uniguide-chat-${roomId}`;
}

function presenceKey() {
  return `uniguide-presence-${roomId}`;
}

function getMessages() {
  try {
    const raw = localStorage.getItem(chatKey());
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveMessages(list) {
  localStorage.setItem(chatKey(), JSON.stringify(list.slice(-100)));
}

function getPresence() {
  try {
    const raw = localStorage.getItem(presenceKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePresence(map) {
  localStorage.setItem(presenceKey(), JSON.stringify(map));
}

function heartbeat() {
  const map = getPresence();
  map[userName] = Date.now();
  const cutoff = Date.now() - 45000;
  Object.keys(map).forEach((k) => {
    if (map[k] < cutoff) delete map[k];
  });
  savePresence(map);
}

function renderChat() {
  const el = document.getElementById('chat-messages');
  const messages = getMessages();
  if (messages.length === 0) {
    el.innerHTML = '<p class="chat-empty">No messages yet. Say hi to the room!</p>';
    return;
  }
  el.innerHTML = messages
    .map(
      (m) => `
        <div class="chat-msg${m.user === userName ? ' is-self' : ''}">
          <span class="chat-msg-user">${escapeHtml(m.user)}</span>
          <span class="chat-msg-text">${escapeHtml(m.text)}</span>
          <span class="chat-msg-time">${formatChatTime(m.at)}</span>
        </div>`,
    )
    .join('');
  el.scrollTop = el.scrollHeight;
}

function formatChatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function renderOnline() {
  const el = document.getElementById('chat-online');
  const map = getPresence();
  const online = Object.keys(map).sort();
  if (online.length === 0) {
    el.textContent = 'Just you';
    return;
  }
  el.innerHTML = `<span class="chat-online-dot" aria-hidden="true"></span> ${online.length} online: ${online.map((n) => escapeHtml(n)).join(', ')}`;
}

function sendChat(text) {
  const messages = getMessages();
  messages.push({ id: crypto.randomUUID(), user: userName, text, at: new Date().toISOString() });
  saveMessages(messages);
  renderChat();
}

let presenceInterval = null;

function initChat() {
  renderChat();
  document.getElementById('chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    sendChat(text);
    input.value = '';
  });
}

function initPresence() {
  heartbeat();
  if (presenceInterval) clearInterval(presenceInterval);
  presenceInterval = setInterval(() => {
    heartbeat();
    renderOnline();
  }, 10000);
  renderOnline();
}

function initStorageSync() {
  window.addEventListener('storage', (e) => {
    if (e.key === chatKey()) renderChat();
    if (e.key === presenceKey()) renderOnline();
  });
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'study-room' });
  initRoomJoin();
  initTasks();
  initPomodoro();
  initChat();
  initPresence();
  initStorageSync();

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

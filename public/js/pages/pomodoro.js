import { initApp } from '../app.js';

const MODES = {
  focus: { label: 'Focus', minutes: 25, break: false },
  short: { label: 'Short Break', minutes: 5, break: true },
  long: { label: 'Long Break', minutes: 15, break: true },
};

const SESSION_KEY = 'uniguide-pomodoro-sessions';

let mode = 'focus';
let secondsLeft = MODES.focus.minutes * 60;
let totalSeconds = secondsLeft;
let running = false;
let timerId = null;
let sessions = 0;

function loadSessions() {
  sessions = Number(localStorage.getItem(SESSION_KEY)) || 0;
}

function saveSessions() {
  localStorage.setItem(SESSION_KEY, String(sessions));
}

function formatTime(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTabTitle() {
  if (running) {
    document.title = `${formatTime(secondsLeft)} — ${MODES[mode].label}`;
  } else {
    document.title = 'Pomodoro — UniGuide';
  }
}

function renderModes(container) {
  container.innerHTML = Object.entries(MODES)
    .map(
      ([id, cfg]) => `
        <button
          type="button"
          class="ds-chip${mode === id ? ' is-active' : ''}"
          data-mode="${id}"
          role="tab"
          aria-selected="${mode === id}"
        >${cfg.label}</button>
      `,
    )
    .join('');

  container.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (running) return;
      setMode(btn.dataset.mode);
    });
  });
}

function setMode(nextMode) {
  mode = nextMode;
  totalSeconds = MODES[mode].minutes * 60;
  secondsLeft = totalSeconds;
  render();
}

function render() {
  const cfg = MODES[mode];
  document.getElementById('pomo-label').textContent = cfg.label;
  document.getElementById('pomo-display').textContent = formatTime(secondsLeft);

  const progress = document.getElementById('pomo-progress');
  const pct = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  progress.style.width = `${pct}%`;
  progress.classList.toggle('is-break', cfg.break);

  document.getElementById('pomo-start').textContent = running ? 'Pause' : 'Start';
  document.getElementById('pomo-session').innerHTML =
    `Sessions completed: <strong>${sessions}</strong>`;

  renderModes(document.getElementById('pomo-modes'));
  updateTabTitle();
}

function tick() {
  if (secondsLeft <= 0) {
    onComplete();
    return;
  }
  secondsLeft -= 1;
  render();
}

function onComplete() {
  pause();
  if (mode === 'focus') {
    sessions += 1;
    saveSessions();
    notify('Focus session complete!', 'Time for a break.');
    setMode(sessions % 4 === 0 ? 'long' : 'short');
  } else {
    notify('Break over!', 'Ready for another focus session?');
    setMode('focus');
  }
}

function notify(title, body) {
  if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

function start() {
  if (running) return;
  running = true;
  timerId = setInterval(tick, 1000);
  render();
}

function pause() {
  running = false;
  clearInterval(timerId);
  timerId = null;
  render();
}

function toggle() {
  if (running) pause();
  else start();
}

function reset() {
  pause();
  totalSeconds = MODES[mode].minutes * 60;
  secondsLeft = totalSeconds;
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'pomodoro' });
  loadSessions();

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  render();

  document.getElementById('pomo-start').addEventListener('click', toggle);
  document.getElementById('pomo-reset').addEventListener('click', reset);
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateTabTitle();
});

const STORAGE_KEY = 'uniguide-theme';

export function getTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'light';
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  updateToggleIcon(theme);
}

export function initTheme() {
  const saved = getTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
  setTheme(theme);
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

function updateToggleIcon(theme) {
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

export function bindThemeToggle() {
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });
  updateToggleIcon(getTheme());
}

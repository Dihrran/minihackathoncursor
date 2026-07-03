export function openModal({ title, content, onClose }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'ds-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'modal-title');

  const modal = document.createElement('div');
  modal.className = 'ds-modal';
  modal.innerHTML = `
    <div style="padding:1.25rem;border-bottom:1px solid var(--ds-border);display:flex;justify-content:space-between;align-items:center;">
      <h2 id="modal-title" style="margin:0;font-size:1.1rem;">${title}</h2>
      <button type="button" class="ds-theme-toggle" data-close aria-label="Close">✕</button>
    </div>
    <div style="padding:1.25rem;" id="modal-body"></div>
  `;

  const body = modal.querySelector('#modal-body');
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof Node) {
    body.appendChild(content);
  }

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  requestAnimationFrame(() => backdrop.classList.add('is-open'));

  function close() {
    backdrop.classList.remove('is-open');
    setTimeout(() => backdrop.remove(), 200);
    onClose?.();
  }

  backdrop.querySelector('[data-close]').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', esc);
    }
  });

  return { close, body };
}

export function createDetailPanel(container) {
  const panel = document.createElement('aside');
  panel.className = 'ds-card ds-card-static';
  panel.style.cssText = 'padding:1.25rem;position:sticky;top:calc(var(--ds-header-h) + 1rem);';
  panel.innerHTML = '<p style="color:var(--ds-text-muted);">Select a location to view details.</p>';
  container.appendChild(panel);

  return {
    show(html) {
      panel.innerHTML = html;
    },
    clear() {
      panel.innerHTML = '<p style="color:var(--ds-text-muted);">Select a location to view details.</p>';
    },
  };
}

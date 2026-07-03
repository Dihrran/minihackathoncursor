const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function createCalendar({ events = [], onDateSelect, onEventClick, initialDate = new Date() }) {
  let viewDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  let selectedDate = null;

  const wrap = document.createElement('div');
  wrap.className = 'ds-card ds-card-static';
  wrap.style.padding = '1.25rem';

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'ds-btn ds-btn-secondary';
  prevBtn.textContent = '←';
  prevBtn.setAttribute('aria-label', 'Previous month');

  const title = document.createElement('h3');
  title.style.margin = '0';
  title.style.fontSize = '1.1rem';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'ds-btn ds-btn-secondary';
  nextBtn.textContent = '→';
  nextBtn.setAttribute('aria-label', 'Next month');

  header.append(prevBtn, title, nextBtn);

  const dayHeaders = document.createElement('div');
  dayHeaders.className = 'ds-cal-grid';
  dayHeaders.style.marginBottom = '0.5rem';
  DAYS.forEach((d) => {
    const span = document.createElement('div');
    span.style.cssText = 'text-align:center;font-size:0.75rem;font-weight:600;color:var(--ds-text-muted);padding:0.25rem;';
    span.textContent = d;
    dayHeaders.appendChild(span);
  });

  const grid = document.createElement('div');
  grid.className = 'ds-cal-grid';

  wrap.append(header, dayHeaders, grid);

  function getEventsForDate(dateStr) {
    return events.filter((e) => e.date === dateStr);
  }

  function formatDateStr(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function render() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    title.textContent = `${MONTHS[month]} ${year}`;

    grid.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());

    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('div');
      cell.className = 'ds-cal-day other-month';
      grid.appendChild(cell);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateStr(year, month, d);
      const dayEvents = getEventsForDate(dateStr);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ds-cal-day';
      if (dateStr === todayStr) btn.classList.add('is-today');
      if (dateStr === selectedDate) btn.classList.add('is-selected');
      btn.innerHTML = `<span>${d}</span>`;
      if (dayEvents.length) {
        const dots = document.createElement('div');
        dots.className = 'ds-cal-dots';
        dayEvents.slice(0, 3).forEach((ev) => {
          const dot = document.createElement('span');
          dot.className = 'ds-cal-dot';
          dot.style.background = ev.color || '#3b82f6';
          dots.appendChild(dot);
        });
        btn.appendChild(dots);
      }
      btn.addEventListener('click', () => {
        selectedDate = dateStr;
        render();
        onDateSelect?.(dateStr, dayEvents);
      });
      grid.appendChild(btn);
    }
  }

  prevBtn.addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    render();
  });

  nextBtn.addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    render();
  });

  render();

  return { element: wrap, render, setSelectedDate: (d) => { selectedDate = d; render(); } };
}

export function createEventList(events, onEventClick) {
  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '0.75rem';

  if (!events.length) {
    list.innerHTML = '<p style="color:var(--ds-text-muted);margin:0;">No events on this date.</p>';
    return list;
  }

  events.forEach((ev) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ds-card ds-card-static';
    btn.style.cssText = 'padding:1rem;text-align:left;border:none;cursor:pointer;width:100%;';
    btn.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;">
        <span class="ds-cal-dot" style="background:${ev.color || '#3b82f6'};width:8px;height:8px;"></span>
        <span style="font-size:0.75rem;color:var(--ds-text-muted);">${ev.typeLabel || ev.type}</span>
      </div>
      <p style="margin:0 0 0.25rem;font-weight:700;">${ev.title}</p>
      <p style="margin:0;font-size:0.85rem;color:var(--ds-text-muted);">${ev.time} · ${ev.venue}</p>
    `;
    btn.addEventListener('click', () => onEventClick?.(ev));
    list.appendChild(btn);
  });

  return list;
}

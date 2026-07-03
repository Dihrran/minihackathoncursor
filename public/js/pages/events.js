import { initApp } from '../app.js';
import { createFilterBar } from '../components/filter-bar.js';
import { createCalendar, createEventList } from '../components/calendar.js';
import { openModal } from '../components/modal.js';
import { events, eventTypeLabels, eventTypeColors } from '../data/events.js';

const TYPE_FILTERS = Object.entries(eventTypeLabels).map(([id, label]) => ({ id, label }));

document.addEventListener('DOMContentLoaded', () => {
  initApp({ activePage: 'events' });

  let activeTypes = new Set(Object.keys(eventTypeLabels));
  const eventsListEl = document.getElementById('events-list');
  const dateTitle = document.getElementById('events-date-title');

  function getFilteredEvents() {
    return events
      .filter((e) => activeTypes.has(e.type))
      .map((e) => ({
        ...e,
        color: eventTypeColors[e.type],
        typeLabel: eventTypeLabels[e.type],
      }));
  }

  function showEventDetail(ev) {
    openModal({
      title: ev.title,
      content: `
        <p style="margin:0 0 0.5rem;"><span class="ds-badge" style="background:var(--ds-primary-light);color:var(--ds-primary);">${eventTypeLabels[ev.type]}</span></p>
        <p style="margin:0 0 0.35rem;"><strong>Date:</strong> ${ev.date}</p>
        <p style="margin:0 0 0.35rem;"><strong>Time:</strong> ${ev.time}</p>
        <p style="margin:0 0 0.35rem;"><strong>Venue:</strong> ${ev.venue}</p>
        <p style="margin:0 0 1rem;"><strong>Organizer:</strong> ${ev.organizer}</p>
        <a href="${ev.registration}" target="_blank" rel="noopener" class="ds-btn ds-btn-primary" style="text-decoration:none;display:inline-flex;">Register</a>
      `,
    });
  }

  function onDateSelect(dateStr, dayEvents) {
    dateTitle.textContent = new Date(dateStr + 'T12:00:00').toLocaleDateString('en-MY', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    eventsListEl.innerHTML = '';
    eventsListEl.appendChild(createEventList(dayEvents, showEventDetail));
  }

  const calendarWrap = document.getElementById('calendar-wrap');
  let calendar;

  function rebuildCalendar() {
    calendarWrap.innerHTML = '';
    calendar = createCalendar({
      events: getFilteredEvents(),
      onDateSelect,
      onEventClick: showEventDetail,
    });
    calendarWrap.appendChild(calendar.element);
  }

  const { container } = createFilterBar(TYPE_FILTERS, (filters) => {
    if (filters.length === 0) {
      activeTypes = new Set(Object.keys(eventTypeLabels));
      container.querySelectorAll('.ds-chip').forEach((c) => c.classList.remove('is-active'));
    } else {
      activeTypes = new Set(filters);
    }
    rebuildCalendar();
  });
  document.getElementById('type-filters').appendChild(container);

  rebuildCalendar();

  const dateParam = new URLSearchParams(window.location.search).get('date');
  if (dateParam) {
    calendar.setSelectedDate(dateParam);
    const dayEvents = getFilteredEvents().filter((e) => e.date === dateParam);
    onDateSelect(dateParam, dayEvents);
  }
});

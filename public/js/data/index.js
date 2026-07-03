import { announcements } from './announcements.js';
import { campusLocations } from './campus-locations.js';
import { studySpaces } from './study-spaces.js';
import { foodVenues } from './food-venues.js';
import { clubs } from './clubs.js';
import { lecturers } from './lecturers.js';
import { services } from './services.js';
import { events } from './events.js';
import { freshmanGuide } from './freshman.js';

export {
  announcements,
  campusLocations,
  studySpaces,
  foodVenues,
  clubs,
  lecturers,
  services,
  events,
  freshmanGuide,
};

export function buildSearchIndex() {
  const index = [];

  campusLocations.forEach((loc) => {
    index.push({
      id: loc.id,
      type: 'Locations',
      title: loc.name,
      keywords: `${loc.building} ${loc.category} ${loc.description}`,
      url: `/map.html?highlight=${loc.id}`,
    });
  });

  studySpaces.forEach((s) => {
    index.push({
      id: s.id,
      type: 'Study Spaces',
      title: s.name,
      keywords: `${s.building} ${s.power} ${s.wifi}`,
      url: '/study-spaces.html',
    });
  });

  foodVenues.forEach((v) => {
    index.push({
      id: v.id,
      type: 'Food',
      title: v.name,
      keywords: `${v.cuisine} ${v.priceRange} halal vegetarian`,
      url: `/food.html?id=${v.id}`,
    });
  });

  clubs.forEach((c) => {
    index.push({
      id: c.id,
      type: 'Clubs',
      title: c.name,
      keywords: `${c.category} ${c.description}`,
      url: `/clubs.html?id=${c.id}`,
    });
  });

  lecturers.forEach((l) => {
    index.push({
      id: l.id,
      type: 'Lecturers',
      title: l.name,
      keywords: `${l.faculty} ${l.courses.join(' ')} ${l.title}`,
      url: `/lecturers.html?id=${l.id}`,
    });
  });

  services.forEach((s) => {
    index.push({
      id: s.id,
      type: 'Services',
      title: s.name,
      keywords: s.helps.join(' '),
      url: '/services.html',
    });
  });

  events.forEach((e) => {
    index.push({
      id: e.id,
      type: 'Events',
      title: e.title,
      keywords: `${e.type} ${e.venue} ${e.organizer}`,
      url: `/events.html?date=${e.date}`,
    });
  });

  freshmanGuide.tips.forEach((t, i) => {
    index.push({
      id: `tip-${i}`,
      type: 'Freshman Guide',
      title: t.title,
      keywords: t.body,
      url: '/freshman.html#tips',
    });
  });

  freshmanGuide.faqs.forEach((f, i) => {
    index.push({
      id: `faq-${i}`,
      type: 'Freshman Guide',
      title: f.q,
      keywords: f.a,
      url: '/freshman.html#faqs',
    });
  });

  announcements.forEach((a) => {
    index.push({
      id: a.id,
      type: 'Announcements',
      title: a.title,
      keywords: a.body,
      url: '/index.html',
    });
  });

  return index;
}

export const searchIndex = buildSearchIndex();

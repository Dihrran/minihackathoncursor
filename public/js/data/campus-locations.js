/**
 * UOW Malaysia — Utropolis Glenmarie
 * Jalan Kontraktor U1/14, Seksyen U1, 40150 Shah Alam, Selangor
 * Coordinates from OpenStreetMap (UOW Malaysia bus stop / campus entrance)
 */
export const CAMPUS_CENTER = {
  lat: 3.092906,
  lng: 101.559843,
  zoom: 17,
  address: 'Utropolis Glenmarie, Jalan Kontraktor U1/14, Seksyen U1, 40150 Shah Alam, Selangor',
  name: 'UOW Malaysia',
};

/** Offset from campus center in metres: [north, east] */
function coords(northM, eastM) {
  const lat = CAMPUS_CENTER.lat + northM / 111320;
  const lng = CAMPUS_CENTER.lng + eastM / (111320 * Math.cos((CAMPUS_CENTER.lat * Math.PI) / 180));
  return { lat: +lat.toFixed(6), lng: +lng.toFixed(6) };
}

const c = coords;

export const campusLocations = [
  {
    id: 'uow-main',
    name: 'UOW Malaysia — Main Campus',
    category: 'office',
    building: 'Utropolis Glenmarie',
    floor: 'Ground',
    hours: 'Mon–Fri 9 AM – 5:30 PM · Sat–Sun 10 AM – 4 PM',
    ...CAMPUS_CENTER,
    description: 'University of Wollongong Malaysia flagship campus at Utropolis Glenmarie, Jalan Kontraktor U1/14.',
    isMain: true,
  },
  { id: 'block-a-lecture', name: 'Block A Lecture Theatre', category: 'lecture', building: 'Block A', floor: 'Ground', hours: 'Mon–Fri 8 AM–6 PM', ...c(85, -55), description: 'Main computing faculty lecture hall, seats 200.' },
  { id: 'block-a-lab', name: 'Block A Computer Lab 1', category: 'classroom', building: 'Block A', floor: 'Level 2', hours: 'Mon–Fri 8 AM–10 PM', ...c(75, -45), description: 'Programming labs with dual monitors.' },
  { id: 'block-a-lab2', name: 'Block A Computer Lab 2', category: 'classroom', building: 'Block A', floor: 'Level 2', hours: 'Mon–Fri 8 AM–10 PM', ...c(70, -50), description: 'Networking and cybersecurity lab.' },
  { id: 'block-b-lecture', name: 'Block B Lecture Hall', category: 'lecture', building: 'Block B', floor: 'Ground', hours: 'Mon–Fri 8 AM–6 PM', ...c(80, 55), description: 'Business faculty main auditorium.' },
  { id: 'block-b-seminar', name: 'Block B Seminar Room 101', category: 'classroom', building: 'Block B', floor: 'Level 1', hours: 'Mon–Fri 8 AM–8 PM', ...c(70, 48), description: 'Small group tutorials and presentations.' },
  { id: 'library-main', name: 'Library & Learning Commons', category: 'study', building: 'Library', floor: 'All Levels', hours: 'Mon–Sat 8 AM–10 PM', ...c(95, 0), description: 'Central library with 24hr reading room on L1.' },
  { id: 'library-silent', name: 'Silent Study Zone L3', category: 'study', building: 'Library', floor: 'Level 3', hours: 'Mon–Sat 8 AM–10 PM', ...c(98, 5), description: 'Strictly silent study area.' },
  { id: 'cafeteria-main', name: 'Campus Cafeteria', category: 'food', building: 'Student Centre', floor: 'Ground', hours: 'Mon–Sat 7 AM–8 PM', ...c(35, 12), description: 'Halal meals, drinks, and snacks.' },
  { id: 'cafeteria-kopi', name: 'Kopi Corner', category: 'food', building: 'Block A', floor: 'Ground', hours: 'Mon–Fri 7 AM–6 PM', ...c(55, -38), description: 'Coffee, tea, and light bites.' },
  { id: 'prayer-room', name: 'Surau / Prayer Room', category: 'facility', building: 'Student Centre', floor: 'Level 1', hours: 'Daily 5 AM–10 PM', ...c(42, 18), description: 'Separate sections for men and women. Ablution facilities available.' },
  { id: 'clinic', name: 'Campus Health Centre', category: 'clinic', building: 'Admin Block', floor: 'Ground', hours: 'Mon–Fri 8 AM–5 PM', ...c(28, -22), description: 'Basic medical care and first aid.' },
  { id: 'student-affairs', name: 'Student Affairs Office', category: 'office', building: 'Admin Block', floor: 'Level 1', hours: 'Mon–Fri 9 AM–5 PM', ...c(32, -28), description: 'Enrollment, letters, and student support.' },
  { id: 'it-helpdesk', name: 'IT Helpdesk', category: 'office', building: 'Block A', floor: 'Ground', hours: 'Mon–Fri 8 AM–6 PM', ...c(48, -42), description: 'Wi-Fi, SOL login, and device support.' },
  { id: 'finance-office', name: 'Finance Office', category: 'office', building: 'Admin Block', floor: 'Ground', hours: 'Mon–Fri 9 AM–4 PM', ...c(25, -32), description: 'Fees, invoices, and payment queries.' },
  { id: 'security', name: 'Security Post — Main Gate', category: 'office', building: 'Jalan Kontraktor U1/14', floor: 'Ground', hours: '24 hours', ...c(-18, 0), description: 'Campus security and emergency contact. Main entrance off Jalan Kontraktor U1/14.' },
  { id: 'parking-a', name: 'Visitor Parking A', category: 'parking', building: 'Outdoor', floor: 'Ground', hours: '24 hours', ...c(-45, 35), description: 'Visitor bays near main entrance.' },
  { id: 'parking-b', name: 'Staff & Student Parking B', category: 'parking', building: 'Outdoor', floor: 'Ground', hours: '24 hours', ...c(-55, -45), description: 'Multi-level open parking behind campus.' },
  { id: 'bus-stop-main', name: 'UOW Malaysia Bus Stop', category: 'transport', building: 'Jalan Kontraktor U1/14', floor: 'Ground', hours: '6 AM–10 PM', ...c(-22, -8), description: 'Campus shuttle and public buses. Stop labelled “UOW Malaysia” on Jalan Kontraktor U1/14.' },
  { id: 'bus-stop-lrt', name: 'Glenmarie LRT Shuttle Stop', category: 'transport', building: 'Off-campus', floor: 'Ground', hours: '6 AM–10 PM', lat: 3.094883, lng: 101.553589, description: 'Kelana Jaya Line (KJ27 Glenmarie). Campus shuttle every 20 min.' },
  { id: 'engineering-lab', name: 'Engineering Workshop', category: 'classroom', building: 'Block C', floor: 'Ground', hours: 'Mon–Fri 9 AM–5 PM', ...c(58, 72), description: 'Mechanical and electrical practical labs.' },
  { id: 'block-c-lecture', name: 'Block C Lecture Room', category: 'lecture', building: 'Block C', floor: 'Level 1', hours: 'Mon–Fri 8 AM–6 PM', ...c(68, 78), description: 'Engineering faculty lectures.' },
  { id: 'sports-complex', name: 'Sports & Recreation Area', category: 'facility', building: 'Campus Grounds', floor: 'Outdoor', hours: 'Mon–Sat 7 AM–9 PM', ...c(-70, 90), description: 'Courts and outdoor recreation space.' },
  { id: 'auditorium', name: 'Main Auditorium', category: 'lecture', building: 'Student Centre', floor: 'Level 2', hours: 'By booking', ...c(52, 8), description: 'Large events, convocation, and guest lectures.' },
  { id: 'printing', name: 'Printing Services', category: 'office', building: 'Library', floor: 'Ground', hours: 'Mon–Fri 8 AM–6 PM', ...c(88, -8), description: 'Printing, binding, and photocopying.' },
  { id: 'international-office', name: 'International Student Office', category: 'office', building: 'Admin Block', floor: 'Level 2', hours: 'Mon–Fri 9 AM–5 PM', ...c(30, -25), description: 'Visa, exchange, and international support.' },
  { id: 'lost-found', name: 'Lost & Found', category: 'office', building: 'Security Post', floor: 'Ground', hours: '24 hours', ...c(-16, 3), description: 'Report or claim lost items at main gate security.' },
  { id: 'study-lounge-b', name: 'Block B Study Lounge', category: 'study', building: 'Block B', floor: 'Level 2', hours: 'Mon–Sat 8 AM–9 PM', ...c(72, 52), description: 'Collaborative study with whiteboards.' },
  { id: '24hr-reading', name: '24-Hour Reading Room', category: 'study', building: 'Library', floor: 'Level 1', hours: '24 hours', ...c(92, 3), description: 'Always open quiet reading space.' },
  { id: 'mamak-nearby', name: 'Restoran Selera (Nearby)', category: 'food', building: 'Off-campus', floor: 'Ground', hours: 'Daily 24 hours', ...c(-35, 180), description: 'Popular mamak along Jalan Kontraktor U1/14, 3 min walk east of campus.' },
  { id: 'starbucks-nearby', name: 'Starbucks Glenmarie', category: 'food', building: 'Off-campus', floor: 'Ground', hours: 'Daily 7 AM–11 PM', lat: 3.08762, lng: 101.55621, description: 'Coffee and study spot 10 min walk south-west.' },
  { id: 'atm-main', name: 'ATM — Main Gate', category: 'facility', building: 'Main Gate', floor: 'Ground', hours: '24 hours', ...c(-20, -6), description: 'Maybank and CIMB ATMs at campus entrance.' },
  { id: 'bookstore', name: 'Campus Bookstore', category: 'facility', building: 'Block B', floor: 'Ground', hours: 'Mon–Fri 9 AM–5 PM', ...c(58, 42), description: 'Textbooks, stationery, and UOW merch.' },
];

export const categoryLabels = {
  lecture: 'Lecture Halls',
  classroom: 'Classrooms',
  study: 'Study Spaces',
  food: 'Food & Dining',
  facility: 'Facilities',
  clinic: 'Health',
  office: 'Offices',
  parking: 'Parking',
  transport: 'Transport',
};

export const categoryColors = {
  lecture: '#3b82f6',
  classroom: '#6366f1',
  study: '#10b981',
  food: '#f59e0b',
  facility: '#8b5cf6',
  clinic: '#ef4444',
  office: '#64748b',
  parking: '#78716c',
  transport: '#0ea5e9',
};

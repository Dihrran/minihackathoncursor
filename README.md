# UniGuide

**UniGuide** is an all-in-one campus companion for UOW Malaysia (Glenmarie, Shah Alam). Find study spaces, food, clubs, lecturers, services, events, and freshman resources — all in one place.

## Features

- **Home Dashboard** — Global search, quick access shortcuts, announcements, and today's highlights
- **Interactive Campus Map** — 30+ POIs with Leaflet.js (classrooms, study spaces, food, offices, parking, and more)
- **Study Spaces** — Occupancy, quietness, power sockets, Wi-Fi quality, and opening hours
- **Food Guide** — Filters for Open Now, Budget, Halal, Vegetarian, Coffee, Dessert, and Walking Distance
- **Club Explorer** — Browse clubs by category with search and detail pages
- **Lecturer Directory** — Searchable profiles with office hours and appointment links
- **Campus Services** — Student Affairs, IT, Finance, Security, Health, Printing, International Office, Lost & Found
- **Events Calendar** — Month view with workshops, competitions, career fairs, and guest lectures
- **Freshman Guide** — Survival tips, FAQs, parking, library, LMS, and useful links

## Quick start

```bash
cd ~/Projects/study-room
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Share with others (localtunnel)

Let people on **any network** access your local app:

```bash
# Terminal 1 — start the app
npm start

# Terminal 2 — create a public URL
npm run tunnel
```

You'll get a link like `https://random-name.loca.lt` — share that with others.

Optional custom subdomain (if available):

```bash
TUNNEL_SUBDOMAIN=uniguide-uow npm run tunnel
```

**Notes:**
- Keep both terminals running while sharing
- First-time visitors may see a loca.lt page asking them to click **Continue**
- The URL changes each time unless you use a fixed subdomain

## Tech stack

- **Frontend:** HTML, CSS, vanilla JavaScript (ES modules), Tailwind CSS (CDN)
- **Libraries:** Leaflet.js (map)
- **Backend:** Node.js + Express (static file server only)

## Project structure

```
study-room/
├── server.js              # Express static server
└── public/
    ├── index.html         # Dashboard
    ├── map.html           # Campus map
    ├── study-spaces.html
    ├── food.html
    ├── clubs.html
    ├── lecturers.html
    ├── services.html
    ├── events.html
    ├── freshman.html
    ├── css/               # Design tokens, components, layout
    └── js/
        ├── app.js         # App bootstrap
        ├── search.js      # Global search
        ├── components/    # Reusable UI components
        ├── data/          # Mock UOW Malaysia datasets
        └── pages/         # Page-specific scripts
```

Built for UOW Malaysia students — Glenmarie Campus, Shah Alam.

# Rad TV

A kids' video player built on Time Train's player (`~/Documents/claude/code/time-train`): it opens straight to the next video, shields taps from wandering off to YouTube, keeps sound off during ads, gives a star per finished video, and keeps grown-up settings behind a press-and-hold lock.

- **Mike sends links in chat** → `node scripts/add-video.mjs <link> [<link> ...]`, then commit and push to `main`. It appends to `videos.js` (the starting list, played in order) and bumps `videos.js?v=` in `index.html`. Mention any it flags as not family-safe or skips.
- **Mike adds from the app** → the grown-ups panel posts to the list server, [rad-tv-list](https://github.com/michaelrad100/rad-tv-list) (private), running on Railway in the michaelrad-me project at rad-tv-list-production.up.railway.app. It keeps added and taken-off videos on top of `videos.js`. Adding or removing needs the grown-up code (`GROWNUP_CODE` on the server; `1234` locally).
- If the list server can't be reached, panel adds are saved on that device only, and the panel says so.
- Served at michaelrad.me/tv: the michaelrad.me site copies this repo's `main` in when it rebuilds on Railway, which `.github/workflows/rebuild-michaelrad-me.yml` triggers on every push to `main`.
- Local: `python3 -m http.server 8780` for the app and `npm start` in rad-tv-list for the list on :8792 (the app picks localhost automatically).
- Stars, today's count and settings live in the device's localStorage (keys prefixed `rtv-`).

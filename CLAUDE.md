# Kids TV (Mala TV and Maya TV)

A kids' video player built on Time Train's player (`~/Documents/claude/code/time-train`): it opens straight to the next video, shields taps from wandering off to YouTube, keeps sound off during ads, gives a star per finished video, and keeps grown-up settings behind a press-and-hold lock.

- One channel per kid: `mala/` (Mala TV) and `maya/` (Maya TV), each with its own `videos.js`, icons and manifest. Their `index.html` sets `window.KID` and loads the shared `tv.js` and `tv.css`, so a player fix goes in those two files and reaches every channel. The root `index.html` is the "Who's watching?" page.
- Bump `tv.js?v=` / `tv.css?v=` in every channel's `index.html` when those files change, so iPads load the new copy.
- **Mike sends links in chat** → `node scripts/add-video.mjs <mala|maya|both> <link> [<link> ...]`, then commit and push to `main`. It appends to that channel's `videos.js` (its starting list, played in order) and bumps its `videos.js?v=`. Ask which kid if he doesn't say. Mention any it flags as not family-safe or skips.
- **Mike adds from the app** → a channel's grown-ups panel posts to the list server, [kids-tv-list](https://github.com/michaelrad100/kids-tv-list) (private), running on Railway in the michaelrad-me project at kids-tv-list-production.up.railway.app. It keeps, per kid, added and taken-off videos on top of that channel's `videos.js`. Adding or removing needs the grown-up code (`GROWNUP_CODE` on the server; `1234` locally), which is the same for every channel. A new kid needs a folder here and a name in the server's `KIDS`.
- If the list server can't be reached, panel adds are saved on that device only, and the panel says so.
- Served at michaelrad.me/tv (so michaelrad.me/tv/mala and /tv/maya): the michaelrad.me site copies this repo's `main` in when it rebuilds on Railway, which `.github/workflows/rebuild-michaelrad-me.yml` triggers on every push to `main`.
- Local: `python3 -m http.server 8780` for the app and `npm start` in kids-tv-list for the lists on :8792 (the app picks localhost automatically).
- Stars, today's count and settings live in the device's localStorage, per channel (`tv-<kid>-…`); the grown-up code is shared (`tv-code`).

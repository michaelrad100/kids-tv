// Adds YouTube links under a topic in a channel's videos.js, and bumps its ?v= in that channel's index.html so iPads fetch the new list.
//   node scripts/add-video.mjs <mala|maya|both> "<topic>" <link> [<link> ...]
// A new topic goes at the end of the shelf. Looks up the title, channel and length, and skips videos already on that
// channel's list or whose owner doesn't allow embedding. Flags any that YouTube doesn't mark family-safe.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ALL = fs.readdirSync(root).filter(d => fs.existsSync(path.join(root, d, "videos.js")));
const [which, topic, ...links] = process.argv.slice(2);
const kids = which === "both" ? ALL : [which];
if (!which || !kids.every(k => ALL.includes(k)) || !topic || !links.length) {
  console.log(`usage: node scripts/add-video.mjs <${[...ALL, "both"].join("|")}> "<topic>" <link> [<link> ...]`); process.exit(1);
}

const ID = /^[\w-]{11}$/;
function videoId(url) {
  const s = String(url || "").trim();
  if (ID.test(s)) return s;
  try {
    const u = new URL(/^https?:/.test(s) ? s : "https://" + s);
    if (!/(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be)$/.test(u.hostname)) return null;
    const id = u.hostname.endsWith("youtu.be") ? u.pathname.slice(1) : u.searchParams.get("v") || u.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/)?.[1];
    return ID.test(id || "") ? id : null;
  } catch { return null; }
}
const clock = (n) => { const h = Math.floor(n / 3600), m = Math.floor(n / 60) % 60, s = String(n % 60).padStart(2, "0"); return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`; };

// One YouTube lookup per link, shared by every channel it goes to.
const found = new Map();
async function lookup(link) {
  const id = videoId(link);
  if (!id) return { skip: `${link}: not a YouTube link` };
  if (found.has(id)) return found.get(id);
  const o = await fetch(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`);
  let r;
  if (!o.ok) r = { id, skip: `${id}: ${o.status === 401 || o.status === 403 ? "embedding is turned off" : "not found"}` };
  else {
    const { title, author_name } = await o.json();
    const page = await (await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { "Accept-Language": "en-US" } })).text();
    const secs = +(page.match(/"lengthSeconds":"(\d+)"/)?.[1] || 0);
    r = { id, row: [id, title, author_name, secs ? clock(secs) : ""], familySafe: !/"isFamilySafe":false/.test(page) };
  }
  found.set(id, r);
  return r;
}

// videos.js is a header comment plus window.VIDEOS = { "Topic": [rows], ... }. It's read by running it and written back whole.
const write = (head, topics) => head + "window.VIDEOS = {\n" + Object.entries(topics).map(([t, rows]) =>
  `  ${JSON.stringify(t)}: [\n${rows.map(r => `    [${r.map(x => JSON.stringify(x)).join(", ")}],\n`).join("")}  ],\n`).join("") + "};\n";

for (const kid of kids) {
  const FILE = path.join(root, kid, "videos.js"), INDEX = path.join(root, kid, "index.html");
  const src = fs.readFileSync(FILE, "utf8"), box = { window: {} };
  vm.runInNewContext(src, box);
  const topics = box.window.VIDEOS || {};
  const have = new Set(Object.values(topics).flat().map(r => r[0]));
  const rows = [];
  for (const link of links) {
    const v = await lookup(link);
    if (v.skip) { console.log(`${kid}  skip  ${v.skip}`); continue; }
    if (have.has(v.id)) { console.log(`${kid}  skip  ${v.id}: already on the list`); continue; }
    rows.push(v.row); have.add(v.id);
    console.log(`${kid}  add   ${v.id}: ${v.row[1]} (${v.row[2]}, ${v.row[3] || "length unknown"})${v.familySafe ? "" : "  ⚠ YouTube doesn't mark this one family-safe"}`);
  }
  if (rows.length) {
    (topics[topic] ||= []).push(...rows);
    fs.writeFileSync(FILE, write(src.slice(0, src.indexOf("window.VIDEOS")), topics));
    fs.writeFileSync(INDEX, fs.readFileSync(INDEX, "utf8").replace(/videos\.js\?v=(\d+)/, (_, n) => `videos.js?v=${+n + 1}`));
  }
  console.log(`${kid}  ${rows.length} added to "${topic}".`);
}

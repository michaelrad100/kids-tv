// Adds YouTube links to the end of a channel's videos.js and bumps its ?v= in that channel's index.html so iPads fetch the new list.
//   node scripts/add-video.mjs <mala|maya|both> <link> [<link> ...]
// Looks up the title, channel and length, and skips videos already on that list or whose owner doesn't allow embedding.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ALL = fs.readdirSync(root).filter(d => fs.existsSync(path.join(root, d, "videos.js")));
const [which, ...links] = process.argv.slice(2);
const kids = which === "both" ? ALL : [which];
if (!which || !kids.every(k => ALL.includes(k)) || !links.length) { console.log(`usage: node scripts/add-video.mjs <${[...ALL, "both"].join("|")}> <link> [<link> ...]`); process.exit(1); }

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

for (const kid of kids) {
  const FILE = path.join(root, kid, "videos.js"), INDEX = path.join(root, kid, "index.html");
  let src = fs.readFileSync(FILE, "utf8");
  const have = new Set([...src.matchAll(/^\s*\["([\w-]{11})"/gm)].map(m => m[1]));
  const rows = [];
  for (const link of links) {
    const v = await lookup(link);
    if (v.skip) { console.log(`${kid}  skip  ${v.skip}`); continue; }
    if (have.has(v.id)) { console.log(`${kid}  skip  ${v.id}: already on the list`); continue; }
    rows.push(`  [${v.row.map(x => JSON.stringify(x)).join(", ")}],`);
    have.add(v.id);
    console.log(`${kid}  add   ${v.id}: ${v.row[1]} (${v.row[2]}, ${v.row[3] || "length unknown"})${v.familySafe ? "" : "  ⚠ YouTube doesn't mark this one family-safe"}`);
  }
  if (rows.length) {
    src = src.replace(/\n\];\s*$/, "\n" + rows.join("\n") + "\n];\n");
    fs.writeFileSync(FILE, src);
    const html = fs.readFileSync(INDEX, "utf8").replace(/videos\.js\?v=(\d+)/, (_, n) => `videos.js?v=${+n + 1}`);
    fs.writeFileSync(INDEX, html);
  }
  console.log(`${kid}  ${rows.length} added.`);
}

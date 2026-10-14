// Adds YouTube links to the end of videos.js and bumps its ?v= in index.html so iPads fetch the new list.
//   node scripts/add-video.mjs <link> [<link> ...]
// Looks up the title, channel and length, and skips videos already on the list or whose owner doesn't allow embedding.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(root, "videos.js"), INDEX = path.join(root, "index.html");

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

let src = fs.readFileSync(FILE, "utf8");
const have = new Set([...src.matchAll(/^\s*\["([\w-]{11})"/gm)].map(m => m[1]));
const rows = [];
for (const link of process.argv.slice(2)) {
  const id = videoId(link);
  if (!id) { console.log(`skip   ${link}: not a YouTube link`); continue; }
  if (have.has(id)) { console.log(`skip   ${id}: already on the list`); continue; }
  const o = await fetch(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`);
  if (!o.ok) { console.log(`skip   ${id}: ${o.status === 401 || o.status === 403 ? "embedding is turned off" : "not found"}`); continue; }
  const { title, author_name } = await o.json();
  const page = await (await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { "Accept-Language": "en-US" } })).text();
  const secs = +(page.match(/"lengthSeconds":"(\d+)"/)?.[1] || 0);
  const familySafe = !/"isFamilySafe":false/.test(page);
  rows.push(`  [${[id, title, author_name, secs ? clock(secs) : ""].map(x => JSON.stringify(x)).join(", ")}],`);
  have.add(id);
  console.log(`add    ${id}: ${title} (${author_name}, ${secs ? clock(secs) : "length unknown"})${familySafe ? "" : "  ⚠ YouTube doesn't mark this one family-safe"}`);
}
if (rows.length) {
  src = src.replace(/\n\];\s*$/, "\n" + rows.join("\n") + "\n];\n");
  fs.writeFileSync(FILE, src);
  const html = fs.readFileSync(INDEX, "utf8").replace(/videos\.js\?v=(\d+)/, (_, n) => `videos.js?v=${+n + 1}`);
  fs.writeFileSync(INDEX, html);
}
console.log(`${rows.length} added.`);

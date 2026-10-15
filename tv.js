  // The player behind every kid's channel (mala/, maya/). Each channel page sets window.KID, then loads its own videos.js and this:
  //   window.KID = { id: "mala", name: "Mala", color: "#8b5cf6", others: [{ id: "maya", name: "Maya" }] }
  // Every channel shares this markup, so a fix here reaches all of them.
  const K = window.KID;
  document.body.insertAdjacentHTML("afterbegin", `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <symbol id="star" viewBox="0 0 24 24"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" fill="#ffc845" stroke="#d69d12" stroke-width="1.4" stroke-linejoin="round"/></symbol>
      <symbol id="star-empty" viewBox="0 0 24 24"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" fill="none" stroke="#c9cfe3" stroke-width="1.8" stroke-linejoin="round"/></symbol>
    </svg>
  
    <div class="top">
      <div class="brand">
        <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M14 6l6 6 6-6" fill="none" stroke="#1d2550" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="11" width="34" height="25" rx="7" fill="#1d2550"/><rect x="7" y="15" width="26" height="17" rx="4" fill="var(--kid)"/><path d="M17 19.5v8l7-4z" fill="#fff"/></svg>
        <b>${K.name} <span>TV</span></b>
      </div>
      <button class="icon-btn" id="grown-btn" aria-label="Grown-ups: press and hold">
        <span class="hold" id="hold"></span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/></svg>
      </button>
    </div>
  
    <section class="board" aria-live="polite">
      <div class="row"><span class="label" id="board-label">Now showing</span><span class="count" id="count"></span></div>
      <div class="title" id="title">${K.name} TV</div>
      <span class="chip" id="chip"><i></i><span id="channel"></span><small id="length"></small></span>
    </section>
  
    <div class="player" id="player">
      <div id="yt"></div>
      <div class="poster" id="poster">
        <img id="thumb" alt="">
        <div class="go"><svg viewBox="0 0 24 24"><path d="M6 3.8v16.4L20 12z"/></svg></div>
        <div class="len" id="len"></div>
      </div>
      <div class="shield top"></div>
      <div class="shield bottom"></div>
      <button class="size-btn" id="size-btn"></button>
      <button class="size-btn cc-btn" id="cc-btn">CC</button>
      <div class="hush">Sound comes on when the video starts</div>
      <div class="skip-hint"><span>Tap Skip</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15M5 12l7 7 7-7"/></svg></div>
      <div class="cover paused" id="paused">
        <button class="big-btn" id="resume"><svg viewBox="0 0 24 24"><path d="M6 3.8v16.4L20 12z"/></svg>Keep going</button>
      </div>
      <div class="cover" id="done">
        <svg class="star"><use href="#star"/></svg>
        <h2 id="done-title">You got a star!</h2>
        <p id="done-msg"></p>
        <button class="big-btn" id="onward">Next video <svg viewBox="0 0 24 24"><path d="M6 3.8v16.4L20 12z"/></svg></button>
      </div>
      <div class="cover" id="rest">
        <h2>That's all for today!</h2>
        <p id="rest-msg"></p>
      </div>
      <div class="cover" id="empty">
        <h2 id="empty-title"></h2>
        <p id="empty-msg"></p>
      </div>
    </div>
  
    <section class="shelf">
      <div class="shelf-head"><h3>Your videos</h3><span id="shelf-count"></span></div>
      <div class="stars" id="stars" aria-hidden="true"></div>
      <div id="grid"></div>
      <p class="empty-shelf" id="shelf-empty" hidden>No videos yet. Grown-ups: press and hold the lock to add some.</p>
    </section>
  
    <footer class="foot">Picked by a grown-up, just for ${K.name} · <a href="../">Who's watching?</a></footer>
  
    <div class="sheet-bg" id="grown-sheet"><div class="sheet">
      <div class="sheet-head"><h3>Grown-ups</h3><button class="close" data-close>Done</button></div>
      <div class="grown">
        <div class="now-box" id="g-now"></div>
  
        <form class="add" id="add-form" novalidate>
          <b>Add a video</b>
          <div class="row">
            <input id="add-url" type="url" inputmode="url" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Paste a YouTube link" aria-label="YouTube link">
            <button class="go-btn" id="add-go" type="submit">Add</button>
          </div>
          <div class="row">
            <select id="add-topic" aria-label="Topic"></select>
            <input id="add-topic-new" type="text" autocapitalize="sentences" placeholder="New topic name" aria-label="New topic name" hidden>
          </div>
          <input id="add-code" type="password" autocomplete="off" placeholder="Grown-up code (just once on this device)" aria-label="Grown-up code" hidden>
          ${K.others.map(o => `<label class="also"><input type="checkbox" data-kid="${o.id}"> Add it to ${o.name} TV too</label>`).join("")}
          <p class="msg" id="add-msg"></p>
        </form>
  
        <div class="btns">
          <button class="opt" id="g-skip">Skip this video</button>
          <button class="opt" id="g-more">One more video today</button>
          <button class="opt" id="g-big"></button>
          <button class="opt" id="g-reset">Start the list over</button>
        </div>
        <div class="field">Videos per day
          <div class="seg" id="g-perday"><button data-n="1">1</button><button data-n="2">2</button><button data-n="3">3</button><button data-n="5">5</button><button data-n="0">No limit</button></div>
        </div>
  
        <h4 id="g-list-head">The list</h4>
        <ol class="g-list" id="g-list"></ol>
        <details class="off-wrap" id="g-off-wrap" hidden><summary id="g-off-head"></summary><ol class="g-list off" id="g-off"></ol></details>
        <p class="fine" id="g-where"></p>
        <p class="fine">Hold the lock button for a second to open this. Stars and settings are saved on this device.</p>
      </div>
    </div></div>
  
    <div class="toast" id="toast"></div>
  `);
  document.documentElement.style.setProperty("--line", K.color);
  document.documentElement.style.setProperty("--kid", K.color);   // the channel's own color, for its logo

  // The six Time Train line colors; each video takes the next one, so the list reads like a row of bright spines.
  const COLORS = ["#2fb36b", "#f0960e", "#8b5cf6", "#ef4444", "#1e9be8", "#ec4899"];
  // videos.js: { "Topic": [[id, title, channel, length], ...], ... }, topics in the order the shelf shows them.
  // Videos added from the panel carry their topic; anything without one goes under "More videos".
  const MORE = "More videos";
  const V = window.VIDEOS || {};
  const BASE = (Array.isArray(V) ? [[MORE, V]] : Object.entries(V)).flatMap(([topic, rows]) => rows.map(([id, title, ch, len]) => ({ id, title, ch, len, topic })));
  const topicOf = (v) => v.topic || MORE;

  // ---- storage: keys are tv-<kid>- so each channel keeps its own stars and settings on a shared device ----
  // The grown-up code is the one exception: type it once and every channel on this device knows it.
  const slot = (k) => k === "code" ? "tv-code" : `tv-${K.id}-${k}`;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(slot(k))) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(slot(k), JSON.stringify(v)); } catch {} },
  };
  const watched = new Set(store.get("watched", []));   // video ids with a star
  let cur = store.get("cur", null);                     // the video picked to play next; null = first one without a star
  let perDay = store.get("perDay", 3);                  // 0 = no limit
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => { const t = store.get("today", {}); return t.d === dayKey() ? t : { d: dayKey(), n: 0, extra: 0 }; };
  const canWatch = () => { const t = today(); return !perDay || t.n < perDay + t.extra; };

  // ---- the list: videos.js, then what grown-ups added on the list server, then anything added on this device only ----
  const LIST_URL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? "http://localhost:8792" : "https://kids-tv-list-production.up.railway.app";
  let remote = store.get("remote", { added: [], hidden: [] });   // last copy from the server, so the list still works offline
  const local = store.get("local", { added: [], hidden: [] });    // added while the server couldn't be reached
  let online = false, code = store.get("code", "");
  const broken = new Set();                                         // won't play here (removed, or embedding off): passed over this visit
  let list = [], off = [], topics = [];
  // Grouped by topic (in the order topics first appear), so the videos play through one topic before the next.
  function rebuild() {
    const hidden = new Set([...remote.hidden, ...local.hidden]), seen = new Set(), all = [];
    for (const v of [...BASE, ...remote.added, ...local.added]) if (!seen.has(v.id)) { seen.add(v.id); all.push(v); }
    const order = [...new Set(all.map(topicOf))], grouped = (a) => order.flatMap(t => a.filter(v => topicOf(v) === t));
    list = grouped(all.filter(v => !hidden.has(v.id)));
    off = grouped(all.filter(v => hidden.has(v.id)));
    topics = order.filter(t => list.some(v => topicOf(v) === t));
  }
  rebuild();
  const current = () => list.find(v => v.id === cur && !broken.has(v.id)) || list.find(v => !watched.has(v.id) && !broken.has(v.id)) || null;
  const colorOf = (v) => COLORS[Math.max(0, list.indexOf(v)) % COLORS.length];

  const $ = (id) => document.getElementById(id);
  const esc = (x) => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const thumb = (id, size = "mqdefault") => `https://i.ytimg.com/vi/${id}/${size}.jpg`;
  let player = null, ready = false, timer = null, finished = false, reached = false, shown = null;
  let big = store.get("big", true), autoBig = false, hushed = false, adSince = 0, cc = store.get("cc", false);

  // ---- board, poster and shelf ----
  function paint(arrive) {
    const v = current(), p = $("player");
    shown = v ? v.id : null;
    p.classList.remove("playing", "endzone", "ad", "skippy");
    setBig(false); autoBig = false;
    finished = reached = false;
    clearInterval(timer);
    if (!v) { paintEmpty(); paintShelf(); return; }
    document.documentElement.style.setProperty("--line", colorOf(v));
    $("board-label").textContent = canWatch() ? (watched.has(v.id) ? "Watch again" : "Now showing") : "Tomorrow";
    const inTopic = list.filter(x => topicOf(x) === topicOf(v));
    $("count").textContent = `${topicOf(v)} · ${inTopic.indexOf(v) + 1} of ${inTopic.length}`;
    $("title").textContent = v.title;
    if (arrive) { const n = $("title"); n.classList.remove("arrive"); void n.offsetWidth; n.classList.add("arrive"); }
    $("chip").hidden = false;
    $("channel").textContent = v.ch; $("length").textContent = v.len ? `· ${v.len}` : "";
    $("len").textContent = v.len || "";
    const img = $("thumb");
    // Videos without a high-res thumbnail get YouTube's 120px grey placeholder rather than an error, so check the size too.
    const fallback = () => { img.onerror = img.onload = null; img.src = thumb(v.id, "hqdefault"); };
    img.onerror = fallback;
    img.onload = () => { if (img.naturalWidth <= 120) fallback(); };
    img.src = thumb(v.id, "maxresdefault");
    $("poster").classList.remove("hidden");
    showCover(canWatch() ? null : "rest");
    $("rest-msg").innerHTML = `More videos tomorrow. Up next: <b>${esc(v.title)}</b>`;
    if (ready) { player.cueVideoById(v.id); hush(); }
    paintShelf();
  }

  function paintEmpty() {
    const none = !list.length;
    document.documentElement.style.setProperty("--line", K.color);
    $("board-label").textContent = none ? "Coming soon" : "All caught up";
    $("count").textContent = none ? "" : `${list.length} of ${list.length} watched`;
    $("title").textContent = none ? "No videos yet" : "You watched them all!";
    $("chip").hidden = true;
    $("poster").classList.add("hidden");
    $("empty-title").textContent = none ? "No videos yet" : "All caught up!";
    $("empty-msg").innerHTML = none ? "Ask a grown-up to add some." : "Ask a grown-up to add more, or tap one below to watch it again.";
    showCover("empty");
    if (ready) player.stopVideo();
  }

  function paintShelf() {
    const v = current(), n = list.filter(x => watched.has(x.id)).length;
    $("shelf-count").textContent = list.length ? `${n} of ${list.length} watched` : "";
    $("stars").innerHTML = list.map(x => `<svg><use href="#${watched.has(x.id) ? "star" : "star-empty"}"/></svg>`).join("");
    $("stars").hidden = !list.length || list.length > 60;
    $("shelf-empty").hidden = !!list.length;
    $("grid").innerHTML = topics.map(t => {
      const vids = list.filter(x => topicOf(x) === t), seen = vids.filter(x => watched.has(x.id)).length;
      return `<h4 class="topic"><span>${esc(t)}</span><small>${seen} of ${vids.length}</small></h4><ul class="grid">` + vids.map(x =>
        `<li data-id="${x.id}" class="${watched.has(x.id) ? "seen" : ""}${x === v ? " here" : ""}" style="--c:${colorOf(x)}">` +
        `<svg class="badge"><use href="#star"/></svg><span class="now">Up now</span>` +
        `<div class="th"><img loading="lazy" alt="" src="${thumb(x.id)}"><small>${esc(x.len || "")}</small></div><b>${esc(x.title)}</b></li>`).join("") + `</ul>`;
    }).join("");
  }

  function showCover(which) {
    for (const id of ["paused", "done", "rest", "empty"]) $(id).classList.toggle("show", id === which);
    $("player").classList.toggle("tall", ["done", "rest", "empty"].includes(which));
  }

  // The next video without a star after this one, then from the top of the list.
  function nextAfter(v) {
    const i = list.indexOf(v), ok = (x) => x !== v && !watched.has(x.id) && !broken.has(x.id);
    return list.slice(i + 1).find(ok) || list.slice(0, Math.max(0, i)).find(ok) || null;
  }

  // ---- finishing a video: a star, confetti, and the next one ----
  function finish() {
    const v = list.find(x => x.id === shown);
    if (finished || !v) return;
    finished = true;
    clearInterval(timer);
    watched.add(v.id); store.set("watched", [...watched]);
    const t = today(); t.n++; store.set("today", t);
    const nx = nextAfter(v);
    cur = nx ? nx.id : null; store.set("cur", cur);
    $("player").classList.remove("playing", "endzone");
    setBig(false); unhush();
    if (!nx) {
      $("done-title").textContent = "You got a star!";
      $("done-msg").textContent = "That was the last one on your list. Ask a grown-up to add more!";
      $("onward").hidden = true;
    } else if (canWatch()) {
      $("done-title").textContent = "You got a star!";
      $("done-msg").innerHTML = `Up next: <b>${esc(nx.title)}</b>`;
      $("onward").hidden = false;
    } else {
      $("done-title").textContent = "You got a star!";
      $("done-msg").innerHTML = `That's all for today. Tomorrow: <b>${esc(nx.title)}</b>`;
      $("onward").hidden = true;
    }
    showCover("done");
    confetti(colorOf(v));
    paintShelf();
  }
  $("onward").onclick = () => { showCover(null); paint(true); };

  // Tap any video on the shelf to watch it, including one with a star already.
  $("grid").addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]"); if (!li) return;
    if (li.dataset.id === shown && !$("done").classList.contains("show") && !$("empty").classList.contains("show")) return scrollUp();
    if (!canWatch()) return toast("That's all for today. More tomorrow!");
    cur = li.dataset.id; store.set("cur", cur);
    paint(true); scrollUp();
  });
  const scrollUp = () => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  // ---- big mode ----
  const GROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>`;
  const SHRINK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>`;
  function setBig(on) {
    $("player").classList.toggle("big", on); document.body.classList.toggle("theater", on);
    $("size-btn").innerHTML = on ? SHRINK : GROW; $("size-btn").setAttribute("aria-label", on ? "Smaller video" : "Bigger video");
  }
  $("size-btn").onclick = () => setBig(!$("player").classList.contains("big"));

  // ---- sound gate: muted until the chosen video itself is playing ----
  // During a pre-roll ad the video's own clock sits at 0, so sound comes on once it moves and the length is the one we expect.
  const secs = (len) => String(len || "").split(":").reduce((t, n) => t * 60 + +n, 0);
  function hush() { if (!ready) return; player.mute(); hushed = true; adSince = 0; $("player").classList.add("hushed"); $("player").classList.remove("ad", "skippy"); }
  function unhush() {
    if (!hushed) return; hushed = false; $("player").classList.remove("hushed", "ad", "skippy");
    if (ready) { player.unMute(); applyCC(); }
  }
  function adCheck(now) {
    const ad = hushed && now < 1;
    if (!ad) adSince = 0; else if (!adSince) adSince = Date.now();
    $("player").classList.toggle("ad", ad);
    $("player").classList.toggle("skippy", ad && Date.now() - adSince >= 5000);
    return ad;
  }

  // ---- captions: YouTube's own CC button sits under the bottom shield, so ours lives up top ----
  function applyCC() {
    if (!ready) return;
    try {
      if (cc) { player.loadModule("captions"); player.setOption("captions", "track", { languageCode: "en" }); }
      else player.unloadModule("captions");
    } catch {}
  }
  function paintCC() { $("cc-btn").classList.toggle("on", cc); $("cc-btn").setAttribute("aria-label", cc ? "Turn captions off" : "Turn captions on"); }
  $("cc-btn").onclick = () => { cc = !cc; store.set("cc", cc); paintCC(); applyCC(); toast(cc ? "Captions on" : "Captions off"); };
  paintCC();
  $("resume").onclick = () => { showCover(null); if (ready) player.playVideo(); };

  // ---- confetti in the video's color plus the others ----
  function confetti(main) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = [main, main, "#ffc845", ...COLORS];
    const c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c);
    const dpr = devicePixelRatio || 1, W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
    const bits = Array.from({ length: 160 }, (_, i) => {
      const left = i % 2 === 0, a = (left ? -60 : -120) + (Math.random() - 0.5) * 50, sp = 9 + Math.random() * 10;
      return { x: left ? 0 : W, y: H * 0.8, vx: Math.cos(a * Math.PI / 180) * sp, vy: Math.sin(a * Math.PI / 180) * sp,
               w: 7 + Math.random() * 6, h: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
               color: colors[i % colors.length], round: Math.random() < 0.3 };
    });
    const start = performance.now();
    (function frame(now) {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = Math.max(0, Math.min(1, (3200 - t) / 800));
      for (const b of bits) {
        b.vx *= 0.985; b.vy = b.vy * 0.985 + 0.28; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.color; ctx.scale(1, Math.cos(t / 120 + b.r));
        if (b.round) { ctx.beginPath(); ctx.arc(0, 0, b.h / 2 + 1, 0, 7); ctx.fill(); } else ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      }
      if (t < 3200) requestAnimationFrame(frame); else c.remove();
    })(start);
  }

  let toastTimer;
  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---- grown-ups sheet: press and hold the lock for a second ----
  let holdStart = 0, holdRaf = 0;
  const holdEnd = () => { cancelAnimationFrame(holdRaf); holdStart = 0; $("hold").style.setProperty("--p", 0); };
  $("grown-btn").addEventListener("pointerdown", (e) => {
    e.preventDefault(); holdStart = performance.now();
    (function tick(now) {
      if (!holdStart) return;
      const p = Math.min(1, (now - holdStart) / 1000); $("hold").style.setProperty("--p", p);
      if (p >= 1) { holdEnd(); openGrown(); } else holdRaf = requestAnimationFrame(tick);
    })(holdStart);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => $("grown-btn").addEventListener(ev, holdEnd));
  $("grown-btn").addEventListener("click", () => { if (!$("grown-sheet").classList.contains("show")) toast("Grown-ups: press and hold"); });
  $("grown-btn").addEventListener("contextmenu", (e) => e.preventDefault());

  function openGrown() {
    if (player && ready && $("player").classList.contains("playing")) player.pauseVideo();
    setBig(false);
    paintGrown();
    $("add-msg").textContent = ""; $("add-msg").className = "msg";
    $("grown-sheet").classList.add("show");
    pull();   // pick up anything added on another device while this was open
  }
  function paintGrown() {
    const v = current(), t = today();
    $("g-now").innerHTML = v
      ? `<b>Up now: ${esc(v.title)}</b><br><a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Open on YouTube</a> · ${esc(v.ch)}${v.len ? ` · ${v.len}` : ""}` +
        `<br><span class="fine">${t.n} watched today of ${perDay ? perDay + t.extra : "no limit"} · ${list.filter(x => watched.has(x.id)).length} of ${list.length} have a star</span>`
      : `<b>${list.length ? "Every video has a star." : "The list is empty."}</b> Add a video below.`;
    $("g-big").textContent = big ? "Keep videos small" : "Make videos big";
    document.querySelectorAll("#g-perday button").forEach(b => b.classList.toggle("on", +b.dataset.n === perDay));
    $("add-code").hidden = !online || !!code;
    const row = (x, acts) => `<li data-id="${x.id}" class="${x === v ? "here" : ""}"><img loading="lazy" alt="" src="${thumb(x.id, "default")}">` +
      `<div class="t"><b>${watched.has(x.id) ? "★ " : ""}${esc(x.title)}</b><span>${esc(x.ch)}${x.len ? ` · ${x.len}` : ""}</span></div><div class="acts">${acts}</div></li>`;
    $("g-list-head").textContent = `The list (${list.length})`;
    $("g-list").innerHTML = topics.map(t => `<li class="g-topic">${esc(t)}</li>` +
      list.filter(x => topicOf(x) === t).map(x => row(x, `<button data-act="play">Play</button><button class="rm" data-act="remove">Remove</button>`)).join("")).join("");
    paintTopics();
    $("g-off-wrap").hidden = !off.length;
    $("g-off-head").textContent = `Taken off the list (${off.length})`;
    $("g-off").innerHTML = off.map(x => row(x, `<button data-act="restore">Put back</button>`)).join("");
    $("g-where").textContent = online
      ? `Videos you add here show up on every device that opens ${K.name} TV.`
      : "Couldn't reach the shared list just now, so videos you add are saved on this device only.";
  }
  // Topic picker: the channel's topics (last one used first), plus a new one.
  function paintTopics() {
    const sel = $("add-topic"), was = sel.value, last = store.get("lastTopic", "");
    const names = [...new Set([...(topics.includes(last) ? [last] : []), ...topics, ...off.map(topicOf)])];
    sel.innerHTML = names.map(t => `<option>${esc(t)}</option>`).join("") + `<option value="__new">New topic…</option>`;
    sel.value = names.includes(was) || was === "__new" ? was : names[0] || "__new";
    $("add-topic-new").hidden = sel.value !== "__new";
  }
  $("add-topic").addEventListener("change", () => { $("add-topic-new").hidden = $("add-topic").value !== "__new"; if (!$("add-topic-new").hidden) $("add-topic-new").focus(); });
  const closeSheets = () => document.querySelectorAll(".sheet-bg").forEach(x => x.classList.remove("show"));
  document.querySelectorAll("[data-close]").forEach(b => b.onclick = closeSheets);
  document.querySelectorAll(".sheet-bg").forEach(bg => bg.addEventListener("click", (e) => { if (e.target === bg) closeSheets(); }));
  // Opening the sheet paused the video, and its cover offers Keep going.

  $("g-skip").onclick = () => {
    const v = current(); if (!v) return;
    const nx = nextAfter(v); cur = nx ? nx.id : null; store.set("cur", cur);
    if (!nx) { watched.add(v.id); store.set("watched", [...watched]); }   // nothing after it: count it so the list ends
    closeSheets(); paint(true); toast("Skipped to the next video");
  };
  $("g-more").onclick = () => { const t = today(); t.extra++; store.set("today", t); closeSheets(); paint(true); toast("One more video unlocked for today"); };
  $("g-big").onclick = () => { big = !big; store.set("big", big); paintGrown(); toast(big ? "Videos fill the screen" : "Videos stay small"); };
  $("g-reset").onclick = () => {
    if (!confirm("Take the stars off every video and start the list from the top?")) return;
    watched.clear(); store.set("watched", []); cur = null; store.set("cur", null);
    closeSheets(); paint(true); toast("Back to the top of the list");
  };
  document.querySelectorAll("#g-perday button").forEach(b => b.onclick = () => {
    perDay = +b.dataset.n; store.set("perDay", perDay);
    paintGrown(); if (!busy()) paint();
  });

  // ---- adding and removing videos ----
  // Takes watch, youtu.be, Shorts, embed and live links, or a bare 11-character id.
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
  async function call(route, body) {
    const r = await fetch(LIST_URL + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, kid: K.id, ...body }) });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401) { code = ""; store.set("code", ""); }
    if (!r.ok) throw Object.assign(new Error(j.error || "Couldn't reach the list. Try again in a moment."), { status: r.status });
    return j;
  }
  const took = (j) => { remote = { added: j.added, hidden: j.hidden }; store.set("remote", remote); };
  function addMsg(text, kind = "") { $("add-msg").textContent = text; $("add-msg").className = "msg" + (kind ? " " + kind : ""); }

  $("add-form").onsubmit = async (e) => {
    e.preventDefault();
    const id = videoId($("add-url").value);
    if (!id) return addMsg("That doesn't look like a YouTube link.", "err");
    const also = [...document.querySelectorAll(".also input:checked")].map(b => b.dataset.kid);
    const topic = ($("add-topic").value === "__new" ? $("add-topic-new").value : $("add-topic").value).trim().slice(0, 60);
    if (!topic) { $("add-topic-new").focus(); return addMsg("Give the new topic a name.", "err"); }
    // One added from the panel can be added again under another topic to move it; videos.js ones stay where that file puts them.
    const on = list.find(v => v.id === id);
    if (on && !also.length && (topicOf(on) === topic || BASE.includes(on))) return addMsg(`That one's already on the list, under ${topicOf(on)}.`, "err");
    if (online && !code) {
      const c = $("add-code").value.trim();
      if (!c) { $("add-code").hidden = false; $("add-code").focus(); return addMsg("Type the grown-up code once, then tap Add.", "err"); }
      code = c;
    }
    $("add-go").disabled = true; addMsg("Adding…");
    try {
      let title;
      if (online) {
        const j = await call("/add", { url: id, also, topic });
        took(j); store.set("code", code); $("add-code").value = "";
        title = (j.video || remote.added.find(v => v.id === id) || {}).title;
      } else {
        // Device-only: noembed gives the title and channel (and says no when embedding is off), but not the length.
        const o = await (await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)).json();
        if (o.error) throw new Error("That video can't play outside YouTube, or the link is wrong.");
        local.hidden = local.hidden.filter(x => x !== id);
        if (!local.added.some(v => v.id === id)) local.added.push({ id, title: o.title, ch: o.author_name, len: "", topic });
        store.set("local", local); title = o.title;
      }
      const wasDone = !current();
      rebuild(); $("add-url").value = "";
      const to = also.length && online ? ` to ${[K.name, ...also.map(k => K.others.find(o => o.id === k).name)].map(n => `${n} TV`).join(" and ")}` : "";
      addMsg(`Added “${title || "the video"}” to ${topic}${to ? `, on ${to.slice(4)}` : ""}.`, "ok");
      store.set("lastTopic", topic); $("add-topic-new").value = "";
      document.querySelectorAll(".also input").forEach(b => { b.checked = false; });
      paintGrown();
      if (wasDone || !busy()) paint();
      else paintShelf();
    } catch (err) {
      addMsg(err.message, "err");
      if (err.status === 401) $("add-code").hidden = false;
    } finally { $("add-go").disabled = false; }
  };

  async function setHidden(id, hide) {
    if (online) {
      if (!code) { $("add-code").hidden = false; $("add-code").focus(); addMsg("Type the grown-up code above first.", "err"); return; }
      try { took(await call(hide ? "/remove" : "/restore", { id })); }
      catch (err) { addMsg(err.message, "err"); if (err.status === 401) $("add-code").hidden = false; return; }
    }
    // Also on this device, so a video added here while offline comes off too.
    local.hidden = hide ? [...new Set([...local.hidden, id])] : local.hidden.filter(x => x !== id);
    store.set("local", local);
    const playing = id === shown && busy();
    rebuild(); paintGrown();
    if (!playing) paint(); else paintShelf();
  }
  // With no code typed yet, the code box doubles as the place to type it for Remove and Put back.
  $("add-code").addEventListener("change", () => { const c = $("add-code").value.trim(); if (c && online) { code = c; store.set("code", c); } });

  ["g-list", "g-off"].forEach(el => $(el).addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const id = b.closest("li").dataset.id;
    if (b.dataset.act === "play") { cur = id; store.set("cur", cur); closeSheets(); paint(true); scrollUp(); toast("Up now"); }
    if (b.dataset.act === "remove") setHidden(id, true);
    if (b.dataset.act === "restore") setHidden(id, false);
  }));

  // ---- the shared list: fetched on open and whenever the app comes back to the front ----
  // Never swap the video out from under one that's playing, paused or just finished.
  const busy = () => $("player").classList.contains("playing") || ["paused", "done"].some(id => $(id).classList.contains("show"));
  async function pull() {
    try {
      const r = await fetch(`${LIST_URL}/videos?kid=${K.id}`, { cache: "no-store" });
      if (!r.ok) throw 0;
      took(await r.json()); online = true;
    } catch { online = false; }
    const before = shown;
    rebuild();
    if ($("grown-sheet").classList.contains("show")) paintGrown();
    if (busy()) paintShelf();
    else if ((current() || {}).id !== before) paint();
    else paintShelf();
  }
  // A new day unlocks more videos if the app was left open overnight.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    pull();
    if ($("rest").classList.contains("show") && canWatch()) paint();
  });

  setBig(false);
  paint();
  pull();

  // ---- quiet auto-update: a home-screen app resumes instead of reloading, so check for a new version on the way back in ----
  const version = async () => {
    const r = await fetch(location.pathname, { method: "HEAD", cache: "no-store" });
    return r.ok ? r.headers.get("ETag") || r.headers.get("Last-Modified") : null;
  };
  let loadedVersion = null;
  version().then(v => { loadedVersion = v; }).catch(() => {});
  document.addEventListener("visibilitychange", async () => {
    if (document.hidden || !loadedVersion) return;
    const v = await version().catch(() => null);
    if (v && v !== loadedVersion && !document.hidden && !busy() && !document.querySelector(".sheet-bg.show")) location.reload();
  });

  // ---- YouTube player ----
  window.onYouTubeIframeAPIReady = () => {
    const v = current();
    player = new YT.Player("yt", {
      videoId: v ? v.id : undefined,
      // Plays inside the app (no full screen) so the covers and shields stay on top of YouTube's player.
      playerVars: { playsinline: 1, rel: 0, fs: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1, cc_load_policy: cc ? 1 : 0, cc_lang_pref: "en" },
      events: {
        onReady: () => { ready = true; hush(); if (shown !== (v && v.id)) paint(); },
        onStateChange: (e) => {
          const St = YT.PlayerState, p = $("player");
          if (!shown) return;
          if (e.data === St.PLAYING || e.data === St.BUFFERING) {
            $("poster").classList.add("hidden"); p.classList.add("playing"); showCover(null);
            if (!autoBig) { autoBig = true; if (big) setBig(true); }
          }
          if (e.data === St.ENDED || (e.data === St.PAUSED && reached)) return finish();
          // Pausing covers YouTube's "more videos" shelf with our own Keep going button.
          if (e.data === St.PAUSED) showCover("paused");
          clearInterval(timer);
          if (e.data === St.PLAYING) timer = setInterval(() => {
            const dur = player.getDuration(), now = player.getCurrentTime();
            if (!dur) return;
            if (now / dur >= 0.9) reached = true;
            const want = secs((list.find(x => x.id === shown) || {}).len);
            // Without a known length (added on this device only), hold sound a few seconds into the video's own clock instead.
            if (hushed && now >= 1 && ((want && Math.abs(dur - want) <= Math.max(4, want * 0.06)) || now >= (want ? 15 : 5))) unhush();
            // During an ad, dur is the ad's length, so a short ad must not shield the whole player (and its Skip button).
            p.classList.toggle("endzone", !adCheck(now) && dur - now <= 22);
          }, 1000);
        },
        // 100 = removed, 101/150 = embedding turned off: pass over it for this visit and move on.
        onError: (e) => {
          if (![100, 101, 150].includes(e.data) || !shown) return;
          broken.add(shown);
          const v = list.find(x => x.id === shown), nx = v && nextAfter(v);
          cur = nx ? nx.id : null; store.set("cur", cur);
          paint(true); toast("That video won't play here. On to the next one!");
        },
      },
    });
  };

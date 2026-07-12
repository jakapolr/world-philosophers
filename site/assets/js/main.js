/* World Philosophers — Home interactivity & motion
   Vanilla JS, no deps. All heavy motion gated behind reduced-motion + pointer checks. */
(function () {
  "use strict";
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(pointer: fine)").matches;
  const MOTION = !RM;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------------- Data (mirrors config/mentors.json) ---------------- */
  const MENTORS = [
    { slug:"lao-tzu", name:"Lao Tzu", group:"Eastern Wisdom", tagline:"Effortless action; lead by yielding (wu wei).", domains:["Life & Character","Strategy & Competition","Intuition & Inner-Self","Purpose & Longevity"] },
    { slug:"liu-bei", name:"Liu Bei", group:"Eastern Wisdom", tagline:"Win loyalty through benevolence and patience.", domains:["Business & Leadership","Strategy & Competition","Life & Character"] },
    { slug:"sima-yi", name:"Sima Yi", group:"Eastern Wisdom", tagline:"Endure, wait, and let time defeat your rivals.", domains:["Strategy & Competition","Business & Leadership","Life & Character"] },
    { slug:"sun-tzu", name:"Sun Tzu", group:"Eastern Wisdom", tagline:"Win before you fight; know self and other.", domains:["Strategy & Competition","Business & Leadership"] },
    { slug:"marcus-aurelius", name:"Marcus Aurelius", group:"Western Wisdom", tagline:"Master the inner citadel; control only what is yours.", domains:["Life & Character","Purpose & Longevity","Business & Leadership"] },
    { slug:"epicurus", name:"Epicurus", group:"Western Wisdom", tagline:"Tranquillity through simple, deliberate pleasures.", domains:["Life & Character","Purpose & Longevity"] },
    { slug:"socrates", name:"Socrates", group:"Western Wisdom", tagline:"Question everything; the examined life.", domains:["Life & Character","Intuition & Inner-Self","Strategy & Competition"] },
    { slug:"aristotle", name:"Aristotle", group:"Western Wisdom", tagline:"Virtue as the mean; excellence is a habit.", domains:["Life & Character","Purpose & Longevity","Business & Leadership"] },
    { slug:"plato", name:"Plato", group:"Western Wisdom", tagline:"Pursue the ideal Forms behind the shadows.", domains:["Life & Character","Purpose & Longevity","Intuition & Inner-Self"] },
    { slug:"jim-rohn", name:"Jim Rohn", group:"Business", tagline:"You are the average of your disciplines.", domains:["Business & Leadership","Life & Character","Purpose & Longevity"] },
    { slug:"elon-musk", name:"Elon Musk", group:"Business", tagline:"Reason from first principles; bias to action.", domains:["Business & Leadership","Strategy & Competition","Purpose & Longevity"] },
    { slug:"steve-jobs", name:"Steve Jobs", group:"Business", tagline:"Focus, taste, and the courage to say no.", domains:["Business & Leadership","Life & Character","Intuition & Inner-Self"] },
    { slug:"dario-amodei", name:"Dario Amodei", group:"Business", tagline:"Build powerfully, steer responsibly.", domains:["Business & Leadership","Purpose & Longevity","Strategy & Competition"] },
    { slug:"henry-ford", name:"Henry Ford", group:"Business", tagline:"Systematize; serve the many, not the few.", domains:["Business & Leadership","Financial & Investing","Strategy & Competition"] },
    { slug:"simon-sinek", name:"Simon Sinek", group:"Business", tagline:"Start with Why; leaders make people feel safe.", domains:["Business & Leadership","Purpose & Longevity","Intuition & Inner-Self","Life & Character"] },
    { slug:"carl-jung", name:"Carl Jung", group:"Intuition", tagline:"Make the unconscious conscious; integrate the shadow.", domains:["Intuition & Inner-Self","Life & Character","Purpose & Longevity"] },
    { slug:"gautama-buddha", name:"Gautama Buddha", group:"Intuition", tagline:"End suffering by seeing clearly; the Middle Way.", domains:["Life & Character","Intuition & Inner-Self","Purpose & Longevity"] },
    { slug:"warren-buffett", name:"Warren Buffett", group:"Financial", tagline:"Buy wonderful businesses; circle of competence.", domains:["Financial & Investing","Business & Leadership","Life & Character"] },
    { slug:"ray-dalio", name:"Ray Dalio", group:"Financial", tagline:"Principles, radical truth, and the machine.", domains:["Financial & Investing","Strategy & Competition","Life & Character"] },
    { slug:"benjamin-graham", name:"Benjamin Graham", group:"Financial", tagline:"Margin of safety; Mr. Market is your servant.", domains:["Financial & Investing","Life & Character"] },
    { slug:"peter-lynch", name:"Peter Lynch", group:"Financial", tagline:"Invest in what you understand; do the work.", domains:["Financial & Investing","Business & Leadership"] },
    { slug:"charlie-munger", name:"Charlie Munger", group:"Financial", tagline:"Latticework of mental models; invert, always invert.", domains:["Financial & Investing","Strategy & Competition","Life & Character"] },
    { slug:"chris-yeh", name:"Chris Yeh", group:"Financial", tagline:"Blitzscaling: prioritize speed to win markets.", domains:["Business & Leadership","Financial & Investing","Strategy & Competition"] },
  ];
  const HUE = { "Eastern Wisdom":"#6f9e8f", "Western Wisdom":"#8aa0c2", "Business":"#cfa163", "Intuition":"#a98fc4", "Financial":"#9aa96a" };
  const initials = (n) => { const p = n.split(/\s+/).filter(Boolean); return ((p[0]?.[0]||"") + (p[1]?.[0]||"")).toUpperCase(); };
  function avatar(m) {
    const h = HUE[m.group] || "#cfa163", id = "g_" + m.slug.replace(/[^a-z]/g, "");
    return `<svg viewBox="0 0 54 54" width="54" height="54" role="img" aria-label="${m.name}"><defs><radialGradient id="${id}" cx="50%" cy="38%" r="72%"><stop offset="0%" stop-color="${h}" stop-opacity="0.92"/><stop offset="100%" stop-color="${h}" stop-opacity="0.26"/></radialGradient></defs><circle cx="27" cy="27" r="26" fill="url(#${id})" stroke="#e8b96a" stroke-opacity="0.55" stroke-width="1.2"/><text x="27" y="28" text-anchor="middle" dominant-baseline="central" font-family="Cormorant Garamond, Georgia, serif" font-size="21" font-weight="600" fill="#0b0c10" fill-opacity="0.84">${initials(m.name)}</text></svg>`;
  }
  function cardHTML(m) {
    const tags = m.domains.slice(0, 3).map(d => `<span class="tag">${d.replace(" & ", " · ")}</span>`).join("");
    return `<a class="card" href="philosophers/${m.slug}.html" data-tilt><div class="card-top"><div class="avatar">${avatar(m)}</div><div><div class="name">${m.name}</div><div class="group">${m.group}</div></div></div><p class="tagline">${m.tagline}</p><div class="tags">${tags}</div><span class="go">Read the dossier →</span></a>`;
  }

  const grid = $("#mentor-grid"), emptyEl = $("#empty"), countEl = $("#count");
  let active = "all", busy = false;
  if (countEl) countEl.textContent = "(" + MENTORS.length + ")";

  function paint(list) {
    grid.innerHTML = list.map(cardHTML).join("");
    emptyEl.hidden = list.length > 0;
    const cards = $$(".card", grid);
    cards.forEach((c, i) => {
      if (MOTION) setTimeout(() => c.classList.add("card-in"), 40 + i * 32);
      else c.classList.add("card-in");
    });
  }
  function filterTo(domain) {
    if (busy && MOTION) return;
    active = domain;
    const list = domain === "all" ? MENTORS : MENTORS.filter(m => m.domains.includes(domain));
    if (!MOTION) { paint(list); return; }
    busy = true;
    const cards = $$(".card", grid);
    if (!cards.length) { paint(list); busy = false; return; }
    cards.forEach((c, i) => { c.style.transitionDelay = (i * 12) + "ms"; c.classList.remove("card-in"); c.classList.add("card-out"); });
    setTimeout(() => { paint(list); busy = false; }, 230);
  }
  const filtersEl = $("#filters");
  if (filtersEl) filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip"); if (!btn) return;
    $$("#filters .chip").forEach(c => c.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    const t = document.createElement("textarea"); t.innerHTML = btn.dataset.domain;
    filterTo(t.value);
  });

  /* ---------------- Theme ---------------- */
  const root = document.documentElement, toggle = $("#theme-toggle");
  function setTheme(t) { root.setAttribute("data-theme", t); toggle.textContent = t === "dark" ? "🌙" : "☀️"; try { localStorage.setItem("wp-theme", t); } catch (e) {} }
  toggle.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));
  try { const s = localStorage.getItem("wp-theme"); if (s) setTheme(s); else if (matchMedia("(prefers-color-scheme: light)").matches) setTheme("light"); } catch (e) {}

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.14 });
  $$("[data-reveal]").forEach(el => io.observe(el));

  /* ---------------- Count-up ---------------- */
  function countUp() {
    $$("[data-count]").forEach(el => {
      const target = +el.dataset.count;
      if (!MOTION) { el.textContent = target; return; }
      let t0 = null;
      const step = (ts) => { if (!t0) t0 = ts; const p = clamp((ts - t0) / 1000, 0, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  /* ---------------- Hero line reveal ---------------- */
  function heroReveal() {
    $$(".hero-title .l-inner").forEach((el, i) => {
      if (!MOTION) { el.style.transform = "none"; return; }
      el.style.transition = "transform 1.05s cubic-bezier(.22,.61,.36,1)";
      el.style.transitionDelay = (0.05 + i * 0.12) + "s";
      requestAnimationFrame(() => { el.style.transform = "none"; });
    });
    setTimeout(countUp, 600);
  }

  /* ---------------- Reveal hero on load ---------------- */
  heroReveal();

  /* ---------------- Scroll: nav state, progress, spy ---------------- */
  const nav = $("#nav"), progress = $("#progress");
  const navLinks = $$('.nav-links a[data-nav]');
  const spy = new IntersectionObserver((ents) => {
    ents.forEach(en => {
      if (en.isIntersecting) {
        const id = "#" + en.target.id;
        navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["how", "methodology", "council", "charter"].forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------------- Pointer FX: torch, cursor, tilt, magnetic ---------------- */
  if (FINE && MOTION) {
    const torch = $("#torch"), cur = $("#cursor");
    document.body.classList.add("has-cursor");
    cur.style.display = "block";
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      cx = lerp(cx, mx, 0.18); cy = lerp(cy, my, 0.18);
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
      torch.style.setProperty("--mx", mx + "px");
      torch.style.setProperty("--my", my + "px");
      requestAnimationFrame(loop);
    })();
    // hot cursor over interactive
    document.addEventListener("mouseover", (e) => { if (e.target.closest("a,button,.card,.chip,[data-tilt]")) cur.classList.add("hot"); });
    document.addEventListener("mouseout", (e) => { if (e.target.closest("a,button,.card,.chip,[data-tilt]")) cur.classList.remove("hot"); });

    // 3D tilt + spotlight on cards & steps (delegated)
    function bindTilt(scope) {
      scope.addEventListener("mousemove", (e) => {
        const el = e.target.closest("[data-tilt]"); if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--px", (px * 100) + "%");
        el.style.setProperty("--py", (py * 100) + "%");
        const rx = (0.5 - py) * 8, ry = (px - 0.5) * 8;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      scope.addEventListener("mouseout", (e) => {
        const el = e.target.closest("[data-tilt]"); if (!el || el.contains(e.relatedTarget)) return;
        el.style.transform = "";
      });
    }
    bindTilt(document);

    // magnetic buttons
    $$(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3, y = (e.clientY - r.top - r.height / 2) * 0.4;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------------- Embers canvas ---------------- */
  if (MOTION) {
    const cv = $("#embers"), ctx = cv.getContext("2d");
    let W, H, dpr = Math.min(devicePixelRatio || 1, 2), parts = [], raf;
    function resize() {
      W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
      const n = clamp(Math.round(innerWidth / 22), 26, 74);
      parts = Array.from({ length: n }, () => spawn(true));
    }
    function spawn(any) {
      return { x: Math.random() * W, y: any ? Math.random() * H : H + 10 * dpr,
        r: (Math.random() * 1.6 + 0.5) * dpr, vy: (Math.random() * 0.4 + 0.15) * dpr,
        drift: (Math.random() - 0.5) * 0.35 * dpr, a: Math.random() * 0.5 + 0.15, tw: Math.random() * 6.28 };
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.y -= p.vy; p.x += p.drift + Math.sin(p.tw += 0.01) * 0.15 * dpr;
        if (p.y < -12 * dpr) Object.assign(p, spawn(false));
        const fl = 0.6 + Math.sin(p.tw * 2) * 0.4;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fillStyle = `rgba(232,185,106,${p.a * fl})`; ctx.shadowBlur = 8 * dpr; ctx.shadowColor = "rgba(232,185,106,.7)";
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    resize(); frame();
    addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else frame(); });
  }

  /* ---------------- Voices (rotating quotes) ---------------- */
  (function () {
    const VOICES = [
      { q: "The highest good is like water: it benefits all things and does not compete.", who: "Lao Tzu · Tao Te Ching" },
      { q: "Waste no more time arguing what a good man should be. Be one.", who: "Marcus Aurelius · Meditations" },
      { q: "Know the enemy and know yourself, and you need not fear a hundred battles.", who: "Sun Tzu · The Art of War" },
      { q: "People don't buy what you do; they buy why you do it.", who: "Simon Sinek · Start With Why" },
      { q: "You yourself must strive. The Buddhas only point the way.", who: "Gautama Buddha · Dhammapada" },
      { q: "Invert, always invert. Turn a situation upside down; look at it backward.", who: "Charlie Munger · Poor Charlie's Almanack" },
    ];
    const quote = $("#voice-quote"), textEl = $("#voice-text"), citeEl = $("#voice-cite"), dots = $("#voice-dots");
    if (!quote) return;
    let i = 0, timer = null;
    dots.innerHTML = VOICES.map((_, n) => `<button role="tab" aria-selected="${n === 0}" aria-label="Voice ${n + 1}"></button>`).join("");
    const dotEls = [...dots.children];
    const setContent = () => { textEl.textContent = VOICES[i].q; citeEl.textContent = VOICES[i].who; };
    function show(n, animate) {
      i = (n + VOICES.length) % VOICES.length;
      dotEls.forEach((d, k) => d.setAttribute("aria-selected", k === i));
      if (animate && MOTION) { quote.classList.add("fading"); setTimeout(() => { setContent(); quote.classList.remove("fading"); }, 470); }
      else setContent();
    }
    function schedule() { if (!MOTION) return; clearTimeout(timer); timer = setTimeout(() => { show(i + 1, true); schedule(); }, 5500); }
    dotEls.forEach((d, n) => d.addEventListener("click", () => { show(n, true); schedule(); }));
    quote.addEventListener("mouseenter", () => clearTimeout(timer));
    quote.addEventListener("mouseleave", schedule);
    quote.addEventListener("click", () => { show(i + 1, true); schedule(); });
    show(0, false); schedule();
  })();

  /* ---------------- Initial paint ---------------- */
  if (grid) paint(MENTORS);
})();

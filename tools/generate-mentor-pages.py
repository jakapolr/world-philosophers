#!/usr/bin/env python3
"""
Generate static philosopher detail pages for the website from the canonical
knowledge files.

  Input:  knowledge/philosophers/<slug>.md   (+ config/mentors.json for order/meta)
  Output: site/philosophers/<slug>.html

The output is plain static HTML committed to the repo — the site has no build
step at serve time. Re-run this after editing a knowledge file:

  python3 tools/generate-mentor-pages.py

Images: if site/assets/img/<slug>.{jpg,png,webp} exists it is used; otherwise a
generated monogram medallion (license-clean) is shown.
"""
import json, os, re, html, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KDIR = os.path.join(ROOT, "knowledge", "philosophers")
OUTDIR = os.path.join(ROOT, "site", "philosophers")
IMGDIR = os.path.join(ROOT, "site", "assets", "img")

HUE = {"Eastern Wisdom": "#6f9e8f", "Western Wisdom": "#8aa0c2",
       "Business": "#cfa163", "Intuition": "#a98fc4", "Financial": "#9aa96a"}

with open(os.path.join(ROOT, "config", "mentors.json")) as f:
    ROSTER = json.load(f)["mentors"]
NAME2SLUG = {m["name"]: m["slug"] for m in ROSTER}


def initials(name):
    p = [w for w in re.split(r"\s+", name) if w]
    return ((p[0][:1] if p else "") + (p[1][:1] if len(p) > 1 else "")).upper()


def avatar_svg(name, group):
    hue = HUE.get(group, "#cfa163")
    return f'''<svg viewBox="0 0 132 132" width="132" height="132" role="img" aria-label="{html.escape(name)}">
<defs><radialGradient id="pg" cx="50%" cy="36%" r="76%"><stop offset="0%" stop-color="{hue}" stop-opacity="0.95"/><stop offset="100%" stop-color="{hue}" stop-opacity="0.2"/></radialGradient></defs>
<circle cx="66" cy="66" r="63" fill="url(#pg)" stroke="#e8b96a" stroke-opacity="0.5" stroke-width="1.5"/>
<circle cx="66" cy="66" r="57" fill="none" stroke="#e8b96a" stroke-opacity="0.22" stroke-width="1"/>
<text x="66" y="71" text-anchor="middle" dominant-baseline="central" font-family="Cormorant Garamond, Georgia, serif" font-size="47" font-weight="600" fill="#0b0c10" fill-opacity="0.82">{initials(name)}</text>
</svg>'''


def inline(text):
    text = html.escape(text, quote=False)

    def wl(m):
        nm = m.group(1); slug = NAME2SLUG.get(nm)
        return f'<a href="{slug}.html">{nm}</a>' if slug else nm
    text = re.sub(r"\[\[([^\]]+)\]\]", wl, text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", text)
    return text


def parse_frontmatter(md):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", md, re.S)
    fm_raw, body = m.group(1), m.group(2)
    fm = {"sources": []}
    lines = fm_raw.split("\n"); i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("sources:"):
            i += 1
            while i < len(lines) and lines[i].startswith("  - "):
                fm["sources"].append(lines[i][4:].strip()); i += 1
            continue
        m2 = re.match(r"^([a-z_]+):\s*(.*)$", line)
        if m2:
            fm[m2.group(1)] = m2.group(2).strip()
        i += 1
    doms = fm.get("domains", "").strip("[]")
    fm["domain_list"] = [d.strip() for d in doms.split(",") if d.strip()]
    return fm, body


def split_sections(body):
    sections, title, cur = [], None, []
    for line in body.split("\n"):
        if line.startswith("## "):
            if title is not None:
                sections.append((title, cur))
            title, cur = line[3:].strip(), []
        elif line.startswith("# "):
            continue
        else:
            if title is not None:
                cur.append(line)
    if title is not None:
        sections.append((title, cur))
    return sections


def render_blocks(lines, list_class):
    out, i, n = [], 0, len(lines)
    while i < n:
        line = lines[i].rstrip()
        if not line.strip():
            i += 1; continue
        if line.startswith("### "):
            out.append(f'<h3 class="wisdom-cat">{inline(line[4:].strip())}</h3>'); i += 1
        elif line.startswith("> "):
            out.append(f'<blockquote class="dossier-blockquote">{inline(line[2:].strip())}</blockquote>'); i += 1
        elif line.startswith("- "):
            items = []
            while i < n:
                l = lines[i].rstrip()
                if l.startswith("- "):
                    items.append(inline(l[2:].strip())); i += 1
                elif not l.strip():
                    j = i + 1
                    while j < n and not lines[j].strip():
                        j += 1
                    if j < n and lines[j].startswith("- "):
                        i = j
                    else:
                        break
                else:
                    break
            out.append(f'<ul class="{list_class}">' + "".join(f"<li>{it}</li>" for it in items) + "</ul>")
        else:
            out.append(f"<p>{inline(line.strip())}</p>"); i += 1
    return "\n".join(out)


def render_quotes(lines):
    out = []
    for l in lines:
        s = l.rstrip()
        if s.startswith("- "):
            out.append(f'<blockquote class="sig-quote">{inline(s[2:].strip())}</blockquote>')
        elif s.strip() and not s.startswith("#"):
            out.append(f'<p class="q-note">{inline(s.strip())}</p>')
    return '<div class="sig-quotes">' + "".join(out) + "</div>"


def find_image(slug):
    for ext in ("jpg", "jpeg", "png", "webp"):
        if os.path.exists(os.path.join(IMGDIR, f"{slug}.{ext}")):
            return f"../assets/img/{slug}.{ext}"
    return None


SKIP = {"Voice (for the persona)"}

PAGE = '''<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{name} — World Philosophers</title>
<meta name="description" content="{desc}" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='26' font-size='26'%3E%F0%9F%95%AF%EF%B8%8F%3C/text%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&family=Noto+Sans+Thai:wght@400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../assets/css/main.css" />
</head>
<body>
<canvas class="embers" id="embers" aria-hidden="true"></canvas>
<div class="torch" id="torch" aria-hidden="true"></div>
<div class="grain" aria-hidden="true"></div>
<div class="cursor" id="cursor" aria-hidden="true"><span></span></div>
<div class="scroll-progress" id="progress" aria-hidden="true"></div>

<nav class="nav" id="nav">
  <a class="brand" href="../index.html"><span class="flame-dot">🕯️</span> World Philosophers</a>
  <div class="nav-links">
    <a class="back-link" href="../index.html#council">← The Council</a>
    <button class="icon-btn" id="theme-toggle" aria-label="Toggle light and dark theme" title="Toggle theme">🌙</button>
  </div>
</nav>

<header class="dossier-hero">
  <div class="portrait">{img}{avatar}</div>
  <h1 class="dossier-name">{name}</h1>
  <p class="dossier-meta">{group}{era}</p>
  <div class="domain-chips">{chips}</div>
  <p class="dossier-tagline">{tagline}</p>
  {snapshot}
</header>

<article class="dossier-body">
{sections}
</article>

<section class="dossier-cta">
  <p class="serif-quote">The mentors light the path. You choose the step.</p>
  <div class="footer-links" style="margin-top:1rem;display:flex;gap:1.2rem;justify-content:center;">
    <a href="../index.html#council">← Back to the council</a>
    <a href="https://github.com/jakapolr/world-philosophers" target="_blank" rel="noopener">GitHub</a>
  </div>
</section>

<script src="../assets/js/main.js"></script>
</body>
</html>
'''


def build(slug):
    with open(os.path.join(KDIR, f"{slug}.md")) as f:
        md = f.read()
    fm, body = parse_frontmatter(md)
    name = fm["name"]; group = fm["group"]
    era = f" · {fm['era']}" if fm.get("era") else ""
    sections = split_sections(body)

    snapshot_html = ""
    body_html = []
    for title, lines in sections:
        if title in SKIP:
            continue
        if title == "Snapshot":
            txt = " ".join(l.strip() for l in lines if l.strip())
            snapshot_html = f'<p class="dossier-snapshot">{inline(txt)}</p>'
            continue
        if title == "Wisdom":
            content = render_blocks(lines, "wisdom-list")
        elif title == "Signature Quotes":
            content = render_quotes(lines)
        else:
            content = render_blocks(lines, "dossier-list")
        body_html.append(
            f'<section class="dossier-section" data-reveal data-tilt><h2>{inline(title)}</h2>{content}</section>')

    # sources
    if fm.get("sources"):
        src = "".join(f"<li>{inline(s)}</li>" for s in fm["sources"])
        body_html.append(
            f'<section class="dossier-section" data-reveal><h2>Sources</h2><ul class="sources">{src}</ul></section>')

    chips = "".join(f'<span class="tag">{inline(d)}</span>' for d in fm["domain_list"])
    imgpath = find_image(slug)
    img = f'<img class="portrait-img" src="{imgpath}" alt="{html.escape(name)}" onerror="this.remove()"/>' if imgpath else \
          f'<img class="portrait-img" src="../assets/img/{slug}.jpg" alt="{html.escape(name)}" onerror="this.remove()"/>'

    page = PAGE.format(
        name=html.escape(name),
        desc=html.escape(fm.get("tagline", name)),
        group=html.escape(group), era=html.escape(era),
        chips=chips, tagline=inline(fm.get("tagline", "")),
        snapshot=snapshot_html, img=img, avatar=avatar_svg(name, group),
        sections="\n".join(body_html),
    )
    os.makedirs(OUTDIR, exist_ok=True)
    with open(os.path.join(OUTDIR, f"{slug}.html"), "w") as f:
        f.write(page)
    return name


if __name__ == "__main__":
    slugs = sorted(os.path.basename(p)[:-3] for p in glob.glob(os.path.join(KDIR, "*.md")))
    for slug in slugs:
        print("  ✓", build(slug))
    print(f"Generated {len(slugs)} pages -> site/philosophers/")

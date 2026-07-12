# 🏛️ World Philosophers — Personal Mentorship

A Claude Code plugin that convenes a **council of world-leading philosophers,
strategists, founders, and investors** — Eastern and Western — to mentor you through
life, business, strategy, money, and meaning.

It routes your question to the best-suited mentors, lets them give a holistic view
(including where they **disagree**), and always **hands the choice back to you**.

> **Reflection, never fortune-telling.** See [`PRINCIPLES.md`](PRINCIPLES.md) — the
> Free-Will Charter every mentor obeys.

> 🕯️ **Why this exists** — read [`MANIFESTO.md`](MANIFESTO.md). This was built in the
> hope of being a small candle in the dark for whoever needs it.

## The Council (23 mentors)

| Tradition | Mentors |
|---|---|
| **Eastern Wisdom** | Lao Tzu · Liu Bei · Sima Yi · Sun Tzu |
| **Western Wisdom** | Marcus Aurelius · Epicurus · Socrates · Aristotle · Plato |
| **Business** | Jim Rohn · Elon Musk · Steve Jobs · Dario Amodei · Henry Ford · Simon Sinek |
| **Intuition & Inner-Self** | Carl Jung · Gautama Buddha |
| **Financial** | Warren Buffett · Ray Dalio · Benjamin Graham · Peter Lynch · Charlie Munger · Chris Yeh |

Each mentor is recorded with biography, successes, **failures & blind spots**, and their
**wisdom** categorized across six domains: Life & Character · Business & Leadership ·
Strategy & Competition · Financial & Investing · Intuition & Inner-Self · Purpose &
Longevity.

## Usage
- `/build-goals` — **start here.** Discover your Ultimate Life Goals through a guided
  reflection with the philosophers; it writes them to `config/user-profile.md` so every
  mentor serves your real purpose.
- `/mentor <your question>` — auto-routes to the best mentor, or convenes a council for a
  real decision. Name one with `/mentor as Marcus Aurelius — ...`.
- `/council <your decision>` — a multi-voice holistic reflection.
- `/reflect` — see how you've grown over time (`/reflect log` records a session).

## Storage — neutral by default
Everything is **plain markdown inside this folder** (`knowledge/`, `journal/`, `config/`).
No Obsidian, no database, no account, no internet required. Optionally mirror your data
into a tool you already use (e.g. Obsidian) by adding it to `config/settings.json` →
`mirrors`; leave it empty for a fully self-contained setup.

## How it's built
```
.claude-plugin/plugin.json   manifest
PRINCIPLES.md                the Free-Will Charter — ethics (binding on all mentors)
COACHING.md                  the coaching method — how mentors draw answers out (not therapy)
config/
  user-profile.example.md    ← copy to user-profile.md (gitignored) & make it yours
  mentors.json               roster + category routing map
commands/    /mentor, /council
skills/      mentor-router · council-synthesis · wisdom-sync
agents/      one persona subagent per mentor
knowledge/philosophers/      canonical wisdom base (portable)
templates/   knowledge + persona-agent templates
```

## Two sources of truth, kept in sync
- **Canonical:** `knowledge/philosophers/` in this plugin (portable, open-sourceable).
- **Personal mirror:** the Obsidian vault `World Wisdom/` folder.

The `wisdom-sync` skill updates **both** whenever wisdom is added or edited. Open-source
users without the Obsidian MCP simply use the plugin copy.

## Make it your own
Copy `config/user-profile.example.md` to `config/user-profile.md` (which is **gitignored**,
so your profile stays private) and fill it in — or run `/build-goals` to write it through a
guided reflection. The router reads it to weight every mentor's guidance toward *your*
purpose — never to flatter.

---
*Built as a personal mentorship system. The mentors light the path; you choose the step.*

# World Philosophers — User Stories

## Summary
**13 stories / 6 epics** covering the full arc: **discover your purpose → get guidance →
see your growth → make it your own → trust & privacy → sync.** Every story passes INVEST
and has testable Given/When/Then acceptance criteria.

**Personas:** 🌱 *Seeker* (new, no goals yet) · 🧭 *Decision-Maker* (has a choice to make) ·
🪞 *Reflector* (wants to see growth) · 🕯️ *The One in the Dark* (struggling) · 🛠️ *Builder*
(forks & adapts it) · 🔒 *Privacy-First / Offline* · 🗂️ *Obsidian User* · 🧪 *Skeptic*
(wants honesty).

| Epic | Stories | Persona focus |
|---|---|---|
| A · Discover my purpose | US-1, US-2 | 🌱 Seeker |
| B · Guidance on a decision | US-3, US-4, US-5 | 🧭 Decision-Maker |
| C · See how I've grown | US-6, US-7 | 🪞 Reflector |
| D · Make it my own | US-8, US-9 | 🛠️ Builder |
| E · Trust, privacy & neutrality | US-10, US-11, US-12 | 🔒 Privacy-First · 🧪 Skeptic · 🕯️ In the Dark |
| F · Sync to my tools | US-13 | 🗂️ Obsidian User |

---

## Epic A — Discover my purpose (`/build-goals`)

### US-1 · Find my WHY from scratch
**As a** Seeker who just installed the plugin and has no profile, **I want** to be guided
through a reflective dialogue with the philosophers to discover my Ultimate Goals,
**so that** the plugin knows what I actually want in life before it advises me.

**Acceptance Criteria**
- **Given** an empty/template `config/user-profile.md`, **when** I run `/build-goals`,
  **then** Simon Sinek opens with a WHY question, followed by Aristotle/Jung,
  Marcus/Munger, Buddha, Rohn, Lao Tzu — one stage at a time.
- **Given** I'm mid-dialogue, **when** I answer a stage, **then** it waits for my full
  answer before advancing (no rushing to synthesis).
- **Given** the dialogue ends, **when** it synthesizes, **then** it writes my answers into
  `user-profile.md` mapped as WHY→Purpose / HOW→Principles+Values / WHAT→Targets, **and**
  hands it back to me to confirm/edit.
- **Given** synthesis, **then** it never assigns me a purpose I didn't express (my words,
  organized).

**INVEST:** Independent, valuable, testable. **Notes:** The onboarding front door;
everything else reads its output.

### US-2 · Re-forge my goals as I grow
**As a** Reflector whose life has shifted, **I want** to re-run `/build-goals` and version
the result, **so that** I can see how my Ultimate Goals themselves evolved.

**Acceptance Criteria**
- **Given** an existing profile v1, **when** I re-run `/build-goals`, **then** it bumps
  `profile_version` and stamps `forged_on`, preserving the prior version's intent for
  comparison.
- **Given** two versions exist, **when** I ask what changed, **then** it contrasts v1 vs
  v2 in my purpose/values/targets.

**INVEST:** Small, valuable. **Dependency:** US-1.

---

## Epic B — Get guidance on a real decision (`/mentor`, `/council`)

### US-3 · Auto-routed mentorship
**As a** Decision-Maker, **I want** to ask a question and have it routed to the best-suited
mentor(s) automatically, **so that** I get relevant wisdom without needing to know who to
ask.

**Acceptance Criteria**
- **Given** any question, **when** I run `/mentor "<q>"`, **then** it classifies the
  question into ≥1 of the 6 domains and tells me which mentor(s) it convened and why.
- **Given** a narrow single-domain question, **then** it answers as the single best-fit
  mentor.
- **Given** a cross-cutting/real decision, **then** it convenes a council (2–4 mentors
  across traditions).
- **Given** any answer, **then** it ends by handing the choice back — no command, no
  prediction.

**INVEST:** Valuable, testable. **Dependency:** profile (US-1) improves weighting but
isn't required.

### US-4 · Convene a council and see disagreement
**As a** Decision-Maker weighing a hard tradeoff, **I want** multiple mentors to give their
views *and show where they disagree*, **so that** I see the real tension instead of a
bland average.

**Acceptance Criteria**
- **Given** `/council "<decision>"`, **when** it responds, **then** each mentor speaks in
  their own voice, grounded in their knowledge file.
- **Given** the synthesis, **then** it explicitly lists *where they converge* and *where
  they diverge*, and does **not** flatten the disagreement.
- **Given** the close, **then** it offers reflective questions weighted to my profile —
  never a verdict.

**INVEST:** Valuable. **Notes:** The disagreement is the core value prop.

### US-5 · Go deep with one chosen mentor
**As a** user who trusts a particular voice, **I want** to summon one specific mentor,
**so that** I get sustained depth in their perspective.

**Acceptance Criteria**
- **Given** `/mentor as <Name> — <q>`, **then** it responds solely in that mentor's
  persona, grounded in their dossier, in their characteristic voice.
- **Given** the response, **then** no quotes are invented; uncertain attributions are
  flagged.

**INVEST:** Small, independent.

---

## Epic C — See how I've grown (`/reflect`)

### US-6 · Record a meaningful session
**As a** Reflector, **I want** significant sessions logged automatically (or via
`/reflect log`), **so that** my journey is captured without manual effort.

**Acceptance Criteria**
- **Given** a weighty session, **when** it's logged, **then** a `journal/<date>-<slug>.md`
  entry is written with frontmatter (date, mentors, mode, values_invoked, tone) + body
  (situation, principle that landed, decision, open tension).
- **Given** no Obsidian/mirror configured, **then** it still writes the local file and
  reports success.

**INVEST:** Testable. **Dependency:** none.

### US-7 · Mirror my arc of change back to me
**As a** Reflector, **I want** `/reflect` to show how my thinking/decisions/feelings have
changed over time, **so that** I can *see* my growth concretely.

**Acceptance Criteria**
- **Given** ≥2 entries, **when** I run `/reflect`, **then** it names through-lines and what
  changed between earlier and later entries, **quoting specific dated entries**.
- **Given** only 1 entry, **then** it honestly says the journal is thin and sets a baseline
  (no fabricated arc).
- **Given** any reflection, **then** it never predicts where I'm "heading" and never
  flatters; recurring unresolved tensions are surfaced.

**INVEST:** Valuable, testable. **Dependency:** US-6.

---

## Epic D — Make it my own (open-source / customize)

### US-8 · Adopt the plugin for my own life
**As a** Builder forking the open-source project, **I want** to replace the mentee profile
with my own mission, **so that** every mentor serves *my* purpose, not the original
author's.

**Acceptance Criteria**
- **Given** a fork, **when** I edit (or `/build-goals` into) `config/user-profile.md`,
  **then** the router and all mentors weight guidance toward my stated mission.
- **Given** the template, **then** documentation shows exactly which file to change.

**INVEST:** Independent, valuable. **Notes:** "Change one file to make it yours."

### US-9 · Add or edit a mentor, kept in sync
**As a** Builder, **I want** to add a mentor and have both sources stay aligned, **so that**
my knowledge base never diverges.

**Acceptance Criteria**
- **Given** a new mentor, **when** I use `wisdom-sync`, **then** it writes
  `knowledge/philosophers/<slug>.md`, updates `mentors.json`, and mirrors to any
  configured target.
- **Given** no mirror configured, **then** updating the canonical plugin file alone is a
  complete, valid result.

**INVEST:** Testable. **Dependency:** `settings.json`.

---

## Epic E — Trust, privacy & neutrality

### US-10 · Keep everything local and private
**As a** Privacy-First / Offline user, **I want** all my data stored as plain local files
with no external dependency, **so that** my reflections never leave my machine.

**Acceptance Criteria**
- **Given** a default install, **when** I use any feature, **then** all data is plain
  markdown in the plugin folder — no account, DB, or internet required.
- **Given** a public fork, **then** `.gitignore` keeps `journal/` private (only README +
  `*.example.md` tracked).
- **Given** `settings.json` → `mirrors: []`, **then** nothing is mirrored anywhere.

**INVEST:** Testable. **Notes:** Neutral-by-default is a hard guarantee.

### US-11 · Trust that it reflects, never fortune-tells
**As a** Skeptic, **I want** guidance grounded in real, sourced wisdom that hands me the
choice, **so that** I'm getting honest reflection, not divination or invented quotes.

**Acceptance Criteria**
- **Given** any mentor response, **then** it cites a named principle/source, never predicts
  outcomes, never says "you will," and ends by returning the decision to me.
- **Given** a quote, **then** it's verified; misattributed ones are excluded/flagged (e.g.,
  the Dolly Parton catch on a quote commonly credited to Sinek).
- **Given** a mentor, **then** their failures & blind spots are recorded and may be named.

**INVEST:** Testable. **Notes:** Enforced by `PRINCIPLES.md`.

### US-12 · A small light when I'm struggling
**As** someone in the dark, **I want** to bring a heavy question and receive grounded
perspective plus the choice to act, **so that** I find enough light to take my own next
step.

**Acceptance Criteria**
- **Given** a question touching crisis/medical/legal/acute-mental-health stakes, **then**
  the mentors encourage qualified human help and do not substitute for it.
- **Given** any heavy question, **then** the tone honors agency and dignity (per the
  `MANIFESTO.md` + `PRINCIPLES.md`).

**INVEST:** Valuable. **Notes:** The project's stated reason for existing.

---

## Epic F — Sync to my tools (optional)

### US-13 · Mirror to my Obsidian vault
**As an** Obsidian user, **I want** to opt into mirroring knowledge/journal/goals into my
vault, **so that** my wisdom and growth show up in my existing knowledge graph.

**Acceptance Criteria**
- **Given** I add `{ "type": "obsidian", "target": "...", "sync": [...] }` to
  `settings.json`, **when** data changes, **then** it's copied to that vault folder with
  tags + `[[wikilinks]]`.
- **Given** the Obsidian MCP is unavailable, **then** it skips the mirror gracefully and
  keeps the local file canonical.

**INVEST:** Independent. **Dependency:** `settings.json`, obsidian adapter.

---

## Suggested MVP slice
US-1 (discover purpose) · US-3 (auto-routed mentorship) · US-6 (log a session) ·
US-10 (local & private) — the smallest set that lets a new user find their why, get
guidance, capture it, and trust their data stays theirs.

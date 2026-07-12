# Contributing to World Philosophers

Thank you for helping this council grow. Whether you're fixing a fact, adding a
mentor, or improving a skill — welcome. This is a project built to help people
think for themselves, and contributions should serve that.

## The one rule that governs everything
Every contribution must uphold [`PRINCIPLES.md`](PRINCIPLES.md) — **the Free-Will
Charter**: reflection, never fortune-telling; the choice always returns to the user;
principle before prescription; **no invented quotes**; honesty about a mentor's
failures. If a change would make a mentor predict the future, flatter, or issue
commands, it doesn't belong here.

## Ways to contribute
- **Fix or sharpen a fact** in a mentor's dossier (`knowledge/philosophers/<slug>.md`).
- **Improve a skill** (`skills/*/SKILL.md`) or command (`commands/*.md`).
- **Propose a new mentor** — open an issue first (see below) so we can agree on fit.
- **Improve docs, the website, or accessibility.**

## Adding or editing a mentor
1. Start an issue to discuss fit and sourcing (for a *new* mentor).
2. Write `knowledge/philosophers/<slug>.md` using
   [`templates/knowledge-template.md`](templates/knowledge-template.md).
3. Write the persona `agents/<slug>.md` using
   [`templates/persona-agent-template.md`](templates/persona-agent-template.md).
4. Register the mentor in [`config/mentors.json`](config/mentors.json) (slug, group,
   primary/secondary domains, tagline).
5. Keep the two sources in sync via the `wisdom-sync` skill; if you use an Obsidian
   mirror, update it too.
6. Regenerate the website page from the knowledge file:
   `python3 tools/generate-mentor-pages.py` (writes `site/philosophers/<slug>.html`).

### Quality bar for wisdom (non-negotiable)
- **Real, verified quotes only.** No fabrication. If an attribution is disputed or
  commonly misattributed, exclude it or flag it (see the Simon Sinek / Dolly Parton
  note as an example of the standard).
- **Cite sources** — books, talks, letters, with author/year.
- **Record failures & blind spots honestly.** No hagiography. We learn from where a
  figure fell short, not only where they soared.
- **Tie wisdom to the six domains** and keep the *Apply:* notes concrete.
- Personas are interpretive teaching tools — never claim to *be* the real person, and
  never speak for a living person's actual current views.

## Privacy — never commit personal data
- Your own `config/user-profile.md` and your `journal/` entries are **personal** and
  **gitignored** — start from `config/user-profile.example.md`. Never commit real
  personal data.
- Don't add anyone's private information.

## Development
This is **plain markdown + JSON — there is no build step.** Clone, edit, and test by
running the plugin's commands (`/build-goals`, `/mentor`, `/council`, `/reflect`).
Keep line length readable (~90 cols) and match the tone of existing files.

## Pull requests
- Keep PRs focused (one mentor, one skill, or one fix).
- In the description, note your sources and confirm the Free-Will Charter is upheld.
- Be kind and rigorous in review — see [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

> The mentors light the path. Contributors keep the lamp trimmed and honest.

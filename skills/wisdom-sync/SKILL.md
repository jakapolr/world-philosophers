---
name: wisdom-sync
description: Keeps the mentor knowledge base in sync between the plugin (knowledge/philosophers/) and the Obsidian vault (World Wisdom/). Use when adding a new mentor, editing wisdom, or when the user says to update/sync the philosophers. Updates BOTH sources.
---

# Wisdom Sync

**Canonical, neutral storage:** all data lives as plain markdown in the plugin folder —
`knowledge/philosophers/`, `journal/`, `config/`. **No external tool is required.** This
is always the source of truth.

**Optional mirrors (adapters):** a user *may* opt in to mirror data into a tool they
already use, by listing it in `config/settings.json` → `mirrors`. Today the supported
adapter is **Obsidian** (`{ "type": "obsidian", "target": "World Wisdom", "sync": [...] }`,
reached via the `obsidian` MCP). Mirrors are one-way copies; the plugin folder still wins.
If `mirrors` is empty (the default) or the adapter's tool is unavailable, simply skip
mirroring — the plugin is fully functional on its own.

## Rules
1. **Always update the canonical plugin file.** Then update any mirror configured in
   `config/settings.json` so it never diverges. No mirror configured → step done.
2. **Plugin is the source of truth.** If they ever conflict, the plugin file wins; bring
   Obsidian back into line.
3. **If the Obsidian MCP is unavailable** (e.g. open-source user, headless run), update the
   plugin file only and note that the Obsidian mirror was skipped.

## Adding or editing a mentor
1. Write/update `knowledge/philosophers/<slug>.md` using `templates/knowledge-template.md`.
2. Update `config/mentors.json` (roster + category mapping) if the mentor is new.
3. Mirror to `World Wisdom/<Name>.md` in Obsidian:
   - The vault note uses the same content, adapted with `[[wikilinks]]` and `#tags`
     (e.g. `#wisdom/life`, `#mentor/stoic`) for graph navigation.
   - Create the note if missing; otherwise update in place.
4. Confirm both written.

## Obsidian note shape (mirror)
Frontmatter tags by category + group, then the same sections as the knowledge file:
Snapshot · Biography · Successes · Failures & Blind Spots · Wisdom (by category) ·
Signature Quotes · When To Consult · Tension With Other Mentors.
Cross-link related mentors with `[[Name]]`.

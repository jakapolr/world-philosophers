# Ultimate Goals — output structure

`goal-forge` writes the user's discovered goals into `config/user-profile.md` using this
exact structure (so the router and every mentor can read it consistently). All content
is in the **user's own words**, organized — never authored for them.

```markdown
---
profile_owner: <name>
profile_version: <n>
languages: [<the languages they reflect in>]
forged_on: <YYYY-MM-DD>   # when these goals were discovered/last revised
---

# Who I Am Mentoring

## Ultimate Life Purpose
<one paragraph, their words — the thing wanted for its own sake (Stage 1 + 3)>

## Concrete Targets
- <measurable, time-bound goals — 3/10/20 year horizons (Stage 4)>

## Core Values
<3–6 values they will not compromise (Stage 4)>

## Operating Principles
<their frameworks, disciplines, daily practices (Stage 4)>

## Strengths & Growth Edge
<what they're great at; what they're working on (Stage 5)>

## How I Want To Be Mentored
<tone, language, challenge level — how they want the council to speak to them>
```

> Pair with `growth-mirror`: re-running `goal-forge` later and bumping `profile_version`
> lets the user see how their Ultimate Goals themselves evolved over time.

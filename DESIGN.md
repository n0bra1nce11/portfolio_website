# DESIGN.md — "document brutalism"

Why this looks the way it does, and the exact token values, so a future edit
can stay consistent instead of drifting toward generic defaults.

## Positioning line this design serves

> "I test controls the way an attacker would, then evidence them the way an
> auditor does."

Every decision below is in service of reading like a **well-typeset technical
report** (Trail of Bits / Latacora register) — not a marketing site, and not
neo-brutalism (no thick black borders, no offset drop shadows, no bright
yellow/pink cards, no rotated elements).

## Explicitly avoided

- Warm terracotta/clay accent (`#D97757`-family) — the current generic
  AI-portfolio default.
- Card-shadow grids, `rounded-2xl` everything, gradient hero backgrounds,
  centered hero copy, entrance/scroll animations.
- Color-only severity encoding (fails colorblind readers and print).

## Color

One functional accent, used **only** to encode finding severity — everywhere
else is monochrome.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#faf9f6` | `#0a0a0a` | page background |
| `--bg-raised` | `#f2f0ea` | `#141412` | code blocks, subtle panels |
| `--fg` | `#0a0a0a` | `#f2f1ed` | body text |
| `--fg-muted` | `#4a4a47` | `#a8a6a0` | metadata, captions, secondary text |
| `--rule` | `#d8d6d0` | `#2a2a28` | hairline borders |
| `--rule-strong` | `#b8b6ae` | `#3c3c38` | emphasized hairlines, table headers |
| `--accent` | `#b42318` | `#e5484d` | severity encoding only |

`--accent` is a controlled signal-red — chosen because red is the
semantically correct color for a security-severity scale (not an arbitrary
brand color), and it is nowhere near `#D97757`. **Severity is encoded by
intensity of this single accent, plus a mandatory text label** — never hue
alone:

- Critical → solid accent fill
- High → accent at 40% as a tint/border
- Medium → accent at 15% as a tint/border
- Low → neutral gray outline
- Info → neutral gray outline, dashed

This means the "exactly one accent" constraint holds even though the
severity scale has five steps, and the encoding survives grayscale printing.

## Type

- **Prose**: Source Serif 4 (self-hosted via `@fontsource`, variable weight,
  `font-display: swap`). Used for all reading content — the serif is what
  signals "report," not "web app."
- **Data**: IBM Plex Mono — labels, control IDs, CVSS vectors, timestamps,
  code, table contents. The serif/mono contrast is the site's one visual
  signature; every other decision stays quiet so this one reads clearly.

Scale (1.25 ratio, 16px base):

```
--fs-sm:  0.875rem
--fs-base: 1rem
--fs-lg:  1.25rem
--fs-xl:  1.75rem
--fs-2xl: 2.25rem
--fs-3xl: 3rem
```

Line height: 1.7 for prose, 1.4 for headings/mono/data.

## Layout

- Prose measure: `--measure-prose: 42rem` (~672px). Report content, blog
  posts, and case-study body copy all sit at this width.
- Wide measure: `--measure-wide: 76rem`, used for the nav/footer container
  and for tables on viewports ≥1280px, where they're allowed to break out of
  the prose column (full-bleed) via a centered negative-margin technique.
  Below that breakpoint, tables stay at prose width and scroll horizontally
  inside their own `.table-scroll` container — the page itself never
  scrolls sideways.
- Everything left-aligned. No centered paragraphs, no centered hero text.
- Hairlines only (`1px solid var(--rule)`), no box-shadows anywhere.
  Border-radius capped at `--radius: 2px`.
- Report-style numbered sections (`1.0`, `2.0`, ...) only inside case
  studies, where the content is genuinely sequential (scope → methodology →
  findings → control mapping → risk register → executive summary →
  retrospective).

## Motion

The only motion in the site: a hover-underline thickness change on links,
and a short (120ms) color transition when the theme toggles. Both are
wrapped in `@media (prefers-reduced-motion: no-preference)` and disabled
entirely for users who've asked for less motion. No entrance animations, no
parallax.

## Components as design decisions

- `DocumentMetadataHeader` — every case study opens with reference ID,
  version, date, classification, author. This is what makes the flagship
  case study read as a deliverable rather than a blog post.
- `SeverityBadge` — the single place the accent color scale lives.
- `FindingBlock` — title, severity, CVSS (mono), business impact,
  reproduction, evidence, remediation — always in that order, so a reader
  can skim to the section they care about.
- `ControlMappingTable` / `RiskRegisterTable` — full-bleed on wide screens,
  because a GRC reader scans tables, they don't read them as prose.
- Print stylesheet (`src/styles/print.css`) reproduces the "client
  deliverable" cover page, version table, and distribution list on
  `Ctrl/Cmd+P` from any case-study page — no separate hand-made PDF to keep
  in sync.

## One accepted trade-off

The CSP ships with no `unsafe-inline` for scripts or styles. The theme-init
script (prevents flash-of-wrong-theme on repeat visits) therefore runs as a
deferred external module rather than a blocking inline `<script>`, which
means a returning visitor who previously chose a non-system theme may see a
brief flash before it applies. This is accepted in exchange for a strict CSP
that blocks injected inline scripts outright — documented on `/security`.

# Aayush Shrestha — Security Consultant Portfolio

A static Astro site: penetration testing + GRC case studies, written in a
"document brutalism" style (see [DESIGN.md](./DESIGN.md)). Zero client-side
JS by default, self-hosted fonts, no third-party requests, strict security
headers. See [/security](./src/pages/security.astro) for the full rationale.

## Running locally

```bash
npm install
npm run dev
```

`npm run build` runs `astro check` (type-checking) before `astro build`.
Output goes to `dist/` as fully static files — `npm run preview` serves that
build locally.

## Adding content

Content lives in `src/content/` as Markdown/MDX, so adding a project or post
is one new file — no code changes required.

### Add a project (case study)

Create `src/content/work/<slug>.mdx` with frontmatter matching the schema in
`src/content/config.ts`:

```yaml
---
title: 'Project title'
summary: 'One-sentence summary.'
refId: 'PROJ-XXXX-01'
version: '0.1'
date: 2026-01-01
classification: 'Public — Personal Project'
author: 'Aayush Shrestha'
status: 'stub' # 'complete' | 'template' | 'stub'
tags: ['tag-one', 'tag-two']
order: 8
---
```

The flagship case study (`src/content/work/hospital-vapt.mdx`) shows how to
use the shared report components inside an MDX body:
`FindingBlock`, `SeverityBadge` (used inside `FindingBlock`),
`ControlMappingTable`, `RiskRegisterTable`. Import them at the top of the
`.mdx` file and use them like JSX tags in the markdown flow. The page itself
renders through `src/pages/work/[slug].astro`, which wraps every entry in
`CaseStudyLayout` — no per-project page code needed.

### Add a blog post

Create `src/content/writing/<slug>.md` with frontmatter matching the
`writing` schema in `src/content/config.ts` (`title`, `date`, `summary`,
`tags`, `draft`, optional `resourceUrl` for download-style posts). Rendered
through `src/pages/writing/[slug].astro` + `PostLayout`.

### Update owner details

Name, email, GitHub, LinkedIn, CV path, and location live in one place:
`src/lib/site.ts`. Certifications are a plain content block in
`src/pages/certifications.astro` — edit the table directly.

### Drop in your CV

Place the PDF at `public/cv.pdf` — the header's "Download CV" link and the
Contact page both point at `/cv.pdf` already.

## Deploying

Static output (`output: 'static'` in `astro.config.mjs`) works on either:

- **Cloudflare Pages** — build command `npm run build`, output directory
  `dist`. Security headers ship via `public/_headers` (copied to the site
  root at build time).
- **Netlify** — `netlify.toml` at the repo root already sets the build
  command, publish directory, and the same headers.

Before going live:

1. Replace `site` in `astro.config.mjs` with the real production domain.
2. Update the `Canonical` line (and the mirrored root copy) in
   `public/.well-known/security.txt` / `public/security.txt` to match.
3. Drop `public/cv.pdf` in place.
4. Fill in the certifications table and the `TODO` blocks on About,
   Experience, and Contact.

## Known constraint: Astro version pinned below latest

Astro ≥7.2.0 (the release that patches several disclosed high-severity XSS/
SSRF advisories) requires Node ≥22.12. This repo was scaffolded on Node
20.20.2, so `astro` / `@astrojs/mdx` are pinned to the last majors that
still support Node 20 (`astro@^5.18.2`, `@astrojs/mdx@^4.3.14`) rather than
true "latest."

**TODO**: once this machine (or the deploy environment) is on Node ≥22.12,
run:

```bash
npm install astro@latest @astrojs/mdx@latest
```

and re-run `npm run build` to confirm nothing broke, then remove this note.
The CVEs in the pinned version target features this site doesn't use
(hydrated framework islands, `define:vars`, view-transitions) — see
`npm audit` for the current list.

## Stack

- [Astro](https://astro.build) (static output, content collections)
- `@astrojs/mdx` for project/post authoring
- `@fontsource/source-serif-4` + `@fontsource/ibm-plex-mono`, self-hosted
- TypeScript, no UI framework — the only client JS is two small vanilla
  scripts (mobile nav toggle, theme toggle)

## What's real vs. placeholder right now

Owner identity, education, and site structure are real. Certifications, PGP
key, employment role/dates, and most case-study content (everything except
the format/structure) are intentionally left as `TODO` blocks rather than
invented — search the codebase for `TODO` to find every one.

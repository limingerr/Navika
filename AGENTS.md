# AGENTS.md

NAVIKA: a student opportunity finder (beasiswa / magang / bootcamp). The repo root holds the static HTML5 clickable prototype (22 pages, Indonesian UI, `lang="id"`) kept as the migration reference; the rewrite lives in `navika/` (Next.js). Keep copy and comments in Indonesian. `README.md` is a joke placeholder; the real spec is `PRD-NAVIKA.md` (also Indonesian).

## Repo facts

- Prototype (root, `*.html`): no package.json, no tests, no dev server, no build step. JavaScript is now allowed (owner decision); behavior lives in `script/` files, currently `script/dashboard.js` for month navigation and the date agenda on `dashboard.html` while the other 21 pages stay static. Open any `.html` directly in a browser to preview.
- Prototype styling: only `dashboard.html` is styled, via `style/dashboard.css` — the prototype's only CSS file (Indonesian comments, Poppins, WCAG-adjusted colors). The other 21 pages render with browser defaults.
- `dashboard.html` and `style/` hold uncommitted/untracked work: a hand-done semantic refactor that is the reference pattern for the rest (semantic landmarks, inline SVG instead of icon images, relative `asset/...` paths, hover feedback transitions only, no decorative animation). Check `git status` / `git diff` before touching it.
- Layout refactor in progress: `kalender.html` and `lihatSemua.html` still use `<table>` for layout; the other 20 pages are plain semantic HTML5. Don't introduce inline styles, presentational attributes, or new layout tables — continue the semantic direction.
- Asset paths vary by page (`asset/...` vs `./asset/...`); keep the style of the file you edit. Only `lihatSemua.html` still uses root-absolute `/asset/...`, which breaks on `file://`.
- Indentation is not uniform (2 spaces in some files, 4 in others); match the file you edit.
- The 7 `detail-<slug>.html` pages are hand-copied versions of the same card structure, written near-minified (one tag per line, no indentation). Duplication is expected; there are no shared components, partials, or templates.

## Next.js app (`navika/`)

- Fresh scaffold, only the default starter page: Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4, managed with npm. The PRD §4.6 routes are not built yet.
- Commands run from `navika/`: `npm run dev` (localhost:3000), `npm run build`, `npm run lint`.
- `navika/AGENTS.md` is auto-written by Next 16 and requires reading `node_modules/next/dist/docs/` before writing code — this Next version's APIs and conventions differ from older ones. Follow it inside that folder.
- Tailwind is the chosen styling; PRD §4.1 was updated to match (v1.3).
- Never run `npm audit fix --force`: it would downgrade Next to v14. The 5 high findings are dev-only (ESLint chain).

## Reference material (inputs to the PRD, not app code)

- `export/` — 63 PNG mockups (light/dark) mapped to screens in PRD §2.5; `laporan.pdf` — the Module 5 report the PRD is based on; `contoh desain/` — 2 design-example JPGs. Their dates, names, and counts are examples, not real data (PRD §2.8, §4.6 step 3).

## Known mockup gaps — don't "fix" these silently

- 12 referenced targets don't exist: `pencarian.html`, `lihatBeasiswa.html`, `lihatMagang.html`, `lihatBootcamp.html`, `semua-peluang.html` (GET target of the `lihatSemua.html` search form), `logout.html`, `notifikasi.html`, `bahasa.html`, `bantuan.html`, `privasi.html`, `tentang.html`, and `edit-profile.html` (the real page is `editprofile.html`). ~36 other links are `href="#"`.
- Forms only navigate via GET (`login.html` -> `dashboard.html`, `register.html` -> `verifikasi.html`, `editprofile.html` -> `pengaturan.html`, `tema.html` -> `#`). There is no auth, storage, or validation code.
- Demo identities are inconsistent placeholders ("Fajar Pelari Kalcer" on profile/pengaturan, "Ayip batagor" on dashboard, "Fajar Batagor" on editprofile) and deadlines ("Oktober, 2026") are fictional; PRD §4.2 forbids treating them as real catalog/user data.

## Direction of the rewrite (from PRD-NAVIKA.md)

- Stack: Next.js 16 + TypeScript, scaffolded in `navika/`. P0 scope: auth, profile, Finder, detail, Match, bookmark, tracker/calendar, catalog.
- Match must stay deterministic and explainable per dimension; the PRD explicitly rules out AI for the MVP.
- PRD §4.6 step 1 has the page-to-route mapping; step 2 warns not to equate HTML file names with future business IDs.
- `style/dashboard.css` tokens deliberately differ from the PRD §2.6 palette (darkened for WCAG AA contrast; stated in its comments). Don't "restore" the PRD hex values without review.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `.agents/skills/antislop/SKILL.md` (core) and then the skill for the task:
- UI / visual: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `.agents/skills/antislop-copywriting/SKILL.md`
- People: `.agents/skills/antislop-human/SKILL.md`
- Mobile / responsive: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `.agents/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: replace the core and skill folders from the release matching it, or run `npx antislop-ai --update` if it was installed as skill folders.
<!-- antislop:end -->

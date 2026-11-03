# Chengxin Shi — Academic Homepage

A static, English-language academic profile for Chengxin Shi (石成鑫), M.S. student in
Civil Engineering at Chongqing University. Plain HTML, CSS, and a small vanilla-JS file —
no build step, no dependencies, no analytics.

## Design

- **Palette** — warm paper (`#f7f4ee`), near-black ink, and a single ink-blue accent
  (`#24527f`). All colours live as custom properties at the top of `style.css`.
- **Type** — Newsreader for display and citation lines, Inter for text and UI. Both are
  self-hosted variable fonts in `assets/fonts/` (latin subset), so the page makes no
  third-party requests and renders identically offline.
- **Layout** — a 1100 px editorial column with a fluid type scale, hairline rules, and
  generous section rhythm. Cards, pills, metrics, and tags are shared components.
- **Dark mode** — follows the system preference on first visit, can be toggled in the
  header, and the choice is stored in `localStorage` (`cs-theme`).
- **Extras** — sticky header with scroll state and active-section nav, certificate
  lightbox (arrow keys / Esc), copy-email button, and video playback-speed control.

## Preview locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly in a browser also works.

## Sections

- Hero and short bio
- Education
- Research in Progress
- Publications & Manuscripts
- Competitions & Projects (with demonstration video)
- Honors, interests, and certificate gallery

## Editing

- **Content** — edit `index.html`. Keep the class names if you want the existing styling.
- **Colours and spacing** — edit the token block at the top of `style.css`; both themes are
  defined there.
- **Behaviour** — `script.js` holds the theme toggle, mobile menu, active-nav observer,
  video speed buttons, copy-email action, and certificate viewer.
- **Images** — `assets/profile-photo.jpg` is the portrait (3:4 works best); research
  diagrams are in `assets/paper/`; award scans are in `assets/awards/`; the competition
  video is `assets/competition/smart-city-project.mp4`.
- **Fonts** — to change the typefaces, replace the `.woff2` files in `assets/fonts/` and
  update the `@font-face` blocks and the `--serif` / `--sans` tokens.

## Before publishing

Review paper titles, author order, venues, and statuses against the latest CV. Then commit
and push; GitHub Pages serves the repository root.

The page has no analytics, embedded services, or GitHub Pages workflow.

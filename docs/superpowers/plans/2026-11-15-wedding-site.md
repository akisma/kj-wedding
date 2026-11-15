# Jess & Kathy Wedding Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A one-page wedding site at `jessandkathy.com` that Jess updates by editing one file and pushing.

**Architecture:** A static Vite + React page. All wording lives in `src/content.ts`; `App.tsx` only lays it out. A GitHub Actions workflow tests, builds and publishes to GitHub Pages on every push to `main`.

**Tech Stack:** Vite 8, React 19, TypeScript, Tailwind CSS 4 (`@tailwindcss/vite`), Fontsource fonts, Vitest + Testing Library, `sharp` (photo prep only), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-15-wedding-site-design.md`

## Global Constraints

- Colors: navy `#1f2a44` (text, button), blush `#d59c8a` (accents), paper `#f8f5f1` (background).
- Fonts: Cormorant Garamond for all text; Pinyon Script for the names only. Bundled via Fontsource, no requests to Google at view time.
- No wording, date, or URL is hard-coded in a component. It comes from `src/content.ts`.
- RSVP URL, exactly: `https://docs.google.com/forms/d/e/1FAIpQLSfrWGsr7PeahjrNaB7Ew9JtQsZLWcTtw163108XhrFjM_4yig/viewform`
- The date and venue do not appear in the header, only in the event lines.
- The repo is public: no photo goes in with embedded location or camera data.
- `index.html` carries `<meta name="robots" content="noindex">`.
- Vite `base` stays at the default `/` (custom domain).
- Work happens on branch `build-site`. Nothing is pushed to `main`, and no GitHub or DNS setting is changed, without Jess's go-ahead at that step.
- One change from the spec: with an Actions-based Pages deploy, the custom domain is set in the repo's Pages settings, not by a `CNAME` file. No `CNAME` file is added.

## Review Focus

- An event with no location (the welcome party today) renders no empty line or stray separator. Tested in Task 2.
- The RSVP link opens in a new tab and carries `rel="noopener noreferrer"`. Tested in Task 2.
- The script names fit on a 320px-wide phone without overflowing or wrapping mid-name. Not testable in jsdom; checked by eye in Task 2, Step 7.
- The photo is light enough for a phone on cellular: the largest file under 400 KB, with a smaller size offered via `srcset`. Asserted by the prep script in Task 2.
- A link pasted into a text message shows the photo and "Jess & Kathy". Needs an absolute `og:image` URL; tested for presence in Task 2, checked for real after go-live in Task 4.

---

### Task 1: Project scaffold, theme, and test setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/index.css`, `src/App.tsx` (template placeholder), `src/test-setup.ts`
- Modify: `.gitignore` (add `.superpowers/`)

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm test` (runs `vitest run`); Tailwind utilities `text-navy`, `bg-navy`, `bg-paper`, `text-paper`, `bg-blush`, `font-serif`, `font-script`.

- [ ] **Step 1: Branch**

```bash
git checkout -b build-site
```

- [ ] **Step 2: Scaffold the Vite React TypeScript template**

`npm create vite` refuses a non-empty folder without prompting, so scaffold into a temp folder and copy in. Keep the repo's existing `.gitignore` and `README.md`.

```bash
SCRATCH=$(mktemp -d)
npm create vite@latest "$SCRATCH/kj-scaffold" -- --template react-ts
rsync -a --exclude .gitignore --exclude README.md "$SCRATCH/kj-scaffold/" .
npm install
```

Delete the template's demo content: `src/App.css`, `src/assets/*`, `public/*`.

- [ ] **Step 3: Add dependencies**

```bash
npm install tailwindcss @tailwindcss/vite @fontsource/cormorant-garamond @fontsource/pinyon-script
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom sharp
```

- [ ] **Step 4: Configure Vite, Tailwind, and Vitest**

`vite.config.ts`: import `defineConfig` from `vitest/config`; plugins `react()` and `tailwindcss()`; `test: { environment: 'jsdom', setupFiles: './src/test-setup.ts' }`.

`src/test-setup.ts`: `import '@testing-library/jest-dom/vitest'`.

`package.json` scripts: add `"test": "vitest run"`.

`src/index.css`, in full:

```css
@import "tailwindcss";

@theme {
  --color-navy: #1f2a44;
  --color-blush: #d59c8a;
  --color-paper: #f8f5f1;
  --font-serif: "Cormorant Garamond", Georgia, serif;
  --font-script: "Pinyon Script", cursive;
}
```

`src/main.tsx`: import `@fontsource/cormorant-garamond/400.css`, `/400-italic.css`, `/500.css`, and `@fontsource/pinyon-script/400.css` ahead of `./index.css`.

Append `.superpowers/` to `.gitignore`.

- [ ] **Step 5: Verify**

Run: `npm run build && npm test -- --passWithNoTests`
Expected: build writes `dist/`, both exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Vite, React, Tailwind and test setup"
```

---

### Task 2: Content file, photo, and the page

**Files:**
- Create: `src/content.ts`, `src/App.test.tsx`, `scripts/prepare-photo.mjs`, `src/assets/couple-1600.jpg`, `src/assets/couple-800.jpg`, `public/og.jpg`
- Modify: `src/App.tsx`, `index.html`

**Interfaces:**
- Produces, from `src/content.ts`:

```ts
export interface WeddingEvent { label: string; date: string; location?: string }
export interface SiteContent {
  names: string
  lead: string
  photoAlt: string
  events: WeddingEvent[]
  note: string
  rsvp: { label: string; url: string }
}
export const content: SiteContent
```

- [ ] **Step 1: Write `src/content.ts`** with the interface above and these exact values:

```ts
export const content: SiteContent = {
  names: 'Jess & Kathy',
  lead: 'are getting married',
  photoAlt: 'Jess and Kathy on the beach at dusk',
  events: [
    { label: 'Welcome party', date: 'March 18, 2027' },
    { label: 'Ceremony & reception', date: 'March 19, 2027', location: 'Descanso Gardens' },
  ],
  note: 'More details to come.',
  rsvp: {
    label: 'RSVP',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfrWGsr7PeahjrNaB7Ew9JtQsZLWcTtw163108XhrFjM_4yig/viewform',
  },
}
```

- [ ] **Step 2: Write the failing tests** in `src/App.test.tsx`

```tsx
import { readFileSync } from 'node:fs'
import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'
import { content } from './content'

test('header shows the names and lead, without date or venue', () => {
  render(<App />)
  const header = screen.getByRole('banner')
  expect(within(header).getByRole('heading', { level: 1 })).toHaveTextContent('Jess & Kathy')
  expect(within(header).getByText('are getting married')).toBeInTheDocument()
  expect(header).not.toHaveTextContent('March')
  expect(header).not.toHaveTextContent('Descanso')
})

test('lists each event once with its date', () => {
  render(<App />)
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(content.events.length)
  expect(items[0]).toHaveTextContent('Welcome party')
  expect(items[0]).toHaveTextContent('March 18, 2027')
  expect(items[1]).toHaveTextContent('Ceremony & reception')
  expect(items[1]).toHaveTextContent('March 19, 2027')
  expect(items[1]).toHaveTextContent('Descanso Gardens')
})

test('an event without a location renders only its label and date', () => {
  render(<App />)
  const welcome = screen.getAllByRole('listitem')[0]
  expect(welcome.children).toHaveLength(2)
})

test('RSVP opens the Google Form in a new tab', () => {
  render(<App />)
  const link = screen.getByRole('link', { name: 'RSVP' })
  expect(link).toHaveAttribute('href', content.rsvp.url)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

test('shows the photo with alt text and the more-details note', () => {
  render(<App />)
  expect(screen.getByAltText('Jess and Kathy on the beach at dusk')).toBeInTheDocument()
  expect(screen.getByText('More details to come.')).toBeInTheDocument()
})

test('index.html hides the site from search and sets up link previews', () => {
  const html = readFileSync('index.html', 'utf8')
  expect(html).toContain('<meta name="robots" content="noindex"')
  expect(html).toContain('<title>Jess &amp; Kathy</title>')
  expect(html).toContain('property="og:image" content="https://jessandkathy.com/og.jpg"')
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL (template `App` has none of this content).

- [ ] **Step 4: Prepare the photo**

Write `scripts/prepare-photo.mjs`, run as `node scripts/prepare-photo.mjs <source.jpg>`. Using `sharp` (which drops metadata unless told to keep it) with `.rotate()` first so orientation is baked in, it writes:

- `src/assets/couple-1600.jpg`: 1600px wide, JPEG quality 78
- `src/assets/couple-800.jpg`: 800px wide, JPEG quality 78
- `public/og.jpg`: 1200x630, `fit: 'cover'`, `position: 'attention'`

After writing, for each output it reads `sharp(file).metadata()` and exits non-zero if `exif` is defined or if a `couple-*` file is 400 KB or larger.

Run: `node scripts/prepare-photo.mjs ~/Downloads/IMG_2727.jpg`
Expected: three files written, exit 0. Open `public/og.jpg` and confirm both faces are in the crop; if not, change `position` to `'centre'` or an explicit region and rerun.

- [ ] **Step 5: Implement `src/App.tsx` and `index.html`**

`App.tsx`, default export `App(): JSX.Element`, reading everything from `content`. Structure, matching the approved mockup:

- `<main>` with `bg-paper text-navy font-serif text-center`, content in a centered column of `max-w-xl`.
- `<img>` first: `src` the 1600 file, `srcSet` both files with `800w`/`1600w`, `sizes="(min-width: 36rem) 36rem, 100vw"`, `alt={content.photoAlt}`, explicit `width`/`height`, 4:3, `object-cover`.
- `<header>`: `<h1 className="font-script ...">` with the names, sized `text-[clamp(2.75rem,13vw,4rem)]` and `whitespace-nowrap`; then the lead in italic.
- A short blush rule (`h-px w-12 bg-blush`).
- `<ul>` of events. Each `<li>` has exactly: a label `<span>` (small, uppercase, wide tracking), a date `<span>` (larger, weight 500), and a location `<span>` only when `location` is set. All `block`.
- The note in italic at reduced opacity.
- The RSVP `<a>`: `bg-navy text-paper`, uppercase, wide tracking, `target="_blank"`, `rel="noopener noreferrer"`, with a visible focus ring.

`index.html` `<head>`: `<title>Jess &amp; Kathy</title>`; `<meta name="robots" content="noindex">`; `<meta name="description" content="Jess and Kathy are getting married. March 19, 2027, Descanso Gardens.">`; `og:title` "Jess & Kathy", `og:description` same as description, `og:image` `https://jessandkathy.com/og.jpg`, `og:url` `https://jessandkathy.com/`, `og:type` `website`; `<meta name="theme-color" content="#f8f5f1">`. Remove the template's Vite favicon link.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test && npm run build`
Expected: 6 tests pass; build exits 0.

- [ ] **Step 7: Look at it**

Run `npm run dev` and open the page at 320px, 390px, and desktop widths. Confirm: names on one line with no horizontal scroll at 320px; photo sharp; layout matches mockup `page-v3`. Show Jess the dev URL.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add wedding page, content file and photo"
```

---

### Task 3: Publish workflow and README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: `npm ci`, `npm test`, `npm run build` (output in `dist/`).

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

Start from the workflow in Vite's "Deploying a Static Site → GitHub Pages" guide (https://vite.dev/guide/static-deploy#github-pages), copying its current action versions. Keep: trigger on push to `main` plus `workflow_dispatch`; permissions `contents: read`, `pages: write`, `id-token: write`; concurrency group `pages`; Node `lts/*` with npm cache; upload path `./dist`. Add one step, `npm test`, between "Install dependencies" and "Build".

- [ ] **Step 2: Write `README.md`**

Three short sections: **Updating the site** (edit `src/content.ts`, commit, push to `main`, live in about a minute; how to add an event or a location), **Changing the photo** (`node scripts/prepare-photo.mjs <file>`, why not to copy a photo in directly), **Running locally** (`npm install`, `npm run dev`, `npm test`).

- [ ] **Step 3: Verify and commit**

Run: `npm test && npm run build`
Expected: pass.

```bash
git add -A
git commit -m "Add GitHub Pages deploy workflow and README"
```

---

### Task 4: Go live (each step needs Jess's go-ahead)

**Files:** none.

- [ ] **Step 1: Turn on Pages with Actions as the source**

```bash
gh api -X POST repos/akisma/kj-wedding/pages -f build_type=workflow
```

- [ ] **Step 2: Merge and push**

```bash
git checkout main && git merge --ff-only build-site && git push origin main
gh run watch
```

Expected: the workflow run succeeds. `https://akisma.github.io/kj-wedding/` loads the HTML (styles will be missing there because `base` is `/`; that is expected until the domain is attached).

- [ ] **Step 3: Attach the domain**

```bash
gh api -X PUT repos/akisma/kj-wedding/pages -f cname=jessandkathy.com
```

- [ ] **Step 4: DNS records in DNSimple (Jess, or Claude driving the browser with Jess watching)**

On `jessandkathy.com`, add:

| Type | Name | Content |
|---|---|---|
| ALIAS | (blank, the bare domain) | `akisma.github.io` |
| CNAME | `www` | `akisma.github.io` |

Verify: `dig +short jessandkathy.com A` returns GitHub Pages addresses (`185.199.108.153` to `185.199.111.153`); `dig +short www.jessandkathy.com` returns `akisma.github.io.`

- [ ] **Step 5: HTTPS**

Wait for the certificate (minutes to an hour): `gh api repos/akisma/kj-wedding/pages --jq .https_certificate.state` returns `approved`. Then:

```bash
gh api -X PUT repos/akisma/kj-wedding/pages -F https_enforced=true
```

- [ ] **Step 6: Final check**

`curl -sI https://jessandkathy.com` returns 200; `curl -sI http://www.jessandkathy.com` redirects to `https://jessandkathy.com/`. Open the site on a phone, tap RSVP, and paste the link into a text message to confirm the preview shows the photo and names.

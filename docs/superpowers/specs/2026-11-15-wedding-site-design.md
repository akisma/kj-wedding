# Jess & Kathy wedding site: design

Date: 2026-11-15
Status: awaiting Jess's approval

## Intent

A single page that tells guests Jess and Kathy are getting married, gives
the two dates and the venue, and sends them to a Google Form to RSVP. More
details get added over the coming months, so changing the wording has to be
quick for Jess.

## What's on the page

Top to bottom, as approved in the mockup (`page-v3`):

1. The beach photo, full width.
2. "Jess & Kathy" in script, then "are getting married".
3. Welcome party: March 18, 2027.
4. Ceremony & reception: March 19, 2027, Descanso Gardens.
5. "More details to come."
6. RSVP button, opening the Google Form in a new tab:
   `https://docs.google.com/forms/d/e/1FAIpQLSfrWGsr7PeahjrNaB7Ew9JtQsZLWcTtw163108XhrFjM_4yig/viewform`

The date and venue are not repeated in the header.

## Look

- Readable text: Cormorant Garamond (Jess picked pairing A).
- Names: Pinyon Script, a stand-in until the invitation font is identified.
  Swapping it is a one-line change.
- Colors, taken from the photo: navy `#1f2a44` for text and the button,
  blush `#d59c8a` for accents, warm off-white `#f8f5f1` for the background.
- Centered single column that reads well on a phone first.

## Goals

- Jess updates wording by editing one file and pushing.
- Free hosting on the existing domain, with HTTPS.
- Loads fast on a phone; link previews in texts show the photo and names.

## Not doing

- No RSVP handling on the site; the Google Form owns that.
- No editing screen, login, or guest password.
- No extra pages yet. New details are added as sections on the same page.

## Approaches considered

Hosting:

- **GitHub Pages (picked by Jess).** The repo is already on GitHub; a
  GitHub Action publishes on every push to `main`. No new account. On a
  free plan the repo must be public.
- Netlify. Same push-to-publish flow plus private repos and preview links,
  at the cost of one more account.
- Cloudflare Pages. Using the bare domain would mean moving DNS off
  DNSimple; dropped.

Updating:

- **One content file in the repo (picked).** Only Jess edits, so nothing
  more is needed.
- A browser editing screen. Only worth it if someone non-technical edits.

## How it's built

Jess chose Vite, React and Tailwind. The rest are Claude's calls:

- TypeScript, Tailwind v4 through its Vite plugin.
- All wording, dates, and the RSVP link live in `src/content.ts`. Components
  only lay it out. Adding a detail later means adding an entry there.
- Fonts are bundled with the site (Fontsource packages) so nothing loads
  from Google at view time.
- The photo is resized to web sizes and stripped of its embedded location
  and camera data before it goes in the repo, since the repo is public.
- Search engines are asked not to index the page (`noindex`). Guests get
  the link from you; strangers don't find it by searching your names.
- A GitHub Actions workflow builds and publishes to Pages on push to `main`.
- Checks: type-check and build must pass in the workflow before publishing,
  plus one small test that the page shows the names, both events, and an
  RSVP link pointing at the form.

## Domain

The site lives at `jessandkathy.com`. Claude's call: the bare domain is the
main address and `www.jessandkathy.com` redirects to it, which GitHub Pages
does on its own once both records exist.

- A `CNAME` file in the site sets `jessandkathy.com` as the custom domain
  for Pages.
- In DNSimple: an ALIAS record on the bare domain and a CNAME on `www`,
  both pointing at `akisma.github.io`. Jess adds these (or Claude walks
  through it); they're the only step outside the repo.
- Turn on "Enforce HTTPS" in the repo's Pages settings once the
  certificate is issued.

## Open

- The invitation script font.

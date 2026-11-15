# kj-wedding

The site at [jessandkathy.com](https://jessandkathy.com). One page, built with Vite, React and Tailwind, published by GitHub Pages.

## Updating the site

Everything guests read lives in [`src/content.ts`](src/content.ts). Edit it, commit, and push to `main`. The site updates itself in about a minute.

- **Add an event:** add a line to `events`, e.g. `{ label: 'Brunch', date: 'March 20, 2027' }`.
- **Add a location to an event:** add `location: 'Somewhere'` to its line. Events without one show just the label and date.
- **Change the RSVP form:** replace `rsvp.url`.

If a push doesn't show up, check the Actions tab on GitHub. The publish step only runs when the tests and build pass.

## Changing the photo

```
node scripts/prepare-photo.mjs ~/Downloads/new-photo.jpg
```

This writes the two page sizes and the link-preview image. Don't copy a photo into the repo directly: the repo is public, and phone photos carry embedded location data that the script removes.

## Running locally

```
npm install
npm run dev     # preview at http://localhost:5173
npm test
```

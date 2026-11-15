import { readFileSync } from 'node:fs'
import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'
import { content, type SiteContent } from './content'

// The page tests use their own wording, so editing src/content.ts never
// breaks them. The checks on the real content are at the bottom.
const sample: SiteContent = {
  names: 'Ada & Grace',
  lead: 'are throwing a party',
  photoAlt: 'Ada and Grace laughing',
  events: [
    { label: 'Picnic', date: 'June 1, 2030' },
    { label: 'Dinner', date: 'June 2, 2030', location: 'The Old Mill' },
  ],
  note: 'Bring a sweater.',
  rsvp: { label: 'Reply', url: 'https://example.com/form' },
}

test('header shows the names and lead, without dates or venue', () => {
  render(<App site={sample} />)
  const header = screen.getByRole('banner')
  expect(within(header).getByRole('heading', { level: 1 })).toHaveTextContent('Ada & Grace')
  expect(within(header).getByText('are throwing a party')).toBeInTheDocument()
  expect(header).not.toHaveTextContent('June')
  expect(header).not.toHaveTextContent('The Old Mill')
})

test('lists each event once with its date and location', () => {
  render(<App site={sample} />)
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(2)
  expect(items[0]).toHaveTextContent('Picnic')
  expect(items[0]).toHaveTextContent('June 1, 2030')
  expect(items[1]).toHaveTextContent('Dinner')
  expect(items[1]).toHaveTextContent('June 2, 2030')
  expect(items[1]).toHaveTextContent('The Old Mill')
})

test('an event without a location renders only its label and date', () => {
  render(<App site={sample} />)
  const [picnic, dinner] = screen.getAllByRole('listitem')
  expect(picnic.children).toHaveLength(2)
  expect(dinner.children).toHaveLength(3)
})

test('the RSVP link opens its URL in a new tab', () => {
  render(<App site={sample} />)
  const link = screen.getByRole('link', { name: 'Reply' })
  expect(link).toHaveAttribute('href', 'https://example.com/form')
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

test('shows the photo with alt text and the note', () => {
  render(<App site={sample} />)
  expect(screen.getByAltText('Ada and Grace laughing')).toBeInTheDocument()
  expect(screen.getByText('Bring a sweater.')).toBeInTheDocument()
})

test('with no site given, the page shows the real content', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.names)
})

test('the real content is complete and the RSVP link is a Google Form', () => {
  expect(content.names).not.toBe('')
  expect(content.photoAlt).not.toBe('')
  expect(content.events.length).toBeGreaterThan(0)
  for (const event of content.events) {
    expect(event.label).not.toBe('')
    expect(event.date).not.toBe('')
  }
  expect(content.rsvp.url).toMatch(/^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]{20,}\/viewform$/)
})

test('index.html hides the site from search and sets up link previews', () => {
  const html = readFileSync('index.html', 'utf8')
  expect(html).toContain('<meta name="robots" content="noindex"')
  expect(html).toContain('<title>Jess &amp; Kathy</title>')
  expect(html).toContain('property="og:image" content="https://jessandkathy.com/og.jpg"')
})

test('index.html links a favicon that exists', () => {
  const html = readFileSync('index.html', 'utf8')
  expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg"')
  expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png"')
  expect(readFileSync('public/favicon.svg', 'utf8')).toContain('<svg')
  expect(readFileSync('public/apple-touch-icon.png').length).toBeGreaterThan(0)
})

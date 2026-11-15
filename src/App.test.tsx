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

test('index.html links a favicon that exists', () => {
  const html = readFileSync('index.html', 'utf8')
  expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg"')
  expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png"')
  expect(readFileSync('public/favicon.svg', 'utf8')).toContain('<svg')
  expect(readFileSync('public/apple-touch-icon.png').length).toBeGreaterThan(0)
})

// Everything guests read on the site lives here.
// Edit, commit, and push to main to update the live page.

export interface WeddingEvent {
  label: string
  date: string
  location?: string
}

export interface SiteContent {
  names: string
  lead: string
  photoAlt: string
  events: WeddingEvent[]
  note: string
  rsvp: { label: string; url: string }
}

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

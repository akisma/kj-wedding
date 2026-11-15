import couple1600 from './assets/couple-1600.jpg'
import couple800 from './assets/couple-800.jpg'
import { content } from './content'

function App() {
  return (
    <div className="mx-auto min-h-svh max-w-xl bg-paper pb-16 text-center font-serif text-xl text-navy">
      <header>
        <img
          src={couple1600}
          srcSet={`${couple800} 800w, ${couple1600} 1600w`}
          sizes="(min-width: 36rem) 36rem, 100vw"
          width={1600}
          height={1200}
          alt={content.photoAlt}
          className="aspect-4/3 w-full object-cover"
        />
        <h1 className="mt-8 font-script text-[clamp(2.75rem,13vw,4rem)] leading-tight whitespace-nowrap">
          {content.names}
        </h1>
        <p className="text-2xl italic">{content.lead}</p>
      </header>

      <main className="px-6">
        <div className="mx-auto my-7 h-px w-12 bg-blush" />

        <ul className="space-y-6">
          {content.events.map((event) => (
            <li key={event.label}>
              <span className="block text-sm tracking-[0.18em] uppercase">{event.label}</span>
              <span className="block text-2xl font-medium">{event.date}</span>
              {event.location && <span className="block">{event.location}</span>}
            </li>
          ))}
        </ul>

        <p className="mt-6 italic opacity-80">{content.note}</p>

        <a
          href={content.rsvp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-xs bg-navy px-10 py-3 text-lg tracking-[0.2em] text-paper uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
        >
          {content.rsvp.label}
        </a>
      </main>
    </div>
  )
}

export default App

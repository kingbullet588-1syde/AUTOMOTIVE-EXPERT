import React from 'react'

const { useEffect, useMemo, useState } = React

const PHONE = '256780963633'
const DISPLAY_PHONE = '+256 780 963 633'
const ALT_PHONE = '+256 752 561 372'
const TRACKER_KEY = 'automotive-expert-health-check'

const services = [
  ['01', 'Engine Repair', 'Power, performance and reliability restored with a methodical approach.'],
  ['02', 'Brakes & Suspension', 'Confident stopping and a composed ride, from city streets to long trips.'],
  ['03', 'A/C Service & Repair', 'Cool, clean air and a cabin that feels right in every season.'],
  ['04', 'Diagnostics', 'Find the cause, not just the warning light. Clear answers before work begins.'],
  ['05', 'Preventive Maintenance', 'The small, timely checks that protect your biggest investment.'],
  ['06', 'Tyres, Alignment & Balancing', 'Straight tracking, even wear and a smoother drive.'],
]

const defaultForm = {
  make: '',
  model: '',
  year: '',
  odometer: '',
  lastService: '',
  dailyKm: '',
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-UG', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function calculateHealth(form) {
  const odo = Number(form.odometer)
  const daily = Number(form.dailyKm)
  const last = form.lastService ? new Date(`${form.lastService}T12:00:00`) : null
  if (!odo || !daily || !last || Number.isNaN(last.getTime())) return null

  const kmDate = new Date(last)
  kmDate.setDate(kmDate.getDate() + Math.ceil(10000 / daily))
  const timeDate = new Date(last)
  timeDate.setDate(timeDate.getDate() + 180)
  const nextDate = kmDate < timeDate ? kmDate : timeDate
  const nextOdo = odo + 10000
  const today = new Date()
  const dateProgress = Math.max(0, (today - last) / (timeDate - last))
  const kmProgress = Math.max(0, (odo + daily * Math.max(0, (today - last) / 86400000) - odo) / 10000)
  const progress = Math.max(dateProgress, kmProgress)
  const status = progress >= 1 ? 'red' : progress >= 0.75 ? 'yellow' : 'green'
  return { nextDate, nextOdo, status, progress: Math.min(progress, 1) }
}

function Icon({ name }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" /></>,
    chat: <><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.6 9.6 0 0 1-4-.9L3 21l1.9-4.4A8.4 8.4 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">{paths[name]}</svg>
}

function HealthTracker({ open, onClose }) {
  const [form, setForm] = useState(defaultForm)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(TRACKER_KEY)
    if (saved) setForm({ ...defaultForm, ...JSON.parse(saved) })
  }, [])

  useEffect(() => {
    if (open) setSubmitted(false)
  }, [open])

  const result = useMemo(() => calculateHealth(form), [form])
  if (!open) return null

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const handleSubmit = (event) => {
    event.preventDefault()
    localStorage.setItem(TRACKER_KEY, JSON.stringify(form))
    setSubmitted(true)
  }
  const bookingText = `Hello Automotive Expert, I would like to book a service health check for my ${form.year} ${form.make} ${form.model}. Current mileage: ${Number(form.odometer).toLocaleString()} km.`
  const whatsappUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(bookingText)}`

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="tracker-modal" role="dialog" aria-modal="true" aria-labelledby="tracker-title">
        <button className="modal-close" onClick={onClose} aria-label="Close car health tracker">×</button>
        <div className="tracker-intro">
          <span className="eyebrow">A clearer next step</span>
          <h2 id="tracker-title">Know when your car needs care.</h2>
          <p>Enter a few details and we’ll estimate your next service window using the 10,000 km or 180-day rule.</p>
        </div>
        {!submitted ? (
          <form className="tracker-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>Make<input required value={form.make} onChange={update('make')} placeholder="Toyota" /></label>
              <label>Model<input required value={form.model} onChange={update('model')} placeholder="Harrier" /></label>
              <label>Year<input required type="number" min="1950" max="2030" value={form.year} onChange={update('year')} placeholder="2018" /></label>
              <label>Current odometer (km)<input required type="number" min="0" value={form.odometer} onChange={update('odometer')} placeholder="82,400" /></label>
              <label>Last service date<input required type="date" value={form.lastService} onChange={update('lastService')} /></label>
              <label>Average daily km<input required type="number" min="1" value={form.dailyKm} onChange={update('dailyKm')} placeholder="35" /></label>
            </div>
            <button className="button button-gold tracker-submit" type="submit">Calculate my service window <Icon name="arrow" /></button>
          </form>
        ) : (
          <div className="tracker-result">
            <div className={`status-orb ${result?.status || 'green'}`}><Icon name="check" /></div>
            <span className={`status-label ${result?.status || 'green'}`}>{result?.status === 'red' ? 'Service due now' : result?.status === 'yellow' ? 'Service soon' : 'You’re on track'}</span>
            <h3>{result ? `Next service by ${formatDate(result.nextDate)}` : 'Your service window is ready'}</h3>
            <p>{result ? `Whichever comes first: ${result.nextOdo.toLocaleString()} km or ${formatDate(result.nextDate)}.` : 'Share your details with our team and we’ll help you plan the right visit.'}</p>
            <div className="result-actions">
              <a className="button button-gold" href={whatsappUrl} target="_blank" rel="noreferrer">Book on WhatsApp <Icon name="chat" /></a>
              <button className="button button-quiet" onClick={() => setSubmitted(false)}>Edit details</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function App() {
  const [trackerOpen, setTrackerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const openTracker = () => { setTrackerOpen(true); setMenuOpen(false) }
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Automotive Expert home">
          <img src="/assets/automotive-experts-logo.jpg" alt="" />
          <span><strong>Automotive</strong><em>Expert</em></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">Menu</button>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <button className="nav-cta" onClick={openTracker}>Check car health <Icon name="arrow" /></button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-kicker"><span /> Trusted vehicle care in Kampala</p>
            <h1>Every warning has a <span>reason.</span></h1>
            <p className="hero-lede">We listen to the concern, find the cause, and make the right correction — so you can drive with confidence.</p>
            <div className="hero-actions">
              <button className="button button-gold" onClick={openTracker}>Check car health <Icon name="arrow" /></button>
              <a className="text-link" href={`tel:${PHONE}`}>Call {DISPLAY_PHONE} <Icon name="phone" /></a>
            </div>
            <div className="hero-proof"><span className="proof-line" /><span>CONCERN, CAUSE, CORRECTION.</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap"><img src="/assets/mechanic-workshop.jpg" alt="Automotive Expert working in the workshop" /></div>
            <div className="hero-note"><span className="note-dot" /><span><strong>Care that pays attention.</strong><br />Honest work. Clear answers.</span></div>
            <div className="hero-seal">AE<br /><small>EST. 2024</small></div>
          </div>
        </section>

        <section className="marquee" aria-label="Automotive Expert services"><div>ENGINEERING CONFIDENCE <span>✦</span> RESTORING PERFORMANCE <span>✦</span> KEEPING YOU MOVING <span>✦</span></div></section>

        <section className="services section" id="services">
          <div className="section-heading"><p className="eyebrow">What we do</p><h2>Precision for the<br /><i>road ahead.</i></h2><p>From a dashboard light to a routine check, we make vehicle care feel less like guesswork and more like a conversation you can trust.</p></div>
          <div className="service-list">{services.map(([number, title, copy]) => <article className="service-row" key={title}><span className="service-number">{number}</span><h3>{title}</h3><p>{copy}</p><span className="service-arrow"><Icon name="arrow" /></span></article>)}</div>
        </section>

        <section className="approach section" id="approach">
          <div className="approach-image"><img src="/assets/mechanic-alignment.jpg" alt="Mechanic checking wheel alignment" /><span className="image-caption">Good work is felt<br />before it is seen.</span></div>
          <div className="approach-copy"><p className="eyebrow">The Automotive Expert way</p><h2>A mechanic who<br /><i>thinks with you.</i></h2><p>There’s no mystery in good vehicle care. Ntege Steven takes time to understand what your car is telling you, explains the options, and gets to work with care.</p><div className="signature"><img src="/assets/mechanic-portrait.jpg" alt="Ntege Steven, Automotive Expert mechanic" /><span><strong>Ntege Steven</strong><small>Mechanic &amp; founder</small></span></div></div>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-panel"><p className="eyebrow">Come see us</p><h2>Your car has places<br /><i>to go.</i></h2><p>Let’s make sure it gets there. Visit us at Banamwaya @ Total Energies for thoughtful, capable vehicle care.</p><a className="button button-gold" href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Hello Automotive Expert, I would like to book a service.')}`} target="_blank" rel="noreferrer">Start a conversation <Icon name="chat" /></a></div>
          <div className="contact-details"><div className="detail"><Icon name="pin" /><span><small>Find us</small>Banamwaya @ Total Energies</span></div><div className="detail"><Icon name="phone" /><span><small>Call Steven</small><a href={`tel:${PHONE}`}>{DISPLAY_PHONE}</a><a href="tel:+256752561372">{ALT_PHONE}</a></span></div><div className="detail"><Icon name="chat" /><span><small>Email</small><a href="mailto:stevenclif99@gmail.com">stevenclif99@gmail.com</a></span></div></div>
        </section>
      </main>
      <footer><a className="brand" href="#top"><img src="/assets/automotive-experts-logo.jpg" alt="" /><span><strong>Automotive</strong><em>Expert</em></span></a><span>© 2024 Automotive Expert. Built for better drives.</span><a href="#top">Back to top ↑</a></footer>
      <HealthTracker open={trackerOpen} onClose={() => setTrackerOpen(false)} />
    </>
  )
}

export default App

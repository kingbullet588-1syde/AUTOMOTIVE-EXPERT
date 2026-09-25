import React from 'react'

const { useEffect, useMemo, useState } = React

const PHONE = '256780963633'
const DISPLAY_PHONE = '+256 780 963 633'
const ALT_PHONE = '+256 752 561 372'
const TRACKER_KEY = 'automotive-expert-health-check'
const BOOKINGS_KEY = 'automotive-expert-bookings'
const ADMIN_SESSION_KEY = 'automotive-expert-admin-demo'
const UPLOADS_KEY = 'automotive-expert-local-uploads'

const services = [
  ['01', 'Engine diagnostics & repair', 'Find the cause, then restore performance with a methodical repair plan.'],
  ['02', 'Brake services', 'Brake inspection, servicing and repairs for confident stopping.'],
  ['03', 'Wheel alignment & balancing', 'Straight tracking, even wear and a smoother drive.'],
  ['04', 'Tyre services', 'Tyre checks, fitment and practical advice for the road ahead.'],
  ['05', 'Suspension & steering', 'Inspect the parts that shape ride comfort, control and direction.'],
  ['06', 'A/C & heating', 'Keep the cabin comfortable with focused climate-system care.'],
  ['07', 'Fluid exchanges', 'Coolant, transmission and power-steering fluid service.'],
  ['08', 'Transmission repair', 'Clear diagnosis and careful attention to shifting concerns.'],
  ['09', 'Exhaust & emissions', 'Inspect the systems behind quieter, cleaner vehicle operation.'],
  ['10', 'Preventive maintenance', 'Timely checks that help you stay ahead of avoidable problems.'],
]

const serviceGroups = [
  ['Keep it moving', ['Engine diagnostics & repair', 'Transmission repair', 'Exhaust & emissions']],
  ['Keep it controlled', ['Brake services', 'Suspension & steering', 'Wheel alignment & balancing']],
  ['Keep it comfortable', ['A/C & heating', 'Tyre services', 'Fluid exchanges']],
  ['Keep it ready', ['Preventive maintenance']],
]

const adminStatuses = ['New', 'Confirmed', 'In service', 'Ready', 'Completed']

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
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M8 10h8M8 14h6" /></>,
    box: <><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M21 19V5a2 2 0 0 0-2-2h-5" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 20h16" /></>,
    download: <><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">{paths[name]}</svg>
}

function readBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')
  } catch {
    return []
  }
}

  const uploadCategories = [
    { id: 'documents', title: 'Customer & vehicle documents', copy: 'IDs, logbooks, inspection photos and vehicle records.', accept: '.pdf,.jpg,.jpeg,.png,.webp', types: 'PDF, JPG, PNG, WEBP', max: 10 },
    { id: 'reports', title: 'Invoices & service reports', copy: 'Receipts, quotations, invoices and completed work reports.', accept: '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx', types: 'PDF, images, DOC, DOCX', max: 10 },
    { id: 'inventory', title: 'Inventory & parts sheets', copy: 'Parts lists and stock updates for the workshop.', accept: '.csv,.xls,.xlsx,.ods', types: 'CSV, XLS, XLSX, ODS', max: 5 },
  ]

  function readUploads() {
    try { return JSON.parse(localStorage.getItem(UPLOADS_KEY) || '[]') } catch { return [] }
  }

  function UploadCenter({ bookings }) {
    const [uploads, setUploads] = useState(readUploads)
    const [selectedCategory, setSelectedCategory] = useState('documents')
    const [linkId, setLinkId] = useState('')
    const [progress, setProgress] = useState({})
    const [errors, setErrors] = useState([])

    const persist = (next) => {
      setUploads(next)
      localStorage.setItem(UPLOADS_KEY, JSON.stringify(next))
    }
    const handleFiles = (fileList, category) => {
      const config = uploadCategories.find((item) => item.id === category)
      const file = fileList?.[0]
      if (!file || !config) return
      const allowed = config.accept.split(',').some((type) => type.startsWith('.') ? file.name.toLowerCase().endsWith(type) : file.type === type)
      if (!allowed) {
        setErrors((current) => [`${file.name} was rejected. Accepted types: ${config.types}.`, ...current].slice(0, 3))
        return
      }
      if (file.size > config.max * 1024 * 1024) {
        setErrors((current) => [`${file.name} is too large. Maximum size is ${config.max} MB.`, ...current].slice(0, 3))
        return
      }
      setErrors([])
      const reader = new FileReader()
      const temporaryId = `uploading-${Date.now()}`
      setProgress((current) => ({ ...current, [temporaryId]: 5 }))
      reader.onprogress = (event) => {
        if (event.lengthComputable) setProgress((current) => ({ ...current, [temporaryId]: Math.max(5, Math.round((event.loaded / event.total) * 90)) }))
      }
      reader.onerror = () => {
        setErrors((current) => [`${file.name} could not be read. Try again.`, ...current].slice(0, 3))
        setProgress((current) => { const next = { ...current }; delete next[temporaryId]; return next })
      }
      reader.onload = () => {
        const booking = bookings.find((item) => item.id === linkId)
        const nextUpload = { id: `upload-${Date.now()}`, name: file.name, size: file.size, type: file.type || 'application/octet-stream', category, data: reader.result, linkedTo: booking ? `${booking.name} · ${booking.vehicle}` : 'Unlinked local file', createdAt: new Date().toISOString() }
        persist([nextUpload, ...uploads])
        setProgress((current) => { const next = { ...current }; delete next[temporaryId]; return next })
      }
      reader.readAsDataURL(file)
    }
    const removeUpload = (id) => persist(uploads.filter((item) => item.id !== id))
    const downloadUpload = (item) => {
      const link = document.createElement('a')
      link.href = item.data
      link.download = item.name
      link.click()
    }
    const formatSize = (bytes) => bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

    return <section className="admin-panel full-panel upload-center">
      <div className="panel-heading"><div><p className="eyebrow">Local file cabinet</p><h2>Upload center</h2><p className="panel-subcopy">Files are stored on this device only until backend storage is connected.</p></div></div>
      {errors.length > 0 && <div className="upload-errors" role="alert">{errors.map((error) => <div key={error}>{error}</div>)}</div>}
      <div className="upload-link-row"><label>Link new uploads to a booking<select value={linkId} onChange={(event) => setLinkId(event.target.value)}><option value="">No customer / vehicle selected</option>{bookings.map((booking) => <option value={booking.id} key={booking.id}>{booking.name} · {booking.vehicle}</option>)}</select></label><span>Nothing is uploaded to a server in this prototype.</span></div>
      <div className="upload-cards">{uploadCategories.map((category) => <article className={`upload-card ${selectedCategory === category.id ? 'selected' : ''}`} key={category.id}><div className="upload-card-icon"><Icon name="upload" /></div><h3>{category.title}</h3><p>{category.copy}</p><small>Accepted: {category.types} · Max {category.max} MB</small><label className="dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleFiles(event.dataTransfer.files, category.id) }}><input type="file" accept={category.accept} onChange={(event) => handleFiles(event.target.files, category.id)} /><Icon name="upload" /><span>Choose or drop a file</span></label>{selectedCategory === category.id && progress[Object.keys(progress)[0]] && <div className="upload-progress"><span style={{ transform: `scaleX(${progress[Object.keys(progress)[0]] / 100})` }} /></div>}<button className="text-button" onClick={() => setSelectedCategory(category.id)}>{selectedCategory === category.id ? 'Ready for upload' : 'Select category'}</button></article>)}</div>
      <div className="stored-files"><div className="panel-heading"><div><p className="eyebrow">Stored on this device</p><h3>{uploads.length ? `${uploads.length} saved file${uploads.length === 1 ? '' : 's'}` : 'No files saved yet'}</h3></div></div>{uploads.length === 0 ? <EmptyState icon="upload" title="Your local file cabinet is empty" copy="Choose a category above to add a document, report or parts sheet." /> : <div className="file-list">{uploads.map((item) => <div className="file-row" key={item.id}><span className="file-type">{item.name.split('.').pop().toUpperCase()}</span><span className="file-meta"><strong>{item.name}</strong><small>{formatSize(item.size)} · {item.linkedTo}</small></span><button onClick={() => downloadUpload(item)} aria-label={`Download ${item.name}`}><Icon name="download" /></button><button onClick={() => removeUpload(item.id)} aria-label={`Remove ${item.name}`}><Icon name="trash" /></button></div>)}</div>}</div>
    </section>
}

function AdminGate({ onExit }) {
  const [access, setAccess] = useState(() => localStorage.getItem(ADMIN_SESSION_KEY) === 'demo')
  const [email, setEmail] = useState('')
  const [bookings, setBookings] = useState(readBookings)
  const [activeView, setActiveView] = useState('Overview')
  const [error, setError] = useState('')

  useEffect(() => {
    const sync = () => setBookings(readBookings())
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const signIn = (event) => {
    event.preventDefault()
    if (!email.trim()) {
      setError('Enter an email to continue to the local demo workspace.')
      return
    }
    localStorage.setItem(ADMIN_SESSION_KEY, 'demo')
    setAccess(true)
  }
  const signOut = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    setAccess(false)
  }
  const updateStatus = (id, status) => {
    const next = bookings.map((booking) => booking.id === id ? { ...booking, status } : booking)
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next))
    setBookings(next)
  }

  if (!access) {
    return <main className="admin-shell admin-gate"><div className="admin-gate-card"><a className="brand" href="/"><img src="/assets/automotive-experts-logo.jpg" alt="" /><span><strong>Automotive</strong><em>Expert</em></span></a><p className="eyebrow">Local workspace</p><h1>Welcome to the<br /><i>service desk.</i></h1><p>This is a frontend demo workspace for managing appointments saved in this browser. No backend account or customer data is connected.</p><form onSubmit={signIn}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="steven@example.com" aria-describedby="admin-note" /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-gold" type="submit">Enter demo workspace <Icon name="arrow" /></button></form><small id="admin-note">Demo access only — any email works locally.</small><a className="admin-back-link" href="/">← Back to public site</a></div></main>
  }

  const counts = adminStatuses.reduce((acc, status) => ({ ...acc, [status]: bookings.filter((booking) => booking.status === status).length }), {})
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a className="brand" href="/"><img src="/assets/automotive-experts-logo.jpg" alt="" /><span><strong>Automotive</strong><em>Expert</em></span></a>
      <div className="admin-context"><span className="live-dot" /> Demo / local workspace</div>
      <nav className="admin-nav" aria-label="Admin navigation">{['Overview', 'Appointments', 'Customers & vehicles', 'Uploads', 'Reminders', 'Inventory'].map((item) => <button className={activeView === item ? 'active' : ''} key={item} onClick={() => setActiveView(item)}>{item}</button>)}</nav>
      <button className="admin-exit" onClick={signOut}><Icon name="logout" /> Sign out demo</button>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><p className="eyebrow">Wednesday, 24 September 2026</p><h1>{activeView}</h1></div><div className="admin-top-actions"><a className="button button-quiet" href="/">View public site</a><button className="button button-gold" onClick={() => setActiveView('Appointments')}>New appointment <Icon name="arrow" /></button></div></header>
      <div className="admin-notice"><span className="live-dot" /><span><strong>Local-only demo</strong> Changes are saved in this browser. Connect a backend before using this for live customer records.</span></div>
      {activeView === 'Overview' && <><section className="admin-metrics">{adminStatuses.map((status) => <article className="admin-metric" key={status}><span>{status}</span><strong>{counts[status]}</strong><small>{status === 'New' ? 'Needs attention' : status === 'Completed' ? 'This workspace' : 'Pipeline'}</small></article>)}</section><section className="admin-grid"><article className="admin-panel pipeline-panel"><div className="panel-heading"><div><p className="eyebrow">Today’s flow</p><h2>Appointment pipeline</h2></div><button className="text-button" onClick={() => setActiveView('Appointments')}>View all →</button></div>{bookings.length === 0 ? <EmptyState icon="calendar" title="Your pipeline is clear" copy="New customer bookings will appear here once submitted from the public booking form." /> : <BookingTable bookings={bookings} onStatusChange={updateStatus} compact />}</article><aside className="admin-panel quick-panel"><div className="panel-heading"><div><p className="eyebrow">Shortcuts</p><h2>Quick actions</h2></div></div><button onClick={() => setActiveView('Appointments')}><Icon name="calendar" /><span><strong>Review appointments</strong><small>Move work through the pipeline</small></span><b>→</b></button><a href="/#booking"><Icon name="clipboard" /><span><strong>Open public booking</strong><small>Submit a customer request</small></span><b>→</b></a><button onClick={() => setActiveView('Inventory')}><Icon name="box" /><span><strong>Check parts snapshot</strong><small>Track what needs attention</small></span><b>→</b></button></aside></section></>}
      {activeView === 'Appointments' && <section className="admin-panel full-panel"><div className="panel-heading"><div><p className="eyebrow">Customer requests</p><h2>Appointment pipeline</h2></div></div>{bookings.length === 0 ? <EmptyState icon="calendar" title="No appointments yet" copy="The public booking form is ready for your first local request." /> : <BookingTable bookings={bookings} onStatusChange={updateStatus} />}</section>}
      {activeView === 'Customers & vehicles' && <section className="admin-panel full-panel"><div className="panel-heading"><div><p className="eyebrow">Local records</p><h2>Customers &amp; vehicles</h2></div></div>{bookings.length === 0 ? <EmptyState icon="clipboard" title="No customer records yet" copy="Booking submissions will create lightweight customer and vehicle records here." /> : <div className="record-grid">{bookings.map((booking) => <article className="record-card" key={booking.id}><span className="record-avatar">{booking.name.charAt(0)}</span><div><h3>{booking.name}</h3><p>{booking.phone} · {booking.vehicle}</p><small>Requested {booking.service}</small></div></article>)}</div>}</section>}
      {activeView === 'Uploads' && <UploadCenter bookings={bookings} />}
      {activeView === 'Reminders' && <section className="admin-panel full-panel"><EmptyState icon="calendar" title="No reminders configured" copy="Service reminders will become available once customer records are connected to a backend." /></section>}
      {activeView === 'Inventory' && <section className="admin-panel full-panel"><EmptyState icon="box" title="Inventory is ready to connect" copy="This prototype intentionally shows no fabricated stock levels. Connect your parts source to populate this snapshot." /></section>}
    </main>
  </div>
}

function EmptyState({ icon, title, copy }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} /></span><h3>{title}</h3><p>{copy}</p></div>
}

function BookingTable({ bookings, onStatusChange, compact = false }) {
  return <div className="booking-table-wrap"><table className="booking-table"><thead><tr><th>Customer</th><th>Vehicle</th><th>Service</th><th>Preferred date</th><th>Status</th></tr></thead><tbody>{(compact ? bookings.slice(0, 5) : bookings).map((booking) => <tr key={booking.id}><td><strong>{booking.name}</strong><small>{booking.phone}</small></td><td>{booking.vehicle}</td><td>{booking.service}</td><td>{booking.date || 'Flexible'}</td><td><select value={booking.status} onChange={(event) => onStatusChange(booking.id, event.target.value)} aria-label={`Update status for ${booking.name}`}>{adminStatuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>
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
  if (window.location.pathname.startsWith('/admin')) return <AdminGate />
  const [trackerOpen, setTrackerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingSent, setBookingSent] = useState(false)
  const openTracker = () => { setTrackerOpen(true); setMenuOpen(false) }
  const submitBooking = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const booking = {
      id: `booking-${Date.now()}`,
      name: data.get('name'),
      phone: data.get('phone'),
      vehicle: `${data.get('make')} ${data.get('model')}`,
      service: data.get('service'),
      date: data.get('date'),
      status: 'New',
    }
    const existing = readBookings()
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([...existing, booking]))
    setBookingSent(true)
    event.currentTarget.reset()
  }
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Automotive Expert home">
          <img src="/assets/automotive-experts-logo.jpg" alt="" />
          <span><strong>Automotive</strong><em>Expert</em></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">Menu</button>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <a href="#top" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#booking" onClick={() => setMenuOpen(false)}>Booking</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="/admin" onClick={() => setMenuOpen(false)}>Admin</a>
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
            <div className="hero-support"><span><small>Talk to Steven</small><a href={`tel:${PHONE}`}>{DISPLAY_PHONE}</a></span><span><small>Email</small><a href="mailto:stevenclif99@gmail.com">stevenclif99@gmail.com</a></span></div>
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
          <div className="service-groups">{serviceGroups.map(([group, items]) => <article className="service-group" key={group}><h3>{group}</h3><ul>{items.map((item) => <li key={item}>{item}<Icon name="arrow" /></li>)}</ul></article>)}</div>
        </section>

        <section className="trust-strip"><div><strong>Clear answers</strong><span>No guesswork before work begins.</span></div><div><strong>Human service</strong><span>Talk directly with Ntege Steven.</span></div><div><strong>Local care</strong><span>Banamwaya @ Total Energies.</span></div></section>

        <section className="proof-section section">
          <div className="section-heading"><p className="eyebrow">Why choose Automotive Expert?</p><h2>Good care is<br /><i>easy to understand.</i></h2><p>Our promise is simple: pay attention, explain the finding, and keep the next step clear.</p></div>
          <div className="proof-grid"><article><span>01</span><h3>Concern first</h3><p>We start with what you notice, not a rushed assumption.</p></article><article><span>02</span><h3>Cause made clear</h3><p>We explain the issue in plain language before correction begins.</p></article><article><span>03</span><h3>Correction with care</h3><p>Work is focused on the vehicle and the road you need it for.</p></article></div>
        </section>

        <section className="approach section" id="about">
          <div className="approach-image"><img src="/assets/mechanic-alignment.jpg" alt="Mechanic checking wheel alignment" /><span className="image-caption">Good work is felt<br />before it is seen.</span></div>
          <div className="approach-copy"><p className="eyebrow">The Automotive Expert way</p><h2>A mechanic who<br /><i>thinks with you.</i></h2><p>There’s no mystery in good vehicle care. Ntege Steven takes time to understand what your car is telling you, explains the options, and gets to work with care.</p><div className="signature"><img src="/assets/mechanic-portrait.jpg" alt="Ntege Steven, Automotive Expert mechanic" /><span><strong>Ntege Steven</strong><small>Mechanic &amp; founder</small></span></div></div>
        </section>

        <section className="capability section">
          <div className="capability-image"><img src="/assets/wamuco-workshop-bg1.jpg" alt="Workshop equipment and service environment" /></div>
          <div className="capability-copy"><p className="eyebrow">Technical capability</p><h2>One workshop for<br /><i>the full picture.</i></h2><p>From wheels and brakes to fluids, climate, drivetrain and emissions, Automotive Expert brings the vehicle’s connected systems into one conversation.</p><div className="capability-tags"><span>Inspection</span><span>Diagnosis</span><span>Repair</span><span>Maintenance</span></div></div>
        </section>

        <section className="workshop-note section">
          <div><p className="eyebrow">A practical workshop mindset</p><h2>Clear categories.<br /><i>Careful next steps.</i></h2></div>
          <div className="workshop-note-copy"><img src="/assets/wamuco-service-bg2.jpg" alt="Automotive service workshop detail" /><p>We’ve shaped Automotive Expert around the way drivers actually ask for help: identify the concern, connect it to the right system, and make the next action easy to understand.</p></div>
        </section>

        <section className="booking section" id="booking">
          <div className="booking-copy"><p className="eyebrow">Book a visit</p><h2>Good service<br /><i>starts here.</i></h2><p>Tell us what your vehicle needs and when you would like to come in. We’ll confirm the details by phone or WhatsApp.</p><div className="booking-mini"><span className="mini-icon"><Icon name="calendar" /></span><span><strong>Prefer a quick answer?</strong><a href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Hello Automotive Expert, I would like to book an appointment.')}`} target="_blank" rel="noreferrer">Message us on WhatsApp →</a></span></div></div>
          <div className="booking-card">{bookingSent ? <div className="booking-success"><div className="status-orb green"><Icon name="check" /></div><h3>Request received locally.</h3><p>Your appointment is saved in this browser. We’ll use your contact details to confirm the visit.</p><button className="button button-gold" onClick={() => setBookingSent(false)}>Submit another request</button></div> : <form className="booking-form" onSubmit={submitBooking}><div className="form-heading"><span>Appointment request</span><small>All fields marked * are required</small></div><div className="form-grid"><label>Full name *<input name="name" required placeholder="Your name" /></label><label>Phone / WhatsApp *<input name="phone" required type="tel" placeholder="+256 ..." /></label><label>Vehicle make *<input name="make" required placeholder="Toyota" /></label><label>Vehicle model *<input name="model" required placeholder="Harrier" /></label><label>Service needed *<select name="service" required defaultValue=""><option value="" disabled>Choose a service</option>{services.map(([, title]) => <option key={title}>{title}</option>)}</select></label><label>Preferred date<input name="date" type="date" /></label></div><button className="button button-gold" type="submit">Request appointment <Icon name="arrow" /></button><small className="local-note">Local demo: this request stays in your browser until a backend is connected.</small></form>}</div>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-panel"><p className="eyebrow">Come see us</p><h2>Your car has places<br /><i>to go.</i></h2><p>Let’s make sure it gets there. Visit us at Banamwaya @ Total Energies for thoughtful, capable vehicle care.</p><a className="button button-gold" href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Hello Automotive Expert, I would like to book a service.')}`} target="_blank" rel="noreferrer">Start a conversation <Icon name="chat" /></a></div>
          <div className="contact-details"><div className="detail"><Icon name="pin" /><span><small>Find us</small>Banamwaya @ Total Energies</span></div><div className="detail"><Icon name="phone" /><span><small>Call Steven</small><a href={`tel:${PHONE}`}>{DISPLAY_PHONE}</a><a href="tel:+256752561372">{ALT_PHONE}</a></span></div><div className="detail"><Icon name="chat" /><span><small>Email</small><a href="mailto:stevenclif99@gmail.com">stevenclif99@gmail.com</a></span></div></div>
        </section>
      </main>
      <footer><a className="brand" href="#top"><img src="/assets/automotive-experts-logo.jpg" alt="" /><span><strong>Automotive</strong><em>Expert</em></span></a><span>© 2024 Automotive Expert. Built for better drives.</span><a href="#top">Back to top ↑</a></footer>
      <HealthTracker open={trackerOpen} onClose={() => setTrackerOpen(false)} />
      <div className="mobile-cta"><a href={`tel:${PHONE}`}><Icon name="phone" /> Call</a><button onClick={() => document.getElementById('booking')?.scrollIntoView()}><Icon name="calendar" /> Book an appointment</button></div>
    </>
  )
}

export default App

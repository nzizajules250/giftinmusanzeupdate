import { useState } from 'react'
import { hotelInfo } from '../data/siteContent.js'
import { useSeo } from '../hooks/useSeo.js'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --gold:    #c8a96e;
    --gold-lt: #d9be8a;
    --dark:    #0f0c08;
    --dark2:   #1a1410;
    --ivory:   #faf8f3;
    --sand:    #e8e0d0;
    --muted:   #5a4e42;
    --serif:   'Cormorant Garamond', Georgia, serif;
    --sans:    'Jost', sans-serif;
  }

  .ct-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .ct-wrap {
    font-family: var(--sans);
    background: var(--ivory);
    min-height: 100vh;
    padding-top: 76px;
    overflow-x: hidden;
  }

  /* ════════════════════════════
     HERO
  ════════════════════════════ */
  .ct-hero {
    position: relative;
    height: 56vh;
    min-height: 380px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }
  .ct-hero-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85');
    background-size: cover;
    background-position: center 40%;
    animation: ctZoom 9s ease forwards;
  }
  @keyframes ctZoom { from { transform: scale(1.06); } to { transform: scale(1); } }
  .ct-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,8,4,0.92) 0%, rgba(10,8,4,0.35) 55%, transparent 100%);
  }
  .ct-hero-content {
    position: relative;
    z-index: 2;
    padding: 0 6vw 56px;
  }
  .ct-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
    opacity: 0;
    animation: ctUp 0.7s ease 0.2s forwards;
  }
  .ct-hero-title {
    font-family: var(--serif);
    font-size: clamp(38px, 6vw, 80px);
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.05;
    opacity: 0;
    animation: ctUp 0.8s ease 0.4s forwards;
  }
  .ct-hero-title em { font-style: italic; color: var(--gold); }
  .ct-hero-desc {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: rgba(250,248,243,0.6);
    line-height: 1.8;
    margin-top: 16px;
    max-width: 460px;
    opacity: 0;
    animation: ctUp 0.7s ease 0.6s forwards;
  }
  @keyframes ctUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ════════════════════════════
     QUICK-CONTACT STRIP
  ════════════════════════════ */
  .ct-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: var(--dark2);
    border-bottom: 1px solid rgba(200,169,110,0.15);
  }
  @media (max-width: 700px) { .ct-strip { grid-template-columns: 1fr; } }

  .ct-strip-item {
    padding: 32px 36px;
    border-right: 1px solid rgba(250,248,243,0.07);
    display: flex;
    align-items: center;
    gap: 18px;
    text-decoration: none;
    transition: background 0.3s;
    cursor: pointer;
  }
  .ct-strip-item:last-child { border-right: none; }
  .ct-strip-item:hover { background: rgba(250,248,243,0.03); }

  .ct-strip-icon {
    width: 44px; height: 44px;
    border: 1px solid rgba(200,169,110,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    transition: border-color 0.3s, background 0.3s;
  }
  .ct-strip-item:hover .ct-strip-icon {
    border-color: var(--gold);
    background: rgba(200,169,110,0.08);
  }
  .ct-strip-label {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 5px;
  }
  .ct-strip-value {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.7);
    line-height: 1.4;
  }

  /* ════════════════════════════
     MAIN GRID — form + details + map
  ════════════════════════════ */
  .ct-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-bottom: 1px solid var(--sand);
  }
  @media (max-width: 900px) { .ct-main { grid-template-columns: 1fr; } }

  /* ── Left: Form ── */
  .ct-form-side {
    padding: 72px 6vw 72px 6vw;
    border-right: 1px solid var(--sand);
  }
  @media (max-width: 900px) {
    .ct-form-side { border-right: none; border-bottom: 1px solid var(--sand); padding: 56px 6vw; }
  }

  .ct-section-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .ct-section-title {
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 46px);
    font-weight: 300;
    color: var(--dark2);
    line-height: 1.1;
    margin-bottom: 8px;
  }
  .ct-section-title em { font-style: italic; color: var(--gold); }
  .ct-section-desc {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.8;
    margin-bottom: 36px;
  }
  .ct-divider {
    width: 40px; height: 1px;
    background: var(--gold);
    margin: 24px 0;
    opacity: 0.7;
  }

  .ct-form { display: flex; flex-direction: column; gap: 18px; }

  .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  @media (max-width: 500px) { .ct-row { grid-template-columns: 1fr; } }

  .ct-label {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ct-input, .ct-select, .ct-textarea {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: var(--dark2);
    background: var(--ivory);
    border: 1px solid var(--sand);
    padding: 13px 16px;
    outline: none;
    width: 100%;
    transition: border-color 0.3s;
    border-radius: 0;
    appearance: none;
    -webkit-appearance: none;
  }
  .ct-input:focus, .ct-select:focus, .ct-textarea:focus { border-color: var(--gold); }
  .ct-input::placeholder, .ct-textarea::placeholder { color: #b0a090; }
  .ct-textarea { resize: vertical; min-height: 120px; }

  .ct-select-wrap { position: relative; }
  .ct-select-wrap::after {
    content: '';
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    width: 8px; height: 5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23c8a96e'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    pointer-events: none;
  }
  .ct-select { padding-right: 36px; cursor: pointer; }

  .ct-submit {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 17px 0;
    width: 100%;
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.3s, transform 0.2s;
    margin-top: 4px;
  }
  .ct-submit::before {
    content: '';
    position: absolute;
    inset: 0; left: -100%;
    width: 60%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent);
    transition: left 0.5s ease;
  }
  .ct-submit:hover::before { left: 150%; }
  .ct-submit:hover { background: var(--gold-lt, #d9be8a); transform: translateY(-1px); }
  .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .ct-success {
    padding: 16px 20px;
    background: #f0ece4;
    border-left: 3px solid var(--gold);
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 400;
    color: var(--dark2);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: ctUp 0.5s ease forwards;
  }

  /* ── Right: Details + Map ── */
  .ct-info-side {
    display: flex;
    flex-direction: column;
  }

  .ct-details {
    padding: 72px 5vw 48px 5vw;
    flex: 1;
  }
  @media (max-width: 900px) { .ct-details { padding: 56px 6vw 40px; } }

  .ct-detail-items {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 32px;
    border-top: 1px solid var(--sand);
  }
  .ct-detail-item {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 22px 0;
    border-bottom: 1px solid var(--sand);
  }
  .ct-detail-icon {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .ct-detail-label {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 5px;
  }
  .ct-detail-value {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: var(--dark2);
    line-height: 1.6;
  }
  .ct-detail-value a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s;
  }
  .ct-detail-value a:hover { color: var(--gold); }

  .ct-direct-btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 36px;
    padding-top: 28px;
    border-top: 1px solid var(--sand);
  }
  .ct-btn-wa {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 13px 24px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
    white-space: nowrap;
    transition: background 0.3s, transform 0.2s;
  }
  .ct-btn-wa:hover { background: var(--gold-lt, #d9be8a); transform: translateY(-1px); }
  .ct-btn-email {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dark2);
    background: transparent;
    border: 1px solid var(--sand);
    padding: 12px 24px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
    white-space: nowrap;
    transition: border-color 0.3s, color 0.3s;
  }
  .ct-btn-email:hover { border-color: var(--gold); color: var(--gold); }

  /* ── Map ── */
  .ct-map {
    border-top: 1px solid var(--sand);
    position: relative;
    overflow: hidden;
    min-height: 320px;
  }
  .ct-map iframe {
    width: 100%;
    height: 100%;
    min-height: 320px;
    border: 0;
    display: block;
    filter: grayscale(15%) contrast(0.96);
  }
  .ct-map-label {
    position: absolute;
    top: 16px; left: 16px;
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    background: rgba(10,8,4,0.6);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(200,169,110,0.3);
    padding: 7px 14px;
    pointer-events: none;
  }

  /* ════════════════════════════
     HOURS + FAQ ROW
  ════════════════════════════ */
  .ct-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-bottom: 1px solid var(--sand);
  }
  @media (max-width: 768px) { .ct-bottom { grid-template-columns: 1fr; } }

  .ct-hours {
    padding: 64px 6vw;
    border-right: 1px solid var(--sand);
    background: var(--dark2);
  }
  @media (max-width: 768px) {
    .ct-hours { border-right: none; border-bottom: 1px solid rgba(250,248,243,0.07); }
  }
  .ct-hours-title {
    font-family: var(--serif);
    font-size: clamp(26px, 3vw, 42px);
    font-weight: 300;
    color: var(--ivory);
    margin-bottom: 36px;
  }
  .ct-hours-title em { font-style: italic; color: var(--gold); }
  .ct-hours-rows { display: flex; flex-direction: column; gap: 0; }
  .ct-hours-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid rgba(250,248,243,0.07);
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
  }
  .ct-hours-row:last-child { border-bottom: none; }
  .ct-hours-day { color: rgba(250,248,243,0.55); }
  .ct-hours-time { color: var(--gold); font-weight: 400; }

  .ct-faq {
    padding: 64px 6vw;
  }
  .ct-faq-title {
    font-family: var(--serif);
    font-size: clamp(26px, 3vw, 42px);
    font-weight: 300;
    color: var(--dark2);
    margin-bottom: 36px;
  }
  .ct-faq-title em { font-style: italic; color: var(--gold); }
  .ct-faq-items { display: flex; flex-direction: column; gap: 0; }
  .ct-faq-item {
    border-bottom: 1px solid var(--sand);
    overflow: hidden;
  }
  .ct-faq-q {
    width: 100%;
    background: none;
    border: none;
    padding: 18px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 500;
    color: var(--dark2);
    text-align: left;
    transition: color 0.3s;
  }
  .ct-faq-q:hover { color: var(--gold); }
  .ct-faq-icon {
    font-size: 18px;
    color: var(--gold);
    flex-shrink: 0;
    transition: transform 0.3s ease;
    line-height: 1;
  }
  .ct-faq-icon.open { transform: rotate(45deg); }
  .ct-faq-a {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.75;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, padding 0.3s ease;
    padding: 0;
  }
  .ct-faq-a.open {
    max-height: 200px;
    padding-bottom: 18px;
  }
`

const faqs = [
  { q: 'What are your check-in and check-out times?',     a: 'Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out are available on request, subject to availability.' },
  { q: 'Do you offer airport transfers?',                  a: 'Yes — we provide private and group transfers from Kigali International Airport to GiftInn Musanze. Please contact us 24 hours in advance to arrange.' },
  { q: 'Is breakfast included in the room rate?',          a: 'Breakfast is included in select room packages. Please check your chosen room details or contact us to confirm.' },
  { q: 'How do I make a booking modification or cancel?',  a: 'Contact us via WhatsApp or email and we will assist within 2 hours. Free cancellation applies up to 48 hours before arrival.' },
]

const hours = [
  { day: 'Front Desk',        time: '24 / 7' },
  { day: 'Restaurant',        time: '7:00 AM – 10:00 PM' },
  { day: 'Spa & Wellness',    time: '8:00 AM – 8:00 PM' },
  { day: 'Infinity Pool',     time: '7:00 AM – 9:00 PM' },
  { day: 'Fitness Studio',    time: '6:00 AM – 10:00 PM' },
  { day: 'WhatsApp Support',  time: '24 / 7' },
]

function ContactPage() {
  useSeo({
    title: 'GiftInn Musanze | Contact',
    description: 'Contact GiftInn Musanze via phone, WhatsApp, email, and map location.',
  })

  const [form, setForm]         = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' })
  const [sending, setSending]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [openFaq, setOpenFaq]   = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 900))

    const body =
      `Name: ${form.name}%0A` +
      `Email: ${form.email}%0A` +
      `Phone: ${form.phone}%0A` +
      `Subject: ${form.subject}%0A` +
      `Message: ${form.message}`

    window.open(
      `mailto:${hotelInfo.email}?subject=${encodeURIComponent(form.subject)}&body=${body.replaceAll('%0A', '\n')}`,
      '_blank', 'noreferrer',
    )
    window.open(
      `https://wa.me/${hotelInfo.whatsapp}?text=${body}`,
      '_blank', 'noreferrer',
    )

    setSending(false)
    setSent(true)
    setTimeout(() => setSent(false), 5000)
    setForm({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' })
  }

  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx)

  return (
    <div className="ct-wrap">
      <style>{css}</style>

      {/* ════ HERO ════ */}
      <section className="ct-hero">
        <div className="ct-hero-bg" />
        <div className="ct-hero-overlay" />
        <div className="ct-hero-content">
          <p className="ct-eyebrow">Get in Touch</p>
          <h1 className="ct-hero-title">
            Let Us Help Plan<br />Your <em>Stay</em>
          </h1>
          <p className="ct-hero-desc">
            Reach us by phone, email, WhatsApp, or visit us directly in Musanze. Our team responds within 2 hours.
          </p>
        </div>
      </section>

      {/* ════ QUICK-CONTACT STRIP ════ */}
      <div className="ct-strip">
        <a
          href={`https://wa.me/${hotelInfo.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="ct-strip-item"
        >
          <div className="ct-strip-icon">💬</div>
          <div>
            <p className="ct-strip-label">WhatsApp</p>
            <p className="ct-strip-value">+{hotelInfo.whatsapp}</p>
          </div>
        </a>

        <a href={`tel:${hotelInfo.phone}`} className="ct-strip-item">
          <div className="ct-strip-icon">📞</div>
          <div>
            <p className="ct-strip-label">Call Us</p>
            <p className="ct-strip-value">{hotelInfo.phone}</p>
          </div>
        </a>

        <a href={`mailto:${hotelInfo.email}`} className="ct-strip-item">
          <div className="ct-strip-icon">✉️</div>
          <div>
            <p className="ct-strip-label">Email</p>
            <p className="ct-strip-value">{hotelInfo.email}</p>
          </div>
        </a>
      </div>

      {/* ════ MAIN GRID ════ */}
      <div className="ct-main">

        {/* ── Contact form ── */}
        <div className="ct-form-side">
          <p className="ct-section-eyebrow">Send a Message</p>
          <h2 className="ct-section-title">We'd Love to <em>Hear</em> from You</h2>
          <p className="ct-section-desc">Fill in the form and we'll get back to you within 2 hours via email or WhatsApp.</p>

          <form className="ct-form" onSubmit={handleSubmit}>
            <div className="ct-row">
              <label className="ct-label">
                Full Name
                <input
                  required
                  className="ct-input"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="ct-label">
                Phone Number
                <input
                  className="ct-input"
                  placeholder="+250 788 …"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
            </div>

            <label className="ct-label">
              Email Address
              <input
                required
                type="email"
                className="ct-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label className="ct-label">
              Subject
              <div className="ct-select-wrap">
                <select
                  className="ct-select"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option>General Enquiry</option>
                  <option>Room Booking</option>
                  <option>Event & Conference</option>
                  <option>Spa & Wellness</option>
                  <option>Airport Transfer</option>
                  <option>Partnership</option>
                </select>
              </div>
            </label>

            <label className="ct-label">
              Message
              <textarea
                required
                className="ct-textarea"
                placeholder="Tell us how we can help…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>

            {sent && (
              <div className="ct-success">
                <span>✓</span>
                Message sent! We'll respond within 2 hours.
              </div>
            )}

            <button type="submit" className="ct-submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* ── Info + Map ── */}
        <div className="ct-info-side">
          <div className="ct-details">
            <p className="ct-section-eyebrow">Our Location</p>
            <h2 className="ct-section-title">Find <em>GiftInn</em></h2>

            <div className="ct-detail-items">
              {[
                { icon: '📍', label: 'Address',   value: hotelInfo.address },
                { icon: '📞', label: 'Phone',     value: <a href={`tel:${hotelInfo.phone}`}>{hotelInfo.phone}</a> },
                { icon: '✉️', label: 'Email',     value: <a href={`mailto:${hotelInfo.email}`}>{hotelInfo.email}</a> },
                { icon: '🌍', label: 'Location',  value: `${hotelInfo.city}, ${hotelInfo.country}` },
                { icon: '🌋', label: 'Proximity', value: '5 minutes from Volcanoes National Park routes' },
              ].map((d) => (
                <div className="ct-detail-item" key={d.label}>
                  <span className="ct-detail-icon">{d.icon}</span>
                  <div>
                    <p className="ct-detail-label">{d.label}</p>
                    <p className="ct-detail-value">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ct-direct-btns">
              <a
                href={`https://wa.me/${hotelInfo.whatsapp}?text=Hello%20GiftInn%2C%20I%20have%20an%20enquiry.`}
                target="_blank"
                rel="noreferrer"
                className="ct-btn-wa"
              >
                💬 WhatsApp Us
              </a>
              <a href={`mailto:${hotelInfo.email}`} className="ct-btn-email">
                ✉️ Email Us
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="ct-map">
            <iframe
              title="GiftInn Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(hotelInfo.address)}&output=embed`}
            />
            <div className="ct-map-label">Musanze · Rwanda</div>
          </div>
        </div>
      </div>

      {/* ════ HOURS + FAQ ════ */}
      <div className="ct-bottom">
        {/* Hours */}
        <div className="ct-hours">
          <h2 className="ct-hours-title">Operating <em>Hours</em></h2>
          <div className="ct-hours-rows">
            {hours.map((h) => (
              <div className="ct-hours-row" key={h.day}>
                <span className="ct-hours-day">{h.day}</span>
                <span className="ct-hours-time">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="ct-faq">
          <h2 className="ct-faq-title">Common <em>Questions</em></h2>
          <div className="ct-faq-items">
            {faqs.map((f, idx) => (
              <div className="ct-faq-item" key={idx}>
                <button
                  type="button"
                  className="ct-faq-q"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                >
                  {f.q}
                  <span className={`ct-faq-icon${openFaq === idx ? ' open' : ''}`}>+</span>
                </button>
                <p className={`ct-faq-a${openFaq === idx ? ' open' : ''}`}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
import { Link } from 'react-router-dom'
import { hotelInfo } from '../data/siteContent.js'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --gold:    #c8a96e;
    --gold-lt: #d9be8a;
    --dark:    #0f0c08;
    --dark2:   #1a1410;
    --ivory:   #faf8f3;
    --sand:    #e8e0d0;
    --serif:   'Cormorant Garamond', Georgia, serif;
    --sans:    'Jost', sans-serif;
  }

  /* ════════════════════════════
     FOOTER SHELL
  ════════════════════════════ */
  .gi-footer {
    background: var(--dark);
    border-top: 1px solid rgba(200,169,110,0.2);
    font-family: var(--sans);
  }

  /* ── Top band: logo + tagline + socials ── */
  .gi-footer-brand {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
    padding: 52px 6vw 40px;
    border-bottom: 1px solid rgba(250,248,243,0.07);
  }

  .gi-footer-logo {
    font-family: var(--serif);
    font-size: 34px;
    font-weight: 300;
    color: var(--ivory);
    letter-spacing: 0.04em;
    text-decoration: none;
    line-height: 1;
  }
  .gi-footer-logo span { color: var(--gold); font-style: italic; }

  .gi-footer-tagline {
    font-size: 11px;
    font-weight: 300;
    color: rgba(250,248,243,0.35);
    letter-spacing: 0.12em;
    margin-top: 8px;
    text-transform: uppercase;
  }

  /* Social icons row */
  .gi-footer-socials {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .gi-social-btn {
    width: 42px;
    height: 42px;
    border: 1px solid rgba(200,169,110,0.28);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: rgba(250,248,243,0.5);
    transition: border-color 0.3s, color 0.3s, background 0.3s;
    flex-shrink: 0;
  }
  .gi-social-btn:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: rgba(200,169,110,0.06);
  }
  .gi-social-btn svg {
    width: 17px;
    height: 17px;
    fill: currentColor;
    display: block;
    flex-shrink: 0;
  }

  /* ── Navigation columns ── */
  .gi-footer-nav {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    padding: 52px 6vw 48px;
    border-bottom: 1px solid rgba(250,248,243,0.07);
  }
  @media (max-width: 900px) { .gi-footer-nav { grid-template-columns: repeat(2, 1fr); gap: 40px 0; } }
  @media (max-width: 480px) { .gi-footer-nav { grid-template-columns: 1fr; gap: 36px; } }

  .gi-footer-col {
    padding-right: 32px;
    border-right: 1px solid rgba(250,248,243,0.06);
  }
  .gi-footer-col:last-child { border-right: none; padding-right: 0; }
  @media (max-width: 900px) {
    .gi-footer-col { border-right: none; padding-right: 0; }
  }

  .gi-footer-col-title {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 22px;
  }

  .gi-footer-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .gi-footer-link {
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.48);
    text-decoration: none;
    transition: color 0.3s, padding-left 0.3s;
    display: inline-block;
    line-height: 1.4;
  }
  .gi-footer-link:hover {
    color: var(--gold);
    padding-left: 4px;
  }

  /* Contact col extras */
  .gi-footer-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.48);
    line-height: 1.55;
    text-decoration: none;
    transition: color 0.3s;
  }
  .gi-footer-contact-item:hover { color: var(--gold); }
  .gi-footer-contact-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
    margin-top: 6px;
    opacity: 0.6;
  }

  /* ── Newsletter strip ── */
  .gi-footer-newsletter {
    padding: 36px 6vw;
    border-bottom: 1px solid rgba(250,248,243,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }
  .gi-footer-nl-text {
    font-family: var(--serif);
    font-size: clamp(18px, 2.5vw, 26px);
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.25;
  }
  .gi-footer-nl-text em { font-style: italic; color: var(--gold); }
  .gi-footer-nl-form {
    display: flex;
    gap: 0;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 8px;
  }
  .gi-footer-nl-input {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--ivory);
    background: rgba(250,248,243,0.06);
    border: 1px solid rgba(250,248,243,0.15);
    padding: 12px 20px;
    outline: none;
    width: 240px;
    max-width: 100%;
    transition: border-color 0.3s;
    border-radius: 0;
    appearance: none;
  }
  .gi-footer-nl-input::placeholder { color: rgba(250,248,243,0.3); }
  .gi-footer-nl-input:focus { border-color: var(--gold); }
  .gi-footer-nl-btn {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    border: none;
    padding: 12px 24px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.3s;
  }
  .gi-footer-nl-btn:hover { background: var(--gold-lt); }

  /* ── Bottom bar ── */
  .gi-footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 24px 6vw;
  }
  .gi-footer-copy {
    font-size: 11px;
    font-weight: 300;
    color: rgba(250,248,243,0.25);
    letter-spacing: 0.04em;
  }
  .gi-footer-legal {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  .gi-footer-legal a {
    font-size: 11px;
    font-weight: 300;
    color: rgba(250,248,243,0.25);
    text-decoration: none;
    letter-spacing: 0.04em;
    transition: color 0.3s;
  }
  .gi-footer-legal a:hover { color: var(--gold); }

  /* ── Decorative gold rule ── */
  .gi-footer-rule {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    opacity: 0.25;
    margin: 0 6vw;
  }
`

/* ── SVG Icon Components ──────────────────────────────────────────────────── */
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

const socials = [
  { label: 'Instagram', href: 'https://instagram.com/giftinnmusanze', Icon: IconInstagram },
  { label: 'YouTube',   href: 'https://youtube.com/@giftinnmusanze',  Icon: IconYouTube  },
  { label: 'LinkedIn',  href: 'https://linkedin.com/company/giftinn', Icon: IconLinkedIn  },
]

/* ── Footer Component ─────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="gi-footer">
      <style>{css}</style>

      {/* ── Brand band ── */}
      <div className="gi-footer-brand">
        <div>
          <Link to="/" className="gi-footer-logo">
            Gift<span>Inn</span>
          </Link>
          <p className="gi-footer-tagline">Musanze, Rwanda · Africa's Hidden Luxury</p>
        </div>

        {/* Social icons */}
        <div className="gi-footer-socials" role="list" aria-label="Follow us">
          {socials.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="gi-social-btn"
              aria-label={`Follow us on ${item.label}`}
              role="listitem"
            >
              <item.Icon />
            </a>
          ))}
        </div>
      </div>

      {/* ── Nav columns ── */}
      <div className="gi-footer-nav">

        {/* Explore */}
        <div className="gi-footer-col">
          <p className="gi-footer-col-title">Explore</p>
          <div className="gi-footer-links">
            {[
              { label: 'Rooms & Suites', to: '/rooms' },
              { label: 'Amenities',      to: '/amenities' },
              { label: 'Gallery',        to: '/gallery' },
              { label: 'About Us',       to: '/about' },
            ].map(({ label, to }) => (
              <Link key={to} className="gi-footer-link" to={to}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Plan */}
        <div className="gi-footer-col">
          <p className="gi-footer-col-title">Plan</p>
          <div className="gi-footer-links">
            {[
              { label: 'Book a Room',    to: '/booking' },
              { label: 'Offers & News',  to: '/blog'    },
              { label: 'Guest Reviews',  to: '/reviews' },
              { label: 'Experiences',    to: '/amenities' },
            ].map(({ label, to }) => (
              <Link key={label} className="gi-footer-link" to={to}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="gi-footer-col">
          <p className="gi-footer-col-title">Contact</p>
          <div className="gi-footer-links">
            <a
              className="gi-footer-contact-item"
              href={`https://wa.me/${hotelInfo.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="gi-footer-contact-dot" />
              {hotelInfo.phone}
            </a>
            <a
              className="gi-footer-contact-item"
              href={`mailto:${hotelInfo.email}`}
            >
              <span className="gi-footer-contact-dot" />
              {hotelInfo.email}
            </a>
            <span className="gi-footer-contact-item">
              <span className="gi-footer-contact-dot" />
              {hotelInfo.address}
            </span>
          </div>
        </div>

        {/* Hours */}
        <div className="gi-footer-col">
          <p className="gi-footer-col-title">Hours</p>
          <div className="gi-footer-links">
            {[
              'Reception: 24 / 7',
              'Dining: 6:30AM – 11PM',
              'Spa: 8AM – 9PM',
              'Pool: 7AM – 10PM',
            ].map((item) => (
              <span key={item} className="gi-footer-link" style={{ cursor: 'default' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div className="gi-footer-newsletter">
        <p className="gi-footer-nl-text">
          Stay updated with <em>offers & stories</em><br />from Musanze.
        </p>
        <div className="gi-footer-nl-form">
          <input
            type="email"
            className="gi-footer-nl-input"
            placeholder="Your email address"
            aria-label="Email for newsletter"
          />
          <button type="button" className="gi-footer-nl-btn">Subscribe</button>
        </div>
      </div>

      {/* ── Decorative rule ── */}
      <div className="gi-footer-rule" />

      {/* ── Bottom bar ── */}
      <div className="gi-footer-bottom">
        <p className="gi-footer-copy">© 2026 GiftInn Musanze. All rights reserved.</p>
        <div className="gi-footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

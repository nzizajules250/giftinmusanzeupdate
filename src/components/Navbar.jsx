import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from '../data/siteContent.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import AdminAuthModal from './AdminAuthModal.jsx'
import { usePanel } from '../context/PanelContext.jsx'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --gold:       #c8a96e;
    --gold-light: #d9be8a;
    --dark:       #0f0c08;
    --dark2:      #1a1410;
    --ivory:      #faf8f3;
    --muted:      rgba(250,248,243,0.52);
    --serif:      'Cormorant Garamond', Georgia, serif;
    --sans:       'Jost', sans-serif;
    --nav-h:      76px;
    --nav-h-sm:   60px;
  }

  .gi-header *, .gi-header *::before, .gi-header *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  /* ══════════════════════════
     NAV BAR
  ══════════════════════════ */
  .gi-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4vw;
    gap: 20px;
    background: transparent;
    transition: height 0.4s ease, background 0.5s ease, box-shadow 0.4s ease;
  }
  .gi-nav.scrolled {
    height: var(--nav-h-sm);
    background: rgba(15,12,8,0.94);
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    box-shadow: 0 1px 0 rgba(200,169,110,0.2);
  }

  /* Logo */
  .gi-logo {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: var(--ivory);
    text-decoration: none;
    flex-shrink: 0;
    position: relative;
    z-index: 1100;
    transition: opacity 0.3s;
  }
  .gi-logo span { color: var(--gold); font-style: italic; }
  .gi-logo:hover { opacity: 0.78; }

  /* Desktop centre links */
  .gi-links {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    flex: 1;
    justify-content: center;
  }
  .gi-link {
    font-family: var(--sans);
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    padding: 7px 10px;
    position: relative;
    transition: color 0.3s;
    white-space: nowrap;
  }
  .gi-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%;
    width: 70%; height: 1px;
    background: var(--gold);
    transform: translateX(-50%) scaleX(0);
    transition: transform 0.35s ease;
  }
  .gi-link:hover           { color: var(--ivory); }
  .gi-link:hover::after,
  .gi-link.active::after   { transform: translateX(-50%) scaleX(1); }
  .gi-link.active          { color: var(--gold); }

  /* Right controls */
  .gi-right {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
    position: relative;
    z-index: 1100;
  }
  .gi-lang {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    background: transparent;
    border: 1px solid rgba(200,169,110,0.28);
    padding: 7px 26px 7px 10px;
    cursor: pointer;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23c8a96e'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    transition: color 0.3s, border-color 0.3s;
  }
  .gi-lang option { background: var(--dark2); color: var(--ivory); }
  .gi-lang:hover, .gi-lang:focus { color: var(--ivory); border-color: var(--gold); }

  .gi-reserve {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 11px 22px;
    text-decoration: none;
    display: inline-block;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  }
  .gi-reserve::before {
    content: '';
    position: absolute;
    inset: 0; left: -100%;
    width: 60%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
    transition: left 0.5s ease;
  }
  .gi-reserve:hover::before { left: 150%; }
  .gi-reserve:hover {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(200,169,110,0.35);
  }

  .gi-theme {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ivory);
    background: transparent;
    border: 1px solid rgba(200,169,110,0.28);
    cursor: pointer;
  }
  .gi-theme:hover { border-color: var(--gold); color: var(--gold); }
  .gi-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  /* Hamburger */
  .gi-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    position: relative;
    z-index: 1100;
  }
  .gi-bar {
    display: block;
    width: 24px;
    height: 1.5px;
    background: var(--ivory);
    border-radius: 2px;
    transform-origin: center;
    transition: transform 0.4s ease, opacity 0.3s ease, width 0.3s ease;
  }
  .gi-toggle.open .gi-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .gi-toggle.open .gi-bar:nth-child(2) { opacity: 0; width: 0; }
  .gi-toggle.open .gi-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ══════════════════════════
     MOBILE FULL-SCREEN OVERLAY
  ══════════════════════════ */
  .gi-mobile {
    position: fixed;
    inset: 0;
    z-index: 1050;
    background: var(--dark);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10vw;
    overflow: hidden;
    /* wipe-down reveal */
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    transition: clip-path 0.65s cubic-bezier(0.77, 0, 0.175, 1);
    pointer-events: none;
  }
  .gi-mobile.open {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    pointer-events: all;
  }

  /* Decorative watermark */
  .gi-mobile-wm {
    position: absolute;
    bottom: 28px; right: 6vw;
    font-family: var(--serif);
    font-size: clamp(60px, 14vw, 130px);
    font-weight: 300;
    font-style: italic;
    color: rgba(200,169,110,0.05);
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }
  /* Vertical gold rule */
  .gi-mobile-rule {
    position: absolute;
    top: 80px; bottom: 80px; left: 6vw;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(200,169,110,0.5) 30%, rgba(200,169,110,0.5) 70%, transparent);
  }

  /* All mobile nav links */
  .gi-mobile-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .gi-mobile-link {
    font-family: var(--serif);
    font-size: clamp(30px, 6vw, 56px);
    font-weight: 300;
    color: rgba(250,248,243,0.48);
    text-decoration: none;
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(250,248,243,0.055);
    opacity: 0;
    transform: translateX(-28px);
    transition:
      color        0.3s ease,
      opacity      0.55s ease,
      transform    0.55s ease,
      padding-left 0.3s ease;
  }
  .gi-mobile.open .gi-mobile-link {
    opacity: 1;
    transform: translateX(0);
  }
  .gi-mobile-link:hover { color: var(--gold); padding-left: 6px; }
  .gi-mobile-link.active { color: var(--gold); }

  .gi-mobile-num {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: rgba(200,169,110,0.4);
    flex-shrink: 0;
  }

  /* Mobile footer */
  .gi-mobile-footer {
    margin-top: 36px;
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .gi-mobile.open .gi-mobile-footer {
    opacity: 1;
    transform: translateY(0);
  }

  /* ══════════════════════════
     RESPONSIVE BREAKPOINTS
  ══════════════════════════ */

  /* Large desktop — full layout */
  @media (min-width: 1025px) {
    .gi-toggle { display: none !important; }
    .gi-mobile  { display: none !important; }
  }

  /* Tablet (769–1024px): tighten link spacing, keep all visible */
  @media (max-width: 1024px) and (min-width: 769px) {
    .gi-link {
      font-size: 9px;
      padding: 6px 6px;
      letter-spacing: 0.15em;
    }
    .gi-reserve { padding: 10px 16px; font-size: 9.5px; }
    .gi-lang    { padding: 7px 22px 7px 8px; }
  }

  /* Mobile (≤768px): hamburger mode */
  @media (max-width: 768px) {
    .gi-links   { display: none; }
    .gi-lang    { display: none; }
    .gi-reserve { display: none; }
    .gi-toggle  { display: flex; }
  }

  /* Tiny screens */
  @media (max-width: 360px) {
    .gi-logo { font-size: 18px; }
    .gi-mobile-link { font-size: 28px; }
  }
`

function Navbar() {
  const [open, setOpen]           = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { theme, toggleTheme }    = useTheme()
  const { setOpenPanel, setPanelTab } = usePanel()
  const lastTapRef                = useRef(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navClass       = ({ isActive }) => `gi-link${isActive ? ' active' : ''}`
  const mobileNavClass = ({ isActive }) => `gi-mobile-link${isActive ? ' active' : ''}`
  const openAdmin      = () => setAdminOpen(true)

  const handleLogoDoubleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    openAdmin()
  }

  const handleLogoTouch = (event) => {
    const now = Date.now()
    const delta = now - lastTapRef.current
    if (delta > 0 && delta < 350) {
      event.preventDefault()
      event.stopPropagation()
      openAdmin()
    }
    lastTapRef.current = now
  }

  return (
    <header className="gi-header">
      <style>{css}</style>

      {/* ══ DESKTOP / TABLET NAV ══ */}
      <nav className={`gi-nav${scrolled ? ' scrolled' : ''}`}>

        <NavLink
          to="/"
          className="gi-logo"
          onDoubleClick={handleLogoDoubleClick}
          onTouchStart={handleLogoTouch}
          aria-label="GiftInn Home (double tap for admin)"
        >
          Gift<span>Inn</span>
        </NavLink>

        {/* ALL links — always present in DOM, hidden via CSS on mobile */}
        <ul className="gi-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={navClass} end>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="gi-right">
          <button type="button" className="gi-theme" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <svg className="gi-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4.5a1 1 0 0 1 1 1v1.6a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 12a1 1 0 0 1 1 1v1.6a1 1 0 1 1-2 0v-1.6a1 1 0 0 1 1-1zm7.5-4.5a1 1 0 0 1-1 1h-1.6a1 1 0 1 1 0-2H18.5a1 1 0 0 1 1 1zM8.1 12a1 1 0 0 1-1 1H5.5a1 1 0 1 1 0-2h1.6a1 1 0 0 1 1 1zm8.2-5.7a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 1 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0zM9.2 16.5a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0zm7.1 1.5a1 1 0 0 1-1.4 0l-1.1-1.1a1 1 0 0 1 1.4-1.4l1.1 1.1a1 1 0 0 1 0 1.4zM9.2 7.5a1 1 0 0 1-1.4 0L6.7 6.4A1 1 0 0 1 8.1 5l1.1 1.1a1 1 0 0 1 0 1.4zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
              </svg>
            ) : (
              <svg className="gi-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a1 1 0 0 1 .2 1.96A6.5 6.5 0 1 0 19.04 14.3a1 1 0 0 1 1.96.2z"/>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="gi-theme"
            onClick={() => {
              setPanelTab('notifications')
              setOpenPanel('panel')
            }}
            aria-label="Open notifications"
          >
            <svg className="gi-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22a2.5 2.5 0 0 0 2.4-1.8h-4.8A2.5 2.5 0 0 0 12 22zm6-6V11a6 6 0 0 0-12 0v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>

          <button
            type="button"
            className="gi-theme"
            onClick={() => {
              setPanelTab('announcements')
              setOpenPanel('panel')
            }}
            aria-label="Open announcements"
          >
            <svg className="gi-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 10v4a1 1 0 0 0 1 1h2l2.6 4.4a1 1 0 0 0 1.8-.4V5a1 1 0 0 0-1.8-.4L7 9H5a1 1 0 0 0-1 1zm9-5v14l7-3V8l-7-3z"/>
            </svg>
          </button>

          <select
            className="gi-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="rw">RW</option>
            <option value="fr">FR</option>
          </select>

          <NavLink to="/booking" className="gi-reserve">
            Reserve
          </NavLink>

          <button
            type="button"
            className={`gi-toggle${open ? ' open' : ''}`}
            onClick={() => setOpen((p) => !p)}
            aria-expanded={open}
            aria-controls="gi-mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="gi-bar" />
            <span className="gi-bar" />
            <span className="gi-bar" />
          </button>
        </div>
      </nav>

      {/* ══ MOBILE OVERLAY — ALL links shown again ══ */}
      <div
        id="gi-mobile-menu"
        className={`gi-mobile${open ? ' open' : ''}`}
        aria-hidden={!open}
      >
        <div className="gi-mobile-rule" aria-hidden="true" />
        <span className="gi-mobile-wm" aria-hidden="true">GiftInn</span>

        <ul className="gi-mobile-links">
          {navItems.map((item, idx) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={mobileNavClass}
                end
                onClick={() => setOpen(false)}
                style={{
                  transitionDelay: open ? `${0.08 + idx * 0.07}s` : '0s',
                }}
              >
                <span className="gi-mobile-num">0{idx + 1}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div
          className="gi-mobile-footer"
          style={{ transitionDelay: open ? `${0.08 + navItems.length * 0.07}s` : '0s' }}
        >
          <button type="button" className="gi-theme" onClick={toggleTheme} style={{ borderColor: 'rgba(200,169,110,0.35)' }}>
            {theme === 'dark' ? (
              <svg className="gi-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4.5a1 1 0 0 1 1 1v1.6a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 12a1 1 0 0 1 1 1v1.6a1 1 0 1 1-2 0v-1.6a1 1 0 0 1 1-1zm7.5-4.5a1 1 0 0 1-1 1h-1.6a1 1 0 1 1 0-2H18.5a1 1 0 0 1 1 1zM8.1 12a1 1 0 0 1-1 1H5.5a1 1 0 1 1 0-2h1.6a1 1 0 0 1 1 1zm8.2-5.7a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 1 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0zM9.2 16.5a1 1 0 0 1 0 1.4l-1.1 1.1a1 1 0 0 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0zm7.1 1.5a1 1 0 0 1-1.4 0l-1.1-1.1a1 1 0 0 1 1.4-1.4l1.1 1.1a1 1 0 0 1 0 1.4zM9.2 7.5a1 1 0 0 1-1.4 0L6.7 6.4A1 1 0 0 1 8.1 5l1.1 1.1a1 1 0 0 1 0 1.4zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
              </svg>
            ) : (
              <svg className="gi-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a1 1 0 0 1 .2 1.96A6.5 6.5 0 1 0 19.04 14.3a1 1 0 0 1 1.96.2z"/>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="gi-theme"
            onClick={() => {
              setPanelTab('notifications')
              setOpenPanel('panel')
            }}
            style={{ borderColor: 'rgba(200,169,110,0.35)' }}
            aria-label="Open notifications"
          >
            <svg className="gi-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22a2.5 2.5 0 0 0 2.4-1.8h-4.8A2.5 2.5 0 0 0 12 22zm6-6V11a6 6 0 0 0-12 0v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>

          <button
            type="button"
            className="gi-theme"
            onClick={() => {
              setPanelTab('announcements')
              setOpenPanel('panel')
            }}
            style={{ borderColor: 'rgba(200,169,110,0.35)' }}
            aria-label="Open announcements"
          >
            <svg className="gi-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 10v4a1 1 0 0 0 1 1h2l2.6 4.4a1 1 0 0 0 1.8-.4V5a1 1 0 0 0-1.8-.4L7 9H5a1 1 0 0 0-1 1zm9-5v14l7-3V8l-7-3z"/>
            </svg>
          </button>

          <select
            className="gi-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ display: 'block', color: 'var(--ivory)', borderColor: 'rgba(200,169,110,0.35)' }}
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="rw">RW</option>
            <option value="fr">FR</option>
          </select>

          <NavLink
            to="/booking"
            className="gi-reserve"
            onClick={() => setOpen(false)}
          >
            Reserve a Room
          </NavLink>
        </div>
      </div>

      <AdminAuthModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </header>
  )
}

export default Navbar

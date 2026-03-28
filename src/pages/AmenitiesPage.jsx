import { useState } from 'react'
import { amenities } from '../data/siteContent.js'
import { useSeo } from '../hooks/useSeo.js'

// ── Amenity metadata (icons + images mapped to your real amenities data) ──────
const amenityMeta = {
  'Spa & Wellness': {
    icon: '🧖',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    tag: 'Signature Experience',
    details: ['Steam room & sauna', 'Volcanic stone massage', 'Beauty & skin treatments', 'Recovery & relaxation sessions'],
  },
  'Infinity Pool': {
    icon: '🏊',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    tag: 'Most Popular',
    details: ['Heated year-round', 'Panoramic volcano views', 'Poolside bar service', 'Private cabanas available'],
  },
  'Fitness Studio': {
    icon: '💪',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    tag: 'Wellness',
    details: ['Modern equipment', 'Personal coaching on request', 'Open 6AM – 10PM', 'Yoga & stretching area'],
  },
  'Fine Dining': {
    icon: '🍽️',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    tag: 'Farm-to-Table',
    details: ['Local & international menu', 'Chef tasting nights', 'Private dining available', 'Breakfast included in suites'],
  },
  'Conference Rooms': {
    icon: '🏛️',
    image: 'https://i.pinimg.com/736x/8b/65/ef/8b65ef8d6fee8aef8112bd122c2096d6.jpg',
    tag: 'Business Ready',
    details: ['Hybrid meeting setup', 'High-speed fibre Wi-Fi', 'Catering & refreshments', 'Capacity up to 80 guests'],
  },
  'Airport Transfer': {
    icon: '🚐',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    tag: 'Complimentary',
    details: ['Private & group options', 'Kigali airport pickup', 'Local guided transport', '24/7 on-request booking'],
  },
}

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

  .am-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .am-wrap {
    font-family: var(--sans);
    background: var(--ivory);
    min-height: 100vh;
    padding-top: 76px;
    overflow-x: hidden;
  }

  /* ════════════════════════════
     HERO
  ════════════════════════════ */
  .am-hero {
    position: relative;
    height: 60vh;
    min-height: 420px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }
  .am-hero-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=85');
    background-size: cover;
    background-position: center 35%;
    animation: amZoom 10s ease forwards;
  }
  @keyframes amZoom {
    from { transform: scale(1.06); }
    to   { transform: scale(1); }
  }
  .am-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,8,4,0.9) 0%, rgba(10,8,4,0.35) 55%, transparent 100%);
  }
  .am-hero-content {
    position: relative;
    z-index: 2;
    padding: 0 6vw 56px;
    max-width: 680px;
  }
  .am-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
    opacity: 0;
    animation: amFadeUp 0.7s ease 0.2s forwards;
  }
  .am-hero-title {
    font-family: var(--serif);
    font-size: clamp(40px, 6vw, 78px);
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.05;
    opacity: 0;
    animation: amFadeUp 0.8s ease 0.4s forwards;
  }
  .am-hero-title em { font-style: italic; color: var(--gold); }
  .am-hero-desc {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: rgba(250,248,243,0.6);
    line-height: 1.8;
    margin-top: 18px;
    opacity: 0;
    animation: amFadeUp 0.7s ease 0.6s forwards;
  }
  @keyframes amFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* scroll hint */
  .am-hero-scroll {
    position: absolute;
    bottom: 32px;
    right: 5vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 2;
    opacity: 0;
    animation: amFadeUp 0.7s ease 1.0s forwards;
  }
  .am-hero-scroll-line {
    width: 1px;
    height: 52px;
    background: linear-gradient(to bottom, rgba(200,169,110,0.8), transparent);
    animation: amScrollPulse 2s ease-in-out infinite;
  }
  .am-hero-scroll-label {
    font-family: var(--sans);
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.4);
    writing-mode: vertical-rl;
  }
  @keyframes amScrollPulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }

  /* ════════════════════════════
     STATS STRIP
  ════════════════════════════ */
  .am-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--dark2);
    border-bottom: 1px solid rgba(200,169,110,0.18);
  }
  @media (max-width: 768px) { .am-stats { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 400px) { .am-stats { grid-template-columns: 1fr; } }

  .am-stat {
    padding: 36px 32px;
    border-right: 1px solid rgba(250,248,243,0.07);
    text-align: center;
  }
  .am-stat:last-child { border-right: none; }
  .am-stat-num {
    font-family: var(--serif);
    font-size: 44px;
    font-weight: 300;
    color: var(--gold);
    line-height: 1;
  }
  .am-stat-label {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.4);
    margin-top: 8px;
  }

  /* ════════════════════════════
     AMENITIES — ALTERNATING ROWS
  ════════════════════════════ */
  .am-section-header {
    padding: 80px 6vw 48px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    border-bottom: 1px solid var(--sand);
  }
  .am-section-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .am-section-title {
    font-family: var(--serif);
    font-size: clamp(32px, 4vw, 58px);
    font-weight: 300;
    color: var(--dark2);
    line-height: 1.1;
  }
  .am-section-title em { font-style: italic; color: var(--gold); }

  /* Tab filters */
  .am-tabs {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
  .am-tab {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 9px 18px;
    background: transparent;
    border: 1px solid var(--sand);
    color: var(--muted);
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
  }
  .am-tab:hover { border-color: var(--gold); color: var(--dark2); }
  .am-tab.active { background: var(--dark2); border-color: var(--dark2); color: var(--ivory); }

  /* Alternating feature rows */
  .am-rows { border-top: 1px solid var(--sand); }

  .am-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-bottom: 1px solid var(--sand);
    overflow: hidden;
    transition: opacity 0.4s ease, max-height 0.5s ease;
  }
  .am-row.hidden {
    display: none;
  }
  @media (max-width: 768px) {
    .am-row { grid-template-columns: 1fr; }
  }

  /* Flip image order for even rows */
  .am-row:nth-child(even) .am-row-img  { order: 2; }
  .am-row:nth-child(even) .am-row-text { order: 1; }
  @media (max-width: 768px) {
    .am-row:nth-child(even) .am-row-img  { order: 0; }
    .am-row:nth-child(even) .am-row-text { order: 0; }
  }

  .am-row-img {
    position: relative;
    overflow: hidden;
    min-height: 380px;
  }
  @media (max-width: 768px) { .am-row-img { min-height: 260px; } }

  .am-row-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s ease;
  }
  .am-row:hover .am-row-img img { transform: scale(1.04); }

  .am-row-img-tag {
    position: absolute;
    top: 20px; left: 20px;
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(200,169,110,0.5);
    padding: 6px 12px;
    background: rgba(10,8,4,0.45);
    backdrop-filter: blur(4px);
  }

  .am-row-text {
    padding: 60px 5vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--ivory);
    position: relative;
  }
  /* Accent left rule on odd, right on even */
  .am-row:nth-child(odd)  .am-row-text::before {
    content: '';
    position: absolute;
    left: 0; top: 48px; bottom: 48px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(200,169,110,0.4), transparent);
  }
  .am-row:nth-child(even) .am-row-text::after {
    content: '';
    position: absolute;
    right: 0; top: 48px; bottom: 48px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(200,169,110,0.4), transparent);
  }

  .am-row-icon {
    font-size: 28px;
    margin-bottom: 20px;
    display: block;
  }
  .am-row-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px;
  }
  .am-row-title {
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 44px);
    font-weight: 300;
    color: var(--dark2);
    line-height: 1.15;
  }
  .am-divider {
    width: 40px; height: 1px;
    background: var(--gold);
    margin: 22px 0;
    opacity: 0.7;
  }
  .am-row-body {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.85;
  }
  .am-row-details {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .am-row-detail {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 400;
    color: var(--dark2);
  }
  .am-row-detail::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
  }

  /* ════════════════════════════
     QUICK-ACCESS CARDS (compact grid)
  ════════════════════════════ */
  .am-grid-section {
    padding: 80px 6vw;
    background: var(--dark2);
  }
  .am-grid-title {
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 48px);
    font-weight: 300;
    color: var(--ivory);
    margin-bottom: 48px;
  }
  .am-grid-title em { font-style: italic; color: var(--gold); }
  .am-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(250,248,243,0.07);
    border: 1px solid rgba(250,248,243,0.07);
  }
  @media (max-width: 900px) { .am-cards { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .am-cards { grid-template-columns: 1fr; } }

  .am-card {
    background: var(--dark2);
    padding: 44px 36px;
    transition: background 0.3s;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .am-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 2px;
    background: var(--gold);
    transition: width 0.4s ease;
  }
  .am-card:hover { background: rgba(250,248,243,0.03); }
  .am-card:hover::after { width: 100%; }

  .am-card-icon { font-size: 28px; margin-bottom: 18px; display: block; }
  .am-card-title {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 400;
    color: var(--ivory);
    margin-bottom: 12px;
  }
  .am-card-text {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.48);
    line-height: 1.75;
  }

  /* ════════════════════════════
     ENQUIRY CTA BAND
  ════════════════════════════ */
  .am-cta {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 40px;
    padding: 60px 6vw;
    border-top: 1px solid var(--sand);
    border-bottom: 1px solid var(--sand);
    flex-wrap: wrap;
  }
  @media (max-width: 640px) {
    .am-cta { grid-template-columns: 1fr; }
  }
  .am-cta-text {
    font-family: var(--serif);
    font-size: clamp(24px, 3vw, 42px);
    font-weight: 300;
    color: var(--dark2);
    line-height: 1.2;
  }
  .am-cta-text em { font-style: italic; color: var(--gold); }
  .am-cta-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .am-btn-primary {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 15px 32px;
    text-decoration: none;
    display: inline-block;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition: background 0.3s, transform 0.2s;
  }
  .am-btn-primary:hover { background: var(--gold-lt, #d9be8a); transform: translateY(-1px); }
  .am-btn-ghost {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark2);
    background: transparent;
    border: 1px solid var(--sand);
    padding: 14px 32px;
    text-decoration: none;
    display: inline-block;
    white-space: nowrap;
    transition: border-color 0.3s, color 0.3s;
  }
  .am-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
`

const FILTER_CATEGORIES = ['All', 'Wellness', 'Leisure', 'Business', 'Transport']
const amenityCategories = {
  'Spa & Wellness':  'Wellness',
  'Infinity Pool':   'Leisure',
  'Fitness Studio':  'Wellness',
  'Fine Dining':     'Leisure',
  'Conference Rooms':'Business',
  'Airport Transfer':'Transport',
}

const stats = [
  { num: '6+',   label: 'Premium Services' },
  { num: '24/7', label: 'Guest Support' },
  { num: '98%',  label: 'Satisfaction Rate' },
  { num: '5★',   label: 'Rated Excellence' },
]

function AmenitiesPage() {
  useSeo({
    title: 'GiftInn Musanze | Amenities & Services',
    description: 'Discover GiftInn spa, pool, gym, dining, airport transfer and conference services.',
  })

  const [activeFilter, setActiveFilter] = useState('All')

  const isVisible = (item) =>
    activeFilter === 'All' || amenityCategories[item.title] === activeFilter

  return (
    <div className="am-wrap">
      <style>{css}</style>

      {/* ════ HERO ════ */}
      <section className="am-hero">
        <div className="am-hero-bg" />
        <div className="am-hero-overlay" />
        <div className="am-hero-content">
          <p className="am-eyebrow">Services & Amenities</p>
          <h1 className="am-hero-title">
            Amenities That<br />Elevate <em>Every Stay</em>
          </h1>
          <p className="am-hero-desc">
            From volcanic stone spa rituals to business-ready conference suites — every service at GiftInn is crafted to exceed your expectations.
          </p>
        </div>
        <div className="am-hero-scroll">
          <div className="am-hero-scroll-line" />
          <span className="am-hero-scroll-label">Scroll</span>
        </div>
      </section>

      {/* ════ STATS STRIP ════ */}
      <div className="am-stats">
        {stats.map((s) => (
          <div className="am-stat" key={s.label}>
            <div className="am-stat-num">{s.num}</div>
            <div className="am-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ════ AMENITY FEATURE ROWS ════ */}
      <div className="am-section-header">
        <div>
          <p className="am-section-eyebrow">What We Offer</p>
          <h2 className="am-section-title">Our <em>Services</em></h2>
        </div>
        <div className="am-tabs">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`am-tab${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="am-rows">
        {amenities.map((item) => {
          const meta = amenityMeta[item.title] || {}
          return (
            <div
              className={`am-row${isVisible(item) ? '' : ' hidden'}`}
              key={item.title}
            >
              {/* Image side */}
              <div className="am-row-img">
                {meta.image && (
                  <img src={meta.image} alt={item.title} loading="lazy" />
                )}
                {meta.tag && (
                  <span className="am-row-img-tag">{meta.tag}</span>
                )}
              </div>

              {/* Text side */}
              <div className="am-row-text">
                {meta.icon && (
                  <span className="am-row-icon">{meta.icon}</span>
                )}
                <p className="am-row-eyebrow">{amenityCategories[item.title] || 'Service'}</p>
                <h3 className="am-row-title">{item.title}</h3>
                <div className="am-divider" />
                <p className="am-row-body">{item.text}</p>
                {meta.details && (
                  <div className="am-row-details">
                    {meta.details.map((d) => (
                      <div className="am-row-detail" key={d}>{d}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ════ QUICK CARD GRID (dark) ════ */}
      <div className="am-grid-section">
        <h2 className="am-grid-title">
          Everything at a<br /><em>Glance</em>
        </h2>
        <div className="am-cards">
          {amenities.map((item) => {
            const meta = amenityMeta[item.title] || {}
            return (
              <div className="am-card" key={`card-${item.title}`}>
                <span className="am-card-icon">{meta.icon || '✦'}</span>
                <p className="am-card-title">{item.title}</p>
                <p className="am-card-text">{item.text}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ════ CTA BAND ════ */}
      <div className="am-cta">
        <p className="am-cta-text">
          Ready to enjoy <em>every amenity</em><br />GiftInn has to offer?
        </p>
        <div className="am-cta-actions">
          <a href="/booking" className="am-btn-primary">Book Your Stay</a>
          <a href="/contact" className="am-btn-ghost">Enquire</a>
        </div>
      </div>
    </div>
  )
}

export default AmenitiesPage
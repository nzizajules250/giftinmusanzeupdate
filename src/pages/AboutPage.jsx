import { useSeo } from '../hooks/useSeo.js'

// ── Mock data (replace with your real imports) ────────────────────────────────
const hotelInfo = {
  address: 'KN 3 Ave, Musanze District, Northern Province, Rwanda',
}

const values = [
  { icon: '✦', title: 'Service Excellence', text: 'Every interaction is crafted to exceed expectations — from the first greeting to checkout.' },
  { icon: '✦', title: 'Sustainability', text: 'Solar-powered facilities, zero-waste kitchens, and a deep commitment to the Rwandan ecosystem.' },
  { icon: '✦', title: 'Cultural Authenticity', text: 'We celebrate Rwandan heritage through design, cuisine, art, and the warmth of every team member.' },
  { icon: '✦', title: 'Community First', text: 'We source local, hire local, and invest in the communities that make Musanze extraordinary.' },
]

const team = [
  { name: 'Amara Nkusi',     role: 'General Manager',       img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80' },
  { name: 'Jean-Paul Habimana', role: 'Head Chef',          img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80' },
  { name: 'Sophie Uwimana',  role: 'Spa Director',          img: 'https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=400&q=80' },
  { name: 'David Mugabo',    role: 'Experiences Curator',   img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
]

const milestones = [
  { year: '2018', event: 'GiftInn opens its doors in Musanze with 12 rooms and a vision.' },
  { year: '2020', event: 'Expansion to 40 rooms, full spa wing, and farm-to-table restaurant.' },
  { year: '2022', event: 'Awarded "Best Boutique Hotel" at Rwanda Hospitality Excellence Awards.' },
  { year: '2024', event: 'Launched eco-certification and gorilla trekking partnership programme.' },
]

// ── Styles ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

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

  .ab-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .ab-wrap {
    font-family: var(--sans);
    background: var(--ivory);
    min-height: 100vh;
    padding-top: 76px;
    overflow-x: hidden;
  }

  /* ════════════════════════════
     HERO
  ════════════════════════════ */
  .ab-hero {
    position: relative;
    height: 80vh;
    min-height: 540px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }
  @media (max-width: 768px) {
    .ab-hero { grid-template-columns: 1fr; height: auto; }
  }

  .ab-hero-img {
    position: relative;
    overflow: hidden;
  }
  .ab-hero-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: scale(1.05);
    animation: abHeroZoom 8s ease forwards;
  }
  @keyframes abHeroZoom {
    to { transform: scale(1); }
  }
  .ab-hero-img::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, transparent 60%, var(--ivory) 100%);
  }
  @media (max-width: 768px) {
    .ab-hero-img { height: 55vw; min-height: 280px; }
    .ab-hero-img::after { background: linear-gradient(to bottom, transparent 60%, var(--ivory) 100%); }
  }

  .ab-hero-content {
    background: var(--ivory);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 6vw 80px 5vw;
    position: relative;
  }
  .ab-hero-content::before {
    content: '';
    position: absolute;
    top: 60px; bottom: 60px; left: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    opacity: 0.5;
  }

  .ab-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    opacity: 0;
    animation: abFadeUp 0.7s ease 0.3s forwards;
  }
  .ab-title {
    font-family: var(--serif);
    font-size: clamp(38px, 4.5vw, 68px);
    font-weight: 300;
    line-height: 1.05;
    color: var(--dark2);
    opacity: 0;
    animation: abFadeUp 0.8s ease 0.5s forwards;
  }
  .ab-title em { font-style: italic; color: var(--gold); }
  .ab-lead {
    font-family: var(--sans);
    font-size: 15px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.8;
    margin-top: 22px;
    max-width: 420px;
    opacity: 0;
    animation: abFadeUp 0.7s ease 0.7s forwards;
  }
  .ab-divider {
    width: 48px; height: 1px;
    background: var(--gold);
    margin: 28px 0;
    opacity: 0;
    animation: abFadeUp 0.6s ease 0.9s forwards;
  }
  .ab-stats {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    opacity: 0;
    animation: abFadeUp 0.7s ease 1.0s forwards;
  }
  .ab-stat-num {
    font-family: var(--serif);
    font-size: 46px;
    font-weight: 300;
    color: var(--dark2);
    line-height: 1;
  }
  .ab-stat-label {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 6px;
  }

  @keyframes abFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ════════════════════════════
     MISSION SPLIT
  ════════════════════════════ */
  .ab-mission {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin-top: 0;
    border-top: 1px solid var(--sand);
  }
  @media (max-width: 768px) {
    .ab-mission { grid-template-columns: 1fr; }
  }
  .ab-mission-text {
    padding: 80px 6vw;
    border-right: 1px solid var(--sand);
  }
  @media (max-width: 768px) {
    .ab-mission-text { border-right: none; border-bottom: 1px solid var(--sand); padding: 60px 6vw; }
  }
  .ab-section-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }
  .ab-section-title {
    font-family: var(--serif);
    font-size: clamp(30px, 3.5vw, 52px);
    font-weight: 300;
    line-height: 1.1;
    color: var(--dark2);
  }
  .ab-section-title em { font-style: italic; color: var(--gold); }
  .ab-body {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.85;
    margin-top: 20px;
  }

  .ab-mission-img {
    position: relative;
    overflow: hidden;
    min-height: 420px;
  }
  @media (max-width: 768px) { .ab-mission-img { min-height: 280px; } }
  .ab-mission-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s ease;
  }
  .ab-mission-img:hover img { transform: scale(1.04); }
  .ab-mission-img-label {
    position: absolute;
    bottom: 24px; left: 24px;
    font-family: var(--serif);
    font-size: 14px;
    font-weight: 300;
    font-style: italic;
    color: rgba(250,248,243,0.8);
    padding: 6px 14px;
    border: 1px solid rgba(250,248,243,0.25);
    background: rgba(10,8,4,0.35);
    backdrop-filter: blur(4px);
  }

  /* ════════════════════════════
     VALUES GRID
  ════════════════════════════ */
  .ab-values {
    background: var(--dark2);
    padding: 100px 6vw;
    position: relative;
    overflow: hidden;
  }
  .ab-values::before {
    content: '"';
    position: absolute;
    top: -60px; right: 4vw;
    font-family: var(--serif);
    font-size: 400px;
    color: rgba(200,169,110,0.04);
    line-height: 1;
    pointer-events: none;
  }
  .ab-values-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 60px;
  }
  .ab-values-title {
    font-family: var(--serif);
    font-size: clamp(30px, 3.5vw, 52px);
    font-weight: 300;
    color: var(--ivory);
  }
  .ab-values-title em { font-style: italic; color: var(--gold); }
  .ab-values-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: rgba(250,248,243,0.06);
    border: 1px solid rgba(250,248,243,0.06);
  }
  @media (max-width: 600px) {
    .ab-values-grid { grid-template-columns: 1fr; }
  }
  .ab-value-card {
    background: var(--dark2);
    padding: 48px 40px;
    transition: background 0.3s;
    position: relative;
  }
  .ab-value-card:hover { background: rgba(250,248,243,0.03); }
  .ab-value-icon {
    font-size: 13px;
    color: var(--gold);
    margin-bottom: 20px;
    display: block;
  }
  .ab-value-title {
    font-family: var(--serif);
    font-size: 24px;
    font-weight: 400;
    color: var(--ivory);
    margin-bottom: 14px;
  }
  .ab-value-text {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.5);
    line-height: 1.8;
  }

  /* ════════════════════════════
     TIMELINE
  ════════════════════════════ */
  .ab-timeline {
    padding: 100px 6vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    border-bottom: 1px solid var(--sand);
  }
  @media (max-width: 900px) {
    .ab-timeline { grid-template-columns: 1fr; gap: 48px; }
  }
  .ab-timeline-items {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .ab-timeline-item {
    display: flex;
    gap: 28px;
    padding: 28px 0;
    border-bottom: 1px solid var(--sand);
    position: relative;
  }
  .ab-timeline-item:last-child { border-bottom: none; }
  .ab-timeline-year {
    font-family: var(--serif);
    font-size: 32px;
    font-weight: 300;
    color: var(--gold);
    flex-shrink: 0;
    width: 72px;
    line-height: 1;
  }
  .ab-timeline-event {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.75;
    padding-top: 6px;
  }

  .ab-timeline-visual {
    position: relative;
    overflow: hidden;
    border-radius: 0;
  }
  .ab-timeline-visual img {
    width: 100%;
    height: 480px;
    object-fit: cover;
    display: block;
  }
  @media (max-width: 900px) {
    .ab-timeline-visual img { height: 280px; }
  }
  .ab-timeline-visual-caption {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 32px 28px;
    background: linear-gradient(to top, rgba(10,8,4,0.85) 0%, transparent 100%);
  }
  .ab-timeline-visual-title {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 300;
    font-style: italic;
    color: var(--ivory);
  }
  .ab-timeline-visual-sub {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 6px;
  }

  /* ════════════════════════════
     TEAM
  ════════════════════════════ */
  .ab-team {
    padding: 100px 6vw;
    background: var(--ivory);
    border-bottom: 1px solid var(--sand);
  }
  .ab-team-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 60px;
    flex-wrap: wrap;
    gap: 20px;
  }
  .ab-team-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
  @media (max-width: 900px) { .ab-team-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .ab-team-grid { grid-template-columns: 1fr 1fr; } }

  .ab-team-card {
    position: relative;
    overflow: hidden;
    cursor: default;
  }
  .ab-team-card img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    display: block;
    filter: grayscale(30%);
    transition: filter 0.5s ease, transform 0.6s ease;
  }
  .ab-team-card:hover img {
    filter: grayscale(0%);
    transform: scale(1.04);
  }
  .ab-team-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 28px 20px;
    background: linear-gradient(to top, rgba(10,8,4,0.9) 0%, transparent 100%);
    transform: translateY(8px);
    transition: transform 0.4s ease;
  }
  .ab-team-card:hover .ab-team-overlay { transform: translateY(0); }
  .ab-team-name {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 400;
    color: var(--ivory);
  }
  .ab-team-role {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 5px;
  }

  /* ════════════════════════════
     LOCATION
  ════════════════════════════ */
  .ab-location {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    min-height: 500px;
  }
  @media (max-width: 768px) {
    .ab-location { grid-template-columns: 1fr; }
  }
  .ab-location-info {
    background: var(--dark);
    padding: 80px 6vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ab-location-title {
    font-family: var(--serif);
    font-size: clamp(30px, 3vw, 48px);
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.15;
  }
  .ab-location-title em { font-style: italic; color: var(--gold); }
  .ab-location-address {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.5);
    line-height: 1.8;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(250,248,243,0.08);
  }
  .ab-location-detail {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ab-location-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.45);
    line-height: 1.6;
  }
  .ab-location-row-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
    margin-top: 7px;
    opacity: 0.7;
  }
  .ab-location-map {
    position: relative;
    overflow: hidden;
    background: #1a1a1a;
    min-height: 380px;
  }
  .ab-location-map iframe {
    width: 100%; height: 100%;
    min-height: 380px;
    border: 0;
    display: block;
    filter: grayscale(20%) contrast(0.95);
  }

  /* ════════════════════════════
     CLOSING CTA
  ════════════════════════════ */
  .ab-cta {
    padding: 100px 6vw;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ab-cta::before {
    content: 'GiftInn';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--serif);
    font-size: clamp(80px, 18vw, 220px);
    font-weight: 300;
    font-style: italic;
    color: rgba(200,169,110,0.06);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    line-height: 1;
  }
  .ab-cta-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }
  .ab-cta-title {
    font-family: var(--serif);
    font-size: clamp(36px, 5vw, 72px);
    font-weight: 300;
    color: var(--dark2);
    line-height: 1.1;
    position: relative;
  }
  .ab-cta-title em { font-style: italic; color: var(--gold); }
  .ab-cta-actions {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    position: relative;
  }
  .ab-btn-primary {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 15px 36px;
    text-decoration: none;
    display: inline-block;
    transition: background 0.3s, transform 0.2s;
  }
  .ab-btn-primary:hover {
    background: var(--gold-lt, #d9be8a);
    transform: translateY(-1px);
  }
  .ab-btn-ghost {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark2);
    background: transparent;
    border: 1px solid var(--sand);
    padding: 14px 36px;
    text-decoration: none;
    display: inline-block;
    transition: border-color 0.3s, color 0.3s;
  }
  .ab-btn-ghost:hover {
    border-color: var(--gold);
    color: var(--gold);
  }
`

function AboutPage() {
  useSeo({
    title: 'GiftInn Musanze | About Us',
    description: 'Learn GiftInn story, values, team and location in Musanze, Rwanda.',
  })

  return (
    <div className="ab-wrap">
      <style>{css}</style>

      {/* ════ HERO ════ */}
      <section className="ab-hero">
        <div className="ab-hero-img">
          <img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=85"
            alt="GiftInn Musanze exterior"
          />
        </div>
        <div className="ab-hero-content">
          <p className="ab-eyebrow">About GiftInn Musanze</p>
          <h1 className="ab-title">
            Our Story,<br />People &<br /><em>Values</em>
          </h1>
          <div className="ab-divider" />
          <p className="ab-lead">
            Born from a love of Rwanda's extraordinary landscapes, GiftInn was built to share the wonder of Musanze with the world — without compromise on comfort, culture, or soul.
          </p>
          <div className="ab-divider" />
          <div className="ab-stats">
            {[
              { n: '2018', l: 'Founded' },
              { n: '98%', l: 'Guest satisfaction' },
              { n: '40+', l: 'Rooms & Suites' },
            ].map((s) => (
              <div key={s.l}>
                <div className="ab-stat-num">{s.n}</div>
                <div className="ab-stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ MISSION ════ */}
      <section className="ab-mission">
        <div className="ab-mission-text">
          <p className="ab-section-eyebrow">Our Purpose</p>
          <h2 className="ab-section-title">
            Mission &<br /><em>Philosophy</em>
          </h2>
          <p className="ab-body" style={{ marginTop: 24 }}>
            Our mission is to blend premium comfort, local culture, and seamless hospitality for every guest who walks through our doors — whether they arrive from around the corner or across the world.
          </p>
          <p className="ab-body" style={{ marginTop: 16 }}>
            We believe luxury is not merely a thread count or a view — it is the feeling of being truly cared for. At GiftInn, we design every moment to feel personal, unhurried, and remarkable.
          </p>
        </div>
        <div className="ab-mission-img">
          <img
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85"
            alt="GiftInn philosophy"
          />
          <span className="ab-mission-img-label">Infinity Pool · Musanze</span>
        </div>
      </section>

      {/* ════ VALUES ════ */}
      <section className="ab-values">
        <div className="ab-values-header">
          <div>
            <p className="ab-section-eyebrow" style={{ color: 'var(--gold)', marginBottom: 14 }}>What We Stand For</p>
            <h2 className="ab-values-title">
              Core <em>Values</em>
            </h2>
          </div>
        </div>
        <div className="ab-values-grid">
          {values.map((v) => (
            <div className="ab-value-card" key={v.title}>
              <span className="ab-value-icon">{v.icon}</span>
              <p className="ab-value-title">{v.title}</p>
              <p className="ab-value-text">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ TIMELINE ════ */}
      <section className="ab-timeline">
        <div>
          <p className="ab-section-eyebrow">Our Journey</p>
          <h2 className="ab-section-title" style={{ marginBottom: 40 }}>
            A Story of<br /><em>Growth</em>
          </h2>
          <div className="ab-timeline-items">
            {milestones.map((m) => (
              <div className="ab-timeline-item" key={m.year}>
                <span className="ab-timeline-year">{m.year}</span>
                <p className="ab-timeline-event">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ab-timeline-visual">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85"
            alt="Volcanoes National Park"
          />
          <div className="ab-timeline-visual-caption">
            <p className="ab-timeline-visual-title">Gateway to the Volcanoes</p>
            <p className="ab-timeline-visual-sub">Musanze · Rwanda</p>
          </div>
        </div>
      </section>

      {/* ════ TEAM ════ */}
      <section className="ab-team">
        <div className="ab-team-header">
          <div>
            <p className="ab-section-eyebrow">The People</p>
            <h2 className="ab-section-title">
              Meet Our <em>Team</em>
            </h2>
          </div>
          <p className="ab-body" style={{ maxWidth: 340, marginTop: 0 }}>
            Front office experts, chefs, spa directors, and experience curators — united by a passion for exceptional hospitality.
          </p>
        </div>
        <div className="ab-team-grid">
          {team.map((member) => (
            <div className="ab-team-card" key={member.name}>
              <img src={member.img} alt={member.name} />
              <div className="ab-team-overlay">
                <p className="ab-team-name">{member.name}</p>
                <p className="ab-team-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ LOCATION ════ */}
      <section className="ab-location">
        <div className="ab-location-info">
          <p className="ab-section-eyebrow" style={{ color: 'var(--gold)', marginBottom: 20 }}>Find Us</p>
          <h2 className="ab-location-title">
            Perfectly<br /><em>Located</em> in<br />Musanze
          </h2>
          <p className="ab-location-address">{hotelInfo.address}</p>
          <div className="ab-location-detail">
            {[
              '2 hours from Kigali International Airport',
              'Gateway to Volcanoes National Park & gorilla trekking',
              'Walking distance from Musanze city centre',
              'Private airport transfers available on request',
            ].map((item) => (
              <div className="ab-location-row" key={item}>
                <span className="ab-location-row-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ab-location-map">
          <iframe
            title="GiftInn Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63716.28217887673!2d29.5499!3d-1.4994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc4603b2c36461%3A0x5c88e2b0534ab0f9!2sMusanze%2C%20Rwanda!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>

      {/* ════ CLOSING CTA ════ */}
      <section className="ab-cta">
        <p className="ab-cta-eyebrow">Begin Your Experience</p>
        <h2 className="ab-cta-title">
          Come Stay With<br /><em>Us in Musanze</em>
        </h2>
        <div className="ab-cta-actions">
          <a href="/booking" className="ab-btn-primary">Reserve a Room</a>
          <a href="/contact" className="ab-btn-ghost">Get in Touch</a>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
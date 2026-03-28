import { useState } from 'react'
import { format } from 'date-fns'
import { blogPosts } from '../data/siteContent.js'
import { useSeo } from '../hooks/useSeo.js'

// ── Extended blog data with images & categories ───────────────────────────────
const extendedPosts = [
  {
    ...blogPosts[0],
    category: 'Travel Guide',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    readTime: '5 min read',
    featured: true,
  },
  {
    ...blogPosts[1],
    category: 'Offers',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80',
    readTime: '3 min read',
    featured: false,
  },
  {
    ...blogPosts[2],
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
    readTime: '4 min read',
    featured: false,
  },
]

const CATEGORIES = ['All', 'Travel Guide', 'Offers', 'Business']

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

  .bl-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .bl-wrap {
    font-family: var(--sans);
    background: var(--ivory);
    min-height: 100vh;
    padding-top: 76px;
    overflow-x: hidden;
  }

  /* ════════════════════════════
     HERO
  ════════════════════════════ */
  .bl-hero {
    position: relative;
    height: 58vh;
    min-height: 400px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }
  .bl-hero-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=1600&q=85');
    background-size: cover;
    background-position: center 45%;
    animation: blZoom 10s ease forwards;
  }
  @keyframes blZoom {
    from { transform: scale(1.06); }
    to   { transform: scale(1); }
  }
  .bl-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,8,4,0.92) 0%, rgba(10,8,4,0.4) 55%, rgba(10,8,4,0.15) 100%);
  }
  .bl-hero-content {
    position: relative;
    z-index: 2;
    padding: 0 6vw 52px;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
  }
  .bl-hero-left { max-width: 600px; }
  .bl-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
    opacity: 0;
    animation: blFadeUp 0.6s ease 0.2s forwards;
  }
  .bl-hero-title {
    font-family: var(--serif);
    font-size: clamp(40px, 6vw, 78px);
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.05;
    opacity: 0;
    animation: blFadeUp 0.8s ease 0.35s forwards;
  }
  .bl-hero-title em { font-style: italic; color: var(--gold); }
  .bl-hero-desc {
    font-size: 14px;
    font-weight: 300;
    color: rgba(250,248,243,0.6);
    line-height: 1.8;
    margin-top: 16px;
    max-width: 440px;
    opacity: 0;
    animation: blFadeUp 0.7s ease 0.55s forwards;
  }
  .bl-hero-stats {
    display: flex;
    gap: 32px;
    opacity: 0;
    animation: blFadeUp 0.7s ease 0.7s forwards;
    flex-shrink: 0;
  }
  .bl-hero-stat-num {
    font-family: var(--serif);
    font-size: 40px;
    font-weight: 300;
    color: var(--gold);
    line-height: 1;
  }
  .bl-hero-stat-label {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.35);
    margin-top: 5px;
  }
  @keyframes blFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ════════════════════════════
     FILTER + HEADER BAR
  ════════════════════════════ */
  .bl-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    padding: 36px 6vw;
    border-bottom: 1px solid var(--sand);
  }
  .bl-section-title {
    font-family: var(--serif);
    font-size: clamp(24px, 3vw, 38px);
    font-weight: 300;
    color: var(--dark2);
  }
  .bl-section-title em { font-style: italic; color: var(--gold); }
  .bl-filters {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
  .bl-filter-btn {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 8px 18px;
    background: transparent;
    border: 1px solid var(--sand);
    color: var(--muted);
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
  }
  .bl-filter-btn:hover { border-color: var(--gold); color: var(--dark2); }
  .bl-filter-btn.active { background: var(--dark2); border-color: var(--dark2); color: var(--ivory); }

  /* ════════════════════════════
     FEATURED POST (large)
  ════════════════════════════ */
  .bl-featured {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 0;
    border-bottom: 1px solid var(--sand);
    overflow: hidden;
  }
  @media (max-width: 800px) { .bl-featured { grid-template-columns: 1fr; } }

  .bl-featured-img {
    position: relative;
    overflow: hidden;
    min-height: 480px;
    cursor: pointer;
  }
  @media (max-width: 800px) { .bl-featured-img { min-height: 300px; } }
  .bl-featured-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s ease;
  }
  .bl-featured-img:hover img { transform: scale(1.04); }
  .bl-featured-badge {
    position: absolute;
    top: 20px; left: 20px;
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 6px 14px;
  }

  .bl-featured-content {
    padding: 56px 5vw 56px 5vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 1px solid var(--sand);
    position: relative;
  }
  @media (max-width: 800px) {
    .bl-featured-content { border-left: none; border-top: 1px solid var(--sand); padding: 40px 6vw; }
  }
  .bl-featured-content::before {
    content: '';
    position: absolute;
    left: 0; top: 48px; bottom: 48px;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(200,169,110,0.4), transparent);
  }
  @media (max-width: 800px) { .bl-featured-content::before { display: none; } }

  .bl-post-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .bl-post-cat {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(200,169,110,0.4);
    padding: 4px 10px;
  }
  .bl-post-date {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 300;
    color: var(--muted);
    letter-spacing: 0.05em;
  }
  .bl-post-read {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 300;
    color: #9a8a7a;
  }
  .bl-meta-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--sand);
    flex-shrink: 0;
  }

  .bl-post-title {
    font-family: var(--serif);
    font-size: clamp(26px, 3vw, 46px);
    font-weight: 300;
    color: var(--dark2);
    line-height: 1.15;
    margin-bottom: 18px;
  }
  .bl-post-title em { font-style: italic; color: var(--gold); }
  .bl-post-summary {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.8;
    margin-bottom: 32px;
  }
  .bl-divider {
    width: 40px; height: 1px;
    background: var(--gold);
    margin-bottom: 28px;
    opacity: 0.7;
  }
  .bl-read-link {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 13px 28px;
    text-decoration: none;
    display: inline-block;
    width: fit-content;
    position: relative;
    overflow: hidden;
    transition: background 0.3s, transform 0.2s;
  }
  .bl-read-link::before {
    content: '';
    position: absolute;
    inset: 0; left: -100%;
    width: 60%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent);
    transition: left 0.5s ease;
  }
  .bl-read-link:hover::before { left: 150%; }
  .bl-read-link:hover { background: var(--gold-lt); transform: translateY(-1px); }

  /* ════════════════════════════
     SECONDARY POSTS GRID
  ════════════════════════════ */
  .bl-grid-label {
    padding: 48px 6vw 28px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .bl-grid-label-text {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .bl-grid-label-line {
    flex: 1;
    height: 1px;
    background: var(--sand);
  }

  .bl-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    padding: 0 6vw;
  }
  @media (max-width: 600px) { .bl-grid { grid-template-columns: 1fr; } }

  .bl-card {
    background: var(--ivory);
    border: 1px solid var(--sand);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: box-shadow 0.3s;
    opacity: 0;
    transform: translateY(20px);
    animation: blCardIn 0.55s ease forwards;
  }
  .bl-card:hover { box-shadow: 0 12px 40px rgba(26,20,16,0.09); }

  @keyframes blCardIn {
    to { opacity: 1; transform: translateY(0); }
  }

  .bl-card-img {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16/10;
  }
  .bl-card-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }
  .bl-card:hover .bl-card-img img { transform: scale(1.05); }
  .bl-card-cat-badge {
    position: absolute;
    bottom: 14px; left: 14px;
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(200,169,110,0.5);
    padding: 4px 10px;
    background: rgba(10,8,4,0.45);
    backdrop-filter: blur(4px);
  }

  .bl-card-body {
    padding: 28px 28px 32px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .bl-card-title {
    font-family: var(--serif);
    font-size: clamp(20px, 2.2vw, 30px);
    font-weight: 300;
    color: var(--dark2);
    line-height: 1.2;
    margin-bottom: 12px;
    transition: color 0.3s;
  }
  .bl-card:hover .bl-card-title { color: var(--gold); }
  .bl-card-summary {
    font-size: 13px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.75;
    flex: 1;
    margin-bottom: 24px;
  }
  .bl-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid var(--sand);
  }
  .bl-card-date {
    font-size: 11px;
    font-weight: 300;
    color: #9a8a7a;
    letter-spacing: 0.04em;
  }
  .bl-card-arrow {
    font-size: 18px;
    color: var(--sand);
    transition: color 0.3s, transform 0.3s;
  }
  .bl-card:hover .bl-card-arrow {
    color: var(--gold);
    transform: translateX(4px);
  }

  /* ════════════════════════════
     NEWSLETTER SUBSCRIBE
  ════════════════════════════ */
  .bl-subscribe {
    margin: 64px 6vw;
    background: var(--dark2);
    padding: 64px 6vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 36px;
    position: relative;
    overflow: hidden;
  }
  .bl-subscribe::before {
    content: '✦';
    position: absolute;
    right: 5vw; top: 50%;
    transform: translateY(-50%);
    font-size: 200px;
    color: rgba(200,169,110,0.04);
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }
  .bl-subscribe-text { max-width: 440px; }
  .bl-subscribe-eyebrow {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px;
  }
  .bl-subscribe-title {
    font-family: var(--serif);
    font-size: clamp(28px, 3.5vw, 48px);
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.15;
  }
  .bl-subscribe-title em { font-style: italic; color: var(--gold); }
  .bl-subscribe-form {
    display: flex;
    gap: 0;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 8px;
    position: relative;
    z-index: 1;
  }
  .bl-subscribe-input {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--ivory);
    background: rgba(250,248,243,0.07);
    border: 1px solid rgba(250,248,243,0.15);
    padding: 14px 22px;
    outline: none;
    width: 260px;
    max-width: 100%;
    transition: border-color 0.3s;
    border-radius: 0;
    appearance: none;
  }
  .bl-subscribe-input::placeholder { color: rgba(250,248,243,0.28); }
  .bl-subscribe-input:focus { border-color: var(--gold); }
  .bl-subscribe-btn {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    border: none;
    padding: 14px 28px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.3s;
  }
  .bl-subscribe-btn:hover { background: var(--gold-lt); }

  /* ════════════════════════════
     TOPICS CLOUD
  ════════════════════════════ */
  .bl-topics {
    padding: 0 6vw 80px;
  }
  .bl-topics-title {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
  }
  .bl-topics-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .bl-topic-tag {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: var(--muted);
    border: 1px solid var(--sand);
    padding: 7px 16px;
    cursor: pointer;
    transition: all 0.3s;
    background: transparent;
  }
  .bl-topic-tag:hover {
    border-color: var(--gold);
    color: var(--dark2);
    background: rgba(200,169,110,0.06);
  }
`

const topics = [
  'Gorilla Trekking', 'Musanze Travel', 'Volcanoes NP', 'Hotel Offers',
  'Honeymoon Packages', 'Business Retreats', 'Rwandan Cuisine', 'Eco Travel',
  'Family Holidays', 'Spa & Wellness',
]

function BlogPage() {
  useSeo({
    title: 'GiftInn Musanze | Blog & News',
    description: 'Hotel blog with local events, offers, travel guides and GiftInn updates.',
  })

  const [activeFilter, setActiveFilter] = useState('All')

  const featuredPost = extendedPosts.find((p) => p.featured)
  const secondaryPosts = extendedPosts.filter((p) => {
    if (!p.featured) {
      return activeFilter === 'All' || p.category === activeFilter
    }
    return false
  })

  return (
    <div className="bl-wrap">
      <style>{css}</style>

      {/* ════ HERO ════ */}
      <section className="bl-hero">
        <div className="bl-hero-bg" />
        <div className="bl-hero-overlay" />
        <div className="bl-hero-content">
          <div className="bl-hero-left">
            <p className="bl-eyebrow">Blog & Stories</p>
            <h1 className="bl-hero-title">
              Discover <em>Musanze</em><br />Through Our Stories
            </h1>
            <p className="bl-hero-desc">
              Travel guides, exclusive offers, local experiences and behind-the-scenes stories from Rwanda's most extraordinary hotel destination.
            </p>
          </div>
          <div className="bl-hero-stats">
            {[
              { n: extendedPosts.length + '+', l: 'Articles' },
              { n: '4',                        l: 'Categories' },
              { n: '2026',                     l: 'Latest Year' },
            ].map((s) => (
              <div key={s.l}>
                <div className="bl-hero-stat-num">{s.n}</div>
                <div className="bl-hero-stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FILTER BAR ════ */}
      <div className="bl-bar">
        <h2 className="bl-section-title">
          Latest <em>Stories</em>
        </h2>
        <div className="bl-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`bl-filter-btn${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ════ FEATURED POST ════ */}
      {featuredPost && (activeFilter === 'All' || activeFilter === featuredPost.category) && (
        <div className="bl-featured">
          <div className="bl-featured-img">
            <img src={featuredPost.image} alt={featuredPost.title} />
            <span className="bl-featured-badge">Featured</span>
          </div>
          <div className="bl-featured-content">
            <div className="bl-post-meta">
              <span className="bl-post-cat">{featuredPost.category}</span>
              <span className="bl-meta-dot" />
              <span className="bl-post-date">
                {format(new Date(featuredPost.date), 'dd MMM yyyy')}
              </span>
              <span className="bl-meta-dot" />
              <span className="bl-post-read">{featuredPost.readTime}</span>
            </div>
            <h2 className="bl-post-title">{featuredPost.title}</h2>
            <div className="bl-divider" />
            <p className="bl-post-summary">{featuredPost.summary}</p>
            <a href="/blog/1" className="bl-read-link">Read Article</a>
          </div>
        </div>
      )}

      {/* ════ SECONDARY POSTS GRID ════ */}
      {secondaryPosts.length > 0 && (
        <>
          <div className="bl-grid-label">
            <span className="bl-grid-label-text">More Articles</span>
            <div className="bl-grid-label-line" />
          </div>
          <div className="bl-grid">
            {secondaryPosts.map((post, idx) => (
              <article
                key={post.title}
                className="bl-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="bl-card-img">
                  <img src={post.image} alt={post.title} loading="lazy" />
                  <span className="bl-card-cat-badge">{post.category}</span>
                </div>
                <div className="bl-card-body">
                  <div className="bl-post-meta" style={{ marginBottom: 12 }}>
                    <span className="bl-post-date">
                      {format(new Date(post.date), 'dd MMM yyyy')}
                    </span>
                    <span className="bl-meta-dot" />
                    <span className="bl-post-read">{post.readTime}</span>
                  </div>
                  <h3 className="bl-card-title">{post.title}</h3>
                  <p className="bl-card-summary">{post.summary}</p>
                  <div className="bl-card-footer">
                    <span className="bl-card-date">{post.category}</span>
                    <span className="bl-card-arrow">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* ════ NEWSLETTER ════ */}
      <div className="bl-subscribe">
        <div className="bl-subscribe-text">
          <p className="bl-subscribe-eyebrow">Stay in the Loop</p>
          <h2 className="bl-subscribe-title">
            Get <em>offers & stories</em><br />delivered to you
          </h2>
        </div>
        <div className="bl-subscribe-form">
          <input
            type="email"
            className="bl-subscribe-input"
            placeholder="Your email address"
            aria-label="Email for newsletter"
          />
          <button type="button" className="bl-subscribe-btn">Subscribe</button>
        </div>
      </div>

      {/* ════ TOPICS ════ */}
      <div className="bl-topics">
        <p className="bl-topics-title">Browse by Topic</p>
        <div className="bl-topics-list">
          {topics.map((t) => (
            <button key={t} className="bl-topic-tag">{t}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogPage
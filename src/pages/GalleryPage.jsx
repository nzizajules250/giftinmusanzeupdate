import { useState, useEffect, useCallback } from 'react'
import { useSeo } from '../hooks/useSeo.js'

// ── Mock data (replace with your real import from siteContent.js) ─────────────
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', category: 'Rooms',       label: 'Volcano Suite' },
  { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', category: 'Rooms',       label: 'Garden Deluxe' },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', category: 'Rooms',       label: 'Honeymoon Suite' },
  { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', category: 'Pool',        label: 'Infinity Pool' },
  { src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80', category: 'Views',       label: 'Volcano Panorama' },
  { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', category: 'Dining',      label: 'Restaurant' },
  { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', category: 'Spa',         label: 'Wellness Centre' },
  { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', category: 'Rooms',       label: 'Executive Room' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', category: 'Views',       label: 'Mountain Trail' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', category: 'Dining',      label: 'Fine Dining' },
  { src: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80', category: 'Pool',        label: 'Evening Pool' },
  { src: 'https://images.unsplash.com/photo-1537519646099-335112f03225?w=800&q=80', category: 'Spa',         label: 'Spa Ritual' },
]

const CATEGORIES = ['All', ...Array.from(new Set(galleryImages.map((i) => i.category)))]

// ── Styles ────────────────────────────────────────────────────────────────────
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

  .gp-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page wrapper ── */
  .gp-wrap {
    font-family: var(--sans);
    background: var(--ivory);
    min-height: 100vh;
    padding-top: 100px;
  }

  /* ── Hero header ── */
  .gp-hero {
    position: relative;
    height: 52vh;
    min-height: 360px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
    margin: 0 4vw;
    border-radius: 0;
  }
  .gp-hero-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=85');
    background-size: cover;
    background-position: center 40%;
    transition: transform 0.1s linear;
  }
  .gp-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,8,4,0.88) 0%, rgba(10,8,4,0.3) 60%, transparent 100%);
  }
  .gp-hero-content {
    position: relative;
    z-index: 2;
    padding: 0 6vw 48px;
  }
  .gp-hero-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px;
    opacity: 0;
    transform: translateY(12px);
    animation: gpFadeUp 0.7s ease 0.2s forwards;
  }
  .gp-hero-title {
    font-family: var(--serif);
    font-size: clamp(36px, 5vw, 68px);
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.05;
    opacity: 0;
    transform: translateY(16px);
    animation: gpFadeUp 0.8s ease 0.4s forwards;
  }
  .gp-hero-title em { font-style: italic; color: var(--gold); }
  .gp-hero-desc {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: rgba(250,248,243,0.65);
    margin-top: 14px;
    max-width: 440px;
    line-height: 1.7;
    opacity: 0;
    transform: translateY(12px);
    animation: gpFadeUp 0.7s ease 0.6s forwards;
  }
  @keyframes gpFadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── Filter tabs ── */
  .gp-filters {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 36px 4vw 0;
    flex-wrap: wrap;
  }
  .gp-filter-btn {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 9px 20px;
    border: 1px solid var(--sand);
    background: transparent;
    color: #8a7a6a;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  .gp-filter-btn:hover {
    border-color: var(--gold);
    color: var(--dark2);
  }
  .gp-filter-btn.active {
    background: var(--dark2);
    border-color: var(--dark2);
    color: var(--ivory);
  }
  .gp-filter-count {
    margin-left: auto;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 400;
    color: #8a7a6a;
    padding: 9px 0;
    letter-spacing: 0.05em;
  }

  /* ── Masonry grid ── */
  .gp-grid {
    padding: 28px 4vw 0;
    columns: 3;
    column-gap: 10px;
  }
  @media (max-width: 900px) { .gp-grid { columns: 2; } }
  @media (max-width: 520px) { .gp-grid { columns: 1; } }

  .gp-item {
    break-inside: avoid;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: block;
    /* entrance animation */
    opacity: 0;
    transform: translateY(20px);
    animation: gpItemIn 0.55s ease forwards;
  }
  @keyframes gpItemIn {
    to { opacity: 1; transform: translateY(0); }
  }

  .gp-item img {
    width: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  .gp-item:hover img { transform: scale(1.05); }

  .gp-item-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,8,4,0.82) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
  }
  .gp-item:hover .gp-item-overlay { opacity: 1; }

  .gp-item-label {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.2;
  }
  .gp-item-cat {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 6px;
  }
  .gp-item-expand {
    position: absolute;
    top: 14px; right: 14px;
    width: 34px; height: 34px;
    border: 1px solid rgba(250,248,243,0.4);
    background: transparent;
    color: var(--ivory);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.4s ease, border-color 0.3s;
    cursor: pointer;
  }
  .gp-item:hover .gp-item-expand { opacity: 1; }
  .gp-item-expand:hover { border-color: var(--gold); color: var(--gold); }

  /* ── Lightbox ── */
  .gp-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10,8,4,0.97);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .gp-lightbox.open {
    opacity: 1;
    pointer-events: all;
  }
  .gp-lb-img-wrap {
    position: relative;
    max-width: 88vw;
    max-height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .gp-lb-img {
    max-width: 88vw;
    max-height: 82vh;
    object-fit: contain;
    display: block;
    transform: scale(0.94);
    transition: transform 0.45s ease;
  }
  .gp-lightbox.open .gp-lb-img { transform: scale(1); }

  .gp-lb-close {
    position: fixed;
    top: 28px; right: 32px;
    width: 44px; height: 44px;
    border: 1px solid rgba(250,248,243,0.25);
    background: transparent;
    color: var(--ivory);
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s, color 0.3s;
    z-index: 9010;
  }
  .gp-lb-close:hover { border-color: var(--gold); color: var(--gold); }

  .gp-lb-arrow {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 48px; height: 48px;
    border: 1px solid rgba(250,248,243,0.2);
    background: transparent;
    color: var(--ivory);
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s, color 0.3s, background 0.3s;
    z-index: 9010;
  }
  .gp-lb-arrow:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: rgba(200,169,110,0.08);
  }
  .gp-lb-prev { left: 24px; }
  .gp-lb-next { right: 24px; }

  .gp-lb-caption {
    position: fixed;
    bottom: 32px; left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 9010;
  }
  .gp-lb-caption-label {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 300;
    color: var(--ivory);
  }
  .gp-lb-caption-cat {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 4px;
  }
  .gp-lb-counter {
    position: fixed;
    top: 32px; left: 32px;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 400;
    color: rgba(250,248,243,0.4);
    letter-spacing: 0.1em;
    z-index: 9010;
  }

  /* ── Virtual tour section ── */
  .gp-tour {
    margin: 60px 4vw 0;
    padding: 0;
  }
  .gp-tour-inner {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0;
    border: 1px solid var(--sand);
    overflow: hidden;
  }
  @media (max-width: 768px) {
    .gp-tour-inner { grid-template-columns: 1fr; }
  }
  .gp-tour-info {
    background: var(--dark2);
    padding: 52px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .gp-tour-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }
  .gp-tour-title {
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 44px);
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.15;
  }
  .gp-tour-title em { font-style: italic; color: var(--gold); }
  .gp-tour-desc {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.55);
    line-height: 1.75;
    margin-top: 16px;
  }
  .gp-tour-divider {
    width: 40px; height: 1px;
    background: var(--gold);
    margin: 24px 0;
    opacity: 0.6;
  }
  .gp-tour-tag {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.35);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .gp-tour-tag::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    opacity: 0.6;
  }
  .gp-tour-video {
    position: relative;
    background: #000;
  }
  .gp-tour-video iframe {
    width: 100%;
    height: 100%;
    min-height: 380px;
    border: 0;
    display: block;
  }

  /* ── Footer strip ── */
  .gp-footer-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    padding: 48px 4vw 80px;
    margin-top: 60px;
    border-top: 1px solid var(--sand);
  }
  .gp-footer-text {
    font-family: var(--serif);
    font-size: clamp(24px, 3vw, 38px);
    font-weight: 300;
    color: var(--dark2);
  }
  .gp-footer-text em { font-style: italic; color: var(--gold); }
  .gp-footer-btn {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 14px 32px;
    text-decoration: none;
    display: inline-block;
    transition: background 0.3s, transform 0.2s;
  }
  .gp-footer-btn:hover {
    background: var(--gold-lt, #d9be8a);
    transform: translateY(-1px);
  }
`

function GalleryPage() {
  useSeo({
    title: 'GiftInn Musanze | Gallery',
    description: 'Browse GiftInn hotel gallery including rooms, spa, dining, and surrounding attractions.',
  })

  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIdx, setLightboxIdx]       = useState(null)

  const filtered = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((i) => i.category === activeCategory)

  const openLightbox  = (idx) => setLightboxIdx(idx)
  const closeLightbox = ()    => setLightboxIdx(null)
  const prevImage = useCallback(() =>
    setLightboxIdx((i) => (i - 1 + filtered.length) % filtered.length), [filtered.length])
  const nextImage = useCallback(() =>
    setLightboxIdx((i) => (i + 1) % filtered.length), [filtered.length])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (lightboxIdx === null) return
      if (e.key === 'Escape')      closeLightbox()
      if (e.key === 'ArrowLeft')   prevImage()
      if (e.key === 'ArrowRight')  nextImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIdx, prevImage, nextImage])

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIdx])

  const currentImage = lightboxIdx !== null ? filtered[lightboxIdx] : null

  return (
    <div className="gp-wrap">
      <style>{css}</style>

      {/* ── Hero ── */}
      <section className="gp-hero">
        <div className="gp-hero-bg" />
        <div className="gp-hero-overlay" />
        <div className="gp-hero-content">
          <p className="gp-hero-eyebrow">Visual Journey</p>
          <h1 className="gp-hero-title">
            Explore GiftInn<br /><em>Through Images</em>
          </h1>
          <p className="gp-hero-desc">
            Rooms, spa rituals, culinary moments, and the breathtaking landscapes of Musanze — all in one place.
          </p>
        </div>
      </section>

      {/* ── Filter tabs ── */}
      <div className="gp-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`gp-filter-btn${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <span className="gp-filter-count">
          {filtered.length} {filtered.length === 1 ? 'image' : 'images'}
        </span>
      </div>

      {/* ── Masonry grid ── */}
      <div className="gp-grid">
        {filtered.map((image, idx) => (
          <div
            key={`${image.src}-${idx}`}
            className="gp-item"
            style={{ animationDelay: `${idx * 0.05}s` }}
            onClick={() => openLightbox(idx)}
          >
            <img
              src={image.src}
              alt={image.label}
              loading="lazy"
              style={{
                /* Vary heights for masonry feel */
                height: [280, 380, 320, 420, 300, 360][idx % 6],
              }}
            />
            <div className="gp-item-overlay">
              <p className="gp-item-cat">{image.category}</p>
              <p className="gp-item-label">{image.label}</p>
            </div>
            <button className="gp-item-expand" aria-label="Expand image">⤢</button>
          </div>
        ))}
      </div>

      {/* ── Virtual Tour ── */}
      <div id="virtual-tour" className="gp-tour">
        <div className="gp-tour-inner">
          <div className="gp-tour-info">
            <p className="gp-tour-eyebrow">Immersive Experience</p>
            <h2 className="gp-tour-title">Virtual<br /><em>360° Tour</em></h2>
            <div className="gp-tour-divider" />
            <p className="gp-tour-desc">
              Step inside GiftInn from anywhere in the world. Explore our suites, common areas, and lush garden grounds with a fully immersive virtual walkthrough.
            </p>
            <div className="gp-tour-divider" />
            <p className="gp-tour-tag">Replace the embed URL with your Matterport or 360° capture link</p>
          </div>
          <div className="gp-tour-video">
            <iframe
              title="GiftInn Virtual Tour"
              src="https://www.youtube.com/embed/6x2fH4vGE5c"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      </div>

      {/* ── Footer CTA strip ── */}
      <div className="gp-footer-strip">
        <p className="gp-footer-text">
          Ready to experience<br /><em>GiftInn in person?</em>
        </p>
        <a href="/booking" className="gp-footer-btn">Reserve Your Stay</a>
      </div>

      {/* ── Lightbox ── */}
      <div
        className={`gp-lightbox${lightboxIdx !== null ? ' open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeLightbox() }}
        aria-modal="true"
        role="dialog"
        aria-label="Image lightbox"
      >
        {currentImage && (
          <>
            {/* Counter */}
            <div className="gp-lb-counter">
              {String(lightboxIdx + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
            </div>

            {/* Close */}
            <button className="gp-lb-close" onClick={closeLightbox} aria-label="Close lightbox">✕</button>

            {/* Arrows */}
            <button className="gp-lb-arrow gp-lb-prev" onClick={prevImage} aria-label="Previous image">‹</button>
            <button className="gp-lb-arrow gp-lb-next" onClick={nextImage} aria-label="Next image">›</button>

            {/* Image */}
            <div className="gp-lb-img-wrap">
              <img
                key={currentImage.src}
                src={currentImage.src}
                alt={currentImage.label}
                className="gp-lb-img"
              />
            </div>

            {/* Caption */}
            <div className="gp-lb-caption">
              <p className="gp-lb-caption-label">{currentImage.label}</p>
              <p className="gp-lb-caption-cat">{currentImage.category}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GalleryPage
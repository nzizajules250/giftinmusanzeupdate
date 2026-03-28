import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { amenities, rooms, testimonials, uspItems } from '../data/siteContent.js'
import { useSeo } from '../hooks/useSeo.js'

const offers = [
  { label: 'Family Package', nights: '3+ nights', discount: '15% off', accent: '#7a9e7e' },
  { label: 'Honeymoon Escape', nights: '2+ nights', discount: '20% off', accent: '#c97b84' },
  { label: 'Business Retreat', nights: '5+ nights', discount: '10% off', accent: '#c8a96e' },
]

function HomePage() {
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [offerRevealed, setOfferRevealed] = useState(false)

  useSeo({
    title: 'GiftInn Musanze | Home',
    description: 'Editorial luxury hotel website for GiftInn Musanze with rooms, booking, and premium experiences.',
  })

  useEffect(() => {
    const id = setTimeout(() => setHeroLoaded(true), 80)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(id)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div>
      <section className={`hero-section ${heroLoaded ? 'loaded' : ''}`}>
        <div className="hero-bg" style={{ transform: `translateY(${scrollY * 0.4}px)` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Musanze, Rwanda - Est. 2018</p>
          <h1 className="hero-title gift-hero">
            Where the <em>Volcanoes</em> Meet Luxury
          </h1>
          <p className="hero-subtitle gift-body">
            Nestled at the foot of the Virunga mountains, GiftInn Musanze offers an unparalleled sanctuary of elegance,
            nature, and African hospitality.
          </p>
          <div className="hero-actions">
            <Link to="/booking" className="btn-primary">
              Reserve Your Stay
            </Link>
            <Link to="/gallery#virtual-tour" className="btn-ghost">
              Discover More
            </Link>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-label">Scroll</span>
        </div>
      </section>

      <div className="booking-bar">
        {[
          { label: 'Check-in', value: 'Select date' },
          { label: 'Check-out', value: 'Select date' },
          { label: 'Guests', value: '2 Adults' },
          { label: 'Room Type', value: 'Any room' },
        ].map((item) => (
          <div className="booking-field" key={item.label}>
            <span className="booking-label">{item.label}</span>
            <input readOnly className="booking-input" value={item.value} />
          </div>
        ))}
        <Link to="/booking" className="booking-btn">
          Check Availability
        </Link>
      </div>

      <section className="section">
        <p className="section-eyebrow">Accommodations</p>
        <h2 className="section-title gift-hero">
          Rooms & <em>Suites</em>
        </h2>
        <div className="divider" />
        <p className="section-desc">
          Each room is a carefully composed story of comfort, crafted with local materials, artisan textiles, and
          panoramic views.
        </p>
        <div className="rooms-grid">
          {rooms.map((room) => (
            <article className="room-card" key={room.id}>
              <img src={room.image} alt={room.name} />
              <div className="room-overlay">
                <span className="room-tag">Premium</span>
                <h3 className="room-name">{room.name}</h3>
                <p className="room-desc">{room.amenities.join(' - ')}</p>
                <p className="room-price">from ${room.price} / night</p>
                <Link to="/booking" className="room-cta">
                  Book This Room
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section">
        <div
          className="split-img"
          style={{ backgroundImage: "url('https://i.ibb.co/hRdLKS96/image-4.jpg')" }}
        />
        <div className="split-content">
          <p className="section-eyebrow">Our Story</p>
          <h2 className="section-title gift-hero">
            A Refuge of <em>Authentic</em> Luxury
          </h2>
          <div className="divider" />
          <p className="section-desc">
            Born from a love of Rwanda's extraordinary landscapes, GiftInn was built to share the wonder of Musanze
            with the world without compromise on comfort, sustainability, or soul.
          </p>
          <div className="stats-row">
            {[
              { n: '98%', l: 'Guest satisfaction' },
              { n: '6+', l: 'Dining experiences' },
              { n: '5*', l: 'Rated excellence' },
            ].map((item) => (
              <div key={item.l}>
                <div className="stat-num">{item.n}</div>
                <div className="stat-label">{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section-eyebrow">Why GiftInn</p>
        <h2 className="section-title gift-hero">
          An Experience <em>Unlike</em> Any Other
        </h2>
        <div className="editorial-grid">
          {uspItems.map((item) => (
            <article key={item} className="editorial-card">
              <h3 className="editorial-title gift-hero">{item}</h3>
              <p className="editorial-text">Designed to balance destination adventure with premium comfort.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-block">
        <p className="section-eyebrow">Guest Stories</p>
        <h2 className="section-title gift-hero">
          Voices from <em>Our Guests</em>
        </h2>
        <div className="dark-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="dark-card">
              <p className="dark-text" style={{ letterSpacing: '3px', color: '#c8a96e' }}>
                {'*'.repeat(item.rating)}
              </p>
              <p className="dark-text" style={{ fontStyle: 'italic', marginTop: 10 }}>
                "{item.text}"
              </p>
              <p style={{ marginTop: 16, color: '#c8a96e', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12 }}>
                {item.name}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <span className="badge-live">Live offers - Updated daily</span>
        <p className="section-eyebrow" style={{ marginTop: 14 }}>
          Special Packages
        </p>
        <h2 className="section-title gift-hero">
          This Week's <em>Best</em> Deals
        </h2>
        <div className="package-grid">
          {offers.map((item) => (
            <article key={item.label} className="package-card" style={{ '--accent': item.accent }}>
              <h3 className="editorial-title gift-hero">{item.label}</h3>
              <p className="editorial-text">{item.nights}</p>
              <p className="gift-hero" style={{ fontSize: 44, color: item.accent, marginTop: 6 }}>
                {item.discount}
              </p>
              <button type="button" className="btn-primary" style={{ marginTop: 22 }} onClick={() => setOfferRevealed(true)}>
                {offerRevealed ? 'Offer Unlocked' : 'Reveal Offer'}
              </button>
            </article>
          ))}
        </div>
        {offerRevealed ? (
          <div className="editorial-card" style={{ marginTop: 18, borderLeft: '3px solid #c8a96e' }}>
            <p>
              Congratulations. Use code <strong style={{ letterSpacing: '0.1em', color: '#c8a96e' }}>GIFTINN10</strong> at
              checkout to redeem your discount.
            </p>
          </div>
        ) : null}
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <p className="section-eyebrow">Featured Amenities</p>
        <div className="editorial-grid" style={{ marginTop: 20 }}>
          {amenities.slice(0, 3).map((item) => (
            <article key={item.title} className="editorial-card">
              <h3 className="editorial-title gift-hero">{item.title}</h3>
              <p className="editorial-text">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage

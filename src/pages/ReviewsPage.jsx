import { testimonials } from '../data/siteContent.js'
import SectionHeader from '../components/SectionHeader.jsx'
import { useSeo } from '../hooks/useSeo.js'

function ReviewsPage() {
  useSeo({
    title: 'GiftInn Musanze | Reviews',
    description: 'Read reviews and testimonials from guests who stayed at GiftInn Musanze.',
  })

  return (
    <section className="section dark-block">
      <SectionHeader
        eyebrow="Testimonials"
        title={<span className="gift-hero">Guest <em>Reviews</em></span>}
        description="Feedback from previous guests to build trust and help new visitors book confidently."
      />

      <div className="dark-grid">
        {testimonials.map((item) => (
          <article key={item.name} className="dark-card">
            <p className="dark-text" style={{ color: '#c8a96e', letterSpacing: '3px' }}>
              {'*'.repeat(item.rating)}
            </p>
            <p className="dark-text" style={{ marginTop: 10, fontStyle: 'italic' }}>
              "{item.text}"
            </p>
            <p style={{ marginTop: 14, color: '#c8a96e', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12 }}>
              {item.name}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ReviewsPage

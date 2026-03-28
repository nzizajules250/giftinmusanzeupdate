import RoomCard from '../components/RoomCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { rooms } from '../data/siteContent.js'
import { useSeo } from '../hooks/useSeo.js'

function RoomsPage() {
  useSeo({
    title: 'GiftInn Musanze | Rooms & Suites',
    description: 'View GiftInn rooms, suite amenities, photos, and pricing in Musanze.',
  })

  return (
    <section className="section">
      <SectionHeader
        eyebrow="Rooms & Suites"
        title={
          <span className="gift-hero">
            Comfort Designed For <em>Every Guest</em>
          </span>
        }
        description="Detailed room options with photos, amenities and transparent pricing."
      />
      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  )
}

export default RoomsPage

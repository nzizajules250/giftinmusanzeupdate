import { Link } from 'react-router-dom'

function RoomCard({ room }) {
  return (
    <article className="room-card">
      <img src={room.image} alt={room.name} />
      <div className="room-overlay">
        <span className="room-tag">{room.guests}</span>
        <h3 className="room-name">{room.name}</h3>
        <p className="room-desc">{room.amenities.join(' - ')}</p>
        <p className="room-price">from Frw{room.price} / night</p>
        <Link to={`/rooms/${room.id}`} className="room-cta">
          View Details
        </Link>
      </div>
    </article>
  )
}

export default RoomCard

import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import SectionHeader from '../components/SectionHeader.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { hotelInfo, rooms } from '../data/siteContent.js'
import { db } from '../firebase.js'
import { useRealtimeAvailability } from '../hooks/useRealtimeAvailability.js'
import { useSeo } from '../hooks/useSeo.js'

function BookingPage() {
  const { slots, lastUpdate } = useRealtimeAvailability()
  const { pushNotification } = useNotifications()
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    roomId: String(rooms[0].id),
    checkIn: '',
    checkOut: '',
    guests: 2,
    paymentMethod: 'card',
    notes: '',
  })

  useSeo({
    title: 'GiftInn Musanze | Booking',
    description: 'Book your room at GiftInn with online reservation, real-time availability, and secure payment.',
  })

  const selectedRoom = useMemo(() => rooms.find((room) => String(room.id) === form.roomId), [form.roomId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))

      const summary =
        `Booking Request%0A` +
        `Name: ${encodeURIComponent(form.fullName)}%0A` +
        `Room: ${encodeURIComponent(selectedRoom?.name || '')}%0A` +
        `Dates: ${encodeURIComponent(form.checkIn)} to ${encodeURIComponent(form.checkOut)}%0A` +
        `Guests: ${encodeURIComponent(String(form.guests))}%0A` +
        `Email: ${encodeURIComponent(form.email)}%0A` +
        `Phone: ${encodeURIComponent(form.phone)}%0A` +
        `Payment: ${encodeURIComponent(form.paymentMethod)}%0A` +
        `Notes: ${encodeURIComponent(form.notes)}`

      window.open(`https://wa.me/${hotelInfo.whatsapp}?text=${summary}`, '_blank', 'noreferrer')
      window.open(
        `mailto:${hotelInfo.email}?subject=GiftInn Booking Request&body=${summary.replaceAll('%0A', '\n')}`,
        '_blank',
        'noreferrer',
      )

      await addDoc(collection(db, 'bookings'), {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        roomId: form.roomId,
        roomName: selectedRoom?.name || '',
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      pushNotification('Booking request sent and saved', 'success')
    } catch {
      pushNotification('Booking request failed to save. Please try again.', 'info')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section">
      <SectionHeader
        eyebrow="Booking"
        title={<span className="gift-hero">Reserve Your <em>Stay</em></span>}
        description="Complete your reservation form, check live availability, and proceed with secure payment options."
      />

      <div className="editorial-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        <form onSubmit={handleSubmit} className="form-shell">
          <div className="form-grid">
            <label className="form-label">
              Full Name
              <input className="input" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
            </label>
            <label className="form-label">
              Email
              <input
                className="input"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label className="form-label">
              Phone
              <input className="input" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
            <label className="form-label">
              Room Type
              <select className="select" value={form.roomId} onChange={(event) => setForm({ ...form, roomId: event.target.value })}>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - ${room.price}/night
                  </option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Check-In
              <input className="input" type="date" required value={form.checkIn} onChange={(event) => setForm({ ...form, checkIn: event.target.value })} />
            </label>
            <label className="form-label">
              Check-Out
              <input className="input" type="date" required value={form.checkOut} onChange={(event) => setForm({ ...form, checkOut: event.target.value })} />
            </label>
            <label className="form-label">
              Guests
              <input
                className="input"
                type="number"
                min="1"
                max="6"
                value={form.guests}
                onChange={(event) => setForm({ ...form, guests: Number(event.target.value) })}
              />
            </label>
            <label className="form-label">
              Payment Method
              <select
                className="select"
                value={form.paymentMethod}
                onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}
              >
                <option value="card">Card Payment</option>
                <option value="mobile-money">Mobile Money</option>
                <option value="bank-transfer">Bank Transfer</option>
              </select>
            </label>
          </div>

          <label className="form-label" style={{ marginTop: 16 }}>
            Extra Notes
            <textarea className="textarea" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </label>

          <button type="submit" disabled={sending} className="btn-primary" style={{ marginTop: 18 }}>
            {sending ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>

        <aside>
          <article className="editorial-card">
            <span className="badge-live">Realtime availability</span>
            <p className="editorial-text">Updated at {format(lastUpdate, 'HH:mm:ss')}</p>
            <div style={{ marginTop: 10, maxHeight: 340, overflow: 'auto', display: 'grid', gap: 8 }}>
              {slots.map((slot) => (
                <div key={slot.iso} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #e8e0d0', padding: '10px 12px' }}>
                  <span>{slot.dayLabel}</span>
                  <strong style={{ color: slot.available < 5 ? '#a33232' : '#4a9e6e' }}>{slot.available} rooms</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="editorial-card" style={{ marginTop: 16 }}>
            <h3 className="editorial-title gift-hero">Secure Payment Integration</h3>
            <p className="editorial-text">
              Connect Flutterwave, Stripe or PayPal in this submit flow for full online transactions.
            </p>
            <button type="button" className="btn-primary" onClick={() => pushNotification('Payment gateway connected in demo mode', 'success')}>
              Test Payment Hook
            </button>
          </article>
        </aside>
      </div>
    </section>
  )
}

export default BookingPage

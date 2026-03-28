import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { hotelInfo, rooms } from '../data/siteContent.js'
import { useNotifications } from '../context/NotificationContext.jsx'
import { db } from '../firebase.js'
import { useSeo } from '../hooks/useSeo.js'

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

  .rd-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .rd-wrap {
    font-family: var(--sans);
    background: var(--ivory);
    min-height: 100vh;
    padding-top: 76px;
    overflow-x: hidden;
  }

  /* ════════════════════════════
     BREADCRUMB
  ════════════════════════════ */
  .rd-breadcrumb {
    padding: 28px 6vw 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #9a8a7a;
    opacity: 0;
    animation: rdFadeUp 0.6s ease 0.1s forwards;
  }
  .rd-breadcrumb a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s;
  }
  .rd-breadcrumb a:hover { color: var(--gold); }
  .rd-breadcrumb-sep { color: var(--gold); opacity: 0.6; }
  .rd-breadcrumb-current { color: var(--dark2); }

  /* ════════════════════════════
     HERO TITLE BLOCK
  ════════════════════════════ */
  .rd-title-block {
    padding: 32px 6vw 48px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    border-bottom: 1px solid var(--sand);
  }
  .rd-eyebrow {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px;
    opacity: 0;
    animation: rdFadeUp 0.6s ease 0.2s forwards;
  }
  .rd-title {
    font-family: var(--serif);
    font-size: clamp(36px, 5vw, 72px);
    font-weight: 300;
    line-height: 1.05;
    color: var(--dark2);
    opacity: 0;
    animation: rdFadeUp 0.7s ease 0.35s forwards;
  }
  .rd-title em { font-style: italic; color: var(--gold); }
  .rd-desc {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.8;
    max-width: 500px;
    margin-top: 14px;
    opacity: 0;
    animation: rdFadeUp 0.7s ease 0.5s forwards;
  }
  .rd-price-block {
    text-align: right;
    flex-shrink: 0;
    opacity: 0;
    animation: rdFadeUp 0.7s ease 0.5s forwards;
  }
  .rd-price-label {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .rd-price {
    font-family: var(--serif);
    font-size: clamp(44px, 5vw, 68px);
    font-weight: 300;
    color: var(--dark2);
    line-height: 1;
  }
  .rd-price-sub {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 400;
    color: var(--muted);
    margin-top: 4px;
    letter-spacing: 0.05em;
  }

  @keyframes rdFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ════════════════════════════
     MAIN LAYOUT
  ════════════════════════════ */
  .rd-body {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 0;
    border-bottom: 1px solid var(--sand);
  }
  @media (max-width: 900px) {
    .rd-body { grid-template-columns: 1fr; }
  }

  /* ── Gallery side ── */
  .rd-gallery {
    border-right: 1px solid var(--sand);
    padding: 48px 5vw 48px 6vw;
  }
  @media (max-width: 900px) {
    .rd-gallery { border-right: none; border-bottom: 1px solid var(--sand); padding: 40px 6vw; }
  }

  .rd-main-img-wrap {
    position: relative;
    overflow: hidden;
    cursor: zoom-in;
  }
  .rd-main-img {
    width: 100%;
    height: 460px;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }
  @media (max-width: 600px) { .rd-main-img { height: 300px; } }
  .rd-main-img-wrap:hover .rd-main-img { transform: scale(1.03); }

  /* image counter badge */
  .rd-img-counter {
    position: absolute;
    bottom: 16px; right: 16px;
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--ivory);
    background: rgba(10,8,4,0.55);
    backdrop-filter: blur(6px);
    padding: 6px 14px;
    border: 1px solid rgba(250,248,243,0.2);
  }

  /* expand hint */
  .rd-img-expand {
    position: absolute;
    top: 16px; right: 16px;
    width: 36px; height: 36px;
    border: 1px solid rgba(250,248,243,0.35);
    background: rgba(10,8,4,0.4);
    color: var(--ivory);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.3s, border-color 0.3s;
    cursor: pointer;
  }
  .rd-main-img-wrap:hover .rd-img-expand { opacity: 1; }
  .rd-img-expand:hover { border-color: var(--gold); color: var(--gold); }

  /* Thumbnails */
  .rd-thumbs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 10px;
  }
  .rd-thumb {
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    outline: none;
  }
  .rd-thumb img {
    width: 100%;
    height: 110px;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .rd-thumb:hover img { transform: scale(1.05); }
  .rd-thumb::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    transition: border-color 0.3s;
  }
  .rd-thumb.active::after { border-color: var(--gold); }
  .rd-thumb:not(.active)::after { border-color: transparent; }

  /* ── Info side ── */
  .rd-info {
    padding: 48px 6vw 48px 5vw;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  @media (max-width: 900px) { .rd-info { padding: 40px 6vw; } }

  /* Room specs */
  .rd-specs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--sand);
    border: 1px solid var(--sand);
    margin-bottom: 36px;
  }
  .rd-spec {
    background: var(--ivory);
    padding: 20px 18px;
    text-align: center;
  }
  .rd-spec-value {
    font-family: var(--serif);
    font-size: 26px;
    font-weight: 300;
    color: var(--dark2);
    line-height: 1;
  }
  .rd-spec-label {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 6px;
  }

  /* Divider */
  .rd-divider {
    width: 40px; height: 1px;
    background: var(--gold);
    margin: 28px 0;
    opacity: 0.7;
  }

  /* Amenities */
  .rd-amenities-title {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 18px;
  }
  .rd-amenities-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 36px;
  }
  .rd-amenity {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 400;
    color: var(--dark2);
    line-height: 1.5;
  }
  .rd-amenity::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
  }

  /* Book button */
  .rd-book-btn {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    padding: 18px 0;
    width: 100%;
    border: none;
    cursor: pointer;
    display: block;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: background 0.3s, transform 0.2s;
    margin-top: 8px;
  }
  .rd-book-btn::before {
    content: '';
    position: absolute;
    inset: 0; left: -100%;
    width: 60%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent);
    transition: left 0.5s ease;
  }
  .rd-book-btn:hover::before { left: 150%; }
  .rd-book-btn:hover {
    background: var(--gold-lt);
    transform: translateY(-1px);
  }
  .rd-book-btn:disabled {
    opacity: 0.6; cursor: not-allowed; transform: none;
  }

  .rd-wa-btn {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dark2);
    background: transparent;
    border: 1px solid var(--sand);
    padding: 16px 0;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
    text-decoration: none;
    transition: border-color 0.3s, color 0.3s;
  }
  .rd-wa-btn:hover { border-color: var(--gold); color: var(--gold); }

  /* trust note */
  .rd-trust {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 300;
    color: #9a8a7a;
    line-height: 1.5;
  }
  .rd-trust::before {
    content: '🔒';
    font-size: 13px;
    flex-shrink: 0;
  }

  /* ════════════════════════════
     RELATED ROOMS
  ════════════════════════════ */
  .rd-related {
    padding: 80px 6vw;
    border-top: 1px solid var(--sand);
  }
  .rd-related-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .rd-related-title {
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 48px);
    font-weight: 300;
    color: var(--dark2);
  }
  .rd-related-title em { font-style: italic; color: var(--gold); }
  .rd-related-link {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    border-bottom: 1px solid var(--sand);
    padding-bottom: 2px;
    transition: color 0.3s, border-color 0.3s;
  }
  .rd-related-link:hover { color: var(--gold); border-color: var(--gold); }

  .rd-related-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
  }
  @media (max-width: 600px) { .rd-related-grid { grid-template-columns: 1fr; } }

  .rd-related-card {
    position: relative;
    overflow: hidden;
    text-decoration: none;
    display: block;
    aspect-ratio: 16/10;
    cursor: pointer;
  }
  .rd-related-card img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }
  .rd-related-card:hover img { transform: scale(1.05); }
  .rd-related-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,8,4,0.85) 0%, transparent 55%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
    transform: translateY(6px);
    transition: transform 0.4s ease;
  }
  .rd-related-card:hover .rd-related-card-overlay { transform: translateY(0); }
  .rd-related-card-name {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 300;
    color: var(--ivory);
  }
  .rd-related-card-price {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 400;
    color: var(--gold);
    margin-top: 4px;
    letter-spacing: 0.05em;
  }

  /* ════════════════════════════
     BOOKING MODAL
  ════════════════════════════ */
  .rd-modal-bg {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(10,8,4,0.88);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(6px);
    opacity: 0;
    animation: rdModalIn 0.4s ease forwards;
  }
  @keyframes rdModalIn {
    to { opacity: 1; }
  }

  .rd-modal {
    background: var(--ivory);
    width: min(720px, 96vw);
    max-height: 92vh;
    overflow-y: auto;
    position: relative;
    transform: translateY(24px);
    animation: rdModalSlide 0.45s ease forwards;
  }
  @keyframes rdModalSlide {
    to { transform: translateY(0); }
  }

  /* Modal header */
  .rd-modal-header {
    background: var(--dark2);
    padding: 28px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .rd-modal-title {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 300;
    color: var(--ivory);
  }
  .rd-modal-title em { font-style: italic; color: var(--gold); }
  .rd-modal-close {
    width: 38px; height: 38px;
    border: 1px solid rgba(250,248,243,0.25);
    background: transparent;
    color: var(--ivory);
    font-size: 18px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.3s, color 0.3s;
  }
  .rd-modal-close:hover { border-color: var(--gold); color: var(--gold); }

  /* Modal body */
  .rd-modal-body { padding: 36px 36px 40px; }
  @media (max-width: 500px) { .rd-modal-body { padding: 28px 20px 32px; } }

  .rd-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 24px;
  }
  @media (max-width: 560px) { .rd-form-grid { grid-template-columns: 1fr; } }
  .rd-form-grid .rd-span2 { grid-column: span 2; }
  @media (max-width: 560px) { .rd-form-grid .rd-span2 { grid-column: span 1; } }

  .rd-label {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .rd-input,
  .rd-select {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    color: var(--dark2);
    background: var(--ivory);
    border: 1px solid var(--sand);
    padding: 13px 16px;
    outline: none;
    width: 100%;
    transition: border-color 0.3s;
    appearance: none;
    -webkit-appearance: none;
    border-radius: 0;
  }
  .rd-input:focus, .rd-select:focus { border-color: var(--gold); }
  .rd-input::placeholder { color: #b0a090; }

  .rd-select-wrap {
    position: relative;
  }
  .rd-select-wrap::after {
    content: '';
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    width: 8px; height: 5px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23c8a96e'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    pointer-events: none;
  }
  .rd-select { padding-right: 36px; cursor: pointer; }

  .rd-modal-summary {
    margin-top: 24px;
    padding: 18px 20px;
    background: #f4f0e8;
    border-left: 3px solid var(--gold);
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.65;
  }

  .rd-submit-btn {
    margin-top: 24px;
    width: 100%;
    padding: 18px;
    background: var(--gold);
    color: var(--dark);
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.3s, transform 0.2s;
  }
  .rd-submit-btn::before {
    content: '';
    position: absolute;
    inset: 0; left: -100%;
    width: 60%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent);
    transition: left 0.5s ease;
  }
  .rd-submit-btn:hover::before { left: 150%; }
  .rd-submit-btn:hover { background: var(--gold-lt); }
  .rd-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .rd-sending-dots::after {
    content: '...';
    animation: rdDots 1.2s steps(4, end) infinite;
  }
  @keyframes rdDots {
    0%, 100% { content: '.'; }
    33%       { content: '..'; }
    66%       { content: '...'; }
  }
`

function RoomDetailsPage() {
  const { id } = useParams()
  const room = rooms.find((entry) => String(entry.id) === id)
  const { pushNotification } = useNotifications()

  const [selectedImage, setSelectedImage] = useState(room?.images?.[0] || room?.image || '')
  const [selectedIdx, setSelectedIdx]     = useState(0)
  const [openBooking, setOpenBooking]     = useState(false)
  const [sending, setSending]             = useState(false)
  const [form, setForm] = useState({
    fullName:      '',
    phone:         '',
    checkIn:       '',
    checkOut:      '',
    roomType:      room?.name || '',
    guests:        '',
    paymentMethod: 'card',
  })

  useSeo({
    title:       room ? `${room.name} | GiftInn Musanze` : 'Room Details | GiftInn Musanze',
    description: room
      ? `${room.name} details, room images and direct booking form at GiftInn Musanze.`
      : 'GiftInn room details page.',
  })

  if (!room) return <Navigate to="/rooms" replace />

  const selectImage = (img, idx) => {
    setSelectedImage(img)
    setSelectedIdx(idx)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await new Promise((r) => setTimeout(r, 400))

      const summary =
        `Room Booking Request%0A` +
        `Name: ${encodeURIComponent(form.fullName)}%0A` +
        `Phone: ${encodeURIComponent(form.phone)}%0A` +
        `Room Type: ${encodeURIComponent(form.roomType)}%0A` +
        `Check-In: ${encodeURIComponent(form.checkIn)}%0A` +
        `Check-Out: ${encodeURIComponent(form.checkOut)}%0A` +
        `Guests: ${encodeURIComponent(form.guests)}%0A` +
        `Payment: ${encodeURIComponent(form.paymentMethod)}`

      window.open(`https://wa.me/${hotelInfo.whatsapp}?text=${summary}`, '_blank', 'noreferrer')
      window.open(
        `mailto:${hotelInfo.email}?subject=GiftInn Room Booking Request&body=${summary.replaceAll('%0A', '\n')}`,
        '_blank', 'noreferrer',
      )

      await addDoc(collection(db, 'bookings'), {
        fullName: form.fullName,
        phone: form.phone,
        roomId: room.id,
        roomName: form.roomType,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        paymentMethod: form.paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      pushNotification('Booking sent to WhatsApp and logged for admin', 'success')
      setOpenBooking(false)
    } catch {
      pushNotification('Booking request failed. Please try again.', 'info')
    } finally {
      setSending(false)
    }
  }

  const relatedRooms = rooms.filter((r) => r.id !== room.id)

  return (
    <div className="rd-wrap">
      <style>{css}</style>

      {/* ════ BREADCRUMB ════ */}
      <div className="rd-breadcrumb">
        <a href="/">Home</a>
        <span className="rd-breadcrumb-sep">·</span>
        <a href="/rooms">Rooms & Suites</a>
        <span className="rd-breadcrumb-sep">·</span>
        <span className="rd-breadcrumb-current">{room.name}</span>
      </div>

      {/* ════ TITLE BLOCK ════ */}
      <div className="rd-title-block">
        <div>
          <p className="rd-eyebrow">Room Details</p>
          <h1 className="rd-title">{room.name} <em>Suite</em></h1>
          <p className="rd-desc">{room.description}</p>
        </div>
        <div className="rd-price-block">
          <p className="rd-price-label">Starting From</p>
          <p className="rd-price">Frw{room.price}</p>
          <p className="rd-price-sub">per night · taxes incl.</p>
        </div>
      </div>

      {/* ════ MAIN BODY ════ */}
      <div className="rd-body">

        {/* ── Gallery ── */}
        <div className="rd-gallery">
          <div className="rd-main-img-wrap">
            <img
              src={selectedImage}
              alt={room.name}
              className="rd-main-img"
            />
            <div className="rd-img-counter">
              {String(selectedIdx + 1).padStart(2, '0')} / {String(room.images.length).padStart(2, '0')}
            </div>
            <button className="rd-img-expand" aria-label="Expand image">⤢</button>
          </div>

          <div className="rd-thumbs">
            {room.images.map((img, idx) => (
              <button
                key={img}
                type="button"
                className={`rd-thumb${selectedImage === img ? ' active' : ''}`}
                onClick={() => selectImage(img, idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt={`${room.name} view ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Info panel ── */}
        <div className="rd-info">

          {/* Specs grid */}
          <div className="rd-specs">
            <div className="rd-spec">
              <div className="rd-spec-value">{room.size}</div>
              <div className="rd-spec-label">Room Size</div>
            </div>
            <div className="rd-spec">
              <div className="rd-spec-value">{room.guests.split(' ')[0]}</div>
              <div className="rd-spec-label">Max Guests</div>
            </div>
            <div className="rd-spec">
              <div className="rd-spec-value">5★</div>
              <div className="rd-spec-label">Rating</div>
            </div>
          </div>

          {/* Amenities */}
          <p className="rd-amenities-title">Room Includes</p>
          <div className="rd-amenities-list">
            {room.amenities.map((a) => (
              <div className="rd-amenity" key={a}>{a}</div>
            ))}
          </div>

          <div className="rd-divider" />

          {/* CTA buttons */}
          <button
            type="button"
            className="rd-book-btn"
            onClick={() => setOpenBooking(true)}
          >
            Reserve This Room
          </button>

          <a
            href={`https://wa.me/${hotelInfo.whatsapp}?text=I%20want%20to%20book%20${encodeURIComponent(room.name)}`}
            target="_blank"
            rel="noreferrer"
            className="rd-wa-btn"
          >
            <span>💬</span> Enquire via WhatsApp
          </a>

          <p className="rd-trust">
            Secure booking · Free cancellation up to 48h · No hidden fees
          </p>
        </div>
      </div>

      {/* ════ RELATED ROOMS ════ */}
      {relatedRooms.length > 0 && (
        <section className="rd-related">
          <div className="rd-related-header">
            <h2 className="rd-related-title">
              Other <em>Rooms & Suites</em>
            </h2>
            <a href="/rooms" className="rd-related-link">View All Rooms →</a>
          </div>
          <div className="rd-related-grid">
            {relatedRooms.map((r) => (
              <a href={`/rooms/${r.id}`} className="rd-related-card" key={r.id}>
                <img src={r.image} alt={r.name} />
                <div className="rd-related-card-overlay">
                  <p className="rd-related-card-name">{r.name}</p>
                  <p className="rd-related-card-price">from Frw{r.price} / night</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ════ BOOKING MODAL ════ */}
      {openBooking && (
        <div
          className="rd-modal-bg"
          onClick={(e) => { if (e.target === e.currentTarget) setOpenBooking(false) }}
        >
          <div className="rd-modal">

            {/* Modal header */}
            <div className="rd-modal-header">
              <p className="rd-modal-title">
                Book <em>{room.name}</em>
              </p>
              <button
                type="button"
                className="rd-modal-close"
                onClick={() => setOpenBooking(false)}
                aria-label="Close"
              >✕</button>
            </div>

            {/* Modal body */}
            <div className="rd-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="rd-form-grid">

                  <label className="rd-label">
                    Full Name
                    <input
                      required
                      className="rd-input"
                      placeholder="e.g. Amara Nkusi"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </label>

                  <label className="rd-label">
                    Phone Number
                    <input
                      required
                      className="rd-input"
                      placeholder="+250 788 ..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </label>

                  <label className="rd-label">
                    Check-In
                    <input
                      required
                      type="datetime-local"
                      className="rd-input"
                      value={form.checkIn}
                      onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    />
                  </label>

                  <label className="rd-label">
                    Check-Out
                    <input
                      required
                      type="datetime-local"
                      className="rd-input"
                      value={form.checkOut}
                      onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    />
                  </label>

                  <label className="rd-label">
                    Room Type
                    <div className="rd-select-wrap">
                      <select
                        className="rd-select"
                        value={form.roomType}
                        onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                      >
                        {rooms.map((entry) => (
                          <option key={entry.id} value={entry.name}>{entry.name}</option>
                        ))}
                      </select>
                    </div>
                  </label>

                  <label className="rd-label">
                    Number of Guests
                    <input
                      required
                      type="number"
                      min="1"
                      max="8"
                      className="rd-input"
                      placeholder="e.g. 2"
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    />
                  </label>

                  <label className="rd-label rd-span2">
                    Payment Method
                    <div className="rd-select-wrap">
                      <select
                        className="rd-select"
                        value={form.paymentMethod}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      >
                        <option value="card">💳 Card Payment</option>
                        <option value="mobile-money">📱 Mobile Money</option>
                        <option value="bank-transfer">🏦 Bank Transfer</option>
                      </select>
                    </div>
                  </label>
                </div>

                {/* Summary note */}
                <div className="rd-modal-summary">
                  Your booking request will be sent directly to GiftInn via <strong>WhatsApp</strong> and <strong>email</strong>. Our team will confirm availability and payment details within 2 hours.
                </div>

                <button
                  type="submit"
                  className="rd-submit-btn"
                  disabled={sending}
                >
                  {sending
                    ? <span>Processing<span className="rd-sending-dots" /></span>
                    : 'Confirm Booking Request'
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomDetailsPage

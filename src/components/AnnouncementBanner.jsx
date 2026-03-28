import { useEffect, useState } from 'react'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase.js'

const css = `
  .gi-announce {
    width: 100%;
    background: #0f0c08;
    color: #faf8f3;
    padding: 10px 16px;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
  }
  .gi-announce strong {
    color: #c8a96e;
    font-weight: 600;
  }
  .gi-announce-close {
    background: transparent;
    border: 1px solid rgba(200, 169, 110, 0.35);
    color: #faf8f3;
    width: 26px;
    height: 26px;
    cursor: pointer;
    font-size: 12px;
  }
`

function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null)
  const [dismissedId, setDismissedId] = useState(() => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem('giftinn-dismissed-announcement')
  })
  const [dismissedLocal, setDismissedLocal] = useState(false)

  useEffect(() => {
    const announcementQuery = query(
      collection(db, 'announcements'),
      orderBy('createdAt', 'desc'),
      limit(1),
    )
    const unsubscribe = onSnapshot(announcementQuery, (snapshot) => {
      const docSnap = snapshot.docs[0]
      if (!docSnap) {
        setAnnouncement(null)
        return
      }
      const data = docSnap.data()
      if (data?.active === false) {
        setAnnouncement(null)
        return
      }
      const nextAnnouncement = {
        id: docSnap.id,
        title: data?.title || 'Announcement',
        body: data?.body || '',
      }
      setAnnouncement((prev) => {
        if (!prev || prev.id !== nextAnnouncement.id) {
          setDismissedLocal(false)
        }
        return nextAnnouncement
      })
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'giftinn-dismissed-announcement') {
        setDismissedId(event.newValue)
      }
    }
    const onReset = () => {
      setDismissedId(window.localStorage.getItem('giftinn-dismissed-announcement'))
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('giftinn:announcement-reset', onReset)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('giftinn:announcement-reset', onReset)
    }
  }, [])

  if (!announcement || dismissedLocal || dismissedId === announcement.id) return null

  return (
    <>
      <style>{css}</style>
      <div className="gi-announce" role="status" aria-live="polite">
        <div>
          <strong>{announcement.title}</strong>
          <span style={{ marginLeft: 10 }}>{announcement.body}</span>
        </div>
        <button
          type="button"
          className="gi-announce-close"
          onClick={() => {
            try {
              window.localStorage.setItem('giftinn-dismissed-announcement', announcement.id)
            } catch {
              // ignore storage issues
            }
            setDismissedId(announcement.id)
            setDismissedLocal(true)
          }}
          aria-label="Close announcement"
        >
          x
        </button>
      </div>
    </>
  )
}

export default AnnouncementBanner

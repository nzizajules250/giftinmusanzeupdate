import { useEffect, useState } from 'react'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase.js'
import { usePanel } from '../context/PanelContext.jsx'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --gold:    #c8a96e;
    --gold-lt: #d9be8a;
    --dark:    #0f0c08;
    --dark2:   #1a1410;
    --dark3:   #241c14;
    --ivory:   #faf8f3;
    --sand:    #e8e0d0;
    --muted:   #5a4e42;
    --serif:   'Cormorant Garamond', Georgia, serif;
    --sans:    'Jost', sans-serif;
  }

  /* ── Backdrop ── */
  .gi-panel-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 8, 4, 0.55);
    z-index: 1400;
    display: flex;
    justify-content: flex-end;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    animation: panelBgIn 0.3s ease forwards;
  }
  @keyframes panelBgIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── Side panel ── */
  .gi-panel {
    width: min(400px, 92vw);
    height: 100%;
    background: var(--ivory);
    border-left: 1px solid var(--sand);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: -20px 0 60px rgba(10,8,4,0.25);
    animation: panelSlideIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes panelSlideIn {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }

  /* ── Panel header ── */
  .gi-panel-header {
    background: var(--dark2);
    padding: 22px 24px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(200,169,110,0.18);
    flex-shrink: 0;
  }
  .gi-panel-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .gi-panel-icon {
    width: 36px; height: 36px;
    border: 1px solid rgba(200,169,110,0.3);
    background: var(--dark3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .gi-panel-icon svg {
    width: 16px; height: 16px;
    fill: var(--gold);
  }
  .gi-panel-title {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.1;
  }
  .gi-panel-title span { font-style: italic; color: var(--gold); }
  .gi-panel-subtitle {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.12em;
    color: rgba(250,248,243,0.38);
    margin-top: 2px;
  }
  .gi-panel-close {
    width: 34px; height: 34px;
    background: transparent;
    border: 1px solid rgba(250,248,243,0.18);
    color: rgba(250,248,243,0.5);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s, color 0.3s;
    flex-shrink: 0;
    font-family: var(--sans);
  }
  .gi-panel-close:hover { border-color: var(--gold); color: var(--gold); }

  /* ── Tabs ── */
  .gi-panel-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--sand);
    flex-shrink: 0;
    background: var(--ivory);
  }
  .gi-panel-tab {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 14px 10px;
    cursor: pointer;
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #9a8a7a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: color 0.3s, border-color 0.3s;
    position: relative;
  }
  .gi-panel-tab:hover { color: var(--dark2); }
  .gi-panel-tab.active {
    color: var(--dark2);
    border-bottom-color: var(--gold);
  }
  .gi-panel-tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    background: var(--gold);
    color: var(--dark);
    font-size: 9px;
    font-weight: 700;
    border-radius: 9px;
  }

  /* ── Scrollable body ── */
  .gi-panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .gi-panel-body::-webkit-scrollbar { width: 3px; }
  .gi-panel-body::-webkit-scrollbar-track { background: transparent; }
  .gi-panel-body::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 2px; }

  /* ── Empty state ── */
  .gi-panel-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 60px 20px;
    text-align: center;
    flex: 1;
  }
  .gi-panel-empty-icon {
    width: 52px; height: 52px;
    border: 1px solid var(--sand);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .gi-panel-empty-icon svg {
    width: 22px; height: 22px;
    fill: #c0b0a0;
  }
  .gi-panel-empty-title {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 300;
    color: var(--dark2);
  }
  .gi-panel-empty-title em { font-style: italic; color: var(--gold); }
  .gi-panel-empty-text {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.7;
    max-width: 240px;
  }

  /* ── Notification card ── */
  .gi-panel-card {
    border: 1px solid var(--sand);
    background: var(--ivory);
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: box-shadow 0.3s;
    animation: cardIn 0.35s ease forwards;
    opacity: 0;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .gi-panel-card:hover { box-shadow: 0 4px 18px rgba(26,20,16,0.07); }

  .gi-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .gi-card-dot-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }
  .gi-card-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 5px;
  }
  .gi-card-dot.info    { background: #4a9ecc; }
  .gi-card-dot.success { background: #4caf7d; }
  .gi-card-dot.warning { background: var(--gold); }
  .gi-card-dot.error   { background: #c97b84; }

  .gi-card-message {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 400;
    color: var(--dark2);
    line-height: 1.65;
    flex: 1;
  }
  .gi-card-type-badge {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 3px 8px;
    border: 1px solid var(--sand);
    color: var(--muted);
    flex-shrink: 0;
    white-space: nowrap;
  }
  .gi-card-type-badge.info    { border-color: rgba(74,158,204,0.4);  color: #4a9ecc; }
  .gi-card-type-badge.success { border-color: rgba(76,175,125,0.4);  color: #4caf7d; }
  .gi-card-type-badge.warning { border-color: rgba(200,169,110,0.4); color: var(--gold); }
  .gi-card-type-badge.error   { border-color: rgba(201,123,132,0.4); color: #c97b84; }

  .gi-card-divider {
    height: 1px;
    background: var(--sand);
    opacity: 0.6;
  }

  .gi-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .gi-card-meta {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 300;
    color: #9a8a7a;
    letter-spacing: 0.04em;
  }

  /* ── Announcement card ── */
  .gi-ann-card {
    border: 1px solid var(--sand);
    background: var(--ivory);
    overflow: hidden;
    transition: box-shadow 0.3s;
    animation: cardIn 0.35s ease forwards;
    opacity: 0;
  }
  .gi-ann-card:hover { box-shadow: 0 4px 18px rgba(26,20,16,0.07); }

  .gi-ann-card-header {
    background: var(--dark2);
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(200,169,110,0.15);
  }
  .gi-ann-card-icon {
    width: 28px; height: 28px;
    border: 1px solid rgba(200,169,110,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .gi-ann-card-icon svg {
    width: 13px; height: 13px;
    fill: var(--gold);
  }
  .gi-ann-card-title {
    font-family: var(--serif);
    font-size: 16px;
    font-weight: 400;
    color: var(--ivory);
    flex: 1;
    line-height: 1.2;
  }
  .gi-ann-card-body {
    padding: 14px 18px;
  }
  .gi-ann-card-text {
    font-family: var(--sans);
    font-size: 12.5px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.75;
  }
  .gi-ann-card-action {
    display: flex;
    gap: 0;
    padding: 12px 18px;
    border-top: 1px solid var(--sand);
  }
  .gi-ann-show-btn {
    font-family: var(--sans);
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: background 0.3s, transform 0.2s;
  }
  .gi-ann-show-btn:hover { background: var(--gold-lt); transform: translateY(-1px); }
  .gi-ann-show-btn svg {
    width: 12px; height: 12px;
    fill: var(--dark);
  }

  /* ── Panel footer ── */
  .gi-panel-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--sand);
    background: #f4f0e8;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .gi-panel-footer-text {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 300;
    color: #9a8a7a;
    line-height: 1.5;
  }
  .gi-panel-footer-text strong {
    font-weight: 500;
    color: var(--muted);
  }
  .gi-panel-clear-btn {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    background: transparent;
    border: 1px solid var(--sand);
    padding: 7px 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.3s, color 0.3s;
  }
  .gi-panel-clear-btn:hover { border-color: var(--gold); color: var(--dark2); }
`

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
    </svg>
  )
}
function IconAnnounce() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.96.74-2.21 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.99-.74 2.24-1.68 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z"/>
    </svg>
  )
}
function IconEmpty() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
  )
}
function IconPin() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
    </svg>
  )
}

/* ── Type config ─────────────────────────────────────────────────────────── */
const TYPE_MAP = {
  info:    { label: 'Info',    dot: 'info'    },
  success: { label: 'Success', dot: 'success' },
  warning: { label: 'Warning', dot: 'warning' },
  error:   { label: 'Error',   dot: 'error'   },
}

function AnnouncementNotificationPanel() {
  const { openPanel, setOpenPanel, panelTab, setPanelTab } = usePanel()
  const [notifications,  setNotifications]  = useState([])
  const [announcements,  setAnnouncements]  = useState([])

  useEffect(() => {
    if (openPanel !== 'panel') return
    const noteQ = query(collection(db, 'notifications'),  orderBy('createdAt', 'desc'), limit(10))
    const annQ  = query(collection(db, 'announcements'),  orderBy('createdAt', 'desc'), limit(10))
    const unsubN = onSnapshot(noteQ, (snap) =>
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
    const unsubA = onSnapshot(annQ,  (snap) =>
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
    return () => { unsubN(); unsubA() }
  }, [openPanel])

  if (openPanel !== 'panel') return null

  const totalCount = notifications.length + announcements.length

  return (
    <>
      <style>{css}</style>

      {/* Backdrop */}
      <div className="gi-panel-backdrop" onClick={() => setOpenPanel(null)}>

        {/* Side panel */}
        <aside className="gi-panel" onClick={(e) => e.stopPropagation()} role="complementary" aria-label="Updates panel">

          {/* ── Header ── */}
          <div className="gi-panel-header">
            <div className="gi-panel-header-left">
              <div className="gi-panel-icon">
                <IconBell />
              </div>
              <div>
                <p className="gi-panel-title">
                  Gift<span>Inn</span> Updates
                </p>
                <p className="gi-panel-subtitle">
                  {totalCount > 0 ? `${totalCount} item${totalCount !== 1 ? 's' : ''} · Live` : 'All caught up'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="gi-panel-close"
              onClick={() => setOpenPanel(null)}
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="gi-panel-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={panelTab === 'notifications'}
              className={`gi-panel-tab${panelTab === 'notifications' ? ' active' : ''}`}
              onClick={() => setPanelTab('notifications')}
            >
              <IconBell />
              Notifications
              {notifications.length > 0 && (
                <span className="gi-panel-tab-badge">{notifications.length}</span>
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={panelTab === 'announcements'}
              className={`gi-panel-tab${panelTab === 'announcements' ? ' active' : ''}`}
              onClick={() => setPanelTab('announcements')}
            >
              <IconAnnounce />
              Announcements
              {announcements.length > 0 && (
                <span className="gi-panel-tab-badge">{announcements.length}</span>
              )}
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="gi-panel-body" role="tabpanel">

            {/* — Notifications tab — */}
            {panelTab === 'notifications' && (
              <>
                {notifications.length === 0 ? (
                  <div className="gi-panel-empty">
                    <div className="gi-panel-empty-icon"><IconEmpty /></div>
                    <p className="gi-panel-empty-title">All <em>clear</em></p>
                    <p className="gi-panel-empty-text">
                      No notifications yet. New alerts from bookings, reviews, and chat messages will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map((note, idx) => {
                    const type = TYPE_MAP[note.type] || TYPE_MAP.info
                    return (
                      <div
                        key={note.id}
                        className="gi-panel-card"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div className="gi-card-top">
                          <div className="gi-card-dot-wrap">
                            <span className={`gi-card-dot ${type.dot}`} />
                            <p className="gi-card-message">{note.message}</p>
                          </div>
                          <span className={`gi-card-type-badge ${type.dot}`}>{type.label}</span>
                        </div>
                        {note.createdAt && (
                          <>
                            <div className="gi-card-divider" />
                            <div className="gi-card-footer">
                              <span className="gi-card-meta">
                                {note.createdAt?.toDate
                                  ? note.createdAt.toDate().toLocaleString('en-US', {
                                      month: 'short', day: 'numeric',
                                      hour: '2-digit', minute: '2-digit',
                                    })
                                  : 'Just now'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </>
            )}

            {/* — Announcements tab — */}
            {panelTab === 'announcements' && (
              <>
                {announcements.length === 0 ? (
                  <div className="gi-panel-empty">
                    <div className="gi-panel-empty-icon"><IconAnnounce /></div>
                    <p className="gi-panel-empty-title">No <em>announcements</em></p>
                    <p className="gi-panel-empty-text">
                      Hotel announcements, special offers, and important updates will be displayed here.
                    </p>
                  </div>
                ) : (
                  announcements.map((item, idx) => (
                    <div
                      key={item.id}
                      className="gi-ann-card"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="gi-ann-card-header">
                        <div className="gi-ann-card-icon"><IconAnnounce /></div>
                        <p className="gi-ann-card-title">{item.title}</p>
                      </div>
                      {item.body && (
                        <div className="gi-ann-card-body">
                          <p className="gi-ann-card-text">{item.body}</p>
                        </div>
                      )}
                      <div className="gi-ann-card-action">
                        <button
                          type="button"
                          className="gi-ann-show-btn"
                          onClick={() => {
                            window.localStorage.removeItem('giftinn-dismissed-announcement')
                            window.dispatchEvent(new Event('giftinn:announcement-reset'))
                          }}
                        >
                          <IconPin />
                          Show on Top
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="gi-panel-footer">
            <p className="gi-panel-footer-text">
              <strong>GiftInn Musanze</strong><br />
              Live updates from Firebase
            </p>
            <button
              type="button"
              className="gi-panel-clear-btn"
              onClick={() => setOpenPanel(null)}
            >
              Dismiss
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}

export default AnnouncementNotificationPanel
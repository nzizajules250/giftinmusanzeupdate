import { useMemo, useState, useRef } from 'react'
import { hotelInfo } from '../data/siteContent.js'
import { useNotifications } from '../context/NotificationContext.jsx'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --gold:    #c8a96e;
    --gold-lt: #d9be8a;
    --dark:    #0f0c08;
    --dark2:   #1a1410;
    --dark3:   #251e18;
    --ivory:   #faf8f3;
    --sand:    #e8e0d0;
    --muted:   #5a4e42;
    --serif:   'Cormorant Garamond', Georgia, serif;
    --sans:    'Jost', sans-serif;
  }

  /* ── Trigger button ── */
  .cw-trigger {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 900;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  .cw-fab {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--dark2);
    border: 1px solid rgba(200,169,110,0.35);
    color: var(--ivory);
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 14px 22px;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(10,8,4,0.45);
    transition: background 0.3s, border-color 0.3s, transform 0.2s, box-shadow 0.3s;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  .cw-fab::before {
    content: '';
    position: absolute;
    inset: 0; left: -100%;
    width: 60%;
    background: linear-gradient(120deg, transparent, rgba(200,169,110,0.12), transparent);
    transition: left 0.5s ease;
  }
  .cw-fab:hover::before { left: 150%; }
  .cw-fab:hover {
    background: var(--dark3);
    border-color: var(--gold);
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(10,8,4,0.5);
  }
  .cw-fab-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4caf7d;
    flex-shrink: 0;
    animation: cwPulse 1.8s ease-in-out infinite;
  }
  .cw-fab-dot.offline { background: #9a8a7a; animation: none; }
  @keyframes cwPulse {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(76,175,125,0.4); }
    50%       { opacity: 0.7; transform: scale(1.2); box-shadow: 0 0 0 5px rgba(76,175,125,0); }
  }

  .cw-fab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cw-fab-icon svg {
    width: 16px; height: 16px;
    fill: var(--gold);
  }

  /* Unread badge */
  .cw-badge {
    position: absolute;
    top: -6px; right: -6px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--gold);
    color: var(--dark);
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: cwBounce 0.4s ease;
  }
  @keyframes cwBounce {
    0%   { transform: scale(0); }
    70%  { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  /* ── Chat panel ── */
  .cw-panel {
    position: fixed;
    bottom: 88px;
    right: 28px;
    z-index: 901;
    width: min(92vw, 340px);
    /* hard cap so it never overlaps the navbar */
    max-height: min(68vh, 480px);
    background: var(--ivory);
    border: 1px solid var(--sand);
    box-shadow: 0 16px 48px rgba(10,8,4,0.32), 0 2px 0 rgba(200,169,110,0.18);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    opacity: 0;
    transform: translateY(16px) scale(0.97);
    transform-origin: bottom right;
    animation: cwPanelIn 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
  }
  @keyframes cwPanelIn {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Panel header */
  .cw-header {
    background: var(--dark2);
    padding: 13px 16px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(200,169,110,0.15);
    flex-shrink: 0;
  }
  .cw-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cw-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--dark3);
    border: 1px solid rgba(200,169,110,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: var(--serif);
    font-size: 13px;
    font-style: italic;
    color: var(--gold);
    font-weight: 400;
  }
  .cw-header-name {
    font-family: var(--serif);
    font-size: 15px;
    font-weight: 400;
    color: var(--ivory);
    line-height: 1.1;
  }
  .cw-header-name span { color: var(--gold); font-style: italic; }
  .cw-header-status {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 400;
    color: rgba(250,248,243,0.45);
    letter-spacing: 0.05em;
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .cw-header-status::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #4caf7d;
    flex-shrink: 0;
    animation: cwPulse 1.8s ease-in-out infinite;
  }
  .cw-close-btn {
    width: 32px; height: 32px;
    background: transparent;
    border: 1px solid rgba(250,248,243,0.15);
    color: rgba(250,248,243,0.5);
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s, color 0.3s;
    flex-shrink: 0;
  }
  .cw-close-btn:hover { border-color: var(--gold); color: var(--gold); }

  /* Message area */
  .cw-messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;       /* allow flex to shrink it */
    background: #f6f2ec;
    scroll-behavior: smooth;
  }
  .cw-messages::-webkit-scrollbar { width: 3px; }
  .cw-messages::-webkit-scrollbar-track { background: transparent; }
  .cw-messages::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 2px; }

  .cw-msg {
    display: flex;
    flex-direction: column;
    max-width: 85%;
    animation: cwMsgIn 0.3s ease forwards;
  }
  @keyframes cwMsgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cw-msg.guest { align-self: flex-end; align-items: flex-end; }
  .cw-msg.bot   { align-self: flex-start; align-items: flex-start; }

  .cw-bubble {
    padding: 8px 12px;
    font-family: var(--sans);
    font-size: 12.5px;
    font-weight: 300;
    line-height: 1.6;
  }
  .cw-msg.bot .cw-bubble {
    background: var(--ivory);
    color: var(--dark2);
    border: 1px solid var(--sand);
    border-radius: 0 12px 12px 12px;
  }
  .cw-msg.guest .cw-bubble {
    background: var(--dark2);
    color: var(--ivory);
    border-radius: 12px 0 12px 12px;
  }

  .cw-msg-time {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 400;
    color: #9a8a7a;
    letter-spacing: 0.05em;
    margin-top: 4px;
    padding: 0 2px;
  }

  /* Typing indicator */
  .cw-typing {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 14px;
    background: var(--ivory);
    border: 1px solid var(--sand);
    border-radius: 0 12px 12px 12px;
    animation: cwMsgIn 0.3s ease forwards;
  }
  .cw-typing span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--muted);
    animation: cwTyping 1.2s ease-in-out infinite;
  }
  .cw-typing span:nth-child(2) { animation-delay: 0.2s; }
  .cw-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes cwTyping {
    0%, 100% { opacity: 0.3; transform: translateY(0); }
    50%       { opacity: 1;   transform: translateY(-4px); }
  }

  /* Input area */
  .cw-input-area {
    padding: 10px 12px;
    background: var(--ivory);
    border-top: 1px solid var(--sand);
    display: flex;
    gap: 7px;
    align-items: center;
    flex-shrink: 0;
  }
  .cw-input {
    flex: 1;
    font-family: var(--sans);
    font-size: 12.5px;
    font-weight: 300;
    color: var(--dark2);
    background: var(--ivory);
    border: 1px solid var(--sand);
    padding: 9px 12px;
    outline: none;
    border-radius: 0;
    appearance: none;
    transition: border-color 0.3s;
    resize: none;
  }
  .cw-input::placeholder { color: #b0a090; }
  .cw-input:focus { border-color: var(--gold); }
  .cw-send-btn {
    width: 36px; height: 36px;
    background: var(--gold);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.3s, transform 0.2s;
  }
  .cw-send-btn:hover { background: var(--gold-lt); transform: scale(1.05); }
  .cw-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .cw-send-btn svg {
    width: 13px; height: 13px;
    fill: var(--dark);
  }

  /* Actions row */
  .cw-actions {
    display: flex;
    gap: 5px;
    padding: 8px 12px 10px;
    background: var(--ivory);
    border-top: 1px solid rgba(232,224,208,0.5);
    flex-shrink: 0;
  }
  .cw-action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 8px 8px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.3s, transform 0.2s;
  }
  .cw-action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .cw-action-btn svg {
    width: 12px; height: 12px;
    fill: currentColor;
    flex-shrink: 0;
  }
  .cw-action-wa {
    background: #25d366;
    color: #fff;
  }
  .cw-action-email {
    background: var(--dark2);
    color: var(--ivory);
  }

  /* ── Quick replies ── */
  .cw-quick-replies {
    padding: 6px 12px 0;
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    background: #f6f2ec;
    border-top: 1px solid rgba(232,224,208,0.6);
    flex-shrink: 0;
  }
  .cw-quick-btn {
    font-family: var(--sans);
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.06em;
    padding: 4px 10px;
    background: var(--ivory);
    border: 1px solid var(--sand);
    color: var(--muted);
    cursor: pointer;
    transition: border-color 0.3s, color 0.3s;
    white-space: nowrap;
    margin-bottom: 6px;
  }
  .cw-quick-btn:hover {
    border-color: var(--gold);
    color: var(--dark2);
  }
`

/* ── SVG Icons ─────────────────────────────────────────────────────────────── */
function IconChat() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
  )
}
function IconSend() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  )
}
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  )
}

/* ── Quick reply suggestions ─────────────────────────────────────────────── */
const QUICK_REPLIES = [
  'Room availability?',
  'Book a room',
  'Gorilla trekking',
  'Spa & wellness',
]

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const getTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

const getSessionId = () => {
  if (typeof window === 'undefined') return 'server'
  const stored = window.localStorage.getItem('giftinn-session')
  if (stored) return stored
  const next = crypto.randomUUID()
  window.localStorage.setItem('giftinn-session', next)
  return next
}

/* ── Component ───────────────────────────────────────────────────────────── */
function ChatWidget() {
  const [open, setOpen]         = useState(false)
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const [unread, setUnread]     = useState(1)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hello, welcome to GiftInn Musanze 🌿 How can our concierge team help you today?',
      time: getTime(),
    },
  ])
  const { pushNotification } = useNotifications()
  const messagesEndRef = useRef(null)
  const sessionIdRef = useRef(getSessionId())

  // Auto-scroll to bottom
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  // Clear unread when opened
  const handleOpen = () => {
    setOpen(true)
    setUnread(0)
  }

  const sendMessage = async (text) => {
    const next = (text || input).trim()
    if (!next) return

    setMessages((prev) => [...prev, { role: 'guest', text: next, time: getTime() }])
    setInput('')
    pushNotification('Message received - concierge will reply shortly', 'info')
    try {
      await addDoc(collection(db, 'chatMessages'), {
        message: next,
        sessionId: sessionIdRef.current,
        page: window.location?.pathname || '/',
        createdAt: serverTimestamp(),
      })
    } catch {
      // ignore write failures
    }

    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Thank you for reaching out. Our concierge will reply on WhatsApp or email within a few minutes.',
          time: getTime(),
        },
      ])
      scrollToBottom()
    }, 1400)
    setTimeout(scrollToBottom, 50)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const transcript = useMemo(
    () => messages.map((m) => `${m.role === 'bot' ? 'GiftInn' : 'Guest'}: ${m.text}`).join('\n'),
    [messages],
  )
  const encoded = encodeURIComponent(`GiftInn Chat Transcript\n\n${transcript}`)

  return (
    <>
      <style>{css}</style>

      <div className="cw-trigger">
        {/* Chat panel */}
        {open && (
          <div className="cw-panel" role="dialog" aria-label="Live chat">

            {/* Header */}
            <div className="cw-header">
              <div className="cw-header-left">
                <div className="cw-avatar">G</div>
                <div>
                  <p className="cw-header-name">Gift<span>Inn</span></p>
                  <p className="cw-header-status">Concierge · Online now</p>
                </div>
              </div>
              <button
                type="button"
                className="cw-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >✕</button>
            </div>

            {/* Messages */}
            <div className="cw-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`cw-msg ${msg.role}`}>
                  <div className="cw-bubble">{msg.text}</div>
                  <span className="cw-msg-time">{msg.time}</span>
                </div>
              ))}
              {typing && (
                <div className="cw-typing">
                  <span /><span /><span />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="cw-quick-replies">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="cw-quick-btn"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="cw-input-area">
              <input
                type="text"
                className="cw-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your message…"
                aria-label="Chat message"
              />
              <button
                type="button"
                className="cw-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <IconSend />
              </button>
            </div>

            {/* Forward actions */}
            <div className="cw-actions">
              <a
                href={`https://wa.me/${hotelInfo.whatsapp}?text=${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="cw-action-btn cw-action-wa"
              >
                <IconWhatsApp />
                WhatsApp
              </a>
              <a
                href={`mailto:${hotelInfo.email}?subject=GiftInn Chat Request&body=${encoded}`}
                className="cw-action-btn cw-action-email"
              >
                <IconEmail />
                Send Email
              </a>
            </div>
          </div>
        )}

        {/* FAB trigger */}
        <button
          type="button"
          className="cw-fab"
          onClick={open ? () => setOpen(false) : handleOpen}
          aria-expanded={open}
          aria-label={open ? 'Close chat' : 'Open live chat'}
        >
          {unread > 0 && !open && (
            <span className="cw-badge" aria-label={`${unread} unread message`}>{unread}</span>
          )}
          <span className="cw-fab-dot" />
          <span className="cw-fab-icon"><IconChat /></span>
          {open ? 'Close Chat' : 'Live Chat'}
        </button>
      </div>
    </>
  )
}

export default ChatWidget




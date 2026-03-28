import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'

const css = `
  .gi-admin-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 8, 6, 0.72);
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .gi-admin-modal {
    width: min(520px, 100%);
    background: #11100b;
    color: #faf8f3;
    border: 1px solid rgba(200, 169, 110, 0.25);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.5);
    padding: 32px;
    position: relative;
  }

  .gi-admin-kicker {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(250, 248, 243, 0.6);
  }

  .gi-admin-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 32px;
    font-weight: 400;
    margin: 8px 0 18px;
  }

  .gi-admin-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
  }

  .gi-admin-tab {
    border: 1px solid rgba(200, 169, 110, 0.35);
    background: transparent;
    color: rgba(250, 248, 243, 0.65);
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 9px 14px;
    cursor: pointer;
  }
  .gi-admin-tab.active {
    color: #0f0c08;
    background: #c8a96e;
  }

  .gi-admin-form {
    display: grid;
    gap: 12px;
  }

  .gi-admin-label {
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(250, 248, 243, 0.6);
  }

  .gi-admin-input {
    width: 100%;
    background: #1b1812;
    border: 1px solid rgba(200, 169, 110, 0.25);
    color: #faf8f3;
    padding: 10px 12px;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
  }
  .gi-admin-input:focus {
    outline: none;
    border-color: #c8a96e;
    box-shadow: 0 0 0 2px rgba(200, 169, 110, 0.2);
  }

  .gi-admin-submit {
    margin-top: 6px;
    background: #c8a96e;
    color: #0f0c08;
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    padding: 12px 14px;
    cursor: pointer;
  }
  .gi-admin-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .gi-admin-error {
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    color: #f1b0a6;
    background: rgba(241, 176, 166, 0.1);
    border: 1px solid rgba(241, 176, 166, 0.35);
    padding: 8px 10px;
  }

  .gi-admin-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: 1px solid rgba(200, 169, 110, 0.35);
    color: #faf8f3;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
`

const parseAllowList = (value) => {
  if (!value) return []
  return value
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

function AdminAuthModal({ open, onClose }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const allowList = useMemo(
    () => parseAllowList(import.meta.env.VITE_ADMIN_EMAILS),
    [],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    setError('')
    setPassword('')
    setConfirm('')
  }, [open, mode])

  if (!open) return null

  const isAllowed = (value) => {
    if (!allowList.length) return true
    return allowList.includes(value.toLowerCase())
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Enter your admin email and password.')
      return
    }

    if (!isAllowed(email)) {
      setError('This email is not allowed for admin access.')
      return
    }

    if (mode === 'register' && password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      onClose()
      navigate('/admin')
    } catch (err) {
      setError(err?.message || 'Unable to authenticate.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="gi-admin-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <style>{css}</style>
      <div className="gi-admin-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="gi-admin-close" onClick={onClose} aria-label="Close admin auth">
          x
        </button>
        <div className="gi-admin-kicker">GiftInn Admin</div>
        <div className="gi-admin-title">
          {mode === 'login' ? 'Admin Sign In' : 'Admin Register'}
        </div>
        <div className="gi-admin-tabs">
          <button
            type="button"
            className={`gi-admin-tab${mode === 'login' ? ' active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`gi-admin-tab${mode === 'register' ? ' active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        <form className="gi-admin-form" onSubmit={submit}>
          <label className="gi-admin-label" htmlFor="gi-admin-email">Email</label>
          <input
            id="gi-admin-email"
            type="email"
            className="gi-admin-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />
          <label className="gi-admin-label" htmlFor="gi-admin-password">Password</label>
          <input
            id="gi-admin-password"
            type="password"
            className="gi-admin-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
          {mode === 'register' && (
            <>
              <label className="gi-admin-label" htmlFor="gi-admin-confirm">Confirm Password</label>
              <input
                id="gi-admin-confirm"
                type="password"
                className="gi-admin-input"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
                required
              />
            </>
          )}
          {error && <div className="gi-admin-error">{error}</div>}
          <button type="submit" className="gi-admin-submit" disabled={busy}>
            {busy ? 'Please wait' : mode === 'login' ? 'Sign In' : 'Create Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminAuthModal

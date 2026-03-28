/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase.js'

const NotificationContext = createContext(null)

function canUseDeviceNotifications() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [localNotifications, setLocalNotifications] = useState([])
  const [dismissedIds, setDismissedIds] = useState(() => new Set())
  const seenFirestoreIds = useRef(new Set())

  const enqueueNotification = useCallback((message, type = 'info') => {
    const item = { id: crypto.randomUUID(), message, type, createdAt: Date.now() }
    setLocalNotifications((prev) => [item, ...prev].slice(0, 6))
    setTimeout(() => {
      setLocalNotifications((prev) => prev.filter((note) => note.id !== item.id))
    }, 4800)
  }, [])

  const sendDeviceNotification = useCallback((message, type = 'info') => {
    if (!canUseDeviceNotifications() || window.Notification.permission !== 'granted') return

    const title = type === 'success' ? 'GiftInn Confirmed Update' : 'GiftInn Live Update'
    const options = {
      body: message,
      icon: '/icons/giftinn-logo.svg',
      badge: '/icons/giftinn-badge.svg',
      tag: `giftinn-${type}`,
      data: { url: '/?focus=notifications' },
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.showNotification(title, options)
        } else {
          new window.Notification(title, options)
        }
      })
    } else {
      new window.Notification(title, options)
    }
  }, [])

  const pushNotification = useCallback(
    (message, type = 'info') => {
      enqueueNotification(message, type)
      sendDeviceNotification(message, type)
    },
    [enqueueNotification, sendDeviceNotification],
  )

  useEffect(() => {
    const welcomeTimer = window.setTimeout(() => {
      enqueueNotification('Realtime notifications connected', 'success')
    }, 1200)

    const noteQuery = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(10))
    const unsubscribe = onSnapshot(noteQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        const createdAt = data?.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()
        return {
          id: docSnap.id,
          message: data?.message || '',
          type: data?.type || 'info',
          createdAt,
          active: data?.active !== false,
        }
      })
      const visible = items.filter((item) => item.active && !dismissedIds.has(item.id)).slice(0, 6)
      setNotifications(visible)

      visible.forEach((item) => {
        if (seenFirestoreIds.current.has(item.id)) return
        seenFirestoreIds.current.add(item.id)
        sendDeviceNotification(item.message, item.type || 'info')
      })
    })

    return () => {
      window.clearTimeout(welcomeTimer)
      unsubscribe()
    }
  }, [enqueueNotification, dismissedIds, sendDeviceNotification])

  const removeNotification = (id) => {
    setDismissedIds((prev) => new Set([...prev, id]))
    setNotifications((prev) => prev.filter((note) => note.id !== id))
    setLocalNotifications((prev) => prev.filter((note) => note.id !== id))
  }

  const value = useMemo(
    () => ({
      notifications: [...localNotifications, ...notifications]
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, 6),
      pushNotification,
      removeNotification,
    }),
    [localNotifications, notifications, pushNotification],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error('useNotifications must be used inside NotificationProvider')
  }
  return ctx
}

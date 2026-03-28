import { useState } from 'react'
import { useNotifications } from '../context/NotificationContext.jsx'

function NotificationPermissionPrompt() {
  const { pushNotification } = useNotifications()
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? window.Notification.permission : 'denied',
  )
  const [requesting, setRequesting] = useState(false)

  const requestAccess = async () => {
    if (!('Notification' in window) || requesting) return
    setRequesting(true)
    const result = await window.Notification.requestPermission()
    setPermission(result)
    setRequesting(false)

    if (result === 'granted') {
      pushNotification('Device notifications enabled on this browser', 'success')
    } else {
      pushNotification('Notification access not granted', 'info')
    }
  }

  if (permission === 'granted') return null

  return (
    <div className="notification-permission">
      <div>
        <p className="notification-permission-title">Enable Device Notifications</p>
        <p className="notification-permission-text">
          Allow GiftInn to send booking and live updates directly to this device.
        </p>
      </div>
      <button type="button" className="btn-primary" onClick={requestAccess} disabled={requesting}>
        {requesting ? 'Requesting...' : 'Allow Notifications'}
      </button>
    </div>
  )
}

export default NotificationPermissionPrompt


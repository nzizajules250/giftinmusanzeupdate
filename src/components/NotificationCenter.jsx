import { useNotifications } from '../context/NotificationContext.jsx'

function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed right-4 top-20 z-[130] flex w-[min(95vw,360px)] flex-col gap-3">
      {notifications.map((note) => (
        <button
          key={note.id}
          type="button"
          onClick={() => removeNotification(note.id)}
          className={`w-full border px-4 py-3 text-left shadow-lg transition ${
            note.type === 'success'
              ? 'border-emerald-400/70 bg-emerald-50 text-emerald-900'
              : 'border-[#e8e0d0] bg-[#faf8f3] text-[#1a1410]'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#c8a96e]">Live Update</p>
          <p className="mt-1 text-sm font-semibold">{note.message}</p>
        </button>
      ))}
    </div>
  )
}

export default NotificationCenter

import { addDays, format, isWeekend } from 'date-fns'
import { useEffect, useState } from 'react'

function generateSlots() {
  const now = new Date()
  return Array.from({ length: 21 }, (_, idx) => {
    const date = addDays(now, idx)
    const base = 22 - idx + (isWeekend(date) ? -4 : 0)
    const available = Math.max(2, base + Math.floor(Math.random() * 5))
    return {
      iso: format(date, 'yyyy-MM-dd'),
      dayLabel: format(date, 'EEE d MMM'),
      available,
    }
  })
}

export function useRealtimeAvailability() {
  const [slots, setSlots] = useState(generateSlots)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prev) =>
        prev.map((slot) => ({
          ...slot,
          available: Math.max(0, slot.available + Math.floor(Math.random() * 3) - 1),
        })),
      )
      setLastUpdate(new Date())
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  return { slots, lastUpdate }
}


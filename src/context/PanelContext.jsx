/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const PanelContext = createContext(null)

export function PanelProvider({ children }) {
  const [openPanel, setOpenPanel] = useState(null)
  const [panelTab, setPanelTab] = useState('notifications')

  const value = useMemo(
    () => ({ openPanel, setOpenPanel, panelTab, setPanelTab }),
    [openPanel, panelTab],
  )

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
}

export function usePanel() {
  const ctx = useContext(PanelContext)
  if (!ctx) throw new Error('usePanel must be used inside PanelProvider')
  return ctx
}

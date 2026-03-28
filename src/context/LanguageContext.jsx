/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const translations = {
  en: {
    heroTitle: 'Elevated Hospitality in Musanze',
    heroSubtitle: 'Luxury stay, mountain views, and seamless booking at GiftInn.',
    bookNow: 'Book Now',
  },
  rw: {
    heroTitle: 'Ubwakiranyi Buhanitse i Musanze',
    heroSubtitle: 'Aho uruhukira heza, ufite ibiboneka byiza kandi ubone booking byoroshye.',
    bookNow: 'Buka Ubu',
  },
  fr: {
    heroTitle: 'Hospitalite Premium a Musanze',
    heroSubtitle: 'Sejour haut de gamme, vue sur montagnes et reservation rapide.',
    bookNow: 'Reserver',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }
  return ctx
}

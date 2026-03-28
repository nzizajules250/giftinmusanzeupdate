import { useEffect } from 'react'

export function useSeo({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title
    }
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', description)
      }
    }
  }, [title, description])
}


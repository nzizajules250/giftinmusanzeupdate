import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { PanelProvider } from './context/PanelContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PanelProvider>
          <LanguageProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </LanguageProvider>
        </PanelProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

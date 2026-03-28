import { Outlet, useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget.jsx'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'
import AnnouncementBanner from './AnnouncementBanner.jsx'
import AnnouncementNotificationPanel from './AnnouncementNotificationPanel.jsx'
import NotificationCenter from './NotificationCenter.jsx'
import NotificationPermissionPrompt from './NotificationPermissionPrompt.jsx'

function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="site-shell">
      {!isAdmin && <Navbar />}
      {!isAdmin && <AnnouncementBanner />}
      {!isAdmin && <NotificationPermissionPrompt />}
      {!isAdmin && <AnnouncementNotificationPanel />}
      <NotificationCenter />
      <main className={isAdmin ? 'page-content admin-page' : 'page-content'}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ChatWidget />}
    </div>
  )
}

export default Layout

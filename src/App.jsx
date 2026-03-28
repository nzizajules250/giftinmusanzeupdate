import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AmenitiesPage from './pages/AmenitiesPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import HomePage from './pages/HomePage.jsx'
import RoomDetailsPage from './pages/RoomDetailsPage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetailsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/amenities" element={<AmenitiesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

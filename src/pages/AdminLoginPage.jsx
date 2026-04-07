import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminAuthModal from '../components/AdminAuthModal.jsx'

function AdminLoginPage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(true)

  const handleClose = () => {
    setShowModal(false)
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0c08',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <AdminAuthModal open={showModal} onClose={handleClose} />
    </div>
  )
}

export default AdminLoginPage
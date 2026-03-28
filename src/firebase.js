import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBMzm3TnCZXzwC4k3taPlTYXaRgD8rKDEg',
  authDomain: 'giftinnadmin.firebaseapp.com',
  projectId: 'giftinnadmin',
  storageBucket: 'giftinnadmin.firebasestorage.app',
  messagingSenderId: '398384529883',
  appId: '1:398384529883:web:dcc56af5d8a18034e5e7fe',
  measurementId: 'G-ZVFJKWV3EG',
}

const app = initializeApp(firebaseConfig)

if (typeof window !== 'undefined') {
  getAnalytics(app)
}

export const auth = getAuth(app)
export const db = getFirestore(app)

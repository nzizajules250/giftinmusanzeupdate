import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC81v5TSrC0_wE0jsLW_kFLZs7BMdP5ceQ",
  authDomain: "auction-origin.firebaseapp.com",
  databaseURL: "https://auction-origin-default-rtdb.firebaseio.com",
  projectId: "auction-origin",
  storageBucket: "auction-origin.firebasestorage.app",
  messagingSenderId: "881371645224",
  appId: "1:881371645224:web:8391dc9d4e1b431ca8fc1d",
  measurementId: "G-R5GXNHTKFX"
}

const app = initializeApp(firebaseConfig)

if (typeof window !== 'undefined') {
  getAnalytics(app)
}

export const auth = getAuth(app)
export const db = getFirestore(app)

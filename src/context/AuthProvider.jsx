import { useState } from 'react'
import AuthContext from './authContext.js'

function readStoredUser() {
  const storedUser = localStorage.getItem('eventhub_user')

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('eventhub_user')
    localStorage.removeItem('eventhub_token')
    return null
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  function saveSession({ token, user: authenticatedUser }) {
    localStorage.setItem('eventhub_token', token)
    localStorage.setItem('eventhub_user', JSON.stringify(authenticatedUser))
    setUser(authenticatedUser)
  }

  function logout() {
    localStorage.removeItem('eventhub_token')
    localStorage.removeItem('eventhub_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ logout, saveSession, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider


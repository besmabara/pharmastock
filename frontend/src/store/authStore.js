import { atom } from 'jotai'

// Mock users for demo purposes
const mockUsers = [
  {
    id: 1,
    email: 'admin@pharmacie.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@pharmacie.com',
    password: 'user123',
    name: 'User',
    role: 'user'
  }
]

// Initial auth state
const initialAuth = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false
}

// Check if user is already logged in from localStorage
const loadStoredAuth = () => {
  try {
    const storedUser = localStorage.getItem('pharmacy_user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      return {
        isAuthenticated: true,
        user,
        error: null,
        loading: false
      }
    }
  } catch (error) {
    console.error('Failed to load auth from localStorage:', error)
  }
  return initialAuth
}

// Auth atom with persistence
export const authAtom = atom(loadStoredAuth())

// Login action
export const login = (email, password, setAuth) => {
  setAuth(prev => ({ ...prev, loading: true, error: null }))
  
  // Simulate API call delay
  setTimeout(() => {
    const user = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    
    if (user) {
      // Remove password before storing
      const { password, ...secureUser } = user
      
      // Store in localStorage
      localStorage.setItem('pharmacy_user', JSON.stringify(secureUser))
      
      setAuth({
        isAuthenticated: true,
        user: secureUser,
        error: null,
        loading: false
      })
    } else {
      setAuth(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        error: 'Email ou mot de passe incorrect',
        loading: false
      }))
    }
  }, 500)
}

// Logout action
export const logout = (setAuth) => {
  localStorage.removeItem('pharmacy_user')
  setAuth(initialAuth)
}
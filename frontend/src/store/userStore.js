import { atom } from 'jotai'

// Mock data for users
const mockUsers = [
  {
    id: 1,
    email: 'admin@pharmacie.com',
    name: 'Admin',
    role: 'admin',
    createdAt: '2023-01-01T10:00:00Z',
    lastLogin: '2024-03-15T08:30:00Z',
    status: 'active'
  },
  {
    id: 2,
    email: 'user@pharmacie.com',
    name: 'User',
    role: 'user',
    createdAt: '2023-02-15T14:20:00Z',
    lastLogin: '2024-03-14T16:45:00Z',
    status: 'active'
  }
]

// Initial users state with persisted data
const loadStoredUsers = () => {
  try {
    const stored = localStorage.getItem('pharmacy_users')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load users from localStorage:', error)
  }
  // Store mock data if nothing in storage
  localStorage.setItem('pharmacy_users', JSON.stringify(mockUsers))
  return mockUsers
}

// Users atom
export const usersAtom = atom(loadStoredUsers())

// Helper functions for user management
export const saveUsers = (users) => {
  localStorage.setItem('pharmacy_users', JSON.stringify(users))
}

export const addUser = (userData, setUsers) => {
  const newUser = {
    ...userData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    lastLogin: null,
    status: 'active'
  }
  
  setUsers(prev => {
    const updated = [...prev, newUser]
    saveUsers(updated)
    return updated
  })
  
  return newUser
}

export const updateUser = (id, userData, setUsers) => {
  setUsers(prev => {
    const index = prev.findIndex(user => user.id === id)
    if (index === -1) return prev
    
    const updated = [...prev]
    updated[index] = { ...updated[index], ...userData }
    saveUsers(updated)
    return updated
  })
}

export const deleteUser = (id, setUsers) => {
  setUsers(prev => {
    const updated = prev.filter(user => user.id !== id)
    saveUsers(updated)
    return updated
  })
}
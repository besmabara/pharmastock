import { atom } from 'jotai'

// Mock data for history log
const mockHistory = [
  {
    id: 1,
    date: '2023-06-15T09:30:00Z',
    user: 'Admin',
    action: 'Entrée de stock',
    medicationId: 1,
    medicationName: 'Paracétamol 500mg',
    details: 'Entrée de 50 unités - Raison: Réapprovisionnement'
  },
  {
    id: 2,
    date: '2023-06-18T14:15:00Z',
    user: 'User',
    action: 'Sortie de stock',
    medicationId: 1,
    medicationName: 'Paracétamol 500mg',
    details: 'Sortie de 5 unités - Raison: Prescription'
  },
  {
    id: 3,
    date: '2023-06-20T11:00:00Z',
    user: 'Admin',
    action: 'Ajout',
    medicationId: 7,
    medicationName: 'Amlodipine 5mg',
    details: 'Nouveau médicament ajouté'
  },
  {
    id: 4,
    date: '2023-06-22T15:30:00Z',
    user: 'User',
    action: 'Modification',
    medicationId: 2,
    medicationName: 'Ibuprofène 400mg',
    details: 'Quantité mise à jour: 95 -> 85'
  },
  {
    id: 5,
    date: '2023-06-25T10:45:00Z',
    user: 'Admin',
    action: 'Sortie de stock',
    medicationId: 3,
    medicationName: 'Amoxicilline 500mg',
    details: 'Sortie de 8 unités - Raison: Prescription'
  }
]

// Initial history state with persisted data
const loadStoredHistory = () => {
  try {
    const stored = localStorage.getItem('pharmacy_history')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load history from localStorage:', error)
  }
  // Store mock data if nothing in storage
  localStorage.setItem('pharmacy_history', JSON.stringify(mockHistory))
  return mockHistory
}

// History atom
export const historyAtom = atom(loadStoredHistory())

// Recent history entries (last 10)
export const recentHistoryAtom = atom(get => {
  const history = get(historyAtom)
  return [...history]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
})

// Helper functions for history management
export const saveHistory = (history) => {
  localStorage.setItem('pharmacy_history', JSON.stringify(history))
}

export const addHistoryEntry = (entry, setHistory) => {
  const newEntry = {
    ...entry,
    id: Date.now()
  }
  
  // If setHistory is provided, use it (from component)
  if (setHistory) {
    setHistory(prev => {
      const updated = [newEntry, ...prev]
      saveHistory(updated)
      return updated
    })
  } else {
    // Otherwise, update localStorage directly (for use from other stores)
    try {
      const currentHistory = JSON.parse(localStorage.getItem('pharmacy_history') || '[]')
      const updated = [newEntry, ...currentHistory]
      saveHistory(updated)
    } catch (error) {
      console.error('Error updating history:', error)
    }
  }
  
  return newEntry
}
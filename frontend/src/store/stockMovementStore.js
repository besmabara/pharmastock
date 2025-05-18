import { atom } from 'jotai'

// Mock data for stock movements
const mockStockMovements = [
  {
    id: 1,
    date: '2023-06-15T09:30:00Z',
    action: 'Entrée',
    medicationId: 1,
    medicationName: 'Paracétamol 500mg',
    quantity: 50,
    reason: 'Réapprovisionnement'
  },
  {
    id: 2,
    date: '2023-06-18T14:15:00Z',
    action: 'Sortie',
    medicationId: 1,
    medicationName: 'Paracétamol 500mg',
    quantity: 5,
    reason: 'Prescription'
  },
  {
    id: 3,
    date: '2023-06-20T11:00:00Z',
    action: 'Entrée',
    medicationId: 3,
    medicationName: 'Amoxicilline 500mg',
    quantity: 20,
    reason: 'Réapprovisionnement'
  },
  {
    id: 4,
    date: '2023-06-22T15:30:00Z',
    action: 'Sortie',
    medicationId: 2,
    medicationName: 'Ibuprofène 400mg',
    quantity: 10,
    reason: 'Prescription'
  },
  {
    id: 5,
    date: '2023-06-25T10:45:00Z',
    action: 'Sortie',
    medicationId: 3,
    medicationName: 'Amoxicilline 500mg',
    quantity: 8,
    reason: 'Prescription'
  },
  {
    id: 6,
    date: '2023-06-28T09:15:00Z',
    action: 'Entrée',
    medicationId: 4,
    medicationName: 'Oméprazole 20mg',
    quantity: 25,
    reason: 'Réapprovisionnement'
  },
  {
    id: 7,
    date: '2023-06-30T16:20:00Z',
    action: 'Sortie',
    medicationId: 4,
    medicationName: 'Oméprazole 20mg',
    quantity: 5,
    reason: 'Prescription'
  }
]

// Initial stock movements state with persisted data
const loadStoredStockMovements = () => {
  try {
    const stored = localStorage.getItem('pharmacy_stock_movements')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load stock movements from localStorage:', error)
  }
  // Store mock data if nothing in storage
  localStorage.setItem('pharmacy_stock_movements', JSON.stringify(mockStockMovements))
  return mockStockMovements
}

// Stock movements atom
export const stockMovementsAtom = atom(loadStoredStockMovements())

// Recent stock movements (last 10)
export const recentStockMovementsAtom = atom(get => {
  const movements = get(stockMovementsAtom)
  return [...movements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
})

// Helper functions for stock movement management
export const saveStockMovements = (movements) => {
  localStorage.setItem('pharmacy_stock_movements', JSON.stringify(movements))
}

export const addStockMovement = (movement, setStockMovements) => {
  const newMovement = {
    ...movement,
    id: Date.now()
  }
  
  // If setStockMovements is provided, use it (from component)
  if (setStockMovements) {
    setStockMovements(prev => {
      const updated = [newMovement, ...prev]
      saveStockMovements(updated)
      return updated
    })
  } else {
    // Otherwise, update localStorage directly (for use from other stores)
    try {
      const currentMovements = JSON.parse(localStorage.getItem('pharmacy_stock_movements') || '[]')
      const updated = [newMovement, ...currentMovements]
      saveStockMovements(updated)
    } catch (error) {
      console.error('Error updating stock movements:', error)
    }
  }
  
  // Add to history
  addHistoryEntry({
    date: new Date().toISOString(),
    user: 'System',
    action: movement.action === 'Entrée' ? 'Entrée de stock' : 'Sortie de stock',
    medicationId: movement.medicationId,
    medicationName: movement.medicationName,
    details: `${movement.action} de ${movement.quantity} unités - Raison: ${movement.reason}`
  })
  
  return newMovement
}
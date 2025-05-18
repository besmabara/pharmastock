import { atom } from 'jotai'

// Mock data for medications
const mockMedications = [
  {
    id: 1,
    name: 'Paracétamol 500mg',
    quantity: 120,
    expiryDate: '2025-12-31',
    category: 'Analgésique',
    supplier: 'Pharma Plus',
    threshold: 30,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z'
  },
  {
    id: 2,
    name: 'Ibuprofène 400mg',
    quantity: 85,
    expiryDate: '2025-08-15',
    category: 'Anti-inflammatoire',
    supplier: 'MediSource',
    threshold: 25,
    createdAt: '2023-01-20T09:15:00Z',
    updatedAt: '2023-06-10T11:30:00Z'
  },
  {
    id: 3,
    name: 'Amoxicilline 500mg',
    quantity: 42,
    expiryDate: '2024-06-30',
    category: 'Antibiotique',
    supplier: 'BioPharm',
    threshold: 20,
    createdAt: '2023-02-05T13:45:00Z',
    updatedAt: '2023-04-18T16:20:00Z'
  },
  {
    id: 4,
    name: 'Oméprazole 20mg',
    quantity: 95,
    expiryDate: '2026-03-15',
    category: 'Anti-acide',
    supplier: 'Pharma Plus',
    threshold: 30,
    createdAt: '2023-02-12T10:00:00Z',
    updatedAt: '2023-05-05T09:30:00Z'
  },
  {
    id: 5,
    name: 'Loratadine 10mg',
    quantity: 15,
    expiryDate: '2024-10-20',
    category: 'Antihistaminique',
    supplier: 'MediSource',
    threshold: 20,
    createdAt: '2023-03-01T15:15:00Z',
    updatedAt: '2023-06-30T14:00:00Z'
  },
  {
    id: 6,
    name: 'Metformine 850mg',
    quantity: 150,
    expiryDate: '2025-11-30',
    category: 'Antidiabétique',
    supplier: 'BioPharm',
    threshold: 40,
    createdAt: '2023-03-10T11:20:00Z',
    updatedAt: '2023-05-12T13:10:00Z'
  },
  {
    id: 7,
    name: 'Amlodipine 5mg',
    quantity: 8,
    expiryDate: '2024-09-10',
    category: 'Antihypertenseur',
    supplier: 'Pharma Plus',
    threshold: 25,
    createdAt: '2023-03-22T16:30:00Z',
    updatedAt: '2023-06-15T10:45:00Z'
  }
]

// Initial medications state with persisted data
const loadStoredMedications = () => {
  try {
    const storedMedications = localStorage.getItem('pharmacy_medications')
    if (storedMedications) {
      return JSON.parse(storedMedications)
    }
  } catch (error) {
    console.error('Failed to load medications from localStorage:', error)
  }
  // Store mock data if nothing in storage
  localStorage.setItem('pharmacy_medications', JSON.stringify(mockMedications))
  return mockMedications
}

// Medications atom
export const medicationsAtom = atom(loadStoredMedications())

// Categories for filtering and selection
export const categoriesAtom = atom(get => {
  const medications = get(medicationsAtom)
  return [...new Set(medications.map(med => med.category))].sort()
})

// Suppliers for filtering and selection
export const suppliersAtom = atom(get => {
  const medications = get(medicationsAtom)
  return [...new Set(medications.map(med => med.supplier))].sort()
})

// Low stock medications
export const lowStockMedicationsAtom = atom(get => {
  const medications = get(medicationsAtom)
  return medications.filter(med => med.quantity <= med.threshold)
})

// Soon to expire medications (within 90 days)
export const soonToExpireMedicationsAtom = atom(get => {
  const medications = get(medicationsAtom)
  const today = new Date()
  const ninetyDaysLater = new Date(today)
  ninetyDaysLater.setDate(today.getDate() + 90)
  
  return medications.filter(med => {
    const expiryDate = new Date(med.expiryDate)
    return expiryDate <= ninetyDaysLater && expiryDate >= today
  })
})

// Helper functions for medication management
export const saveMedications = (medications) => {
  localStorage.setItem('pharmacy_medications', JSON.stringify(medications))
}

export const addMedication = (medication, setMedications) => {
  const newMedication = {
    ...medication,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  setMedications(prev => {
    const updated = [...prev, newMedication]
    saveMedications(updated)
    return updated
  })
  
  // Add to stock movement history
  addStockMovement({
    date: new Date().toISOString(),
    action: 'Entrée',
    medicationId: newMedication.id,
    medicationName: newMedication.name,
    quantity: newMedication.quantity,
    reason: 'Stock initial'
  })
}

export const updateMedication = (id, updatedData, setMedications) => {
  setMedications(prev => {
    const index = prev.findIndex(med => med.id === id)
    if (index === -1) return prev
    
    const oldQuantity = prev[index].quantity
    const newQuantity = updatedData.quantity
    
    const medication = {
      ...prev[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    }
    
    const updated = [...prev]
    updated[index] = medication
    saveMedications(updated)
    
    // Add to stock movement history if quantity changed
    if (oldQuantity !== newQuantity) {
      const change = newQuantity - oldQuantity
      addStockMovement({
        date: new Date().toISOString(),
        action: change > 0 ? 'Entrée' : 'Sortie',
        medicationId: id,
        medicationName: medication.name,
        quantity: Math.abs(change),
        reason: 'Mise à jour de stock'
      })
    }
    
    return updated
  })
}

export const deleteMedication = (id, setMedications) => {
  setMedications(prev => {
    const medication = prev.find(med => med.id === id)
    const updated = prev.filter(med => med.id !== id)
    saveMedications(updated)
    
    // Add to history
    addHistoryEntry({
      date: new Date().toISOString(),
      user: 'System',
      action: 'Suppression',
      medicationId: id,
      medicationName: medication?.name || 'Unknown',
      details: 'Médicament supprimé'
    })
    
    return updated
  })
}
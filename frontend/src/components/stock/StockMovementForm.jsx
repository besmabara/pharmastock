import { useState } from 'react'
import { useAtom } from 'jotai'
import { medicationsAtom, updateMedication } from '../../store/medicationsStore'
import { stockMovementsAtom, addStockMovement } from '../../store/stockMovementStore'

function StockMovementForm() {
  const [medications, setMedications] = useAtom(medicationsAtom)
  const [stockMovements, setStockMovements] = useAtom(stockMovementsAtom)
  
  const [formData, setFormData] = useState({
    medicationId: '',
    action: 'Entrée',
    quantity: 1,
    reason: ''
  })
  
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  
  const commonReasons = {
    Entrée: ['Réapprovisionnement', 'Retour', 'Correction d\'inventaire', 'Don'],
    Sortie: ['Prescription', 'Périmé', 'Perte/Dommage', 'Correction d\'inventaire']
  }
  
  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }))
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
    
    // Reset success message
    if (success) {
      setSuccess(false)
    }
  }
  
  const selectMedication = (e) => {
    const selectedId = parseInt(e.target.value, 10)
    setFormData(prev => ({ ...prev, medicationId: selectedId }))
    
    if (errors.medicationId) {
      setErrors(prev => ({ ...prev, medicationId: null }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.medicationId) {
      newErrors.medicationId = 'Veuillez sélectionner un médicament'
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'La quantité doit être positive'
    }
    
    const medication = medications.find(m => m.id === formData.medicationId)
    
    if (formData.action === 'Sortie' && medication && formData.quantity > medication.quantity) {
      newErrors.quantity = 'Quantité insuffisante en stock'
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Le motif est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    const medication = medications.find(m => m.id === formData.medicationId)
    
    // Calculate new quantity
    const quantityChange = formData.action === 'Entrée' 
      ? formData.quantity 
      : -formData.quantity
    
    const newQuantity = medication.quantity + quantityChange
    
    // Update medication quantity
    updateMedication(
      formData.medicationId, 
      { ...medication, quantity: newQuantity },
      setMedications
    )
    
    // Add stock movement record
    addStockMovement({
      date: new Date().toISOString(),
      action: formData.action,
      medicationId: formData.medicationId,
      medicationName: medication.name,
      quantity: formData.quantity,
      reason: formData.reason
    }, setStockMovements)
    
    // Reset form
    setFormData({
      medicationId: '',
      action: 'Entrée',
      quantity: 1,
      reason: ''
    })
    
    // Show success message
    setSuccess(true)
  }
  
  return (
    <div className="card">
      <h2 className="text-xl font-medium mb-6">Enregistrer un mouvement de stock</h2>
      
      {success && (
        <div className="bg-success-50 border border-success-200 text-success-800 p-4 rounded-lg mb-4">
          Mouvement de stock enregistré avec succès
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="medicationId" className="form-label">Médicament</label>
          <select
            id="medicationId"
            name="medicationId"
            value={formData.medicationId}
            onChange={selectMedication}
            className={`form-input ${errors.medicationId ? 'border-error-500' : ''}`}
          >
            <option value="">Sélectionner un médicament</option>
            {medications.map(med => (
              <option key={med.id} value={med.id}>
                {med.name} - Stock: {med.quantity}
              </option>
            ))}
          </select>
          {errors.medicationId && <p className="form-error">{errors.medicationId}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="action" className="form-label">Type de mouvement</label>
            <select
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Entrée">Entrée</option>
              <option value="Sortie">Sortie</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity" className="form-label">Quantité</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className={`form-input ${errors.quantity ? 'border-error-500' : ''}`}
            />
            {errors.quantity && <p className="form-error">{errors.quantity}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="reason" className="form-label">Motif</label>
          <div className="flex items-center space-x-2 mb-2">
            {commonReasons[formData.action].map(reason => (
              <button
                key={reason}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, reason }))}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {reason}
              </button>
            ))}
          </div>
          <input
            type="text"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className={`form-input ${errors.reason ? 'border-error-500' : ''}`}
          />
          {errors.reason && <p className="form-error">{errors.reason}</p>}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="btn-primary"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}

export default StockMovementForm
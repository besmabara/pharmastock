import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { 
  medicationsAtom, 
  categoriesAtom, 
  addMedication, 
  updateMedication 
} from '../../store/medicationsStore'

function MedicationForm({ medicationId = null }) {
  const navigate = useNavigate()
  const [medications, setMedications] = useAtom(medicationsAtom)
  const [categories] = useAtom(categoriesAtom)
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    expiryDate: '',
    category: '',
    supplier: '',
    threshold: 10
  })
  
  const [errors, setErrors] = useState({})
  const [isNewCategory, setIsNewCategory] = useState(false)
  
  // If editing, load medication data
  useEffect(() => {
    if (medicationId) {
      const medication = medications.find(med => med.id === medicationId)
      if (medication) {
        // Format the date for the date input (YYYY-MM-DD)
        const formattedDate = medication.expiryDate.split('T')[0]
        
        setFormData({
          name: medication.name,
          quantity: medication.quantity,
          expiryDate: formattedDate,
          category: medication.category,
          supplier: medication.supplier,
          threshold: medication.threshold || 10
        })
      } else {
        navigate('/medications')
      }
    }
  }, [medicationId, medications, navigate])
  
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
  }
  
  const toggleCategoryInput = () => {
    setIsNewCategory(!isNewCategory)
    if (!isNewCategory) {
      setFormData(prev => ({ ...prev, category: '' }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'La quantité doit être positive'
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'La date d\'expiration est requise'
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (new Date(formData.expiryDate) < today) {
        newErrors.expiryDate = 'La date d\'expiration doit être future'
      }
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'La catégorie est requise'
    }
    
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Le fournisseur est requis'
    }
    
    if (formData.threshold < 1) {
      newErrors.threshold = 'Le seuil minimum doit être au moins 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    if (medicationId) {
      updateMedication(medicationId, formData, setMedications)
    } else {
      addMedication(formData, setMedications)
    }
    
    navigate('/medications')
  }
  
  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-medium mb-6">
        {medicationId ? 'Modifier le médicament' : 'Ajouter un médicament'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nom du médicament</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'border-error-500' : ''}`}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="quantity" className="form-label">Quantité</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className={`form-input ${errors.quantity ? 'border-error-500' : ''}`}
            />
            {errors.quantity && <p className="form-error">{errors.quantity}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="expiryDate" className="form-label">Date d'expiration</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`form-input ${errors.expiryDate ? 'border-error-500' : ''}`}
            />
            {errors.expiryDate && <p className="form-error">{errors.expiryDate}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="category" className="form-label mb-0">Catégorie</label>
            <button
              type="button"
              onClick={toggleCategoryInput}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {isNewCategory ? 'Choisir une existante' : 'Nouvelle catégorie'}
            </button>
          </div>
          
          {isNewCategory ? (
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Nouvelle catégorie"
              className={`form-input ${errors.category ? 'border-error-500' : ''}`}
            />
          ) : (
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-input ${errors.category ? 'border-error-500' : ''}`}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          )}
          
          {errors.category && <p className="form-error">{errors.category}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="supplier" className="form-label">Fournisseur</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className={`form-input ${errors.supplier ? 'border-error-500' : ''}`}
            />
            {errors.supplier && <p className="form-error">{errors.supplier}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="threshold" className="form-label">
              Seuil d'alerte stock bas
              <span className="text-xs text-gray-500 ml-1">(qté minimum)</span>
            </label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              min="1"
              className={`form-input ${errors.threshold ? 'border-error-500' : ''}`}
            />
            {errors.threshold && <p className="form-error">{errors.threshold}</p>}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/medications')}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {medicationId ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MedicationForm
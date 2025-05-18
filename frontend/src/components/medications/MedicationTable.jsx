import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  medicationsAtom, 
  categoriesAtom, 
  suppliersAtom, 
  deleteMedication
} from '../../store/medicationsStore'

function MedicationTable() {
  const navigate = useNavigate()
  const [medications, setMedications] = useAtom(medicationsAtom)
  const [categories] = useAtom(categoriesAtom)
  const [suppliers] = useAtom(suppliersAtom)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)
  
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }
  
  const getSortIcon = (column) => {
    if (sortColumn !== column) return null
    
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 inline-block ml-1" />
      : <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />
  }
  
  const handleEdit = (id) => {
    navigate(`/medications/${id}/edit`)
  }
  
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament?')) {
      deleteMedication(id, setMedications)
    }
  }
  
  // Filter and sort medications
  const filteredMedications = medications
    .filter(med => {
      return (
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === '' || med.category === categoryFilter) &&
        (supplierFilter === '' || med.supplier === supplierFilter)
      )
    })
    .sort((a, b) => {
      let valueA = a[sortColumn]
      let valueB = b[sortColumn]
      
      // Handle dates
      if (sortColumn === 'expiryDate') {
        valueA = new Date(valueA)
        valueB = new Date(valueB)
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  
  return (
    <div className="card space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Search bar */}
        <div className="relative w-full md:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <FunnelIcon className="w-4 h-4 mr-1" />
            Filtres
          </button>
          
          <button
            onClick={() => navigate('/medications/new')}
            className="btn-primary"
          >
            Ajouter un médicament
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-full md:w-1/2">
            <label htmlFor="category-filter" className="form-label">Catégorie</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/2">
            <label htmlFor="supplier-filter" className="form-label">Fournisseur</label>
            <select
              id="supplier-filter"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Tous les fournisseurs</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <span className="flex items-center">
                  Nom {getSortIcon('name')}
                </span>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('quantity')}
              >
                <span className="flex items-center">
                  Quantité {getSortIcon('quantity')}
                </span>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('expiryDate')}
              >
                <span className="flex items-center">
                  Date d'expiration {getSortIcon('expiryDate')}
                </span>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <span className="flex items-center">
                  Catégorie {getSortIcon('category')}
                </span>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('supplier')}
              >
                <span className="flex items-center">
                  Fournisseur {getSortIcon('supplier')}
                </span>
              </th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredMedications.length > 0 ? (
              filteredMedications.map(medication => {
                const today = new Date()
                const expiryDate = new Date(medication.expiryDate)
                const isLowStock = medication.quantity <= medication.threshold
                const isExpiringSoon = expiryDate <= new Date(today.setDate(today.getDate() + 30))
                
                return (
                  <tr key={medication.id} className="table-row">
                    <td className="table-cell font-medium">{medication.name}</td>
                    <td className="table-cell">
                      <span className={isLowStock ? 'text-error-600 font-medium' : ''}>
                        {medication.quantity}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={isExpiringSoon ? 'text-warning-600 font-medium' : ''}>
                        {format(new Date(medication.expiryDate), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    </td>
                    <td className="table-cell">{medication.category}</td>
                    <td className="table-cell">{medication.supplier}</td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(medication.id)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                          aria-label="Modifier"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(medication.id)}
                          className="p-1 text-error-600 hover:bg-error-50 rounded"
                          aria-label="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="6" className="table-cell text-center py-4">
                  Aucun médicament trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MedicationTable
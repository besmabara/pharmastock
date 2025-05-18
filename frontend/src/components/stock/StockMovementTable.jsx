import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { stockMovementsAtom } from '../../store/stockMovementStore'
import { medicationsAtom } from '../../store/medicationsStore'

function StockMovementTable() {
  const [stockMovements] = useAtom(stockMovementsAtom)
  const [medications] = useAtom(medicationsAtom)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [dateRangeStart, setDateRangeStart] = useState('')
  const [dateRangeEnd, setDateRangeEnd] = useState('')
  const [sortColumn, setSortColumn] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
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
  
  // Apply filters and sort
  const filteredMovements = stockMovements
    .filter(movement => {
      const matchesSearch = movement.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reason.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAction = actionFilter === '' || movement.action === actionFilter
      
      let matchesDateRange = true
      if (dateRangeStart) {
        const movementDate = new Date(movement.date)
        const startDate = new Date(dateRangeStart)
        startDate.setHours(0, 0, 0, 0)
        
        matchesDateRange = movementDate >= startDate
      }
      
      if (dateRangeEnd && matchesDateRange) {
        const movementDate = new Date(movement.date)
        const endDate = new Date(dateRangeEnd)
        endDate.setHours(23, 59, 59, 999)
        
        matchesDateRange = movementDate <= endDate
      }
      
      return matchesSearch && matchesAction && matchesDateRange
    })
    .sort((a, b) => {
      if (sortColumn === 'date') {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
      }
      
      if (sortColumn === 'quantity') {
        return sortDirection === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity
      }
      
      // Default string comparison
      const valueA = a[sortColumn]?.toLowerCase() || ''
      const valueB = b[sortColumn]?.toLowerCase() || ''
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  
  return (
    <div className="card space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Search */}
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
        
        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center"
        >
          <FunnelIcon className="w-4 h-4 mr-1" />
          Filtres
        </button>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-full md:w-1/3">
            <label htmlFor="action-filter" className="form-label">Type</label>
            <select
              id="action-filter"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Tous</option>
              <option value="Entrée">Entrées</option>
              <option value="Sortie">Sorties</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="date-start" className="form-label">Date début</label>
            <input
              type="date"
              id="date-start"
              value={dateRangeStart}
              onChange={(e) => setDateRangeStart(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="date-end" className="form-label">Date fin</label>
            <input
              type="date"
              id="date-end"
              value={dateRangeEnd}
              onChange={(e) => setDateRangeEnd(e.target.value)}
              className="form-input"
            />
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
                onClick={() => handleSort('date')}
              >
                <span className="flex items-center">
                  Date {getSortIcon('date')}
                </span>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('action')}
              >
                <span className="flex items-center">
                  Action {getSortIcon('action')}
                </span>
              </th>
              <th 
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('medicationName')}
              >
                <span className="flex items-center">
                  Médicament {getSortIcon('medicationName')}
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
                onClick={() => handleSort('reason')}
              >
                <span className="flex items-center">
                  Motif {getSortIcon('reason')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredMovements.length > 0 ? (
              filteredMovements.map(movement => (
                <tr key={movement.id} className="table-row">
                  <td className="table-cell">
                    {format(new Date(movement.date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="table-cell">
                    <span className={
                      movement.action === 'Entrée' 
                        ? 'badge-success' 
                        : 'badge-warning'
                    }>
                      {movement.action}
                    </span>
                  </td>
                  <td className="table-cell font-medium">{movement.medicationName}</td>
                  <td className="table-cell">{movement.quantity}</td>
                  <td className="table-cell">{movement.reason}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="table-cell text-center py-4">
                  Aucun mouvement de stock trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StockMovementTable
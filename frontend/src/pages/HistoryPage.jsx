import { useState } from 'react'
import { useAtom } from 'jotai'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { historyAtom } from '../store/historyStore'

function HistoryPage() {
  const [history] = useAtom(historyAtom)
  
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
  
  // Filter and sort history entries
  const filteredHistory = history
    .filter(entry => {
      const matchesSearch = 
        entry.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.user.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAction = actionFilter === '' || entry.action.includes(actionFilter)
      
      let matchesDateRange = true
      if (dateRangeStart) {
        const entryDate = new Date(entry.date)
        const startDate = new Date(dateRangeStart)
        startDate.setHours(0, 0, 0, 0)
        
        matchesDateRange = entryDate >= startDate
      }
      
      if (dateRangeEnd && matchesDateRange) {
        const entryDate = new Date(entry.date)
        const endDate = new Date(dateRangeEnd)
        endDate.setHours(23, 59, 59, 999)
        
        matchesDateRange = entryDate <= endDate
      }
      
      return matchesSearch && matchesAction && matchesDateRange
    })
    .sort((a, b) => {
      if (sortColumn === 'date') {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
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
            <label htmlFor="action-filter" className="form-label">Type d'action</label>
            <select
              id="action-filter"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Toutes</option>
              <option value="Entrée">Entrées</option>
              <option value="Sortie">Sorties</option>
              <option value="Ajout">Ajouts</option>
              <option value="Modification">Modifications</option>
              <option value="Suppression">Suppressions</option>
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
                onClick={() => handleSort('user')}
              >
                <span className="flex items-center">
                  Utilisateur {getSortIcon('user')}
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
              <th className="table-header-cell">Détails</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredHistory.length > 0 ? (
              filteredHistory.map(entry => (
                <tr key={entry.id} className="table-row">
                  <td className="table-cell">
                    {format(new Date(entry.date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="table-cell font-medium">{entry.user}</td>
                  <td className="table-cell">
                    <span className={
                      entry.action.includes('Entrée') ? 'badge-success' :
                      entry.action.includes('Sortie') ? 'badge-warning' :
                      entry.action.includes('Ajout') ? 'badge-info' :
                      entry.action.includes('Suppression') ? 'badge-error' :
                      'badge'
                    }>
                      {entry.action}
                    </span>
                  </td>
                  <td className="table-cell">{entry.medicationName}</td>
                  <td className="table-cell">{entry.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="table-cell text-center py-4">
                  Aucune entrée d'historique trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HistoryPage
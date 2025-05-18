import { useAtom } from 'jotai'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { 
  lowStockMedicationsAtom, 
  soonToExpireMedicationsAtom 
} from '../store/medicationsStore'

function AlertsPage() {
  const navigate = useNavigate()
  const [lowStockMeds] = useAtom(lowStockMedicationsAtom)
  const [soonToExpireMeds] = useAtom(soonToExpireMedicationsAtom)
  
  const handleViewMedication = (id) => {
    navigate(`/medications/${id}/edit`)
  }
  
  return (
    <div className="space-y-6">
      {/* Low Stock Medications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-700">Médicaments en stock bas</h2>
          <span className="badge-error">{lowStockMeds.length} alerte(s)</span>
        </div>
        
        {lowStockMeds.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Nom</th>
                  <th className="table-header-cell">Quantité actuelle</th>
                  <th className="table-header-cell">Seuil minimum</th>
                  <th className="table-header-cell">Fournisseur</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {lowStockMeds.map(med => (
                  <tr key={med.id} className="table-row">
                    <td className="table-cell font-medium">{med.name}</td>
                    <td className="table-cell text-error-600 font-medium">{med.quantity}</td>
                    <td className="table-cell">{med.threshold}</td>
                    <td className="table-cell">{med.supplier}</td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleViewMedication(med.id)}
                        className="p-1 text-primary-600 hover:bg-primary-50 rounded inline-flex items-center"
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-1" />
                        <span>Voir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">
            Aucun médicament en stock bas
          </p>
        )}
      </div>
      
      {/* Expiring Soon Medications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-700">Médicaments expirant bientôt</h2>
          <span className="badge-warning">{soonToExpireMeds.length} alerte(s)</span>
        </div>
        
        {soonToExpireMeds.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Nom</th>
                  <th className="table-header-cell">Date d'expiration</th>
                  <th className="table-header-cell">Jours restants</th>
                  <th className="table-header-cell">Quantité</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {soonToExpireMeds.map(med => {
                  const today = new Date()
                  const expiryDate = new Date(med.expiryDate)
                  const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <tr key={med.id} className="table-row">
                      <td className="table-cell font-medium">{med.name}</td>
                      <td className="table-cell">
                        {format(expiryDate, 'dd/MM/yyyy', { locale: fr })}
                      </td>
                      <td className="table-cell">
                        <span className={
                          daysLeft <= 30 ? 'text-error-600 font-medium' :
                          daysLeft <= 60 ? 'text-warning-600 font-medium' :
                          'text-gray-700'
                        }>
                          {daysLeft} jours
                        </span>
                      </td>
                      <td className="table-cell">{med.quantity}</td>
                      <td className="table-cell">
                        <button
                          onClick={() => handleViewMedication(med.id)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded inline-flex items-center"
                        >
                          <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-1" />
                          <span>Voir</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">
            Aucun médicament n'expire bientôt
          </p>
        )}
      </div>
    </div>
  )
}

export default AlertsPage
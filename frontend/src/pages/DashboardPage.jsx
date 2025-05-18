import { useAtom } from 'jotai'
import { 
  ShoppingBagIcon, 
  ExclamationTriangleIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline'
import { 
  medicationsAtom, 
  lowStockMedicationsAtom, 
  soonToExpireMedicationsAtom 
} from '../store/medicationsStore'
import { recentHistoryAtom } from '../store/historyStore'
import KpiCard from '../components/dashboard/KpiCard'
import ActivityLog from '../components/dashboard/ActivityLog'
import StockChart from '../components/dashboard/StockChart'

function DashboardPage() {
  const [medications] = useAtom(medicationsAtom)
  const [lowStockMeds] = useAtom(lowStockMedicationsAtom)
  const [soonToExpireMeds] = useAtom(soonToExpireMedicationsAtom)
  const [recentHistory] = useAtom(recentHistoryAtom)
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard 
          title="Total Médicaments" 
          value={medications.length}
          icon={<ShoppingBagIcon className="h-6 w-6 text-white" />}
          color="bg-primary-600"
        />
        
        <KpiCard 
          title="Stock bas" 
          value={lowStockMeds.length}
          icon={<ExclamationTriangleIcon className="h-6 w-6 text-white" />}
          color="bg-warning-500"
        />
        
        {/* <KpiCard 
          title="Expiration proche" 
          value={soonToExpireMeds.length}
          icon={<CalendarIcon className="h-6 w-6 text-white" />}
          color="bg-error-500"
        /> */}
      </div>
      
      {/* Stock Chart and Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockChart />
        <ActivityLog activities={recentHistory} />
      </div>
      
      {/* Low Stock Alert */}
      {lowStockMeds.length > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-warning-800">
                Alerte de stock bas pour {lowStockMeds.length} médicament(s)
              </h3>
              <div className="mt-2 text-sm text-warning-700">
                <ul className="list-disc pl-5 space-y-1">
                  {lowStockMeds.slice(0, 3).map(med => (
                    <li key={med.id}>
                      <span className="font-medium">{med.name}</span>: {med.quantity} unités restantes
                    </li>
                  ))}
                  {lowStockMeds.length > 3 && (
                    <li>
                      <a href="/alerts" className="font-medium underline">
                        Voir tous les médicaments en alerte...
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
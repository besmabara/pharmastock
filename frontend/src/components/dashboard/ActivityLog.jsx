import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

function ActivityLog({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Activités récentes</h2>
        <p className="text-gray-500 text-center py-4">Chargement en cours</p>
      </div>
    )
  }
  
  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Activités récentes</h2>
      <div className="space-y-4">
        {activities.map(activity => (
          <div 
            key={activity.id} 
            className="flex items-start border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.medicationName}
              </p>
              <p className="text-sm text-gray-500">
                {activity.action === 'Entrée de stock' 
                  ? `Entrée de ${activity.details.split(' ')[2]} unités` 
                  : activity.action === 'Sortie de stock'
                    ? `Sortie de ${activity.details.split(' ')[2]} unités`
                    : activity.details}
              </p>
            </div>
            <div className="text-right text-xs text-gray-500 whitespace-nowrap">
              {format(new Date(activity.date), 'dd/MM/yyyy HH:mm', { locale: fr })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityLog
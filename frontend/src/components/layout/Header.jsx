import { useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { authAtom } from '../../store/authStore'

function Header() {
  const location = useLocation()
  const [auth] = useAtom(authAtom)
  
  // Map paths to page titles
  const getTitleFromPath = (path) => {
    const routes = {
      '/dashboard': 'Tableau de bord',
      '/medications': 'Médicaments',
      '/medications/new': 'Ajouter un médicament',
      '/stock': 'Mouvements de stock',
      '/history': 'Historique',
      '/alerts': 'Alertes',
      '/settings': 'Paramètres'
    }
    
    if (path.match(/\/medications\/\d+\/edit/)) {
      return 'Modifier le médicament'
    }
    
    return routes[path] || 'Page non trouvée'
  }
  
  const pageTitle = getTitleFromPath(location.pathname)

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
      
      <div className="flex items-center">
        <span className="hidden md:block text-sm font-medium text-gray-700 mr-2">
          {auth.user?.name}
        </span>
        <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
          {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}

export default Header
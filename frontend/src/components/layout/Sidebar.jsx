import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ArrowsRightLeftIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { authAtom, logout } from '../../store/authStore'

function Sidebar() {
  const [auth, setAuth] = useAtom(authAtom)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  const handleLogout = () => {
    logout(setAuth)
  }
  
  const navItems = [
    { path: '/dashboard', name: 'Tableau de bord', icon: <HomeIcon className="w-5 h-5" /> },
    { path: '/medications', name: 'Médicaments', icon: <ShoppingBagIcon className="w-5 h-5" /> },
    { path: '/stock', name: 'Mouvements de stock', icon: <ArrowsRightLeftIcon className="w-5 h-5" /> },
    { path: '/history', name: 'Historique', icon: <ClockIcon className="w-5 h-5" /> },
    { path: '/alerts', name: 'Alertes', icon: <ExclamationTriangleIcon className="w-5 h-5" /> },
    ...(auth.user?.role === 'admin' ? [
      { path: '/users', name: 'Gestion des utilisateurs', icon: <UsersIcon className="w-5 h-5" /> }
    ] : []),
    { path: '/settings', name: 'Paramètres', icon: <Cog6ToothIcon className="w-5 h-5" /> }
  ]
  
  const NavItem = ({ item, onClick }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 transition-colors rounded-lg ${
          isActive 
            ? 'bg-primary-100 text-primary-700' 
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      <span className="mr-3">{item.icon}</span>
      <span>{item.name}</span>
    </NavLink>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-100"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform transform z-50 w-64
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Close button (mobile only) */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Logo and title */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-primary-700">PharmStock</h1>
          <p className="text-sm text-gray-500">Gestion d'inventaire</p>
        </div>
        
        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="font-medium">{auth.user?.name || 'Utilisateur'}</p>
          <p className="text-sm text-gray-500">{auth.user?.email}</p>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <NavItem 
              key={item.path} 
              item={item}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </nav>
        
        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-red-600 transition-colors rounded-lg hover:bg-red-50 flex items-center justify-center"
          >
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
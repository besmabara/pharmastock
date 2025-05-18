import { useAtom } from 'jotai'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authAtom } from './store/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MedicationsPage from './pages/MedicationsPage'
import MedicationFormPage from './pages/MedicationFormPage'
import StockMovementPage from './pages/StockMovementPage'
import HistoryPage from './pages/HistoryPage'
import AlertsPage from './pages/AlertsPage'
import SettingsPage from './pages/SettingsPage'
import UsersPage from './pages/UsersPage'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const [auth] = useAtom(authAtom)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/medications/new" element={<MedicationFormPage />} />
          <Route path="/medications/:id/edit" element={<MedicationFormPage />} />
          <Route path="/stock" element={<StockMovementPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route 
            path="/users" 
            element={
              auth.user?.role === 'admin' 
                ? <UsersPage /> 
                : <Navigate to="/dashboard" replace />
            } 
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to={auth.isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default App
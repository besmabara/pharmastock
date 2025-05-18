import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { authAtom, login } from '../store/authStore'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [auth, setAuth] = useAtom(authAtom)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  
  // Redirect if already logged in
  if (auth.isAuthenticated) {
    const from = location.state?.from || '/dashboard'
    navigate(from, { replace: true })
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis'
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    login(email, password, setAuth)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">PharmStock</h1>
          <h2 className="mt-6 text-2xl font-medium text-gray-900">
            Connectez-vous à votre compte
          </h2>
        </div>
        
        <div className="mt-8 card">
          {auth.error && (
            <div className="bg-error-50 border border-error-200 text-error-800 p-4 rounded-lg mb-4">
              {auth.error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input ${errors.email ? 'border-error-500' : ''}`}
                placeholder="nom@example.com"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span>Mot de passe</span>
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 text-sm float-right">
                  Mot de passe oublié ?
                </a>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input ${errors.password ? 'border-error-500' : ''}`}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={auth.loading}
              >
                {auth.loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>
          
          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Accès de test: 
              <span className="font-semibold ml-1">admin@pharmacie.com / admin123</span>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
import { useState } from 'react'
import { useAtom } from 'jotai'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'
import { usersAtom, addUser, updateUser, deleteUser } from '../store/userStore'

function UsersPage() {
  const [users, setUsers] = useAtom(usersAtom)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })
  const [errors, setErrors] = useState({})
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!selectedUser && !formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    if (selectedUser) {
      updateUser(selectedUser.id, formData, setUsers)
    } else {
      addUser(formData, setUsers)
    }
    
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    })
    setSelectedUser(null)
    setShowForm(false)
  }
  
  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setShowForm(true)
  }
  
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser(id, setUsers)
    }
  }
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full"
          />
        </div>
        
        <button
          onClick={() => {
            setSelectedUser(null)
            setFormData({
              name: '',
              email: '',
              password: '',
              role: 'user'
            })
            setShowForm(true)
          }}
          className="btn-primary flex items-center"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Ajouter un utilisateur
        </button>
      </div>
      
      {/* User Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-medium mb-6">
            {selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'border-error-500' : ''}`}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'border-error-500' : ''}`}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  {selectedUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'border-error-500' : ''}`}
                />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>
              
              <div className="form-group">
                <label htmlFor="role" className="form-label">Rôle</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {selectedUser ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Users Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Nom</th>
                <th className="table-header-cell">Email</th>
                <th className="table-header-cell">Rôle</th>
                <th className="table-header-cell">Dernière connexion</th>
                <th className="table-header-cell">Statut</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredUsers.map(user => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell font-medium">{user.name}</td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge-error' : 'badge-info'
                    }`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="table-cell">
                    {user.lastLogin 
                      ? format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm', { locale: fr })
                      : 'Jamais connecté'}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${
                      user.status === 'active' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                        aria-label="Modifier"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-error-600 hover:bg-error-50 rounded"
                        aria-label="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UsersPage
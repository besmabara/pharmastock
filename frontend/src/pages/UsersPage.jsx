import { useEffect, useState } from 'react';
import {
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';
import instance from '../components/auth/instance';


function UsersPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await instance.get("/api/utilisateurs");
                setUsers(response.data.data);
                console.log(response.data.data);
                
            } catch (err) {
                console.error("Error fetching users:", err);
                setApiError('Erreur lors du chargement des utilisateurs.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        if (apiError) setApiError(null);
    };

    const handleUsernameChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, username: value }));
        if (errors.username) {
            setErrors(prev => ({ ...prev, username: null }));
        }
        if (apiError) setApiError(null);
    };


    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Le nom d\'utilisateur est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (!selectedUser && !formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (!formData.role) {
            newErrors.role = 'Le rôle est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }


        setActionLoading(true);
        setApiError(null);

        try {
            let response;
            if (selectedUser) {
                const updateData = {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                response = await instance.patch(`/api/utilisateurs/${selectedUser.id}`, updateData);
                console.log("User Update Response:", response.data);

            } else {
                const addData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                };
                response = await instance.post("/api/utilisateurs", addData);
                console.log("User Add Response:", response.data);
            }

            const updatedUsersResponse = await instance.get("/api/utilisateurs");
            setUsers(updatedUsersResponse.data.data);

            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
            setSelectedUser(null);
            setShowForm(false);
            setSuccess(true);

        } catch (err) {
            console.error("Error saving user:", err);
            const errorMessage = err.response?.data?.message || 'Erreur lors de l\'enregistrement de l\'utilisateur.';
            setApiError(errorMessage);
            if (err.response?.data?.errors) {
                console.error("Backend Validation Errors:", err.response.data.errors);
            }

        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role || 'USER'
        });
        setErrors({});
        setApiError(null);
        setSuccess(false);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            setActionLoading(true);
            setApiError(null);
            setSuccess(false);

            try {
                await instance.delete(`/api/utilisateurs/${id}`);

                console.log(`User ${id} deleted.`);

                const updatedUsersResponse = await instance.get("/api/utilisateurs");
                setUsers(updatedUsersResponse.data.data);

            } catch (err) {
                console.error("Error deleting user:", err);
                const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur.';
                setApiError(errorMessage);
            } finally {
                setActionLoading(false);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="space-y-6">
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
                        setSelectedUser(null);
                        setFormData({
                            username: '',
                            email: '',
                            password: '',
                            role: 'user'
                        });
                        setErrors({});
                        setApiError(null);
                        setSuccess(false);
                        setShowForm(true);
                    }}
                    className="btn-primary flex items-center"
                >
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                    Ajouter un utilisateur
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <h2 className="text-xl font-medium mb-6">
                        {selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                    </h2>
                    {apiError && (
                        <div className="bg-error-50 border border-error-200 text-error-800 p-4 rounded-lg mb-4">
                            {apiError}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleUsernameChange}
                                    className={`form-input ${errors.username ? 'border-error-500' : ''}`}
                                />
                                {errors.username && <p className="form-error">{errors.username}</p>}
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
                                <label htmlFor="password" className="form-label" >
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
                                onClick={() => {
                                    setShowForm(false);
                                    setErrors({});
                                    setApiError(null);
                                    setSuccess(false);
                                }}
                                className="btn-secondary"
                                disabled={actionLoading}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={actionLoading}
                            >
                                {actionLoading ? (selectedUser ? 'Mise à jour...' : 'Ajout...') : (selectedUser ? 'Mettre à jour' : 'Ajouter')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && <div className="text-center py-8">Chargement des utilisateurs...</div>}
            {!loading && apiError && !showForm && <div className="text-center py-8 text-error-600">{apiError}</div>}


            {!loading && !apiError && (
                <div className="card">
                    {success && (
                        <div className="bg-success-50 border border-success-200 text-success-800 p-4 rounded-lg mb-4">
                            Opération réussie !
                        </div>
                    )}
                    <div className="table-container">
                        <table className="table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-header-cell">Nom d'utilisateur</th>
                                    <th className="table-header-cell">Email</th>
                                    <th className="table-header-cell">Rôle</th>
                                    <th className="table-header-cell">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.id} className="table-row">
                                            <td className="table-cell font-medium">{user.username}</td>
                                            <td className="table-cell">{user.email}</td>
                                            <td className="table-cell">
                                                <span className={`badge ${
                                                    user.role === 'ADMIN' ? 'badge-error' : 'badge-info'
                                                }`}>
                                                    {user.role === 'ADMIN' ? 'Administrateur' : user.role || 'USER'}
                                                </span>
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                        aria-label="Modifier"
                                                        disabled={actionLoading}
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-1 text-error-600 hover:bg-error-50 rounded"
                                                        aria-label="Supprimer"
                                                        disabled={actionLoading}
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="table-cell text-center py-4">
                                            Aucun utilisateur trouvé
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersPage;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

import instance from '../auth/instance';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAtom } from 'jotai';
import { categoriesAtom, fetchAllAtom, medicationsAtom, suppliersAtom } from '../../store/globalAtom';





function MedicationTable() {
  const navigate = useNavigate();
  const [, fetchAll] = useAtom(fetchAllAtom);
  const [medicaments] = useAtom(medicationsAtom);
  const [categories] = useAtom(categoriesAtom);
  const [suppliers] = useAtom(suppliersAtom);


useEffect(() => {
    fetchAll();
  }, [fetchAll]);


  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('nom'); 
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return null;

    return sortDirection === 'asc'
      ? <ChevronUpIcon className="w-4 h-4 inline-block ml-1" />
      : <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />;
  };

  const handleEdit = (id) => {
    navigate(`/medications/${id}/edit`);
  };

  const deleteMedication = async (id) => {
  try {
    await instance.delete(`/api/medicaments/${id}`);
    fetchAll()
    
  } catch (error) {
    console.error("Error deleting medication:", error);
  }
};
  const handleDeleteClick = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament?')) {
      deleteMedication(id);
    }
  };

  const filteredAndSortedMedicaments = medicaments
    .filter(med => {
      const matchesSearch = med.nom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === '' || med.categorie === categoryFilter;
      const matchesSupplier = supplierFilter === '' || (med.fournisseur && med.fournisseur.nom === supplierFilter);

      return matchesSearch && matchesCategory && matchesSupplier;
    })
    .sort((a, b) => {
      let valueA = a[sortColumn];
      let valueB = b[sortColumn];

      if (sortColumn === 'fournisseur') {
          valueA = a.fournisseur?.nom || ''; 
          valueB = b.fournisseur?.nom || ''; 
      }

      if (sortColumn === 'date_expiration') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="card space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <FunnelIcon className="w-4 h-4 mr-1" />
            Filtres
          </button>

          <button
            onClick={() => navigate('/medications/new')}
            className="btn-primary"
          >
            Ajouter un médicament
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-full md:w-1/2">
            <label htmlFor="category-filter" className="form-label">Catégorie</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <label htmlFor="supplier-filter" className="form-label">Fournisseur</label>
            <select
              id="supplier-filter"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Tous les fournisseurs</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
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
                onClick={() => handleSort('nom')} // Use 'nom' for sorting
              >
                <span className="flex items-center">
                  Nom {getSortIcon('nom')}
                </span>
              </th>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('quantite')} // Use 'quantite' for sorting
              >
                <span className="flex items-center">
                  Quantité {getSortIcon('quantite')}
                </span>
              </th>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('date_expiration')} // Use 'date_expiration' for sorting
              >
                <span className="flex items-center">
                  Date d'expiration {getSortIcon('date_expiration')}
                </span>
              </th>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('categorie')} // Use 'categorie' for sorting
              >
                <span className="flex items-center">
                  Catégorie {getSortIcon('categorie')}
                </span>
              </th>
              <th
                className="table-header-cell cursor-pointer"
                onClick={() => handleSort('fournisseur')} // Sort by supplier name
              >
                <span className="flex items-center">
                  Fournisseur {getSortIcon('fournisseur')}
                </span>
              </th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredAndSortedMedicaments.length > 0 ? (
              filteredAndSortedMedicaments.map(medication => {
                const today = new Date();
                // Use 'date_expiration' from API data
                const expiryDate = new Date(medication.date_expiration);
                // Use 'quantite' and 'seuil_alerte' from API data
                const isLowStock = medication.quantite <= medication.seuil_alerte;
                // Check if expiryDate is valid before comparison
                const isExpiringSoon = !isNaN(expiryDate.getTime()) && expiryDate <= new Date(today.setDate(today.getDate() + 30));

                return (
                  <tr key={medication.id} className="table-row">
                    {/* Use 'nom' from API data */}
                    <td className="table-cell font-medium">{medication.nom}</td>
                    <td className="table-cell">
                      {/* Use 'quantite' from API data */}
                      <span className={isLowStock ? 'text-error-600 font-medium' : ''}>
                        {medication.quantite}
                      </span>
                    </td>
                    <td className="table-cell">
                       {/* Use 'date_expiration' from API data and check if valid */}
                      <span className={isExpiringSoon ? 'text-warning-600 font-medium' : ''}>
                        {!isNaN(expiryDate.getTime()) ? format(expiryDate, 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                      </span>
                    </td>
                    {/* Use 'categorie' from API data */}
                    <td className="table-cell">{medication.categorie}</td>
                    {/* Use nested 'fournisseur.nom' from API data */}
                    <td className="table-cell">{medication.fournisseur?.nom || 'N/A'}</td> {/* Handle null fournisseur */}
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(medication.id)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                          aria-label="Modifier"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(medication.id)} // Use the local handler
                          className="p-1 text-error-600 hover:bg-error-50 rounded"
                          aria-label="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="table-cell text-center py-4">
                  chargement des médicaments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MedicationTable;
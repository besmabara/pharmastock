import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import instance from '../components/auth/instance';


function AlertsPage() {
    const navigate = useNavigate();

    const [medications, setMedications] = useState([]);
    const [lowStockMeds, setLowStockMeds] = useState([]);
    const [soonToExpireMeds, setSoonToExpireMeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndFilterMeds = async () => {
            try {
                const response = await instance.get("/api/medicaments");
                const fetchedMeds = response.data;
                console.log("Fetched Medications for Alerts:", fetchedMeds);

                setMedications(fetchedMeds);

                const lowStock = fetchedMeds.filter(
                    (med) => med.quantite <= med.seuil_alerte
                );
                setLowStockMeds(lowStock);

                const now = new Date();
                const ninetyDaysLater = new Date(now);
                ninetyDaysLater.setDate(now.getDate() + 90);

                const soonToExpire = fetchedMeds.filter((med) => {
                    if (typeof med.date_expiration !== 'string') return false;

                    const expirationDate = parseISO(med.date_expiration);

                    if (isNaN(expirationDate.getTime())) return false;

                    return expirationDate > now && expirationDate <= ninetyDaysLater;
                });
                const expiredByEndOf2024 = fetchedMeds.filter((med) => {
                    if (typeof med.date_expiration !== 'string') return false;
                    const expirationDate = parseISO(med.date_expiration);
                    if (isNaN(expirationDate.getTime())) return false;
                    return expirationDate.getFullYear() <= 2024;
                });

                setSoonToExpireMeds([...soonToExpire, ...expiredByEndOf2024]);


            } catch (err) {
                console.error("Error fetching medications for alerts:", err);
                setError('Erreur lors du chargement des alertes.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilterMeds();
    }, []);

    const handleViewMedication = (id) => {
        navigate(`/medications/${id}/edit`);
    };

    if (loading) {
        return <div className="text-center py-8">Chargement des alertes...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-error-600">{error}</div>;
    }

    return (
        <div className="space-y-6">
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
                                        <td className="table-cell font-medium">{med.nom}</td>
                                        <td className="table-cell text-error-600 font-medium">{med.quantite}</td>
                                        <td className="table-cell">{med.seuil_alerte}</td>
                                        <td className="table-cell">{med.fournisseur?.nom || 'N/A'}</td>
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
                                    const today = new Date();
                                    const expiryDate = typeof med.date_expiration === 'string' ? parseISO(med.date_expiration) : null;

                                    let daysLeft = 'N/A';

                                    if (expiryDate && !isNaN(expiryDate.getTime())) {
                                        const timeDiff = expiryDate.getTime() - today.getTime();
                                        daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                                    }


                                    return (
                                        <tr key={med.id} className="table-row">
                                            <td className="table-cell font-medium">{med.nom}</td>
                                            <td className="table-cell">
                                                {expiryDate && !isNaN(expiryDate.getTime())
                                                    ? format(expiryDate, 'dd/MM/yyyy', { locale: fr })
                                                    : 'Date invalide'}
                                            </td>
                                            <td className="table-cell">
                                                <span className={
                                                    typeof daysLeft === 'number' && daysLeft <= 30 ? 'text-error-600 font-medium' :
                                                    typeof daysLeft === 'number' && daysLeft <= 60 ? 'text-warning-600 font-medium' :
                                                    'text-gray-700'
                                                }>
                                                    {typeof daysLeft === 'number' ? `${daysLeft} jours` : daysLeft}
                                                </span>
                                            </td>
                                            <td className="table-cell">{med.quantite}</td>
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
                                    );
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
    );
}

export default AlertsPage;
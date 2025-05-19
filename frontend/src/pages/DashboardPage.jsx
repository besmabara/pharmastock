import {
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

import KpiCard from "../components/dashboard/KpiCard";
import ActivityLog from "../components/dashboard/ActivityLog";
import StockChart from "../components/dashboard/StockChart";
import { useEffect, useState } from "react";
import instance from "../components/auth/instance";
import { useAtom } from "jotai";
import {
  fetchAllAtom,
  historyAtom,
  lowStockMedsAtom,
  medicationsAtom,
  soonToExpireMedsAtom,
} from "../store/globalAtom";

function DashboardPage() {
  const [, fetchAll] = useAtom(fetchAllAtom);
  const [medications] = useAtom(medicationsAtom);
  const [lowStockMeds] = useAtom(lowStockMedsAtom);
  const [soonToExpireMeds] = useAtom(soonToExpireMedsAtom);
  const [history] = useAtom(historyAtom);

  useEffect(() => {
    fetchAll();
    console.log(medications);
    
  }, [fetchAll]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total Médicaments"
          value={medications.length} // Use the local state
          icon={<ShoppingBagIcon className="h-6 w-6 text-white" />}
          color="bg-primary-600"
        />

        <KpiCard
          title="Stock bas"
          value={lowStockMeds.length} // Use the local state
          icon={<ExclamationTriangleIcon className="h-6 w-6 text-white" />}
          color="bg-warning-500"
        />

        <KpiCard
          title="Expiration proche"
          value={soonToExpireMeds.length} // Use the local state
          icon={<CalendarIcon className="h-6 w-6 text-white" />}
          color="bg-error-500"
        />
      </div>

      {/* Stock Chart and Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assuming StockChart might need medications data if it visualizes it */}
        <StockChart
          medications={medications.map((medication) => ({
            id: medication.id,
            name: medication.nom,
            quantity: medication.quantite,
            expiryDate: medication.date_expiration,
            category: medication.categorie,
            supplier: medication.fournisseur.nom,
            threshold: medication.seuil_alerte,
            createdAt: medication.created_at,
            updatedAt: medication.updated_at,
          }))}
        />
        <ActivityLog activities={history} />
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
                  {/* Ensure you use the correct property names from your data */}
                  {lowStockMeds.slice(0, 3).map((med) => (
                    <li key={med.id}>
                      <span className="font-medium">{med.nom}</span>:{" "}
                      {med.quantite} unités restantes
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

      {/* Soon to Expire Alert (Add a similar block if needed) */}
      {soonToExpireMeds.length > 0 && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 mt-4">
          {" "}
          {/* Added mt-4 for spacing */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-error-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error-800">
                {soonToExpireMeds.length} médicament(s) avec expiration proche
              </h3>
              <div className="mt-2 text-sm text-error-700">
                <ul className="list-disc pl-5 space-y-1">
                  {/* Display details for soon to expire meds */}
                  {soonToExpireMeds.slice(0, 3).map((med) => (
                    <li key={med.id}>
                      <span className="font-medium">{med.nom}</span>: Expire le{" "}
                      {med.date_expiration}
                    </li>
                  ))}
                  {soonToExpireMeds.length > 3 && (
                    <li>
                      <a href="/alerts" className="font-medium underline">
                        Voir tous les médicaments avec expiration proche...
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
  );
}

export default DashboardPage;

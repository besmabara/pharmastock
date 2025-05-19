import { atom } from "jotai";
import instance from "../components/auth/instance.js";

export const medicationsAtom = atom([]);

export const lowStockMedsAtom = atom((get) =>
  get(medicationsAtom).filter((med) => med.quantite <= med.seuil_alerte)
);

export const soonToExpireMedsAtom = atom((get) => {
  const meds = get(medicationsAtom);
  const now = new Date();
  const ninetyDaysLater = new Date();
  ninetyDaysLater.setDate(now.getDate() + 90);

  const soonToExpire = meds.filter((med) => {
    const expirationDate = new Date(med.date_expiration);
    return expirationDate <= ninetyDaysLater && expirationDate > now;
  });

  const expiredByEndOf2024 = meds.filter((med) => {
    const expirationDate = new Date(med.date_expiration);
    return expirationDate.getFullYear() <= 2024;
  });

  return [...soonToExpire, ...expiredByEndOf2024];
});

// Atom to hold the history, initially empty
export const historyAtom = atom([]);

export const fetchMedicationsAtom = atom(null, async (get, set) => {
  try {
    const response = await instance.get("/api/medicaments");
    const fetchedMeds = response.data;
    console.log("Fetched Medications:", fetchedMeds);
    set(medicationsAtom, fetchedMeds);
  } catch (error) {
    console.error("Error fetching medications:", error);
  }
});

// Atom to fetch history and update historyAtom
export const fetchHistoryAtom = atom(null, async (get, set) => {
  try {
    const response = await instance.get("/api/mouvements");
    console.log("history", response.data);
    console.log(response.data);

    const formattedHistory = response.data.map((historyItem) => {
      const actionText =
        historyItem.type_mouvement === "entree"
          ? "Entrée de stock"
          : historyItem.type_mouvement === "sortie"
          ? "Sortie de stock"
          : historyItem.type_mouvement;

      let detailsText;
      if (
        historyItem.type_mouvement === "entree" ||
        historyItem.type_mouvement === "sortie"
      ) {
        detailsText = `${actionText.split(" ")[0]} de ${
          historyItem.quantite
        } unités - Raison: ${historyItem.note || "Non spécifié"}`;
      } else {
        detailsText = `${actionText}: ${historyItem.note || "Aucune note"}`;
      }

      return {
        id: historyItem.id,
        date: historyItem.created_at,
        user: "Admin",
        action: actionText,
        medicamentId: historyItem.medicament_id,
        medicationName: historyItem.medicament
          ? historyItem.medicament.nom
          : "Médicament inconnu",
        details: detailsText,
        quantity: historyItem.quantite, 
        reason: historyItem.note || "Aucune note", 
      };
    });

    set(historyAtom, formattedHistory);
  } catch (error) {
    console.error("Error fetching history:", error);
  }
});

export const fetchAllAtom = atom(null, async (get, set) => {
  await Promise.all([set(fetchMedicationsAtom), set(fetchHistoryAtom)]);
});

export const categoriesAtom = atom((get) => {
  const meds = get(medicationsAtom);
  const uniqueCategories = [
    ...new Set(meds.map((med) => med.categorie).filter(Boolean)),
  ];
  return uniqueCategories;
});

export const suppliersAtom = atom((get) => {
  const meds = get(medicationsAtom);
  const uniqueSuppliers = [
    ...new Set(meds.map((med) => med.fournisseur?.nom).filter(Boolean)),
  ];
  return uniqueSuppliers;
});

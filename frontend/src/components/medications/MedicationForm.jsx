import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../auth/instance";
import { useAtom } from "jotai";
import { fetchAllAtom } from "../../store/globalAtom";

function MedicationForm({ medicationId = null }) {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    expiryDate: "",
    category: "",
    supplierId: "",
    threshold: 10,
  });

  const [errors, setErrors] = useState({});
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get("/api/medicaments");
        const medicamentsData = response.data;

        const uniqueCategories = [
          ...new Set(
            medicamentsData.map((med) => med.categorie).filter(Boolean)
          ),
        ];
        setCategories(uniqueCategories);

        const uniqueSuppliersMap = new Map();
        medicamentsData.forEach((med) => {
          if (med.fournisseur) {
            uniqueSuppliersMap.set(med.fournisseur.id, {
              id: med.fournisseur.id,
              nom: med.fournisseur.nom,
            });
          }
        });
        setSuppliers(Array.from(uniqueSuppliersMap.values()));

        if (medicationId) {
          const medicationToEdit = medicamentsData.find(
            (med) => med.id === parseInt(medicationId, 10)
          );

          if (medicationToEdit) {
            const formattedDate = medicationToEdit.date_expiration
              ? medicationToEdit.date_expiration.split("T")[0]
              : "";

            setFormData({
              name: medicationToEdit.nom || "",
              quantity: medicationToEdit.quantite || 0,
              expiryDate: formattedDate,
              category: medicationToEdit.categorie || "",
              supplierId: medicationToEdit.fournisseur_id || "", // Use the supplier ID
              threshold: medicationToEdit.seuil_alerte || 10,
            });

            if (
              medicationToEdit.categorie &&
              !uniqueCategories.includes(medicationToEdit.categorie)
            ) {
              setIsNewCategory(true);
            }
          } else {
            console.warn(`Medication with ID ${medicationId} not found.`);
            navigate("/medications");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [medicationId, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleCategoryInput = () => {
    setIsNewCategory(!isNewCategory);
    setFormData((prev) => ({ ...prev, category: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "La quantité doit être positive";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "La date d'expiration est requise";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiryDateObj = new Date(formData.expiryDate);
      if (isNaN(expiryDateObj.getTime())) {
        newErrors.expiryDate = "Format de date invalide";
      } else if (expiryDateObj < today) {
        newErrors.expiryDate = "La date d'expiration doit être future";
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = "La catégorie est requise";
    }

    if (!formData.supplierId) {
      newErrors.supplierId = "Le fournisseur est requis";
    }

    if (formData.threshold < 1) {
      newErrors.threshold = "Le seuil minimum doit être au moins 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [, fetchAll] = useAtom(fetchAllAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      console.log("Form validation failed");
      return; // Stop if validation fails
    }

    const payload = {
      nom: formData.name,
      quantite: formData.quantity,
      dateExpiration: formData.expiryDate,
      categorie: formData.category,
      seuil_alerte: formData.threshold,
      fournisseurId: formData.supplierId
        ? parseInt(formData.supplierId, 10)
        : null,
    };

    try {
      if (medicationId) {
        await instance.put(`/api/medicaments/${medicationId}`, payload, {
          headers: { Accept: "application/json" },
        });
        fetchAll();
      } else {
        const response = await instance.post("/api/medicaments", payload, {
          headers: { Accept: "application/json" },
        });
        fetchAll();
      }
      navigate("/medications");
    } catch (error) {
      console.error(
        "Error submitting medication form:",
        error.response?.data || error.message
      );
      setErrors((prevErrors) => ({
        ...prevErrors,
        submit: "Medicament déja stocké",
      }));
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-medium mb-6">
        {medicationId ? "Modifier le médicament" : "Ajouter un médicament"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nom du médicament
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? "border-error-500" : ""}`}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="quantity" className="form-label">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className={`form-input ${
                errors.quantity ? "border-error-500" : ""
              }`}
            />
            {errors.quantity && <p className="form-error">{errors.quantity}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate" className="form-label">
              Date d'expiration
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`form-input ${
                errors.expiryDate ? "border-error-500" : ""
              }`}
            />
            {errors.expiryDate && (
              <p className="form-error">{errors.expiryDate}</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="category" className="form-label mb-0">
              Catégorie
            </label>
            <button
              type="button"
              onClick={toggleCategoryInput}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {isNewCategory ? "Choisir une existante" : "Nouvelle catégorie"}
            </button>
          </div>

          {isNewCategory ? (
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Nouvelle catégorie"
              className={`form-input ${
                errors.category ? "border-error-500" : ""
              }`}
            />
          ) : (
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-input ${
                errors.category ? "border-error-500" : ""
              }`}
            >
              <option value="">Sélectionner une catégorie</option>
              {/* Populate options from fetched categories */}
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}

          {errors.category && <p className="form-error">{errors.category}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="supplierId" className="form-label">
              Fournisseur
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className={`form-input ${
                errors.supplierId ? "border-error-500" : ""
              }`}
            >
              <option value="">Sélectionner un fournisseur</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nom}
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="form-error">{errors.supplierId}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="threshold" className="form-label">
              Seuil d'alerte stock bas
              <span className="text-xs text-gray-500 ml-1">(qté minimum)</span>
            </label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              min="1"
              className={`form-input ${
                errors.threshold ? "border-error-500" : ""
              }`}
            />
            {errors.threshold && (
              <p className="form-error">{errors.threshold}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/medications")}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            {medicationId ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>

        {/* Optional: Display a general submit error message */}
        {errors.submit && (
          <p className="form-error text-center mt-4">{errors.submit}</p>
        )}
      </form>
    </div>
  );
}

export default MedicationForm;

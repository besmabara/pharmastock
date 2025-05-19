import { useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "../store/authStore";

function SettingsPage() {
  const [auth, setAuth] = useAtom(authAtom);

  const [formData, setFormData] = useState({
    name: auth.user?.name || "",
    email: auth.user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error and success message
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (
      passwordSuccess &&
      (name === "currentPassword" ||
        name === "newPassword" ||
        name === "confirmPassword")
    ) {
      setPasswordSuccess(false);
    }

    if (profileSuccess && (name === "name" || name === "email")) {
      setProfileSuccess(false);
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email est invalide";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Le mot de passe actuel est requis";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    // Mock update - in a real app would call an API
    const updatedUser = {
      ...auth.user,
      name: formData.name,
      email: formData.email,
    };

    // Update localStorage and state
    localStorage.setItem("pharmacy_user", JSON.stringify(updatedUser));
    setAuth((prev) => ({ ...prev, user: updatedUser }));

    setProfileSuccess(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    // In a real app, this would call an API
    // For this demo, just simulate success

    // Reset password fields
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    setPasswordSuccess(true);
  };

  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="card">
        <h2 className="text-xl font-medium mb-6">Informations du profil</h2>

        {profileSuccess && (
          <div className="bg-success-50 border border-success-200 text-success-800 p-4 rounded-lg mb-4">
            Profil mis à jour avec succès
          </div>
        )}

        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${
                  errors.name ? "border-error-500" : ""
                }`}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${
                  errors.email ? "border-error-500" : ""
                }`}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn-primary">
              Mettre à jour le profil
            </button>
          </div>
        </form>
      </div>

      {/* Password Settings */}
      <div className="card">
        <h2 className="text-xl font-medium mb-6">Changer le mot de passe</h2>

        {passwordSuccess && (
          <div className="bg-success-50 border border-success-200 text-success-800 p-4 rounded-lg mb-4">
            Mot de passe mis à jour avec succès
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Mot de passe actuel
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`form-input ${
                errors.currentPassword ? "border-error-500" : ""
              }`}
            />
            {errors.currentPassword && (
              <p className="form-error">{errors.currentPassword}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`form-input ${
                  errors.newPassword ? "border-error-500" : ""
                }`}
              />
              {errors.newPassword && (
                <p className="form-error">{errors.newPassword}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${
                  errors.confirmPassword ? "border-error-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn-primary">
              Changer le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;

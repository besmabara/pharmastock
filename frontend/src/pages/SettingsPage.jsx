import { useState } from "react";
import instance from "../components/auth/instance";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (
      passwordSuccess &&
      (name === "newPassword" || name === "confirmPassword")
    ) {
      setPasswordSuccess(false);
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const response = await instance.post("/api/user/update", {
        username: localStorage.getItem("username"),
        password: formData.newPassword,
      });
      console.log(response);

      setPasswordSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (error) {
      console.log(error);

      setErrors(error.message);
    }

    setLoading(false);
  };
  console.log(errors);

  return (
    <div className="space-y-8">
      {errors.general && (
        <div className="bg-error-50 border border-error-200 text-error-800 p-4 rounded-lg mb-4">
          {errors.general}
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-medium mb-6">Changer le mot de passe</h2>

        {passwordSuccess && (
          <div className="bg-success-50 border border-success-200 text-success-800 p-4 rounded-lg mb-4">
            Mot de passe mis à jour avec succès
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
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
                disabled={loading}
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
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Modification..." : "Changer le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;

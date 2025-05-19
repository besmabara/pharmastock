import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log(response.data);

      const { token, username, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      window.location.href = "/dashboard";
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrors({ general: "Email ou mot de passe incorrect." });
        } else if (error.response.data?.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({
            general: "Une erreur s’est produite. Réessayez plus tard.",
          });
        }
      } else if (error.request) {
        setErrors({ general: "Impossible de contacter le serveur." });
      } else {
        setErrors({ general: "Une erreur inattendue est survenue." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">PharmaStock</h1>
          <h2 className="mt-6 text-2xl font-medium text-gray-900">
            Connectez-vous à votre compte
          </h2>
        </div>

        <div className="mt-8 card p-6 shadow-lg bg-white rounded-xl space-y-4">
          {errors.general && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-md">
              {errors.general}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label block mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input w-full border px-3 py-2 rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="nom@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="mot de passe"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input w-full border px-3 py-2 rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-md transition"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

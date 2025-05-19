import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MedicationsPage from "./pages/MedicationsPage";
import MedicationFormPage from "./pages/MedicationFormPage";
import StockMovementPage from "./pages/StockMovementPage";
import AlertsPage from "./pages/AlertsPage";
import LandingPage from "./pages/LandingPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StockMovementTable from "./components/stock/StockMovementTable";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LandingPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/medications/new" element={<MedicationFormPage />} />
          <Route
            path="/medications/:id/edit"
            element={<MedicationFormPage />}
          />
          <Route path="/stock" element={<StockMovementPage />} />
          <Route path="/history" element={<StockMovementTable />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route
            path="/users"
            element={
              localStorage.getItem("role") === "ADMIN" ? (
                <UsersPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* <Route
        path="*"
        element={
          <Navigate
            to={auth.isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      /> */}
    </Routes>
  );
}

export default App;

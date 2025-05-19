import { Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  if (token) {
    return <Outlet />;
  }
}

export default ProtectedRoute;

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AlquimistaDashboard from "../pages/DashboardAlquimista";
import SupervisorDashboard from "../pages/DashboardSupervisor";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/DashboardAlquimista"; 

const AppRoutes = () => {
  const { token, user } = useAuth(); 

  return (
    <Routes>
      {/* Ruta raíz: si está logueado, lo mando a su panel según Rol; si no, Home */}
      <Route
        path="/"
        element={
          token ? (
            user?.Rol === "supervisor" ? (
              <SupervisorDashboard />
            ) : (
              <AlquimistaDashboard />
            )
          ) : (
            <Home />
          )
        }
      />

      {/* Login y registro: si ya tiene token, lo regreso a "/" */}
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Ruta explícita para alquimista */}
      <Route
        path="/alquimista"
        element={
          <ProtectedRoute rol="alquimista">
            <AlquimistaDashboard />
          </ProtectedRoute>
        }
      />

      {/* Ruta explícita para supervisor */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute rol="supervisor">
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Cualquier otra ruta manda a raíz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

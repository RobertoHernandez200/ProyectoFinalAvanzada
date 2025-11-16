import { Navigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  rol?: "alquimista" | "supervisor"; // la prop sigue, pero no la usamos aún
}

export default function ProtectedRoute({ children }: Props) {
  // SOLO usamos lo que EXISTE en tu AuthContext
  const { token } = useAuth();

  // Si no hay token → mandamos a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token → dejamos pasar siempre
  return <>{children}</>;
}

// Cliente para autenticación (registro/login)

import api from "./client";

// Registrar usuario
export async function registrarUsuario(datos: {
  Nombre: string;
  Correo: string;
  Password: string;
  Rol: string;
}) {
  const res = await api.post("/auth/registro", datos);
  return res.data;
}

// Iniciar sesión
export async function iniciarSesion(datos: {
  Correo: string;
  Password: string;
}) {
  const res = await api.post("/auth/login", datos);
  return res.data;
}

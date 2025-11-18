
import api from "./client";
import type { Mision } from "../types";

// OBTENER TODAS LAS MISIONES
export async function obtenerMisiones(): Promise<Mision[]> {
  const respuesta = await api.get<Mision[]>("/misiones");
  return respuesta.data;
}

// CREAR MISIÓN
export async function crearMision(datos: Partial<Mision>): Promise<Mision> {
  const respuesta = await api.post<Mision>("/misiones", datos);
  return respuesta.data;
}

// ACTUALIZAR MISIÓN
export async function actualizarMision(
  id: number,
  datos: Partial<Mision>
): Promise<Mision> {
  const respuesta = await api.put<Mision>(`/misiones/${id}`, datos);
  return respuesta.data;
}

// ELIMINAR MISIÓN
export async function eliminarMision(id: number): Promise<void> {
  await api.delete(`/misiones/${id}`);
}


import api from "./client";
import type { Mision } from "../types";

//Obtener todas las misiones
export async function obtenerMisiones(): Promise<Mision[]> {
  const respuesta = await api.get<Mision[]>("/api/misiones");
  return respuesta.data;
}

//Crear misión
export async function crearMision(datos: Partial<Mision>): Promise<Mision> {
  const respuesta = await api.post<Mision>("/api/misiones", datos);
  return respuesta.data;
}

//Actualizar misión
export async function actualizarMision(
  id: number,
  datos: Partial<Mision>
): Promise<Mision> {
  const respuesta = await api.put<Mision>(`/api/misiones/${id}`, datos);
  return respuesta.data;
}

//Eliminar misión
export async function eliminarMision(id: number): Promise<void> {
  await api.delete(`/api/misiones/${id}`);
}


import api from "./client";
import type { Material } from "../types";

// Obtener todos los materiales
export async function obtenerMateriales(): Promise<Material[]> {
  const r = await api.get<Material[]>("/api/materiales");
  return r.data;
}

// Crear un nuevo material
export async function crearMaterial(
  datos: Partial<Material>
): Promise<Material> {
  const r = await api.post<Material>("/api/materiales", datos);
  return r.data;
}

// Actualizar un material existente
export async function actualizarMaterial(
  id: number,
  datos: Partial<Material>
): Promise<Material> {
  const r = await api.put<Material>(`/api/materiales/${id}`, datos);
  return r.data;
}

// Eliminar un material
export async function eliminarMaterial(id: number): Promise<void> {
  await api.delete(`/api/materiales/${id}`);
}


import api from "./client";
import type { Auditoria } from "../types";

//Obtener todas las auditorías del sistema
export async function obtenerAuditorias(): Promise<Auditoria[]> {
  const respuesta = await api.get<Auditoria[]>("/api/auditorias");
  return respuesta.data;
}

//Crear una nueva auditoría (por ejemplo, desde acciones del sistema)
export async function crearAuditoria(
  datos: Partial<Auditoria>
): Promise<Auditoria> {
  const respuesta = await api.post<Auditoria>("/api/auditorias", datos);
  return respuesta.data;
}

//Actualizar una auditoría existente
export async function actualizarAuditoria(
  id: number,
  datos: Partial<Auditoria>
): Promise<Auditoria> {
  const respuesta = await api.put<Auditoria>(`/api/auditorias/${id}`, datos);
  return respuesta.data;
}

//Eliminar una auditoría
export async function eliminarAuditoria(id: number): Promise<void> {
  await api.delete(`/api/auditorias/${id}`);
}

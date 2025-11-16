
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Material } from "../../types";
import {
  obtenerMateriales,
  eliminarMaterial,
} from "../../api/materiales";

//Componente principal exportado por defecto
export default function ListaMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  //Cargar materiales al montar el componente
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const lista = await obtenerMateriales();
        setMateriales(lista);
      } catch (err) {
        console.error("Error al obtener materiales", err);
        setError("No se pudieron cargar los materiales.");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const irANuevo = () => {
    navigate("/supervisor/materiales/nuevo");
  };

  const irAEditar = (id: number) => {
    navigate(`/supervisor/materiales/${id}`);
  };

  const borrar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este material?")) return;

    try {
      await eliminarMaterial(id);
      setMateriales((prev) => prev.filter((m) => m.ID !== id));
    } catch (err) {
      console.error("Error al eliminar material", err);
      alert("No se pudo eliminar el material.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 10px" }}>
      <h2 style={{ marginBottom: 15 }}>Materiales alquímicos</h2>

      <button
        onClick={irANuevo}
        style={{
          marginBottom: 10,
          padding: 8,
          borderRadius: 4,
          border: "none",
          backgroundColor: "#16a34a",
          color: "white",
          cursor: "pointer",
        }}
      >
        Registrar nuevo material
      </button>

      {cargando && <p>Cargando materiales...</p>}

      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>
          {error}
        </p>
      )}

      {!cargando && materiales.length === 0 && !error && (
        <p>No hay materiales registrados.</p>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 0 3px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#e5e7eb" }}>
            <th style={{ padding: 8, borderBottom: "1px solid #d1d5db" }}>
              Nombre
            </th>
            <th style={{ padding: 8, borderBottom: "1px solid #d1d5db" }}>
              Tipo
            </th>
            <th style={{ padding: 8, borderBottom: "1px solid #d1d5db" }}>
              Cantidad
            </th>
            <th style={{ padding: 8, borderBottom: "1px solid #d1d5db" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((m) => (
            <tr key={m.ID}>
              <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
                {m.Nombre}
              </td>
              <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
                {m.Tipo}
              </td>
              <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
                {m.Cantidad}
              </td>
              <td
                style={{
                  padding: 8,
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  gap: 6,
                }}
              >
                <button
                  onClick={() => irAEditar(m.ID)}
                  style={{
                    padding: 5,
                    borderRadius: 4,
                    border: "none",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => borrar(m.ID)}
                  style={{
                    padding: 5,
                    borderRadius: 4,
                    border: "none",
                    backgroundColor: "#dc2626",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

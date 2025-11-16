import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Mision {
  ID: number;
  Titulo: string;
  Descripcion: string;
  Estado: string;
  AlquimistaID: number;
}

export default function AlquimistaDashboard() {
  const { token, user } = useAuth();   // <-- ahora sí existe 'user'
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMisiones = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/misiones", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Error al cargar misiones:", await res.text());
          setMisiones([]);
          return;
        }

        const data: Mision[] = await res.json();

        // SOLO las misiones del alquimista logueado
        const misionesFiltradas = data.filter(
          (m) => m.AlquimistaID === user?.ID
        );

        setMisiones(misionesFiltradas);
      } catch (error) {
        console.error("Error en petición:", error);
      } finally {
        setCargando(false);
      }
    };

    if (token && user) {
      cargarMisiones();
    }
  }, [token, user]);

  if (cargando) return <p>Cargando misiones...</p>;

  return (
    <div>
      <h2>Panel de Alquimista</h2>

      {misiones.length === 0 ? (
        <p>No hay misiones disponibles para este alquimista.</p>
      ) : (
        <ul>
          {misiones.map((m) => (
            <li key={m.ID} style={{ marginBottom: "12px" }}>
              <strong>{m.Titulo}</strong>
              <br />
              {m.Descripcion}
              <br />
              <em>Estado: {m.Estado}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

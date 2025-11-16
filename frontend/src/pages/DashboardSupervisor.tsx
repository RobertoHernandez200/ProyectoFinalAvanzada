
// Muestra una lista de misiones y una lista de auditorías.

import { useEffect, useState } from "react";
import type { Mision, Auditoria } from "../types";
import { obtenerMisiones } from "../api/misiones";
import { obtenerAuditorias } from "../api/auditorias";

// Definimos el componente como función exportada por defecto.
export default function DashboardSupervisor() {
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [cargando, setCargando] = useState(false);

  // Cargar misiones y auditorías
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const [listaMisiones, listaAuditorias] = await Promise.all([
          obtenerMisiones(),
          obtenerAuditorias(),
        ]);

        setMisiones(listaMisiones);
        setAuditorias(listaAuditorias);
      } catch (err) {
        console.error("Error al cargar datos del supervisor", err);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: "0 10px" }}>
      <h2 style={{ marginBottom: 15 }}>Panel de Supervisor</h2>

      {cargando && <p>Cargando información...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 15,
          alignItems: "flex-start",
        }}
      >
        {/* Panel de misiones */}
        <section
          style={{
            backgroundColor: "white",
            color: "black",              
            padding: 10,
            borderRadius: 6,
            boxShadow: "0 0 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: 10 }}>Misiones</h3>
          {misiones.length === 0 && <p>No hay misiones registradas.</p>}
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {misiones.map((m) => (
              <li
                key={m.ID}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: 4,
                }}
              >
                <strong>{m.Titulo}</strong> {" - "}
                <span>Estado: {m.Estado}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Panel de auditorías */}
        <section
          style={{
            backgroundColor: "white",
            color: "black",               
            padding: 10,
            borderRadius: 6,
            boxShadow: "0 0 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: 10 }}>Auditorías recientes</h3>
          {auditorias.length === 0 && <p>No hay auditorías registradas.</p>}
          <ul
            style={{
              maxHeight: 260,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 14,
            }}
          >
            {auditorias.map((a) => (
              <li
                key={a.ID}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: 4,
                }}
              >
                <strong>{a.Accion}</strong> en {a.Entidad} (ID: {a.EntidadID})
                <br />
                {a.Descripcion}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

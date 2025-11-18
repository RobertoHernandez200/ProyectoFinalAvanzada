
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { obtenerMisiones } from "../api/misiones";

interface Mision {
  ID: number;
  Titulo: string;
  Descripcion: string;
  Estado: string;
  AlquimistaID: number;
}

export default function AlquimistaDashboard() {
  // Tomamos el token del usuario logueado
  const { token } = useAuth();

  // Estados
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // USE EFFECT para cargar misiones al entrar al dashboard

  useEffect(() => {
    const cargar = async () => {
      try {
        //Si NO hay token, no tiene caso llamar al backend
        if (!token) {
          setError("No hay token. Inicia sesión nuevamente.");
          setCargando(false);
          return;
        }

        // Llamamos al backend 
        const data = await obtenerMisiones();

        //mostramos todas las misiones

        setMisiones(data);

      } catch (err: any) {
        console.error("Error al cargar misiones:", err);
        setError("No se pudieron cargar las misiones.");
      } finally {
        setCargando(false);
      }
    };

    cargar();

  }, [token]);

  // RENDER

  if (cargando) return <p>Cargando misiones...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Misiones</h2>

      {misiones.length === 0 ? (
        <p>No hay misiones.</p>
      ) : (
        <ul>
          {misiones.map((m) => (
            <li key={m.ID} style={{ marginBottom: "12px" }}>
              <strong>{m.Titulo}</strong>
              <br />
              {m.Descripcion}
              <br />
              Estado: {m.Estado}
              <br />
              <small>AlquimistaID: {m.AlquimistaID}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

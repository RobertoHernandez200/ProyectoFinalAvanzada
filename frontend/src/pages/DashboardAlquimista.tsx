import { useEffect, useState } from "react";

interface Mision {
  ID: number;
  Titulo: string;
  Descripcion: string;
  Estado: string;
  AlquimistaID: number;
}

export default function AlquimistaDashboard() {
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Función para decodificar el token y sacar user_id y rol
  const getUserInfoFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return { userId: null as number | null, rol: null as string | null };

    try {
      const payloadBase64 = token.split(".")[1];

      
      const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const padded =
        base64 + "===".slice((base64.length + 3) % 4); // por si falta padding

      const json = atob(padded);
      const payload = JSON.parse(json);

      return {
        userId: payload.user_id as number | null,
        rol: payload.rol as string | null,
      };
    } catch (e) {
      console.error("No se pudo decodificar el token:", e);
      return { userId: null, rol: null };
    }
  };

  useEffect(() => {
    const cargarMisiones = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No hay token. Inicia sesión nuevamente.");
          setCargando(false);
          return;
        }

        const { userId, rol } = getUserInfoFromToken();
        console.log("Usuario desde token →", { userId, rol });

        const res = await fetch("http://localhost:8080/api/misiones", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Error HTTP:", res.status, txt);
          setError(`Error al cargar las misiones: ${res.status}`);
          setCargando(false);
          return;
        }

        const data: Mision[] = await res.json();

        let misionesFinales = data;

        //SI ES ALQUIMISTA SOLO SUS MISIONES
        if (rol === "alquimista" && userId != null) {
          misionesFinales = data.filter(
            (m) => m.AlquimistaID === userId
          );
        }

        // SI ES SUPERVISOR VE TODAS

        setMisiones(misionesFinales);
      } catch (err) {
        console.error("Error en la petición de misiones:", err);
        setError("No se pudieron cargar las misiones.");
      } finally {
        setCargando(false);
      }
    };

    cargarMisiones();
  }, []);

  if (cargando) return <p>Cargando misiones...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Misiones</h2>

      {misiones.length === 0 ? (
        <p>No hay misiones.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {misiones.map((m) => (
            <li
              key={m.ID}
              style={{
                marginBottom: "12px",
                padding: "10px",
                borderRadius: "8px",
                background: "#0f172a",
                color: "white",
              }}
            >
              <strong>{m.Titulo}</strong>
              <br />
              {m.Descripcion}
              <br />
              <em>Estado: {m.Estado}</em>
              <br />
              <small>AlquimistaID: {m.AlquimistaID}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

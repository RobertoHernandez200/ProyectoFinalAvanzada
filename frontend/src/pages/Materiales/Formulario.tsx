
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearMaterial, actualizarMaterial } from "../../api/materiales";

//Definimos cómo será el estado del formulario
interface FormState {
  Nombre: string;
  Tipo: string;
  Cantidad: number;
  Descripcion: string;
}

//Componente principal exportado por defecto
export default function FormularioMaterial() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState<FormState>({
    Nombre: "",
    Tipo: "",
    Cantidad: 0,
    Descripcion: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Maneja los cambios en los inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "Cantidad" ? Number(value) : value,
    }));
  };

  //Envía el formulario al backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setGuardando(true);

    try {
      if (id) {
        // Si hay id en la URL, actualizamos
        await actualizarMaterial(Number(id), form);
      } else {
        // Si no hay id, creamos uno nuevo
        await crearMaterial(form);
      }

      //Después de guardar, volvemos a la lista de materiales
      navigate("/supervisor/materiales");
    } catch (err) {
      console.error("Error al guardar material", err);
      setError("Ocurrió un error al guardar el material.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "20px auto", padding: "0 10px" }}>
      <h2 style={{ marginBottom: 15 }}>
        {id ? "Editar material" : "Registrar nuevo material"}
      </h2>

      {error && (
        <p style={{ color: "red", marginBottom: 10 }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          backgroundColor: "white",
          padding: 15,
          borderRadius: 6,
          boxShadow: "0 0 3px rgba(0,0,0,0.1)",
        }}
      >
        <label>
          Nombre:
          <input
            type="text"
            name="Nombre"
            value={form.Nombre}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        <label>
          Tipo:
          <input
            type="text"
            name="Tipo"
            value={form.Tipo}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        <label>
          Cantidad:
          <input
            type="number"
            name="Cantidad"
            min={0}
            value={form.Cantidad}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="Descripcion"
            value={form.Descripcion}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        <button
          type="submit"
          disabled={guardando}
          style={{
            marginTop: 10,
            padding: 8,
            borderRadius: 4,
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          {guardando ? "Guardando..." : "Guardar material"}
        </button>
      </form>
    </div>
  );
}

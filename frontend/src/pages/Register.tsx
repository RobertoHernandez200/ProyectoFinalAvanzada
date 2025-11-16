//Pantalla de registro de nuevos usuarios
//Envía los datos a POST /auth/registro

import { useState } from "react";
import { registrarUsuario } from "../api/auth";

const Register = () => {
  //Estado del formulario
  const [form, setForm] = useState({
    Nombre: "",
    Correo: "",
    Password: "",
    Rol: "alquimista", //valor por defecto
  });

  //Indica si el botón debe deshabilitarse
  const [enviando, setEnviando] = useState(false);

  //Actualiza los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Envía el formulario al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await registrarUsuario(form);
      alert("Usuario registrado correctamente");
        } catch (error: any) {
    console.error("Error al registrar usuario:", error);

    //Mostrar mensaje real del backend
    if (error.response && error.response.data) {
      const data = error.response.data;

      if (typeof data === "string") {
        alert(data);
      } else if (data.error) {
        alert(data.error);
      } else {
        alert("Error del servidor al registrar usuario");
      }
    } else {
      alert("No se pudo conectar con el servidor");
    }

    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", padding: "0 10px" }}>
      <h2 style={{ marginBottom: 15 }}>Registro de usuario</h2>

      {/*Formulario*/}
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
        {/*Nombre*/}
        <label>
          <span>Nombre:</span>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre completo"
            value={form.Nombre}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        {/*Correo*/}
        <label>
          <span>Correo:</span>
          <input
            type="email"
            name="Correo"
            placeholder="correo@ejemplo.com"
            value={form.Correo}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        {/*Contraseña*/}
        <label>
          <span>Contraseña:</span>
          <input
            type="password"
            name="Password"
            placeholder="Escribe una contraseña"
            value={form.Password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

        {/*Rol*/}
        <label>
          <span>Rol:</span>
          <select
            name="Rol"
            value={form.Rol}
            onChange={handleChange}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          >
            <option value="alquimista">Alquimista</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </label>

        {/*Botón*/}
        <button
          type="submit"
          disabled={enviando}
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
          {enviando ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    Correo: "",
    Password: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      // Llamamos POST /auth/login
      const resp = await iniciarSesion(form);

      // El backend devuelve algo como:
      // { token: "xxx", usuario: { ID, Nombre, Correo, Rol } }

      login(resp.token, resp.usuario);

      navigate("/");
    } catch (err) {
      console.error("Error al iniciar sesión", err);
      setError("Correo o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", padding: "0 10px" }}>
      <h2 style={{ marginBottom: 15 }}>Inicio de sesión</h2>

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

        <label>
          <span>Contraseña:</span>
          <input
            type="password"
            name="Password"
            placeholder="Tu contraseña"
            value={form.Password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 6, marginTop: 4 }}
          />
        </label>

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
          {enviando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;

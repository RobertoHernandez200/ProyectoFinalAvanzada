import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useAuth(); // 👈 YA NO HAY "rol"

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#111827",
        color: "white",
        marginBottom: "20px",
        borderRadius: 8,
      }}
    >
      <div>
        <strong>Amestris</strong>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {token && user && (
          <span>
            {user.Nombre} ({user.Rol})
          </span>
        )}

        {!token ? (
          <>
            <Link to="/login" style={{ color: "white" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white" }}>
              Registro
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

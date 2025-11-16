
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div>
      {/* Barra superior que se muestra siempre */}
      <Navbar />

      {/* Aquí se muestran las distintas pantallas según la ruta */}
      <AppRoutes />
    </div>
  );
};

export default App;

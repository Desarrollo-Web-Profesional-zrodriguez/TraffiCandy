import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import ProductoDetalle from "./pages/ProductoDetalle";
import Login from "./pages/Login";
import CandyMap from "./components/CandyMap/CandyMap";

function App() {
  return (
    <BrowserRouter>
      {/* Fondo global con degradado tipo dulces mexicanos */}
      <div className="min-h-screen bg-gradient-to-br from-[#1a0533] via-[#3d0066] to-[#1a0533]">
        <Navbar />

        {/* Contenido de las páginas (con padding para no quedar bajo el Navbar fijo) */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route
              path="/catalogo/:categoria/:slug"
              element={<ProductoDetalle />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/mapa" element={<CandyMap />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

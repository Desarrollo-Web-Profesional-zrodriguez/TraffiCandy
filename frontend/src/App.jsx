import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import ProductoDetalle from "./pages/ProductoDetalle";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import CandyForm from "./pages/Admin/CandyForm";
import CandyMap from "./components/CandyMap/CandyMap";
import NotFound from "./components/Error/NotFound";

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
            <Route path="/login" element={<Auth />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Rutas para Administración de Dulces */}
            <Route path="/admin/dulce/nuevo" element={<CandyForm />} />
            <Route path="/admin/dulce/editar/:id" element={<CandyForm />} />

            <Route path="/mapa" element={<CandyMap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

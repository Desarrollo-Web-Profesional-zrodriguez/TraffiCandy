import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import ProductoDetalle from "./pages/ProductoDetalle";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import CandyForm from "./pages/Admin/CandyForm";
import CandyMap from "./components/CandyMap/CandyMap";
import NotFound from "./components/Error/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDulces from "./pages/Admin/AdminDulces";

import ErrorBoundary from "./components/Error/ErrorBoundary";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      {/* Fondo global con degradado tipo dulces mexicanos */}
      <div className="min-h-screen bg-gradient-to-br from-[#1a0533] via-[#3d0066] to-[#1a0533]">
        <Toaster position="top-center" toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
          },
          success: {
            iconTheme: { primary: '#4ade80', secondary: '#1a0533' },
          },
          error: {
            iconTheme: { primary: '#FF006E', secondary: '#1a0533' },
          }
        }} />
        <Navbar />

        {/* Contenido de las páginas (con padding para no quedar bajo el Navbar fijo) */}
        <main className="pt-16">
          <ErrorBoundary>
            <Routes>
              {/* ── Rutas Públicas ─────────────────────────────────────── */}
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:categoria/:slug" element={<ProductoDetalle />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/mapa" element={<CandyMap />} />

            {/* ── Rutas Protegidas — Solo Vendedor ───────────────────── */}
            <Route
              path="/admin/dulces"
              element={
                <ProtectedRoute roles={["vendedor"]}>
                  <AdminDulces />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dulce/nuevo"
              element={
                <ProtectedRoute roles={["vendedor"]}>
                  <CandyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dulces/editar/:id"
              element={
                <ProtectedRoute roles={["vendedor"]}>
                  <CandyForm />
                </ProtectedRoute>
              }
            />

            {/* ── 404 ────────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

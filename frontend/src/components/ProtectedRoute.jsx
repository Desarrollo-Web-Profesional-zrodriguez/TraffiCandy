import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * ──────────────
 * Componente que protege rutas basándose en autenticación y rol.
 *
 * Props:
 *   children  — Componente a renderizar si pasa los guards
 *   roles     — Array de roles permitidos (opcional). Si no se pasa, solo verifica login.
 *   redirectTo — Ruta a donde redirigir si no tiene acceso (default: '/login')
 *
 * Ejemplo de uso en App.jsx:
 *   <Route path="/admin/dulce/nuevo" element={
 *     <ProtectedRoute roles={['vendedor']}>
 *       <CandyForm />
 *     </ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ children, roles = [], redirectTo = "/login" }) {
  const { isLoggedIn, usuario } = useAuth();

  // 1. No autenticado → redirigir al login
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // 2. Autenticado pero sin el rol requerido → pantalla de acceso denegado
  if (roles.length > 0 && !roles.includes(usuario?.rol)) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl shadow-2xl p-10">
          {/* Ícono */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 p-4 rounded-full border border-red-500/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-black text-red-400 mb-2">Acceso Denegado</h1>

          <p className="text-white/60 text-sm mb-1">
            Tu rol actual es{" "}
            <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
              {usuario?.rol ?? "desconocido"}
            </span>
          </p>
          <p className="text-white/50 text-sm mb-8">
            Se requiere rol:{" "}
            <span className="font-bold text-[#FF006E]">{roles.join(" o ")}</span>
          </p>

          <a
            href="/"
            className="inline-block rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] px-6 py-3
                       font-bold text-white shadow-[0_0_15px_rgba(255,0,110,0.4)]
                       hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02]
                       active:scale-95 transition-all"
          >
            ← Volver al Inicio
          </a>
        </div>
      </section>
    );
  }

  // 3. Todo OK → renderizar ruta
  return children;
}

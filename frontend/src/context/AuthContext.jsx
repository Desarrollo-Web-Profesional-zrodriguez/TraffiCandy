import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service";

// ─────────────────────────────────────────────────────
// AuthContext
// ─────────────────────────────────────────────────────

const AuthContext = createContext(null);

/**
 * AuthProvider
 * ────────────
 * Envuelve la aplicación y provee:
 *   - usuario      : { id, email, rol, exp, ... } | null
 *   - isLoggedIn   : boolean
 *   - isVendedor   : boolean
 *   - login(token) : guarda token y actualiza estado
 *   - logout()     : borra token y limpia estado
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() =>
    authService.isLoggedIn() ? authService.getUsuario() : null
  );

  // Re-sincroniza si el token expira mientras el tab está abierto
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      setUsuario(null);
    }
  }, []);

  /**
   * Guarda el token recibido del backend y actualiza el estado global.
   * @param {string} token - JWT retornado por /api/auth/login
   */
  const login = useCallback((token) => {
    authService.setToken(token);
    setUsuario(authService.getUsuario());
  }, []);

  /** Elimina el token y limpia el estado */
  const logout = useCallback(() => {
    authService.logout();
    setUsuario(null);
  }, []);

  /** Actualiza el usuario en base a un nuevo token (sin cerrar sesión) */
  const updateUsuario = useCallback((token) => {
    authService.setToken(token);
    setUsuario(authService.getUsuario());
  }, []);

  const isLoggedIn = !!usuario && authService.isLoggedIn();
  const isVendedor = isLoggedIn && usuario?.rol === "vendedor";

  return (
    <AuthContext.Provider value={{ usuario, isLoggedIn, isVendedor, login, logout, updateUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook de acceso al contexto de autenticación.
 * @returns {{ usuario, isLoggedIn, isVendedor, login, logout }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}

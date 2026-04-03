const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─────────────────────────────────────────────────────
// Helpers de token (localStorage)
// ─────────────────────────────────────────────────────

/** Guarda el JWT en localStorage */
const setToken = (token) => localStorage.setItem("tc_token", token);

/** Obtiene el JWT de localStorage */
const getToken = () => localStorage.getItem("tc_token");

/** Elimina el JWT de localStorage */
const removeToken = () => localStorage.removeItem("tc_token");

/**
 * Decodifica el payload del JWT sin validar firma
 * (la validación real la hace el backend en cada petición)
 * @returns {object|null}
 */
const getUsuario = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/** Verifica si hay un token válido (no expirado) */
const isLoggedIn = () => {
  const usuario = getUsuario();
  if (!usuario) return false;
  // exp está en segundos, Date.now() en ms
  return usuario.exp * 1000 > Date.now();
};

/**
 * Retorna los headers de Authorization para peticiones protegidas.
 * @returns {{ Authorization: string, "Content-Type": string }}
 */
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ─────────────────────────────────────────────────────
// API calls
// ─────────────────────────────────────────────────────

/**
 * Servicio para manejar todas las llamadas a la API relacionadas
 * con Autenticación, Sesiones y Control de Acceso (JWT + Roles).
 */
export const authService = {
  // ── Helpers de sesión (exportados para uso en contexto/components) ──
  setToken,
  getToken,
  removeToken,
  getUsuario,
  isLoggedIn,
  getAuthHeaders,

  /** Cierra sesión: elimina el token */
  logout: () => removeToken(),

  // ── Llamadas a la API ──────────────────────────────────────────────

  /**
   * Iniciar sesión. Retorna { ok, mensaje, data: { token, usuario } }
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  /**
   * Registrar un nuevo usuario.
   * @param {string} nombre
   * @param {string} email
   * @param {string} password
   * @param {'comprador'|'vendedor'} rol
   */
  register: async (nombre, email, password, rol = "comprador") => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, rol }),
      });
      return await res.json();
    } catch (error) {
      console.error("Error en register:", error);
      throw error;
    }
  },

  /**
   * Obtener datos del usuario autenticado (ruta protegida).
   * Requiere token válido.
   */
  me: async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (error) {
      console.error("Error en /me:", error);
      throw error;
    }
  },

  /**
   * Solicitar correo de restablecimiento de contraseña.
   * @param {string} email
   */
  forgotPassword: async (email) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (error) {
      console.error("Error en forgotPassword:", error);
      throw error;
    }
  },

  /**
   * Restablecer la contraseña con un token de recuperación.
   * @param {string} token - Token de recuperación de URL
   * @param {string} newPassword - Nueva contraseña
   */
  resetPassword: async (token, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      return await res.json();
    } catch (error) {
      console.error("Error en resetPassword:", error);
      throw error;
    }
  },

  /**
   * Verificar código 2FA de un usuario.
   * @param {string} email
   * @param {string} code
   */
  verify2FA: async (email, code) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      return await res.json();
    } catch (error) {
      console.error("Error en verify2FA:", error);
      throw error;
    }
  },
};

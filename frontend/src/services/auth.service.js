const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Servicio para manejar todas las llamadas a la API relacionadas con la Autenticación y Seguridad.
 */
export const authService = {
  /**
   * Iniciar sesión de un usuario.
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
      console.error("Objeto error devuelto por el navegador en login:", error);
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
      console.error("Objeto error devuelto por el navegador en forgotPassword:", error);
      throw error;
    }
  },

  /**
   * Restablecer la contraseña con un token de seguridad.
   * @param {string} token - Token de recuperación proporcionado vía URL
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
      console.error("Objeto error devuelto por el navegador en resetPassword:", error);
      throw error;
    }
  },

  /**
   * Registrar un nuevo usuario (Endpoint futuro/Pendiente backend).
   * @param {string} email 
   * @param {string} password 
   */
  register: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (error) {
      console.error("Objeto error devuelto por el navegador en register:", error);
      throw error;
    }
  }
};

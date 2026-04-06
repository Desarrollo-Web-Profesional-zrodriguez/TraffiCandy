const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Servicio para manejar todas las peticiones relacionadas con los Dulces (Productos).
 * Actúa como una capa intermedia entre el frontend y el backend.
 */
export const dulcesService = {
  /**
   * Obtiene la colección completa de dulces desde el servidor.
   * @returns {Promise<Array>} Un arreglo de objetos Dulce.
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}api/productos`, {
        method: 'GET', // o el método que uses
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420' // ⚡ ESTA LÍNEA ES LA MAGIA
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Error en dulcesService.getAll:", error);
      throw error;
    }
  },

  /**
   * Obtiene un solo dulce por su ID.
   * @param {string} id - El ID del dulce en MongoDB.
   * @returns {Promise<Object>} Un objeto Dulce.
   */
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/productos/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error(`Error en dulcesService.getById(${id}):`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo dulce en la base de datos.
   * @param {Object} dulceData - Datos del formulario.
   * @returns {Promise<Object>} Respuesta del servidor.
   */
  createDulce: async (dulceData) => {
    try {
      const token = localStorage.getItem("tc_token");
      const response = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(dulceData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || 'Error al crear el dulce');
      }
      return await response.json();
    } catch (error) {
      console.error("Error en createDulce:", error);
      throw error;
    }
  },

  /**
   * Actualiza un dulce existente.
   * @param {string} id - ID del dulce a editar.
   * @param {Object} dulceData - Datos actualizados del formulario.
   * @returns {Promise<Object>} Respuesta del servidor.
   */
  updateDulce: async (id, dulceData) => {
    try {
      const token = localStorage.getItem("tc_token");
      const response = await fetch(`${API_URL}/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(dulceData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || 'Error al actualizar el dulce');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en updateDulce(${id}):`, error);
      throw error;
    }
  }
};

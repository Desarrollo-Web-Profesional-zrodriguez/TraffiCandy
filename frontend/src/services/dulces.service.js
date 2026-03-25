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
      const response = await fetch(`${API_URL}/api/productos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
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
      return await response.json();
    } catch (error) {
      console.error(`Error en dulcesService.getById(${id}):`, error);
      throw error;
    }
  }
};

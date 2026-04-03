import { useState, useEffect } from 'react';
import fallbackImage from '../assets/404.png';
import { dulcesService } from '../services/dulces.service';

/**
 * Hook personalizado para manejar el estado y la carga de los dulces en la UI.
 * Expone un arreglo plano de productos.
 */
export const useDulces = () => {
  const [dulces, setDulces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchDulces = async () => {
      setLoading(true);
      try {
        const data = await dulcesService.getAll();
        if (mounted) {
          setDulces(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDulces();

    return () => {
      mounted = false; // Cleanup para evitar state updates si el componente se desmonta antes
    };
  }, []);

  return { dulces, loading, error };
};

export const normalizeStateName = (str) => {
  if (!str) return "";
  let s = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  
  if (s === "ciudad de mexico" || s === "distrito federal" || s === "cdmx") return "cdmx";
  if (s === "estado de mexico" || s === "mexico" || s === "edomex") return "edomex";
  if (s.includes("coahuila")) return "coahuila";
  if (s.includes("michoacan")) return "michoacan";
  if (s.includes("veracruz")) return "veracruz";
  
  return s;
};

/**
 * Hook personalizado para cargar dulces y formatearlos/agruparlos por Estado
 * de la República (para CandyMap).
 */
export const useMapDulces = () => {
  const { dulces, loading, error } = useDulces();
  const [mapData, setMapData] = useState({});

  useEffect(() => {
    if (dulces.length > 0) {
      const groupedData = {};
      dulces.forEach((dulce) => {
        if (!dulce.estadoOrigen) return;
        
        const normKey = normalizeStateName(dulce.estadoOrigen);
        if (!groupedData[normKey]) {
          groupedData[normKey] = [];
        }
        
        groupedData[normKey].push({
          stateName: dulce.estadoOrigen,
          candyName: dulce.nombre,
          history: dulce.descripcion_es || "Información histórica no disponible aún.",
          preparation: `Nivel de picor: ${dulce.nivelPicor || 0}/5. Alérgenos: ${(dulce.alergenos && dulce.alergenos.length) ? dulce.alergenos.join(', ') : 'Ninguno'}.`,
          image: (dulce.imagenes && dulce.imagenes.length) ? dulce.imagenes[0] : fallbackImage,
          emoji: dulce.emoji,
          precio: dulce.precioBase
        });
      });
      setMapData(groupedData);
    }
  }, [dulces]);

  return { mapData, loading, error };
};

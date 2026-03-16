import { useState, useEffect } from 'react';
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
        
        if (!groupedData[dulce.estadoOrigen]) {
          groupedData[dulce.estadoOrigen] = [];
        }
        
        groupedData[dulce.estadoOrigen].push({
          stateName: dulce.estadoOrigen,
          candyName: dulce.nombre,
          history: dulce.descripcion_es,
          preparation: `Nivel de picor: ${dulce.nivelPicor}/5. Alérgenos: ${dulce.alergenos.length ? dulce.alergenos.join(', ') : 'Ninguno'}.`,
          image: dulce.imagenes?.length ? dulce.imagenes[0] : "https://images.unsplash.com/photo-1550143891-fc5ebc0f70ee?auto=format&fit=crop&q=80&w=600",
          emoji: dulce.emoji,
          precio: dulce.precioBase
        });
      });
      setMapData(groupedData);
    }
  }, [dulces]);

  return { mapData, loading, error };
};

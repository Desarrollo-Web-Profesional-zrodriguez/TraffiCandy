import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import CandyInfoPanel from './CandyInfoPanel';
import { useMapDulces, normalizeStateName } from '../../hooks/useDulces';

// Usaremos el Objeto directamente para que Vite lo incruste en el JS (evitando Fetch/CORS en Railway)
import geoData from '../../assets/mexico-states.json';
import fallbackImage from '../../assets/404.png';

const CandyMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const { mapData: dbSweetsData } = useMapDulces();

  const handleStateClick = (geo) => {
    const stateName = geo.properties.state_name;
    const normKey = normalizeStateName(stateName);
    const data = dbSweetsData[normKey] || [{
      stateName: stateName,
      candyName: "Dulce típico en investigación",
      history: "Pronto se agregará la historia de esta región...",
      preparation: "Información de preparación en construcción.",
      image: fallbackImage
    }];
    setSelectedState({ data, id: geo.rsmKey });
  };

  const mapProjectionConfig = {
    scale: 1400, // Zoom out/in para encajar México 
    center: [-102, 24] // Coordenadas centrales aprox de México
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-900 overflow-hidden flex flex-col md:flex-row items-center justify-center p-4">
      
      {/* Orbs decorativos de fondo */}
      <div className="absolute opacity-10 blur-3xl rounded-full bg-pink-600 w-96 h-96 top-10 left-10 pointer-events-none"></div>
      <div className="absolute opacity-10 blur-3xl rounded-full bg-indigo-600 w-96 h-96 bottom-10 right-10 pointer-events-none"></div>

      {/* Contenedor del Mapa SVG */}
      <div className="w-full md:w-2/3 h-[60vh] md:h-[80vh] z-20 transition-transform duration-700 relative">
        
        {/* Leyenda del Mapa */}
        <div className="absolute bottom-0 left-0 md:bottom-4 md:left-4 z-30 bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl border border-gray-700/50 shadow-xl pointer-events-none">
          <h4 className="text-white text-sm font-bold mb-3 uppercase tracking-wider">Leyenda</h4>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full bg-[#4C1D95] border border-[#6D28D9]"></div>
            <span className="text-gray-300 text-xs font-medium">1 Dulce Típico</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full bg-[#BE185D] shadow-[0_0_10px_rgba(190,24,93,0.5)] border border-pink-500"></div>
            <span className="text-pink-300 text-xs font-bold">Múltiples Dulces</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#1F2937] border border-[#374151]"></div>
            <span className="text-gray-500 text-xs">Próximamente</span>
          </div>
        </div>

        <ComposableMap projection="geoMercator" projectionConfig={mapProjectionConfig} className="w-full h-full drop-shadow-2xl">
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHovered = hoveredState === geo.rsmKey;
                const isSelected = selectedState && selectedState.id === geo.rsmKey;
                const normKey = normalizeStateName(geo.properties.state_name);
                const stateData = dbSweetsData[normKey];
                const hasData = !!stateData;
                const isMultiple = Array.isArray(stateData) && stateData.length > 1;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredState(geo.rsmKey)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(geo)}
                    style={{
                      default: {
                        fill: isMultiple ? "#BE185D" : (hasData ? "#4C1D95" : "#1F2937"), // Destacar multiples vs unicos
                        stroke: "#6D28D9",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "all 250ms"
                      },
                      hover: {
                        fill: isMultiple ? "#F472B6" : "#D946EF", // Fucsia/Rosa vibrante on hover
                        stroke: "#FDF4FF",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 250ms"
                      },
                      pressed: {
                        fill: "#F472B6",
                        outline: "none"
                      }
                    }}
                    fillOpacity={isSelected ? 1 : isHovered ? 0.9 : 0.7}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Info Panel Flotante a la Derecha o Abaixo */}
      <div className={`w-full md:w-1/3 z-30 transition-all duration-500 transform ${selectedState ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0 absolute right-0'}`}>
        {selectedState && (
          <CandyInfoPanel 
             data={selectedState.data} 
             onClose={() => setSelectedState(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CandyMap;

import React, { useState, useEffect } from 'react';

const CandyInfoPanel = ({ data, onClose }) => {
  if (!data) return null;

  // Si data es un array de objetos o si tiene fallbacks estructurados
  const isMultiple = Array.isArray(data) && data.length > 1;
  const candies = Array.isArray(data) ? data : [data];

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reiniciar la selección cada vez que cambia el estado seleccionado
  useEffect(() => {
    setSelectedIndex(0);
  }, [data]);

  const currentCandy = candies[selectedIndex];

  return (
    <div className="relative mx-4 md:mr-8 p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-gray-900/60 border border-gray-700/50 shadow-[0_8px_32px_0_rgba(236,72,153,0.15)] overflow-hidden group">
      {/* Botón de Cierre */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center transition-all z-20"
      >
        ✕
      </button>

      {/* Si hay múltiples dulces, mostrar mini-selector */}
      {isMultiple && (
        <div className="mb-4">
          <h3 className="text-pink-400 font-semibold text-sm mb-2">Selecciona un dulce típico de {currentCandy.stateName}:</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-transparent">
            {candies.map((candy, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedIndex === index 
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/40' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {candy.candyName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden mb-6 shadow-inner shrink-0 lg:mt-2">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
        <img 
          src={currentCandy.image} 
          alt={currentCandy.candyName} 
          className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-3 py-1 bg-pink-600/80 backdrop-blur-sm text-xs font-semibold tracking-wider text-pink-100 rounded-full uppercase">
            {currentCandy.stateName}
          </span>
        </div>
      </div>

      {/* Contenido de Texto */}
      <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <h2 className="text-xl md:text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          {currentCandy.emoji} {currentCandy.candyName}
        </h2>
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">📚 Historia</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{currentCandy.history}</p>
        </div>
        
        <div className="space-y-2 pt-2 border-t border-gray-700/50">
          <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">👨‍🍳 Preparación</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{currentCandy.preparation}</p>
        </div>
      </div>
      
      {/* Botón Decorativo Futuro */}
      <button className="w-full mt-6 py-3 px-4 flex justify-between items-center bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-pink-500/30 transition-all transform hover:-translate-y-1">
         <span>Pedir Ahora</span>
         {currentCandy.precio && <span className="font-bold bg-white/20 px-2 py-1 rounded-lg text-sm">${currentCandy.precio} MXN</span>}
      </button>
    </div>
  );
};

export default CandyInfoPanel;

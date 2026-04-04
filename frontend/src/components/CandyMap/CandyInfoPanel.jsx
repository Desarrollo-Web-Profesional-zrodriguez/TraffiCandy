import { useState, useEffect } from 'react';

const CandyInfoPanel = ({ data, onClose }) => {
  if (!data) return null;

  const candies = Array.isArray(data) ? data : [data];
  const isMultiple = candies.length > 1;
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [data]);

  const candy = candies[selectedIndex];

  return (
    <div className="relative mx-4 md:mr-8 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0f0020]/80 backdrop-blur-2xl">

      {/* Header con imagen */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={candy.image}
          alt={candy.candyName}
          className="w-full h-full object-cover"
        />
        {/* Gradiente sobre imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0020] via-[#0f0020]/40 to-transparent" />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20
                     text-white/70 hover:text-white hover:bg-[#FF006E] transition-all flex items-center justify-center text-sm"
        >
          ✕
        </button>

        {/* Badge estado */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#FF006E]/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
            📍 {candy.stateName}
          </span>
        </div>
      </div>

      {/* Selector si hay múltiples dulces */}
      {isMultiple && (
        <div className="px-5 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-bold">Dulces típicos del estado</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {candies.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                  ${selectedIndex === i
                    ? 'bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white shadow-lg'
                    : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                  }`}
              >
                {c.emoji} {c.candyName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="px-5 py-4 space-y-4 max-h-[38vh] overflow-y-auto">

        {/* Nombre */}
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FFD60A]">
          {candy.emoji} {candy.candyName}
        </h2>

        {/* Historia */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider">📚 Historia</p>
          <p className="text-white/80 text-sm leading-relaxed">{candy.history}</p>
        </div>

        {/* Preparación */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider">👨‍🍳 Preparación</p>
          <p className="text-white/80 text-sm leading-relaxed">{candy.preparation}</p>
        </div>

      </div>

      {/* Footer con botón */}
      <div className="px-5 pb-5 pt-2">
        <button className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#FF006E] to-[#FB5607]
                           text-white font-bold text-sm flex items-center justify-between
                           shadow-lg shadow-[#FF006E]/30 hover:scale-[1.02] hover:shadow-[#FF006E]/50
                           active:scale-[0.98] transition-all duration-200">
          <span>🛒 Pedir Ahora</span>
          {candy.precio && (
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl font-black">
              ${candy.precio} MXN
            </span>
          )}
        </button>
      </div>

    </div>
  );
};

export default CandyInfoPanel;
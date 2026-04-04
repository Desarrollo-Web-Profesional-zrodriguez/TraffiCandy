import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CandyInfoPanel = ({ data, onClose }) => {
  if (!data) return null;

  const candies = Array.isArray(data) ? data : [data];
  const isMultiple = candies.length > 1;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cantidad, setCantidad] = useState(1)
  const [showCantidad, setShowCantidad] = useState(false)
  const { agregarAlCarrito } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    setSelectedIndex(0);
    setShowCantidad(false)
    setCantidad(1)
  }, [data]);

  const candy = candies[selectedIndex];

  const handleAgregar = () => {
    // Adaptamos los campos del mapa al formato del CartContext
    const productoAdaptado = {
      _id: candy.candyName, // usamos el nombre como ID único
      nombre: candy.candyName,
      precioBase: candy.precio || 0,
      imagenes: [candy.image],
      emoji: candy.emoji || '🍬',
      cantidad: 0, // lo maneja el CartContext
    }
    agregarAlCarrito(productoAdaptado, cantidad)
    toast.success(`${cantidad}x ${candy.candyName} agregado al carrito 🍬`)
    setShowCantidad(false)
    setCantidad(1)
  }

  return (
    <div className="relative mx-4 md:mr-8 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0f0020]/80 backdrop-blur-2xl">

      {/* Header con imagen */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={candy.image}
          alt={candy.candyName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0020] via-[#0f0020]/40 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20
                     text-white/70 hover:text-white hover:bg-[#FF006E] transition-all flex items-center justify-center text-sm"
        >
          ✕
        </button>

        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#FF006E]/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
            📍 {candy.stateName}
          </span>
        </div>
      </div>

      {/* Selector múltiples dulces */}
      {isMultiple && (
        <div className="px-5 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-bold">Dulces típicos del estado</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {candies.map((c, i) => (
              <button
                key={i}
                onClick={() => { setSelectedIndex(i); setShowCantidad(false); setCantidad(1) }}
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
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FFD60A]">
          {candy.emoji} {candy.candyName}
        </h2>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider">📚 Historia</p>
          <p className="text-white/80 text-sm leading-relaxed">{candy.history}</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider">👨‍🍳 Preparación</p>
          <p className="text-white/80 text-sm leading-relaxed">{candy.preparation}</p>
        </div>
      </div>

      {/* Selector de cantidad */}
      {showCantidad && (
        <div className="px-5 pb-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">¿Cuántos quieres?</p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <button
                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                className="w-9 h-9 rounded-full bg-white/10 text-white font-black text-xl hover:bg-white/20 transition-all"
              >−</button>
              <span className="text-white font-black text-3xl w-12 text-center">{cantidad}</span>
              <button
                onClick={() => setCantidad(c => c + 1)}
                className="w-9 h-9 rounded-full bg-white/10 text-white font-black text-xl hover:bg-white/20 transition-all"
              >+</button>
            </div>
            {candy.precio && (
              <p className="text-[#FFD60A] font-bold text-center text-sm">
                Subtotal: ${(candy.precio * cantidad).toFixed(2)} MXN
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { handleAgregar() }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white font-bold text-sm hover:scale-105 transition-all"
              >
                Agregar 🛒
              </button>
              <button
                onClick={() => { handleAgregar(); navigate('/checkout') }}
                className="flex-1 py-2 rounded-xl border border-[#FF006E]/40 text-[#FF006E] font-bold text-sm hover:bg-[#FF006E]/10 transition-all"
              >
                Ir al Checkout →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 pb-5 pt-2">
        <button
          onClick={() => setShowCantidad(!showCantidad)}
          className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#FF006E] to-[#FB5607]
                     text-white font-bold text-sm flex items-center justify-between
                     shadow-lg shadow-[#FF006E]/30 hover:scale-[1.02] hover:shadow-[#FF006E]/50
                     active:scale-[0.98] transition-all duration-200"
        >
          <span>{showCantidad ? '✕ Cancelar' : '🛒 Pedir Ahora'}</span>
          {candy.precio && !showCantidad && (
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
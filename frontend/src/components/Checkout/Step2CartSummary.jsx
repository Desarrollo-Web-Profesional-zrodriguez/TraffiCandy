import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { dulcesService } from '../../services/dulces.service'

export default function Step2CartSummary({ onTotalChange }) {
  const { carrito, eliminarDelCarrito, total } = useCart()
  const [promos, setPromos] = useState([])
  const [promoSeleccionada, setPromoSeleccionada] = useState(null)

  useEffect(() => {
    dulcesService.getAll().then(productos => {
      const shuffled = [...productos].sort(() => Math.random() - 0.5)
      setPromos([
        {
          id: 'promo20',
          label: 'Pack 20 Dulces Sorpresa 🎲',
          items: shuffled.slice(0, 20),
          precio: shuffled.slice(0, 20).reduce((a, p) => a + p.precioBase, 0) * 0.85
        },
        {
          id: 'promo40',
          label: 'Pack 40 Dulces Sorpresa 🎁',
          items: shuffled.slice(0, 40),
          precio: shuffled.slice(0, 40).reduce((a, p) => a + p.precioBase, 0) * 0.80
        },
      ])
    })
  }, [])

  const totalFinal = total + (promoSeleccionada?.precio || 0)

  useEffect(() => {
    onTotalChange(totalFinal)
  }, [totalFinal])

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6 text-center">🛒 Paso 2: Tu Caja de Dulces</h2>

      <div className="space-y-4 bg-black/20 p-6 rounded-3xl border border-white/10">

        {carrito.length === 0 ? (
          <p className="text-white/40 text-center py-8">Tu carrito está vacío 🍬</p>
        ) : (
          carrito.map(item => (
            <div key={item._id} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#FF006E] to-purple-600 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                {item.imagenes?.[0]
                  ? <img src={item.imagenes[0]} alt={item.nombre} className="w-full h-full object-cover" />
                  : item.emoji || '🍬'
                }
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold">{item.nombre}</h4>
                <p className="text-white/50 text-sm">Cantidad: {item.cantidad} × ${item.precioBase.toFixed(2)}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="text-[#FF006E] font-black text-lg">${(item.precioBase * item.cantidad).toFixed(2)}</p>
                <button onClick={() => eliminarDelCarrito(item._id)} className="text-white/30 hover:text-red-400 text-xs transition-colors">✕ Quitar</button>
              </div>
            </div>
          ))
        )}

        {/* Promociones */}
        {promos.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <h3 className="text-[#FFD60A] font-black text-sm uppercase tracking-wider mb-3">🔥 Promociones Especiales</h3>
            {promos.map(promo => {
              const seleccionada = promoSeleccionada?.id === promo.id
              return (
                <div
                  key={promo.id}
                  onClick={() => setPromoSeleccionada(seleccionada ? null : promo)}
                  className={`flex items-center justify-between p-4 rounded-2xl mb-3 cursor-pointer transition-all border
                    ${seleccionada
                      ? 'bg-[#FFD60A]/20 border-[#FFD60A]/60 scale-[1.02]'
                      : 'bg-white/5 border-[#FFD60A]/20 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${seleccionada ? 'border-[#FFD60A] bg-[#FFD60A]' : 'border-white/30'}`}>
                      {seleccionada && <span className="text-black text-xs font-black">✓</span>}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{promo.label}</p>
                      <p className="text-white/40 text-xs">{promo.items.length} dulces aleatorios con descuento</p>
                    </div>
                  </div>
                  <span className="text-[#FFD60A] font-black">${promo.precio.toFixed(2)}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Totales */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center px-4 mb-2">
            <span className="text-white/70">Subtotal carrito</span>
            <span className="text-white font-bold">${total.toFixed(2)} USD</span>
          </div>
          {promoSeleccionada && (
            <div className="flex justify-between items-center px-4 mb-2">
              <span className="text-[#FFD60A]/80 text-sm">+ {promoSeleccionada.label}</span>
              <span className="text-[#FFD60A] font-bold">+${promoSeleccionada.precio.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center px-4 mb-4">
            <span className="text-white/70">Envío</span>
            <span className="text-[#00F5D4] font-bold">¡GRATUITO!</span>
          </div>
          <div className="flex justify-between items-center px-4 bg-white/5 py-4 rounded-xl">
            <span className="text-white font-black text-xl">TOTAL</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] font-black text-4xl">
              ${totalFinal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
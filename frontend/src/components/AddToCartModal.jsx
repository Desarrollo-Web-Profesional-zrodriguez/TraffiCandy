import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AddToCartModal({ producto, onClose }) {
  const [cantidad, setCantidad] = useState(1)
  const { agregarAlCarrito } = useCart()
  const navigate = useNavigate()

  const handleAgregar = () => {
    if (cantidad < 1 || cantidad > producto.stock) {
      toast.error(`Cantidad inválida. Stock disponible: ${producto.stock}`)
      return
    }
    agregarAlCarrito(producto, cantidad)
    toast.success(`${cantidad}x ${producto.nombre} agregado al carrito 🍬`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-[#1a0533] p-6 shadow-2xl">
        
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{producto.emoji || '🍬'}</span>
          <div>
            <h3 className="text-white font-black text-lg">{producto.nombre}</h3>
            <p className="text-white/50 text-sm">${producto.precioBase.toFixed(2)} MXN c/u</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-white/70 text-sm font-bold uppercase tracking-wider mb-3 block">
            Cantidad (Stock: {producto.stock})
          </label>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => setCantidad(c => Math.max(1, c - 1))}
              className="w-10 h-10 rounded-full bg-white/10 text-white font-black text-xl hover:bg-white/20 transition-all"
            >−</button>
            <span className="text-white font-black text-3xl w-16 text-center">{cantidad}</span>
            <button
              onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))}
              className="w-10 h-10 rounded-full bg-white/10 text-white font-black text-xl hover:bg-white/20 transition-all"
            >+</button>
          </div>
          <p className="text-[#FFD60A] font-bold text-center mt-3">
            Subtotal: ${(producto.precioBase * cantidad).toFixed(2)} MXN
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 font-bold hover:bg-white/10 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleAgregar}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white font-bold hover:scale-105 transition-all"
          >
            Agregar 🛒
          </button>
        </div>

        <button
          onClick={() => { handleAgregar(); navigate('/checkout') }}
          className="w-full mt-3 py-3 rounded-xl border border-[#FF006E]/40 text-[#FF006E] font-bold hover:bg-[#FF006E]/10 transition-all text-sm"
        >
          Agregar e ir al Checkout →
        </button>
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import AddToCartModal from '../components/AddToCartModal'
import DulceBot from '../components/DulceBot/DulceBot'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function ProductoDetalle() {
  const { slug } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
  fetch(`${API_URL}/productos/${slug}`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(res => { setProducto(res.data); setLoading(false) }) // ← res.data
    .catch(() => { setError('Producto no encontrado'); setLoading(false) })
  }, [slug])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <p className="text-white/60 text-lg animate-pulse">Cargando producto...</p>
    </div>
  )

  if (error || !producto) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
      <span className="text-6xl mb-4">😕</span>
      <h1 className="text-3xl font-black mb-2">Producto no encontrado</h1>
      <Link to="/catalogo" className="text-[#FFD60A] hover:underline mt-2">← Volver al Catálogo</Link>
    </div>
  )

  const saboresActivos = producto.flavorTags || []

  const CATEGORIAS_CONFIG = {
    picante:     { color: 'from-[#FF006E] to-[#FB5607]' },
    dulce:       { color: 'from-[#FFD60A] to-[#FB5607]' },
    agridulce:   { color: 'from-[#8338EC] to-[#3A86FF]' },
    tradicional: { color: 'from-[#06D6A0] to-[#118AB2]' },
    otro:        { color: 'from-[#FF006E] to-[#8338EC]' },
  }
  
  const themeColor = CATEGORIAS_CONFIG[producto.categoria]?.color || 'from-gray-600 to-gray-800'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6 pb-2"><Breadcrumb /></div>

      <article className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
        {/* Header */}
        <div className={`bg-gradient-to-r ${themeColor} flex flex-col items-center`}>
          {producto.imagenes && producto.imagenes.length > 0 ? (
            <div className="w-full h-64 overflow-hidden">
              <img
                src={producto.imagenes[0]}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="text-8xl drop-shadow-lg py-10" role="img" aria-label={producto.nombre}>
              {producto.emoji || '🍬'}
            </span>
          )}
          <div className="p-6 flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-black text-white text-center drop-shadow">
              {producto.nombre}
            </h1>
            <span className="mt-3 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-white">
              ${(producto.precioBase || 0).toFixed(2)} MXN
            </span>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-[#FFD60A] mb-2">Descripción</h2>
            <p className="text-white/80 leading-relaxed">{producto.descripcion_es}</p>

            {/* Sabores */}
            {saboresActivos.length > 0 && (
              <div className="mt-5">
                <h2 className="text-lg font-bold text-[#FFD60A] mb-2">Sabores</h2>
                <div className="flex flex-wrap gap-2">
                  {saboresActivos.map(s => (
                    <span key={s} className={`rounded-full bg-white/20 border border-white/10 px-3 py-1 text-xs font-bold text-white capitalize`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {[
              { label: '⚖️ Peso',       value: `${producto.pesoGramos}g` },
              { label: '📍 Origen',     value: producto.estadoOrigen },
              { label: '🔥 Picor',      value: `${producto.nivelPicor}/5` },
              { label: '🏷️ Categoría', value: producto.categoria.replace('_', ' ') },
              { label: '📦 Stock',      value: `${producto.stock} unidades` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <span className="text-white/60 text-sm">{label}</span>
                <span className="text-white font-semibold text-sm capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex gap-3">
          <Link to="/catalogo" className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white">
            ← Volver al Catálogo
          </Link>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={`rounded-full bg-gradient-to-r ${themeColor} px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95`}
          >
            Agregar al pedido 🛒
          </button>

          {showModal && <AddToCartModal producto={producto} onClose={() => setShowModal(false)} />}
        </div>
      </article>
      <DulceBot />
    </div>
  )
}
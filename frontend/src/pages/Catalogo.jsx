import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const CATEGORIAS_CONFIG = {
  picante:     { titulo: 'Dulces Picantes',   emoji: '🌶️', color: 'from-[#FF006E] to-[#FB5607]' },
  dulce:       { titulo: 'Dulces Clásicos',   emoji: '🍬', color: 'from-[#FFD60A] to-[#FB5607]' },
  agridulce:   { titulo: 'Agridulces',        emoji: '🌀', color: 'from-[#8338EC] to-[#3A86FF]' },
  tradicional: { titulo: 'Dulces Típicos',    emoji: '🍮', color: 'from-[#06D6A0] to-[#118AB2]' },
  otro:        { titulo: 'Otras Variedades',  emoji: '🍭', color: 'from-[#FF006E] to-[#8338EC]' },
}
import { dulcesService } from '../services/dulces.service'

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    dulcesService.getAll()
      .then(data => { setProductos(data); setLoading(false) })
      .catch(() => { setError('Error al cargar productos'); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <p className="text-white/60 text-lg animate-pulse">Cargando catálogo... 🍭</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <p className="text-red-400 text-lg">{error}</p>
    </div>
  )

  // Fallback para mapear dulces viejos de MongoDB al nuevo esquema
  const normalizeCategoria = (cat) => {
    switch (cat) {
      case 'botanas': return 'otro';
      case 'dulces_confitados': return 'dulce';
      case 'dulces_tipicos': return 'tradicional';
      default: return cat;
    }
  };

  const categorias = Object.entries(CATEGORIAS_CONFIG).map(([slug, config]) => ({
    slug,
    ...config,
    productos: productos.filter(p => normalizeCategoria(p.categoria) === slug),
  }))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6 pb-2"><Breadcrumb /></div>

      <header className="mt-6 mb-10 text-center">
        <span className="text-6xl" role="img" aria-label="catálogo">🍭</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-3">
          Catálogo de{' '}
          <span className="bg-gradient-to-r from-[#FF006E] to-[#FFD60A] bg-clip-text text-transparent">
            Productos
          </span>
        </h1>
        <p className="text-white/60 mt-2 text-base">
          Selecciona un producto para ver su detalle y despacharlo al mundo 🌍
        </p>
      </header>

      <div className="flex flex-col gap-12">
        {categorias.map(cat => (
          <section key={cat.slug} aria-labelledby={`cat-${cat.slug}`}>
            <div className="flex items-center gap-3 mb-5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-xl shadow-lg`}>
                {cat.emoji}
              </span>
              <h2 id={`cat-${cat.slug}`} className="text-xl font-black text-white tracking-wide">
                {cat.titulo}
              </h2>
              <div className="flex-1 h-px bg-white/10 rounded-full" />
            </div>

            {cat.productos.length === 0 ? (
              <p className="text-white/40 text-sm pl-2">Sin productos en esta categoría</p>
            ) : (
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.productos.map(p => (
                  <li key={p.slug}>
                    <Link
                      to={`/catalogo/${p.categoria}/${p.slug}`}
                      className="group flex flex-col rounded-2xl border border-white/10
                                 bg-white/5 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/20
                                 transition-all duration-300 hover:scale-[1.03] hover:border-white/25
                                 hover:shadow-2xl hover:shadow-[#FF006E]/10 active:scale-[0.98]"
                    >
                      <div className={`bg-gradient-to-br ${cat.color} h-48 flex items-center justify-center overflow-hidden`}>
                      {p.imagenes && p.imagenes.length > 0 ? (
                        <img
                          src={p.imagenes[0]}
                          alt={p.nombre}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-5xl transition-transform duration-300 group-hover:scale-110" role="img" aria-label={p.nombre}>
                          {p.emoji || '🍬'}
                        </span>
                      )}
                    </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-[#FFD60A] transition-colors duration-200">
                            {p.nombre}
                          </p>
                          <p className="text-white/50 text-xs mt-0.5">Ver detalle →</p>
                        </div>
                        <span className={`rounded-full bg-gradient-to-r ${cat.color} px-3 py-1 text-xs font-bold text-white shadow-sm`}>
                          ${(p.precioBase || 0).toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
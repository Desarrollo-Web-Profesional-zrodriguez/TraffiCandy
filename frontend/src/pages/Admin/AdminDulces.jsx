import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dulcesService } from '../../services/dulces.service'
import toast from 'react-hot-toast'

export default function AdminDulces() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    dulcesService.getAll()
      .then(data => { setProductos(data); setLoading(false) })
      .catch(() => { toast.error('Error al cargar dulces'); setLoading(false) })
  }, [])

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  const CATEGORIA_COLOR = {
    picante:     'from-[#FF006E] to-[#FB5607]',
    dulce:       'from-[#FFD60A] to-[#FB5607]',
    agridulce:   'from-[#8338EC] to-[#3A86FF]',
    tradicional: 'from-[#06D6A0] to-[#118AB2]',
    otro:        'from-[#FF006E] to-[#8338EC]',
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <p className="text-white/60 text-lg animate-pulse">Cargando dulces... 🍬</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
            Administrar Dulces
          </h1>
          <p className="text-white/50 mt-1">Selecciona un dulce para editarlo</p>
        </div>
        <button
          onClick={() => navigate('/admin/dulce/nuevo')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607]
                     text-white font-bold shadow-lg hover:scale-105 transition-all whitespace-nowrap"
        >
          + Nuevo Dulce
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                     placeholder-white/30 outline-none focus:border-[#FF006E] transition-all"
        />
      </div>

      {/* Lista de dulces */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">🍬</span>
          <p className="text-white/50 mt-4">No se encontraron dulces</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productosFiltrados.map(p => (
            <div
              key={p._id}
              onClick={() => navigate(`/admin/dulces/editar/${p._id}`)}
              className="group cursor-pointer flex flex-col rounded-2xl border border-white/10
                         bg-white/5 backdrop-blur-sm overflow-hidden shadow-lg
                         transition-all duration-300 hover:scale-[1.03] hover:border-[#FF006E]/50
                         hover:shadow-2xl hover:shadow-[#FF006E]/10 active:scale-[0.98]"
            >
              {/* Imagen o emoji */}
              <div className={`bg-gradient-to-br ${CATEGORIA_COLOR[p.categoria] || 'from-gray-600 to-gray-800'} h-40 flex items-center justify-center overflow-hidden`}>
                {p.imagenes && p.imagenes.length > 0 ? (
                  <img
                    src={p.imagenes[0]}
                    alt={p.nombre}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : null}
                <div className="hidden w-full h-full flex items-center justify-center">
                  <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
                    {p.emoji || '🍬'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm group-hover:text-[#FFD60A] transition-colors">
                    {p.nombre}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5 capitalize">{p.categoria}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full bg-gradient-to-r ${CATEGORIA_COLOR[p.categoria] || 'from-gray-600 to-gray-800'} px-3 py-1 text-xs font-bold text-white`}>
                    ${(p.precioBase || 0).toFixed(2)}
                  </span>
                  <span className="text-white/40 text-xs">✏️ Editar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
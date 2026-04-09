import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import DulceBot from '../components/DulceBot/DulceBot'
import { dulcesService } from '../services/dulces.service'
import logoTraficandy from '../assets/logo1.png';

const CATEGORIAS_CONFIG = {
  picante:     { titulo: 'Dulces Picantes',  emoji: '🌶️', color: 'from-[#FF006E] to-[#FB5607]' },
  dulce:       { titulo: 'Dulces Clásicos',  emoji: '🍬', color: 'from-[#FFD60A] to-[#FB5607]' },
  agridulce:   { titulo: 'Agridulces',       emoji: '🌀', color: 'from-[#8338EC] to-[#3A86FF]' },
  tradicional: { titulo: 'Dulces Típicos',   emoji: '🍮', color: 'from-[#06D6A0] to-[#118AB2]' },
  otro:        { titulo: 'Otras Variedades', emoji: '🍭', color: 'from-[#FF006E] to-[#8338EC]' },
}

const normalizeCategoria = (cat) => {
  switch (cat) {
    case 'botanas': return 'otro'
    case 'dulces_confitados': return 'dulce'
    case 'dulces_tipicos': return 'tradicional'
    default: return cat
  }
}

export default function Catalogo() {
  const [productos, setProductos]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  // Filtros
  const [categoriaFiltro, setCategoriaFiltro]   = useState('todas')
  const [ordenPrecio, setOrdenPrecio]           = useState('ninguno')
  const [precioMin, setPrecioMin]               = useState('')
  const [precioMax, setPrecioMax]               = useState('')
  const [origenFiltro, setOrigenFiltro]         = useState('todos')
  const [tagsSeleccionados, setTagsSeleccionados]       = useState([])
  const [alergenosExcluidos, setAlergenosExcluidos]     = useState([])

  useEffect(() => {
    dulcesService.getAll()
      .then(data => { setProductos(data); setLoading(false) })
      .catch(() => { setError('Error al cargar productos'); setLoading(false) })
  }, [])

  // Extraer tags, alergenos y orígenes únicos de la BD
  const todosLosTags = useMemo(() => {
    const tags = new Set()
    productos.forEach(p => p.flavorTags?.forEach(t => tags.add(t)))
    return [...tags]
  }, [productos])

  const todosLosAlergenos = useMemo(() => {
    const alergenos = new Set()
    productos.forEach(p => p.alergenos?.forEach(a => alergenos.add(a)))
    return [...alergenos]
  }, [productos])

  const todosLosOrigenes = useMemo(() => {
    const origenes = new Set()
    productos.forEach(p => { if (p.estadoOrigen) origenes.add(p.estadoOrigen) })
    return [...origenes].sort()
  }, [productos])

  // Aplicar todos los filtros
  const productosFiltrados = useMemo(() => {
    let resultado = [...productos]

    // Filtro por categoría
    if (categoriaFiltro !== 'todas') {
      resultado = resultado.filter(p => normalizeCategoria(p.categoria) === categoriaFiltro)
    }

    // Filtro por rango de precio
    if (precioMin !== '') {
      resultado = resultado.filter(p => p.precioBase >= parseFloat(precioMin))
    }
    if (precioMax !== '') {
      resultado = resultado.filter(p => p.precioBase <= parseFloat(precioMax))
    }

    // Filtro por origen
    if (origenFiltro !== 'todos') {
      resultado = resultado.filter(p => p.estadoOrigen === origenFiltro)
    }

    // Filtro por tags (mostrar solo los que tengan los tags marcados)
    if (tagsSeleccionados.length > 0) {
      resultado = resultado.filter(p =>
        tagsSeleccionados.every(tag => p.flavorTags?.includes(tag))
      )
    }

    // Filtro por alergenos (excluir los marcados)
    if (alergenosExcluidos.length > 0) {
      resultado = resultado.filter(p =>
        !alergenosExcluidos.some(a => p.alergenos?.includes(a))
      )
    }

    // Ordenar por precio
    if (ordenPrecio === 'mayor') {
      resultado.sort((a, b) => b.precioBase - a.precioBase)
    } else if (ordenPrecio === 'menor') {
      resultado.sort((a, b) => a.precioBase - b.precioBase)
    }

    return resultado
  }, [productos, categoriaFiltro, ordenPrecio, precioMin, precioMax, origenFiltro, tagsSeleccionados, alergenosExcluidos])

  const toggleTag = (tag) => {
    setTagsSeleccionados(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const toggleAlergeno = (alergeno) => {
    setAlergenosExcluidos(prev =>
      prev.includes(alergeno) ? prev.filter(a => a !== alergeno) : [...prev, alergeno]
    )
  }

  const limpiarFiltros = () => {
    setCategoriaFiltro('todas')
    setOrdenPrecio('ninguno')
    setPrecioMin('')
    setPrecioMax('')
    setOrigenFiltro('todos')
    setTagsSeleccionados([])
    setAlergenosExcluidos([])
  }

  const hayFiltrosActivos = categoriaFiltro !== 'todas' || ordenPrecio !== 'ninguno' ||
    precioMin !== '' || precioMax !== '' || origenFiltro !== 'todos' ||
    tagsSeleccionados.length > 0 || alergenosExcluidos.length > 0

  // Agrupar productos filtrados por categoría
  const categorias = Object.entries(CATEGORIAS_CONFIG).map(([slug, config]) => ({
    slug,
    ...config,
    productos: productosFiltrados.filter(p => normalizeCategoria(p.categoria) === slug),
  }))

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="pt-6 pb-2"><Breadcrumb /></div>

      <header className="mt-6 mb-10 text-center">
        <img src={logoTraficandy} alt="TraffiCandy" className="w-100 h-52 object-contain mx-auto mb-0" />
        <h1 className="text-4xl md:text-5xl font-black text-white mt-1">
          Catálogo de{' '}
          <span className="bg-gradient-to-r from-[#FF006E] to-[#FFD60A] bg-clip-text text-transparent">
            Productos
          </span>
        </h1>
        <p className="text-white/60 mt-2 text-base">
          Selecciona un producto para ver su detalle y despacharlo al mundo 🌍
        </p>
      </header>

      {/* ── Barra de Filtros ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-sm
              ${filtrosAbiertos
                ? 'bg-[#FF006E]/20 border-[#FF006E]/50 text-[#FF006E]'
                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
              }`}
          >
            🔍 Filtros
            {hayFiltrosActivos && (
              <span className="w-2 h-2 rounded-full bg-[#FF006E]" />
            )}
            <span>{filtrosAbiertos ? '▲' : '▼'}</span>
          </button>

          <div className="flex items-center gap-3">
            <p className="text-white/40 text-sm">
              {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
            </p>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-xs text-[#FF006E] hover:underline font-bold"
              >
                Limpiar filtros ✕
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros */}
        {filtrosAbiertos && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-5">

            {/* Fila 1: Categoría y Orden precio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">🏷️ Categoría</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoriaFiltro('todas')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                      ${categoriaFiltro === 'todas'
                        ? 'bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white border-transparent'
                        : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                      }`}
                  >
                    Todas
                  </button>
                  {Object.entries(CATEGORIAS_CONFIG).map(([slug, config]) => (
                    <button
                      key={slug}
                      onClick={() => setCategoriaFiltro(slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                        ${categoriaFiltro === slug
                          ? `bg-gradient-to-r ${config.color} text-white border-transparent`
                          : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                        }`}
                    >
                      {config.emoji} {config.titulo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">💰 Ordenar por precio</p>
                <div className="flex gap-2">
                  {[
                    { value: 'ninguno', label: 'Sin orden' },
                    { value: 'menor',  label: 'Menor → Mayor' },
                    { value: 'mayor',  label: 'Mayor → Menor' },
                  ].map(op => (
                    <button
                      key={op.value}
                      onClick={() => setOrdenPrecio(op.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                        ${ordenPrecio === op.value
                          ? 'bg-gradient-to-r from-[#FFD60A] to-[#FB5607] text-white border-transparent'
                          : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                        }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fila 2: Rango de precio y Origen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">📊 Rango de precio (MXN)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={precioMin}
                    onChange={e => setPrecioMin(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-[#FF006E] transition-all"
                  />
                  <span className="text-white/40 font-bold">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={precioMax}
                    onChange={e => setPrecioMax(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-[#FF006E] transition-all"
                  />
                </div>
              </div>

              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">📍 Lugar de origen</p>
                <select
                  value={origenFiltro}
                  onChange={e => setOrigenFiltro(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-[#FF006E] transition-all"
                >
                  <option value="todos">Todos los estados</option>
                  {todosLosOrigenes.map(origen => (
                    <option key={origen} value={origen}>{origen}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fila 3: Tags */}
            {todosLosTags.length > 0 && (
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">🏷️ Sabores / Tags <span className="text-white/30 normal-case">(mostrar solo los marcados)</span></p>
                <div className="flex flex-wrap gap-2">
                  {todosLosTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                        ${tagsSeleccionados.includes(tag)
                          ? 'bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white border-transparent shadow-lg'
                          : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fila 4: Alergenos */}
            {todosLosAlergenos.length > 0 && (
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">⚠️ Excluir alérgenos <span className="text-white/30 normal-case">(los marcados no aparecen)</span></p>
                <div className="flex flex-wrap gap-2">
                  {todosLosAlergenos.map(alergeno => (
                    <button
                      key={alergeno}
                      onClick={() => toggleAlergeno(alergeno)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                        ${alergenosExcluidos.includes(alergeno)
                          ? 'bg-red-500/30 text-red-300 border-red-500/50 shadow-lg'
                          : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                        }`}
                    >
                      ⚠️ {alergeno}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Grid de productos ── */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">🍬</span>
          <p className="text-white/50 mt-4 text-lg">No hay productos con estos filtros</p>
          <button onClick={limpiarFiltros} className="mt-4 px-6 py-2 rounded-xl bg-[#FF006E]/20 border border-[#FF006E]/40 text-[#FF006E] font-bold text-sm hover:bg-[#FF006E]/30 transition-all">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {categorias.map(cat => (
            cat.productos.length === 0 ? null : (
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
              </section>
            )
          ))}
        </div>
      )}

      <DulceBot />
    </div>
  )
}
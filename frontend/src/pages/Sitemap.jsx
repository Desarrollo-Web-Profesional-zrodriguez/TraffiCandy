import { Link } from 'react-router-dom'

const SECCIONES = [
  {
    titulo: '🏠 Páginas Principales',
    links: [
      { url: '/', label: 'Inicio', descripcion: 'Página principal con hero, carrusel y mapa de dulces' },
      { url: '/catalogo', label: 'Catálogo', descripcion: 'Catálogo completo de productos con filtros' },
      { url: '/mapa', label: 'Mapa de Dulces', descripcion: 'Mapa interactivo de dulces por estado de México' },
    ]
  },
  {
    titulo: '🔐 Autenticación',
    links: [
      { url: '/login', label: 'Login / Registro', descripcion: 'Inicio de sesión, registro y recuperación de contraseña' },
      { url: '/reset-password/:token', label: 'Restablecer Contraseña', descripcion: 'Página para crear una nueva contraseña mediante token' },
    ]
  },
  {
    titulo: '🍬 Productos',
    links: [
      { url: '/catalogo/:categoria/:slug', label: 'Detalle de Producto', descripcion: 'Vista detallada de un producto con descripción, sabores y stock' },
    ]
  },
  {
    titulo: '🛒 Compra',
    links: [
      { url: '/checkout', label: 'Checkout', descripcion: 'Flujo de compra en 3 pasos: envío, carrito y pago con PayPal' },
    ]
  },
  {
    titulo: '🏪 Administración (Solo Vendedores)',
    links: [
      { url: '/admin/dulces', label: 'Admin Dulces', descripcion: 'Lista de dulces para editar o gestionar' },
      { url: '/admin/dulces/nuevo', label: 'Nuevo Dulce', descripcion: 'Formulario para agregar un nuevo producto al catálogo' },
      { url: '/admin/dulces/editar/:id', label: 'Editar Dulce', descripcion: 'Formulario para modificar un producto existente' },
    ]
  },
  {
    titulo: '⚙️ Sistema',
    links: [
      { url: '/sitemap', label: 'Sitemap', descripcion: 'Mapa del sitio con todos los enlaces disponibles' },
      { url: '*', label: 'Página 404', descripcion: 'Página de error para rutas no encontradas' },
    ]
  }
]

export default function Sitemap() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="text-6xl mb-4 block">🗺️</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
          Mapa del{' '}
          <span className="bg-gradient-to-r from-[#FF006E] to-[#FFD60A] bg-clip-text text-transparent">
            Sitio
          </span>
        </h1>
        <p className="text-white/60 text-base">
          Todos los enlaces disponibles en TraffiCandy
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {SECCIONES.map((seccion) => (
          <div key={seccion.titulo} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            {/* Header sección */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <h2 className="text-white font-black text-lg">{seccion.titulo}</h2>
            </div>

            {/* Links */}
            <div className="divide-y divide-white/5">
              {seccion.links.map((link) => {
                const esEstatica = !link.url.includes(':') && link.url !== '*'
                return (
                  <div key={link.url} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {esEstatica ? (
                          <Link
                            to={link.url}
                            className="text-[#FF006E] font-bold text-sm hover:text-[#FFD60A] transition-colors"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <span className="text-white/70 font-bold text-sm">{link.label}</span>
                        )}
                        {!esEstatica && (
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-xs">dinámico</span>
                        )}
                        {link.url === '*' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">404</span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs">{link.descripcion}</p>
                    </div>
                    <code className="text-white/30 text-xs font-mono bg-white/5 px-3 py-1 rounded-lg shrink-0 hidden sm:block">
                      {link.url}
                    </code>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-white/30 text-xs mt-10">
        TraffiCandy © {new Date().getFullYear()} — Exportando dulces mexicanos al mundo 🍬
      </p>
    </div>
  )
}
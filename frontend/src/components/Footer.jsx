import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import logoTraficandy from '../assets/logo.png'

export default function Footer() {
  const { isLoggedIn, isVendedor } = useAuth()
  const { carrito } = useCart()

  return (
    <footer className="w-full border-t border-white/10 bg-[#0f0020]/80 backdrop-blur-xl mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Logo y descripción */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF006E] to-[#FB5607] overflow-hidden shadow-md">
                <img
                  src={logoTraficandy}
                  alt="TraffiCandy"
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="text-xl font-black text-white">
                Trafi<span className="text-[#FFD60A]">Candy</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Exportamos la magia y el sabor auténtico de los dulces mexicanos al mundo 🍬
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4">🏠 Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/50 hover:text-[#FF006E] text-sm transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-white/50 hover:text-[#FF006E] text-sm transition-colors">
                  Catálogo
                </Link>
              </li>
              {carrito.length > 0 && (
                <li>
                  <Link to="/checkout" className="text-white/50 hover:text-[#FF006E] text-sm transition-colors">
                    Checkout 🛒 ({carrito.length})
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4">🔐 Cuenta</h3>
            <ul className="space-y-2">
              {!isLoggedIn && (
                <>
                  <li>
                    <Link to="/login" className="text-white/50 hover:text-[#FF006E] text-sm transition-colors">
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-white/50 hover:text-[#FF006E] text-sm transition-colors">
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Contacto */}
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4 mt-6">📬 Contacto</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:trafficandyconsult@gmail.com"
                  className="text-white/50 hover:text-[#FF006E] text-sm transition-colors break-all"
                >
                  trafficandyconsult@gmail.com
                </a>
              </li>
              <li>
                <p className="text-white/30 text-xs mt-1">Dudas, quejas y sugerencias</p>
              </li>
            </ul>
          </div>

          {/* Admin — solo vendedor */}
          {isVendedor && (
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4">🏪 Vendedor</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/admin/dulce/nuevo" className="text-white/50 hover:text-[#FF006E] text-sm transition-colors">
                    ➕ Crear Dulce
                  </Link>
                </li>
                <li>
                  <Link to="/admin/dulces" className="text-white/50 hover:text-[#FF006E] text-sm transition-colors">
                    ✏️ Modificar Dulces
                  </Link>
                </li>
              </ul>
            </div>
          )}

        </div>

        {/* Línea inferior */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} TraffiCandy — Todos los derechos reservados
          </p>
          <p className="text-white/20 text-xs">
            Hecho con 🍬 en México
          </p>
        </div>
      </div>
    </footer>
  )
}
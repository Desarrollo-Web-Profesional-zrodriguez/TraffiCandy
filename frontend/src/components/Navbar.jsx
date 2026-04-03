import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Badge de rol con colores diferenciados
const ROL_BADGE = {
  vendedor: {
    label: "Vendedor",
    cls: "bg-[#FF006E]/20 text-[#FF006E] border-[#FF006E]/40",
    icon: "🏪",
  },
  comprador: {
    label: "Comprador",
    cls: "bg-[#8338EC]/20 text-[#a87eff] border-[#8338EC]/40",
    icon: "🛍️",
  },
};

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/checkout", label: "Checkout 🛒" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isLoggedIn, isVendedor, usuario, logout } = useAuth();

  /* ── Detectar scroll para activar glassmorphism ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Cerrar menú al cambiar de ruta ── */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ── Helpers de estilo ── */
  const isActive = (path) => location.pathname === path;

  const linkBase =
    "relative font-semibold text-sm tracking-wide transition-all duration-300 " +
    "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 " +
    "after:rounded-full after:bg-current after:transition-all after:duration-300 " +
    "hover:after:w-full";

  const linkDesktop = (path) =>
    isActive(path)
      ? `${linkBase} text-[#FF006E]`
      : `${linkBase} text-white/90 hover:text-[#FFD60A]`;

  const linkMobile = (path) =>
    `block w-full rounded-xl px-4 py-3 font-semibold text-sm transition-all duration-200 ` +
    (isActive(path)
      ? "bg-[#FF006E]/20 text-[#FF006E] border border-[#FF006E]/40"
      : "text-white/90 hover:bg-white/10 hover:text-[#FFD60A]");

  const navBg = scrolled
    ? "bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg shadow-black/10"
    : "bg-transparent";

  const badge = usuario?.rol ? ROL_BADGE[usuario.rol] : null;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  // Links extra para vendedor (visibles solo cuando está autenticado como vendedor)
  const vendedorLinks = isVendedor
    ? [{ to: "/admin/dulce/nuevo", label: "➕ Nuevo Dulce" }]
    : [];

  const allNavLinks = [...NAV_LINKS, ...vendedorLinks];

  return (
    <nav
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
    >
      {/* Gradiente superior decorativo */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#FF006E] via-[#FB5607] to-[#8338EC]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="group flex items-center gap-2 select-none"
            aria-label="TraffiCandy – Ir al inicio"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl
                         bg-gradient-to-br from-[#FF006E] to-[#FB5607]
                         text-white text-lg shadow-md shadow-[#FF006E]/30
                         transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              aria-hidden="true"
            >
              🍬
            </span>
            <span className="text-xl font-black text-white tracking-tight">
              Trafi<span className="text-[#FFD60A]">Candy</span>
            </span>
          </Link>

          {/* ── Links de escritorio ── */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {allNavLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={linkDesktop(to)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── CTA escritorio ── */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              /* ── Usuario autenticado ── */
              <div className="flex items-center gap-3">
                {/* Badge de rol */}
                {badge && (
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold ${badge.cls}`}
                  >
                    {badge.icon} {badge.label}
                  </span>
                )}

                {/* Info del usuario */}
                <div className="text-right">
                  <p className="text-white text-xs font-bold leading-none truncate max-w-[120px]">
                    {usuario?.nombre || usuario?.email?.split("@")[0]}
                  </p>
                  <p className="text-white/40 text-[10px] truncate max-w-[120px]">
                    {usuario?.email}
                  </p>
                </div>

                {/* Botón Logout */}
                <button
                  id="btn-logout-desktop"
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 bg-white/5 hover:bg-red-500/20
                             hover:border-red-500/40 px-4 py-2 text-sm font-bold text-white/80
                             hover:text-red-400 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Salir
                </button>
              </div>
            ) : (
              /* ── Sin sesión ── */
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-[#FF006E] to-[#FB5607]
                           px-5 py-2 text-sm font-bold text-white shadow-md
                           shadow-[#FF006E]/30 transition-all duration-300
                           hover:scale-105 hover:shadow-[#FF006E]/50 hover:shadow-lg
                           active:scale-95"
              >
                Empezar ahora
              </Link>
            )}
          </div>

          {/* ── Botón hamburguesa ── */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="md:hidden flex flex-col items-center justify-center h-10 w-10
                       rounded-lg text-white transition-all duration-200
                       hover:bg-white/10 active:scale-90 gap-[5px]"
          >
            <span className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Menú móvil ── */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="mx-4 mb-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3 shadow-xl shadow-black/20">
          <ul role="list" className="flex flex-col gap-1">
            {allNavLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={linkMobile(to)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-white/10 pt-3">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                {/* Info de usuario móvil */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
                  {badge && (
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${badge.cls}`}>
                      {badge.icon} {badge.label}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold truncate">
                      {usuario?.nombre || usuario?.email?.split("@")[0]}
                    </p>
                    <p className="text-white/40 text-xs truncate">{usuario?.email}</p>
                  </div>
                </div>
                {/* Logout móvil */}
                <button
                  id="btn-logout-mobile"
                  onClick={handleLogout}
                  className="block w-full rounded-xl border border-red-500/30 bg-red-500/10
                             py-3 text-center text-sm font-bold text-red-400
                             transition-all duration-200 hover:bg-red-500/20 active:scale-95"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607]
                           py-3 text-center text-sm font-bold text-white shadow-md
                           transition-all duration-200 hover:opacity-90 active:scale-95"
              >
                Empezar ahora 🚀
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/login", label: "Login" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
      ? `${linkBase} text-[#FF006E]` // rosa mexicano activo
      : `${linkBase} text-white/90 hover:text-[#FFD60A]`; // amarillo dulce en hover

  const linkMobile = (path) =>
    `block w-full rounded-xl px-4 py-3 font-semibold text-sm transition-all duration-200 ` +
    (isActive(path)
      ? "bg-[#FF006E]/20 text-[#FF006E] border border-[#FF006E]/40"
      : "text-white/90 hover:bg-white/10 hover:text-[#FFD60A]");

  /* ── Barra de fondo ── */
  const navBg = scrolled
    ? "bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg shadow-black/10"
    : "bg-transparent";

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
            aria-label="TrafiCandy – Ir al inicio"
          >
            {/* Icono decorativo */}
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
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={linkDesktop(to)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── CTA escritorio ── */}
          <div className="hidden md:flex items-center gap-3">
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
            {/* 3 líneas animadas → X */}
            <span
              className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300
                ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300
                ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300
                ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ── Menú móvil ── */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div
          className="mx-4 mb-4 rounded-2xl border border-white/20
                     bg-white/10 backdrop-blur-md p-3 shadow-xl shadow-black/20"
        >
          <ul role="list" className="flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={linkMobile(to)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-white/10 pt-3">
            <Link
              to="/login"
              className="block w-full rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607]
                         py-3 text-center text-sm font-bold text-white shadow-md
                         transition-all duration-200 hover:opacity-90 active:scale-95"
            >
              Empezar ahora 🚀
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

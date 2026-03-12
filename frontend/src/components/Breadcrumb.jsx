import { Link, useLocation } from "react-router-dom";

/**
 * Mapa de segmentos de URL → etiquetas legibles.
 * Amplíalo con las rutas que vayas añadiendo.
 */
const LABEL_MAP = {
  "": "Inicio",
  catalogo: "Catálogo",
  login: "Login",
  dulces: "Dulces",
  botaneros: "Botaneros",
  chocolates: "Chocolates",
};

/**
 * Rutas válidas que existen en App.jsx.
 * Agrega aquí cada ruta nueva que registres.
 */
const VALID_ROUTES = new Set([
  "/",
  "/catalogo",
  "/login",
  // Las rutas dinámicas se validan con el patrón, no aquí
]);

/** Patrón para rutas dinámicas válidas (ej. /catalogo/:cat/:slug) */
const VALID_PATTERNS = [
  /^\/catalogo\/[^/]+\/[^/]+$/, // /catalogo/:categoria/:slug
];

/** Devuelve true si la ruta existe como página registrada */
const routeExists = (path) =>
  VALID_ROUTES.has(path) || VALID_PATTERNS.some((re) => re.test(path));

/**
 * Dado un path, devuelve la ruta válida más cercana subiendo nivel a nivel.
 * Ej: /catalogo/dulces → no existe → /catalogo ✓
 */
const resolveRoute = (path) => {
  let current = path;
  while (current && current !== "/") {
    if (routeExists(current)) return current;
    current = current.replace(/\/[^/]+$/, "") || "/";
  }
  return "/";
};

/** Capitaliza el primer carácter; útil como fallback */
const prettify = (s) =>
  decodeURIComponent(s)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function Breadcrumb() {
  const { pathname } = useLocation();

  // Construye los segmentos ignorando segmentos vacíos dobles
  const segments = pathname
    .split("/")
    .filter((_, i, arr) => i === 0 || arr[i] !== "");

  // Cada crumb: { label, to (resolved), isLast }
  const crumbs = segments.map((seg, i) => {
    const rawTo = "/" + segments.slice(1, i + 1).join("/");
    const to = resolveRoute(rawTo); // ← fallback a ruta válida más cercana
    const label = LABEL_MAP[seg] ?? prettify(seg);
    const isLast = i === segments.length - 1;
    return { label, to, isLast };
  });

  // No renderizar en la raíz (solo 1 crumb = Inicio)
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full px-4 sm:px-6 lg:px-8 py-3">
      {/* Pill contenedor con glassmorphism */}
      <ol
        role="list"
        className="inline-flex items-center gap-1 flex-wrap
                   rounded-full border border-white/15
                   bg-white/8 backdrop-blur-sm
                   px-4 py-2 shadow-lg shadow-black/20"
      >
        {crumbs.map(({ label, to, isLast }, idx) => (
          <li key={to} className="flex items-center gap-1">
            {/* Separador (excepto el primero) */}
            {idx > 0 && (
              <span
                aria-hidden="true"
                className="select-none text-[#FB5607] font-black text-sm mx-1 drop-shadow-sm"
              >
                ›
              </span>
            )}

            {isLast ? (
              /* Crumb activo — resaltado con gradiente */
              <span
                aria-current="page"
                className="flex items-center gap-1.5 rounded-full
                           bg-gradient-to-r from-[#FF006E] to-[#FB5607]
                           px-3 py-0.5 text-xs font-bold text-white
                           shadow-md shadow-[#FF006E]/30
                           animate-pulse-once"
              >
                {/* Icono decorativo en el último crumb */}
                <span aria-hidden="true" className="text-[10px]">
                  ●
                </span>
                {label}
              </span>
            ) : (
              /* Crumb enlazable */
              <Link
                to={to}
                className="group flex items-center gap-1
                           rounded-full px-3 py-0.5
                           text-xs font-semibold text-white/70
                           transition-all duration-200
                           hover:bg-white/10 hover:text-[#FFD60A]
                           active:scale-95"
              >
                {/* Ícono especial solo en "Inicio" */}
                {idx === 0 && (
                  <span
                    aria-hidden="true"
                    className="text-[11px] group-hover:scale-125 transition-transform duration-200"
                  >
                    🏠
                  </span>
                )}
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

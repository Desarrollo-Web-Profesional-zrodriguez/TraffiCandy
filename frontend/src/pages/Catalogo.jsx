import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const CATEGORIAS = [
  {
    slug: "dulces",
    titulo: "Dulces",
    emoji: "🍬",
    color: "from-[#FF006E] to-[#FB5607]",
    productos: [
      {
        slug: "pelon-pelo-rico",
        nombre: "Pelón Pelo Rico",
        emoji: "🌶️",
        precio: "$12.50",
      },
      {
        slug: "lucas-mango",
        nombre: "Lucas Mango",
        emoji: "🥭",
        precio: "$8.00",
      },
      {
        slug: "pulparindo",
        nombre: "Pulparindo",
        emoji: "🫙",
        precio: "$9.00",
      },
    ],
  },
  {
    slug: "botaneros",
    titulo: "Botaneros",
    emoji: "🌀",
    color: "from-[#8338EC] to-[#3A86FF]",
    productos: [
      {
        slug: "chicharrones-de-harina",
        nombre: "Chicharrones de Harina",
        emoji: "🌀",
        precio: "$5.50",
      },
    ],
  },
];

export default function Catalogo() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* ── Breadcrumb ── */}
      <div className="pt-6 pb-2">
        <Breadcrumb />
      </div>

      {/* ── Header ── */}
      <header className="mt-6 mb-10 text-center">
        <span className="text-6xl" role="img" aria-label="catálogo">
          🍭
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-3">
          Catálogo de{" "}
          <span className="bg-gradient-to-r from-[#FF006E] to-[#FFD60A] bg-clip-text text-transparent">
            Productos
          </span>
        </h1>
        <p className="text-white/60 mt-2 text-base">
          Selecciona un producto para ver su detalle y despacharlo al mundo 🌍
        </p>
      </header>

      {/* ── Categorías ── */}
      <div className="flex flex-col gap-12">
        {CATEGORIAS.map((cat) => (
          <section key={cat.slug} aria-labelledby={`cat-${cat.slug}`}>
            {/* Encabezado de categoría */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl
                            bg-gradient-to-br ${cat.color} text-xl shadow-lg`}
                aria-hidden="true"
              >
                {cat.emoji}
              </span>
              <h2
                id={`cat-${cat.slug}`}
                className="text-xl font-black text-white tracking-wide"
              >
                {cat.titulo}
              </h2>
              <div
                className="flex-1 h-px bg-white/10 rounded-full"
                aria-hidden="true"
              />
            </div>

            {/* Grid de productos */}
            <ul
              role="list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {cat.productos.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/catalogo/${cat.slug}/${p.slug}`}
                    className="group flex flex-col rounded-2xl border border-white/10
                               bg-white/5 backdrop-blur-sm overflow-hidden
                               shadow-lg shadow-black/20
                               transition-all duration-300
                               hover:scale-[1.03] hover:border-white/25
                               hover:shadow-2xl hover:shadow-[#FF006E]/10
                               active:scale-[0.98]"
                  >
                    {/* Imagen / emoji */}
                    <div
                      className={`bg-gradient-to-br ${cat.color} p-6 flex items-center justify-center text-5xl
                                  transition-transform duration-300 group-hover:scale-110`}
                    >
                      <span role="img" aria-label={p.nombre}>
                        {p.emoji}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-sm group-hover:text-[#FFD60A] transition-colors duration-200">
                          {p.nombre}
                        </p>
                        <p className="text-white/50 text-xs mt-0.5">
                          Ver detalle →
                        </p>
                      </div>
                      <span
                        className={`rounded-full bg-gradient-to-r ${cat.color} px-3 py-1
                                   text-xs font-bold text-white shadow-sm`}
                      >
                        {p.precio}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

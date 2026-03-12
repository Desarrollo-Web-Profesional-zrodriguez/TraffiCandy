import { useParams, Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const PRODUCTOS = {
  "pelon-pelo-rico": {
    emoji: "🌶️",
    nombre: "Pelón Pelo Rico",
    categoria: "dulces",
    precio: "$12.50 USD",
    descripcion:
      "El clásico dulce tamarindo con chile, con su icónica presentación en peinado. Sabor agridulce inconfundible de México.",
    peso: "40g",
    origen: "Jalisco, México",
    color: "from-[#FF006E] to-[#FB5607]",
  },
  "lucas-mango": {
    emoji: "🥭",
    nombre: "Lucas Mango",
    categoria: "dulces",
    precio: "$8.00 USD",
    descripcion:
      "Polvo de chile con sabor a mango, el favorito de todas las generaciones. Picante, dulce y delicioso.",
    peso: "25g",
    origen: "Ciudad de México",
    color: "from-[#FB5607] to-[#FFD60A]",
  },
  pulparindo: {
    emoji: "🍬",
    nombre: "Pulparindo",
    categoria: "dulces",
    precio: "$9.00 USD",
    descripcion:
      "Dulce de tamarindo con chile, sal y azúcar. Un explosivo de sabores que conquista paladares internacionales.",
    peso: "20g",
    origen: "Guadalajara, México",
    color: "from-[#8338EC] to-[#FF006E]",
  },
  "chicharrones-de-harina": {
    emoji: "🌀",
    nombre: "Chicharrones de Harina",
    categoria: "botaneros",
    precio: "$5.50 USD",
    descripcion:
      "Botana crujiente y ligera, perfecta para acompañar con salsa valentina y limón. Snack emblemático mexicano.",
    peso: "50g",
    origen: "Monterrey, México",
    color: "from-[#FFD60A] to-[#FB5607]",
  },
};

export default function ProductoDetalle() {
  const { categoria, slug } = useParams();
  const producto = PRODUCTOS[slug];

  if (!producto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
        <span className="text-6xl mb-4">😕</span>
        <h1 className="text-3xl font-black mb-2">Producto no encontrado</h1>
        <Link to="/catalogo" className="text-[#FFD60A] hover:underline mt-2">
          ← Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* ── Breadcrumb ── */}
      <div className="pt-6 pb-2">
        <Breadcrumb />
      </div>

      {/* ── Tarjeta de detalle ── */}
      <article className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
        {/* Header con gradiente */}
        <div
          className={`bg-gradient-to-r ${producto.color} p-10 flex flex-col items-center`}
        >
          <span
            className="text-8xl drop-shadow-lg mb-3"
            role="img"
            aria-label={producto.nombre}
          >
            {producto.emoji}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white text-center drop-shadow">
            {producto.nombre}
          </h1>
          <span className="mt-3 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1 text-sm font-semibold text-white">
            {producto.precio}
          </span>
        </div>

        {/* Cuerpo */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-[#FFD60A] mb-2">
              Descripción
            </h2>
            <p className="text-white/80 leading-relaxed">
              {producto.descripcion}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { label: "⚖️ Peso", value: producto.peso },
              { label: "📍 Origen", value: producto.origen },
              {
                label: "🏷️ Categoría",
                value:
                  producto.categoria.charAt(0).toUpperCase() +
                  producto.categoria.slice(1),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3"
              >
                <span className="text-white/60 text-sm">{label}</span>
                <span className="text-white font-semibold text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex gap-3">
          <Link
            to="/catalogo"
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/80
                       transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            ← Volver al Catálogo
          </Link>
          <button
            type="button"
            className={`rounded-full bg-gradient-to-r ${producto.color} px-6 py-2.5 text-sm font-bold text-white
                       shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95`}
          >
            Agregar al pedido 🛒
          </button>
        </div>
      </article>
    </div>
  );
}

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const CandyMap = lazy(() => import('../components/CandyMap/CandyMap'));
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";
import DulceBot from '../components/DulceBot/DulceBot'

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import { useDulces } from "../hooks/useDulces";

// Fallback colors for products that don't have images/colors yet
const FALLBACK_COLORS = [
  "from-[#FF006E] to-[#FB5607]",
  "from-[#FB5607] to-[#FFD60A]",
  "from-[#8338EC] to-[#FF006E]",
  "from-[#3A86FF] to-[#8338EC]"
];

export default function Inicio() {
  const { dulces, loading } = useDulces();

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen overflow-hidden pb-20">
      {/* ── 1. Hero Section ── */}
      <section className="relative w-full min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
        {/* Elementos decorativos flotantes de fondo */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[15%] text-6xl opacity-30 blur-[2px]"
        >
          🍬
        </motion.div>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-[20%] text-6xl opacity-30 blur-[2px]"
        >
          🍭
        </motion.div>
        <motion.div
          initial={{ y: 0, rotate: 0 }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[15%] text-7xl opacity-20 blur-[3px]"
        >
          🌶️
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-6 shadow-2xl rounded-full bg-white/5 p-4 backdrop-blur-md border border-white/10"
        >
          <img src="/src/assets/logo1.png" alt="TraffiCandy" className="w-100 h-80 object-contain" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-xl"
        >
          Bienvenido a{" "}
          <span className="bg-gradient-to-r from-[#FF006E] via-[#FB5607] to-[#FFD60A] bg-clip-text text-transparent animate-gradient-x">
            TraffiCandy
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/80 text-xl max-w-2xl mb-10 font-medium leading-relaxed"
        >
          Exportamos la magia y el sabor auténtico de los dulces mexicanos a
          cualquier rincón del mundo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/catalogo"
            className="rounded-full bg-gradient-to-r from-[#FF006E] to-[#FB5607] px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(255,0,110,0.4)] hover:shadow-[0_0_30px_rgba(255,0,110,0.6)] hover:scale-105 transition-all duration-300"
          >
            Ver Catálogo de Productos
          </Link>
          <a
            href="#top-dulces"
            className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all duration-300"
          >
            Descubrir Más ↓
          </a>
        </motion.div>
      </section>

      {/* ── 2. Top Dulces (Swiper Carousel) ── */}
      <section id="top-dulces" className="w-full max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Los Favoritos del <span className="text-[#00F5D4]">Mundo</span> 🌍
          </h2>
          <p className="text-white/60">
            Desliza para descubrir nuestros top sellers internacionales.
          </p>
        </div>

        <div className="flex justify-center w-full max-w-[320px] mx-auto md:max-w-[400px]">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            className="w-full h-[400px]"
          >
            {loading ? (
              <SwiperSlide className="flex items-center justify-center rounded-3xl opacity-100!">
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-full h-full rounded-3xl bg-white/10 p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-white/20"
                >
                  <div className="w-24 h-24 rounded-full bg-white/20 mb-6"></div>
                  <div className="w-32 h-8 bg-white/20 rounded-md"></div>
                </motion.div>
              </SwiperSlide>
            ) : dulces.length > 0 ? (
              dulces.map((dulce, idx) => {
                const color = FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
                const displayName = dulce.nombre || "Dulce Misterioso";
                // If there are images, we show the first one. Otherwise fallback to emoji or first letter
                const hasImage = dulce.imagenes && dulce.imagenes.length > 0;
                const emojiOrInitial = dulce.emoji || (hasImage ? "" : displayName.charAt(0));

                return (
                  <SwiperSlide key={dulce._id || dulce.id || idx} className="flex items-center justify-center rounded-3xl opacity-100!">
                    <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${color} p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-white/20 overflow-hidden relative`}>
                      {hasImage ? (
                        <img src={dulce.imagenes[0]} alt={displayName} className="w-32 h-32 object-contain mb-6 drop-shadow-xl hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="text-9xl drop-shadow-2xl mb-6 hover:scale-110 transition-transform duration-300 cursor-grab">{emojiOrInitial}</span>
                      )}
                      <h3 className="text-3xl font-black text-white drop-shadow-md z-10">{displayName}</h3>
                      {dulce.precioBase || dulce.precio ? (
                        <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-bold text-white z-10">
                          ${dulce.precioBase || dulce.precio} MXN
                        </div>
                      ) : (
                        <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-bold text-white z-10">Top Ventas</div>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <SwiperSlide className="flex items-center justify-center rounded-3xl opacity-100!">
                 <div className="w-full h-full rounded-3xl bg-white/5 p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-white/20">
                   <p className="text-white/60">No hay dulces disponibles actualmente.</p>
                 </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </section>

      {/* ── 3. Mapa Interactivo de Dulces ── */}
      <section className="w-full py-10">
        <div className="text-center mb-8 px-4">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Explora los Sabores de{" "}
            <span className="bg-gradient-to-r from-[#FF006E] via-[#FB5607] to-[#FFD60A] bg-clip-text text-transparent">
              México
            </span>{" "}
            🇲🇽
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Haz clic en cualquier estado para descubrir sus dulces típicos y su historia.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="w-full h-[80vh] flex items-center justify-center bg-gray-900/50 rounded-3xl">
              <div className="text-white/60 text-lg animate-pulse">Cargando el Mapa… 🗺️</div>
            </div>
          }
        >
          <CandyMap />
        </Suspense>
      </section>
      <DulceBot />
    </div>
  );
}

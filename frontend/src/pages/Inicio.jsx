import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fallback colors for products that don't have images/colors yet
const FALLBACK_COLORS = [
  "from-[#FF006E] to-[#FB5607]",
  "from-[#FB5607] to-[#FFD60A]",
  "from-[#8338EC] to-[#FF006E]",
  "from-[#3A86FF] to-[#8338EC]"
];

export default function Inicio() {
  const [dulces, setDulces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDulces = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos`);
        const data = await res.json();
        setDulces(data);
      } catch (error) {
        console.error("Error fetching sweets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDulces();
  }, []);
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
          className="text-8xl mb-6 shadow-2xl rounded-full bg-white/5 p-4 backdrop-blur-md border border-white/10"
          role="img"
          aria-label="dulces"
        >
          🌮
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-xl"
        >
          Bienvenido a{" "}
          <span className="bg-gradient-to-r from-[#FF006E] via-[#FB5607] to-[#FFD60A] bg-clip-text text-transparent animate-gradient-x">
            TrafiCandy
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

      {/* ── 3. Mapa Interactivo Placeholder ── */}
      <section className="w-full max-w-6xl mx-auto px-4 py-10">
        <div className="relative w-full h-[500px] rounded-[40px] border border-white/10 bg-[#0a0f1c] overflow-hidden group shadow-2xl">
          {/* Fondo simulando continente/mundo abstracto con blur */}
          <div className="absolute inset-0 opacity-20 blur-sm pointer-events-none transition-opacity duration-700 group-hover:opacity-30">
            <svg
              className="w-full h-full text-[#3A86FF]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                fill="currentColor"
                d="M10,40 Q30,20 50,40 T90,50 L90,90 L10,90 Z"
                opacity="0.5"
              />
              <path
                fill="currentColor"
                d="M20,60 Q40,30 70,50 T90,80 L20,80 Z"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Marcadores animados (Pings) de exportación */}
          <div className="absolute top-[30%] left-[25%]">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF006E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FF006E]"></span>
            </span>
          </div>
          <div className="absolute top-[60%] right-[30%]">
            <span className="relative flex h-3 w-3">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD60A] opacity-75"
                style={{ animationDelay: "1s" }}
              ></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD60A]"></span>
            </span>
          </div>
          <div className="absolute top-[40%] right-[15%]">
            <span className="relative flex h-5 w-5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5D4] opacity-75"
                style={{ animationDelay: "0.5s" }}
              ></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-[#00F5D4]"></span>
            </span>
          </div>

          {/* Capa Glassmorphism Superior (Placeholder Message) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-[6px] transition-all duration-500 hover:backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white/10 border border-white/20 rounded-3xl p-8 max-w-lg text-center shadow-2xl backdrop-blur-xl"
            >
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                Rutas del Sabor
              </h3>
              <p className="text-white/70 mb-6">
                Estamos rastreando cada envío de TrafiCandy por el mundo. El
                mapa interactivo global estará disponible próximamente.
              </p>
              <div className="inline-block rounded-full bg-white/5 border border-white/10 px-6 py-2 text-sm font-semibold text-[#FFD60A]">
                Próximamente 🚀
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

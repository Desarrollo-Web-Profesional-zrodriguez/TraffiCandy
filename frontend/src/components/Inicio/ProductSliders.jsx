import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

const FALLBACK_COLORS = [
  "from-[#FF006E] to-[#FB5607]",
  "from-[#FB5607] to-[#FFD60A]",
  "from-[#8338EC] to-[#FF006E]",
  "from-[#3A86FF] to-[#8338EC]"
];

export default function ProductSliders({ dulces, loading, onAddToCart }) {
  // Create a reversed array for the second slider to simulate "Más Comprados"
  const masComprados = [...dulces].reverse();

  const renderSlider = (items, title, highlightColor, autoplayDelay) => (
    <div className="w-full lg:w-1/2 flex flex-col items-center">
      <h2 className="text-3xl font-black text-white mb-8">
        {title}
      </h2>
      <div className="w-full max-w-[320px] md:max-w-[360px]">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards, Autoplay]}
          autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
          className="w-full h-[450px]"
        >
          {loading ? (
            <SwiperSlide className="flex items-center justify-center rounded-3xl opacity-100!">
              <div className="w-full h-full rounded-3xl bg-white/10 p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-white/20 animate-pulse"></div>
            </SwiperSlide>
          ) : items.length > 0 ? (
            items.map((dulce, idx) => {
              const color = FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
              const displayName = dulce.nombre || "Dulce Misterioso";
              const hasImage = dulce.imagenes && dulce.imagenes.length > 0;
              const emojiOrInitial = dulce.emoji || (hasImage ? "" : displayName.charAt(0));

              return (
                <SwiperSlide key={dulce._id || dulce.id || idx} className="flex items-center justify-center rounded-3xl opacity-100!">
                  <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${color} p-6 flex flex-col items-center justify-center text-center shadow-2xl border border-white/20 overflow-hidden relative`}>
                    {hasImage ? (
                      <>
                        <img 
                          src={dulce.imagenes[0]} 
                          alt={displayName} 
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          className="w-32 h-32 object-contain rounded-2xl mb-4 drop-shadow-xl hover:scale-105 transition-transform duration-300 shadow-inner" 
                        />
                        <div className="hidden w-32 h-32 items-center justify-center transition-transform duration-300 hover:scale-110">
                          <span className="text-8xl drop-shadow-2xl">{emojiOrInitial || "🍬"}</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-8xl drop-shadow-2xl mb-4 hover:scale-110 transition-transform duration-300">{emojiOrInitial || "🍬"}</span>
                    )}
                    <h3 className="text-2xl font-black text-white drop-shadow-md z-10 leading-tight">{displayName}</h3>
                    {dulce.precioBase || dulce.precio ? (
                      <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-bold text-white z-10">
                        ${dulce.precioBase || dulce.precio} MXN
                      </div>
                    ) : null}
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(dulce); }}
                      className={`mt-5 w-full bg-white text-[#1a0533] px-4 py-3 rounded-full font-bold hover:bg-[${highlightColor}] transition-colors z-20 pointer-events-auto`}
                    >
                      Agregar al carrito 🛒
                    </button>
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
    </div>
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center justify-center">
        {renderSlider(
          dulces, 
          <>Los Favoritos del <span className="text-[#00F5D4]">Mundo</span> 🌍</>, 
          "#00F5D4", 
          2500
        )}
        {renderSlider(
          masComprados, 
          <>Más <span className="text-[#FF006E]">Comprados</span> 🔥</>, 
          "#FF006E", 
          3500
        )}
      </div>
    </section>
  );
}

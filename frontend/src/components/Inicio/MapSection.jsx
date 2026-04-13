import { Suspense, lazy } from "react";
const CandyMap = lazy(() => import('../CandyMap/CandyMap'));

export default function MapSection() {
  return (
    <section className="w-full pt-12 pb-16 bg-gray-900 relative" id="mapa">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="text-center mb-10 px-4 relative z-10">
        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter">
          TRAFFICANDY<br />
          <span className="bg-gradient-to-r from-[#FF006E] via-[#FB5607] to-[#FFD60A] bg-clip-text text-transparent">
            SABORES DE MÉXICO
          </span>{" "}
          🇲🇽
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto text-lg md:text-xl font-medium">
          Descubre el dulce tradicional de cada estado y sumérgete en una historia llena de tradición. 
          <span className="block mt-2 text-sm text-white/40 italic">Haz clic en un estado para comenzar tu viaje.</span>
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full h-[80vh] flex items-center justify-center bg-gray-900 rounded-3xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white/60 text-lg font-medium animate-pulse">Preparando el Mapa de México… 🗺️</div>
            </div>
          </div>
        }
      >
        <div className="max-w-[1300px] mx-auto px-4">
          <CandyMap />
        </div>
      </Suspense>
    </section>
  );
}

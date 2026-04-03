export default function Step2CartSummary() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6 text-center">🛒 Paso 2: Tu Caja de Dulces</h2>
      
      <div className="space-y-4 bg-black/20 p-6 rounded-3xl border border-white/10">
        
        {/* DUMMY PRODUCTS */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF006E] to-purple-600 flex items-center justify-center text-2xl shadow-lg">🍬</div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-lg">Mix de Dulces Confitados Mexicanos</h4>
            <p className="text-white/50 text-sm">Cantidad: 2 bolsas</p>
          </div>
          <div className="text-right">
            <p className="text-[#FF006E] font-black text-xl hover:scale-110 transition-transform">$150.00</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FB5607] to-orange-400 flex items-center justify-center text-2xl shadow-lg">🌶️</div>
          <div className="flex-1">
            <h4 className="text-white font-bold text-lg">Pack Extremo: Salsas Artesanales</h4>
            <p className="text-white/50 text-sm">Cantidad: 1 caja especial</p>
          </div>
          <div className="text-right">
            <p className="text-[#FB5607] font-black text-xl hover:scale-110 transition-transform">$250.00</p>
          </div>
        </div>

        {/* RESUMEN PRECIOS */}
        <div className="mt-6">
          <div className="pt-4 border-t border-white/10 flex justify-between items-center px-4">
            <span className="text-white/70 font-medium">Subtotal de la Canasta</span>
            <span className="text-white font-bold">$400.00 MXN</span>
          </div>
          <div className="flex justify-between items-center px-4 mt-2">
            <span className="text-white/70 font-medium">Costo por Distancia de Envío</span>
            <span className="text-[#00F5D4] font-bold tracking-wide">¡GRATUITO! ($0.00)</span>
          </div>
          <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center px-4 bg-white/5 -mx-2 p-4 rounded-xl">
            <span className="text-white font-black text-xl">MONTO TOTAL</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] font-black text-4xl drop-shadow-lg">$400.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

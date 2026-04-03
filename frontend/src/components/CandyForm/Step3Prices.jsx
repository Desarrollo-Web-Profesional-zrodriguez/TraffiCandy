export default function Step3Prices({ formData, handleChange, loading, isEdit }) {
  return (
    <div className="space-y-6 animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
      <h2 className="text-xl font-bold text-white mb-2 md:col-span-2">📦 Paso 3: Precios y Logística</h2>
      
      <div className="space-y-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Precio Base ($ MXN) *</label>
        <input required type="number" min="0" step="0.5" name="precioBase" value={formData.precioBase} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all" />
      </div>
      <div className="space-y-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Peso Físico Bruto (Gramos) *</label>
        <input required type="number" min="0" name="pesoGramos" value={formData.pesoGramos} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all" />
        <p className="text-white/40 text-xs ml-1">Usado para cálculo logístico.</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Unidades Iniciales en Stock</label>
        <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all" />
      </div>

      <div className="space-y-2 flex flex-col justify-center translate-y-2">
        <label className="flex items-center gap-3 cursor-pointer bg-green-500/10 border border-green-500/20 p-4 rounded-xl hover:bg-green-500/20 transition-all">
          <input type="checkbox" name="disponibleParaEnvio" checked={formData.disponibleParaEnvio} onChange={handleChange} className="w-5 h-5 accent-green-500" />
          <span className="text-white font-bold text-sm tracking-wide">Aprobar para Exportación Global ✈️</span>
        </label>
      </div>

      <div className="md:col-span-2 mt-8">
        <button disabled={loading} type="submit" className={`w-full rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-4 font-black text-white text-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_20px_rgba(255,0,110,0.5)] hover:scale-[1.02] active:scale-95'}`}>
          {loading ? "Sincronizando..." : (isEdit ? "✔ Actualizar Dulce" : "✔ Procesar y Publicar Dulce")}
        </button>
      </div>
    </div>
  );
}

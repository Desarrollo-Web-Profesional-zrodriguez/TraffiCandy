import { useState } from "react";

const ESTADOS_MEXICO = [
  "", "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", 
  "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", 
  "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", 
  "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

export default function Step1Identity({ formData, setFormData, handleChange }) {
  const [translating, setTranslating] = useState(false);

  // Traducción Automática (Simula backend o usa API pública)
  const handleTranslateDescription = async () => {
    if (!formData.descripcion_es.trim()) return;
    setTranslating(true);
    
    try {
      const resp = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(formData.descripcion_es)}&langpair=es|en`);
      const data = await resp.json();
      
      if (data && data.responseData && data.responseData.translatedText) {
        setFormData(prev => ({ ...prev, descripcion_en: data.responseData.translatedText }));
      }
    } catch (error) {
       console.error("Error contactando API externa, usando simulación", error);
       setTimeout(() => {
         setFormData(prev => ({ ...prev, descripcion_en: "[Traducción pendiente por Backend API]" }));
       }, 1000);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
      <h2 className="text-xl font-bold text-white mb-2 md:col-span-2">📜 Paso 1: Identidad y Origen</h2>
      
      <div className="space-y-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Nombre del Dulce *</label>
        <input required name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Pulparindo" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
      </div>
      
      <div className="space-y-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Marca o Fabricante</label>
        <input name="marca" value={formData.marca} onChange={handleChange} placeholder="Ej. De La Rosa, Artesanal" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
      </div>
      
      <div className="space-y-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Categoría *</label>
        <select required name="categoria" value={formData.categoria} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 text-white/90 rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all">
          <option value="dulce">Dulce Convencional</option>
          <option value="picante">Picante / Enchilado</option>
          <option value="agridulce">Agridulce</option>
          <option value="tradicional">Tradicional Artesanal</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Estado de Origen *</label>
        <select required name="estadoOrigen" value={formData.estadoOrigen} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 text-white/90 rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all">
          {ESTADOS_MEXICO.map((estado, idx) => (
            <option key={idx} value={estado} disabled={estado === ""}>{estado || "-- Selecciona un Estado --"}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2 md:col-span-2 relative">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Historia / Descripción (Español) *</label>
        <textarea required rows="3" name="descripcion_es" value={formData.descripcion_es} onChange={handleChange} placeholder="Cuéntanos el origen e historia de este dulce..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
        <button 
          type="button" 
          onClick={handleTranslateDescription}
          disabled={translating || !formData.descripcion_es}
          className="absolute right-4 bottom-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
        >
          {translating ? 'Traduciendo...' : 'Traducir Inteligente 🌐'}
        </button>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Descripción en Inglés (Editable)</label>
        <textarea rows="3" name="descripcion_en" value={formData.descripcion_en} onChange={handleChange} placeholder="La traducción aparecerá aquí..." className="w-full bg-blue-900/10 border border-blue-500/30 text-white rounded-xl px-4 py-3 focus:border-blue-400 outline-none transition-all placeholder-white/30" />
      </div>
    </div>
  );
}

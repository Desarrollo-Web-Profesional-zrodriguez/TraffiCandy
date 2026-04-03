import { useState } from "react";

export default function Step2Media({ formData, setFormData, handleChange }) {
  const [imageInput, setImageInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [alergenoInput, setAlergenoInput] = useState("");

  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageInput.trim()) {
      setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, imageInput.trim()] }));
      setImageInput("");
    }
  };
  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, idx) => idx !== indexToRemove) }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.flavorTags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, flavorTags: [...prev.flavorTags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, flavorTags: prev.flavorTags.filter(t => t !== tagToRemove) }));
  };

  const handleAddAlergeno = (e) => {
    e.preventDefault();
    if (alergenoInput.trim() && !formData.alergenos.includes(alergenoInput.trim())) {
      setFormData(prev => ({ ...prev, alergenos: [...prev.alergenos, alergenoInput.trim()] }));
      setAlergenoInput("");
    }
  };
  const handleRemoveAlergeno = (alergenoToRemove) => {
    setFormData(prev => ({ ...prev, alergenos: prev.alergenos.filter(a => a !== alergenoToRemove) }));
  };

  return (
    <div className="space-y-6 animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
      <h2 className="text-xl font-bold text-white mb-2 md:col-span-2">🎨 Paso 2: Multimedia y Sabores</h2>
      
      <div className="space-y-3 md:col-span-2">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Galería de Fotografías (URL) *</label>
        <div className="flex gap-2">
          <input 
            type="url" 
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddImage(e); }}
            placeholder="https://ejemplo.com/foto-dulce.jpg" 
            className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 outline-none focus:border-[#FF006E] placeholder-white/30" 
          />
          <button type="button" onClick={handleAddImage} className="bg-white/10 hover:bg-indigo-500 text-white px-5 rounded-xl font-bold transition-colors shadow-md">Añadir Foto</button>
        </div>

        {formData.imagenes.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 bg-black/20 p-4 rounded-xl border border-white/5">
            {formData.imagenes.map((img, idx) => (
              <div key={idx} className="relative group w-24 h-24 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#FF006E] transition-all">
                <img src={img} alt={`Vista Previa ${idx}`} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/150x150?text=Error'} />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage(idx)} 
                  className="absolute inset-0 bg-red-600/60 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                > Eliminar </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 md:col-span-2 bg-gradient-to-r from-red-600/10 to-orange-500/10 p-6 rounded-2xl border border-red-500/20">
        <div className="flex justify-between items-center">
          <label className="text-white font-black text-lg">Intensidad de Picor (0-5)</label>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
            {formData.nivelPicor} 🌶️
          </span>
        </div>
        <input type="range" name="nivelPicor" min="0" max="5" value={formData.nivelPicor} onChange={handleChange} className="w-full accent-[#FF006E] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
      </div>

      <div className="space-y-3">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Sensaciones / Etiquetas (Inglés/Español)</label>
        <div className="flex gap-2">
          <input value={tagInput} onChange={(e)=>setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(e); } } placeholder="Ej. picoso, amargo..." className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 outline-none focus:border-[#FF006E]" />
          <button type="button" onClick={handleAddTag} className="bg-white/10 hover:bg-[#FF006E] text-white px-5 rounded-xl font-bold">+</button>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {formData.flavorTags.map((tag, idx) => (
            <span key={idx} className="bg-[#FF006E]/20 text-[#FF006E] border border-[#FF006E]/30 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
              #{tag} <button type="button" onClick={() => handleRemoveTag(tag)} className="text-white font-bold">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Lista de Alérgenos (Inglés/Español)</label>
        <div className="flex gap-2">
          <input value={alergenoInput} onChange={(e)=>setAlergenoInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddAlergeno(e); } } placeholder="Ej. peanuts, cacahuate..." className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 outline-none focus:border-[#FB5607]" />
          <button type="button" onClick={handleAddAlergeno} className="bg-white/10 hover:bg-[#FB5607] text-white px-5 rounded-xl font-bold">+</button>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {formData.alergenos.map((alergeno, idx) => (
            <span key={idx} className="bg-[#FB5607]/20 text-[#FB5607] border border-[#FB5607]/30 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
              ⚠️ {alergeno} <button type="button" onClick={() => handleRemoveAlergeno(alergeno)} className="text-white font-bold">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

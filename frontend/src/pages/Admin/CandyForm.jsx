import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dulcesService } from "../../services/dulces.service";
import toast from "react-hot-toast";
const ESTADOS_MEXICO = [
  "", "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", 
  "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", 
  "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", 
  "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

export default function CandyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion_es: "",
    descripcion_en: "",
    precioBase: 0,
    pesoGramos: 0,
    stock: 0,
    imagenes: [],
    emoji: "🍬",
    categoria: "dulce",
    estadoOrigen: "",
    flavorTags: [],
    nivelPicor: 0,
    alergenos: [],
    disponibleParaEnvio: true
  });
  
  const [tagInput, setTagInput] = useState("");
  const [alergenoInput, setAlergenoInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      dulcesService.getById(id)
        .then(data => setFormData({
          ...data,
          imagenes: data.imagenes || [],
          flavorTags: data.flavorTags || [],
          alergenos: data.alergenos || [],
          disponibleParaEnvio: data.disponibleParaEnvio !== undefined ? data.disponibleParaEnvio : true
        }))
        .catch(err => {
          console.error(err);
          toast.error("No se pudo cargar la información del dulce.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue = value;
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parsedValue
    }));
  };

  // 1. Traducción Automática (Simula backend o usa API pública)
  const handleTranslateDescription = async () => {
    if (!formData.descripcion_es.trim()) return;
    setTranslating(true);
    
    try {
      // Uso una API pública gratuita para que funcione visualmente, pero se documentará que esto debe ir al backend
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

  // 2. Arrays Logic
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

  // Wizard Navigation
  const handleNextStep = () => {
    if (step === 1 && (!formData.nombre || !formData.descripcion_es || !formData.categoria || !formData.estadoOrigen)) {
      toast.error("Por favor completa los campos principales de Identidad.");
      return;
    }
    if (step === 2 && formData.imagenes.length === 0) {
      toast.error("Se requiere al menos una fotografía para mostrar el dulce internacionalmente.");
      return;
    }
    setStep(s => s + 1);
  };
  const handlePrevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEdit) {
        await dulcesService.updateDulce(id, formData);
        toast.success("¡Dulce actualizado de manera exitosa! 🍬");
      } else {
        await dulcesService.createDulce(formData);
        toast.success("¡Nuevo dulce inyectado al catálogo exitosamente! 🚀");
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error al intentar guardar el dulce en la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] mb-4 text-center">
          {isEdit ? "Editar Esencia de Dulce" : "Crear Nuevo Dulce Típico"}
        </h1>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-10 px-4 md:px-12 relative mt-4">
          <div className="absolute left-10 right-10 top-1/2 h-1 bg-white/10 -z-10 rounded-full"></div>
          <div className={`absolute left-10 top-1/2 h-1 bg-[#FF006E] -z-10 rounded-full transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= num ? 'bg-[#FF006E] text-white shadow-[0_0_15px_rgba(255,0,110,0.5)]' : 'bg-gray-800 text-gray-400'}`}>
              {num}
            </div>
          ))}
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
          
          {/* STEP 1: IDENTIDAD BÁSICA */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
              <h2 className="text-xl font-bold text-white mb-2 md:col-span-2">📜 Paso 1: Identidad y Origen</h2>
              
              <div className="space-y-2">
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Nombre del Dulce *</label>
                <input required name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Pulparindo" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
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

              <div className="space-y-2 md:col-span-2">
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
          )}

          {/* STEP 2: MULTIMEDIA Y PERFIL DE SABOR */}
          {step === 2 && (
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
                <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Sensaciones / Etiquetas (en Inglés)</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e)=>setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(e); } } placeholder="Ej. spicy, sweet..." className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 outline-none focus:border-[#FF006E]" />
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
          )}

          {/* STEP 3: PRECIOS Y LOGÍSTICA */}
          {step === 3 && (
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
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
            {step > 1 ? (
              <button type="button" onClick={handlePrevStep} className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">
                ← Volver
              </button>
            ) : <div></div>}

            {step < 3 ? (
              <button type="button" onClick={handleNextStep} className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white font-bold shadow-lg hover:scale-105 transition-all">
                Continuar →
              </button>
            ) : null}
          </div>

        </form>
      </div>
    </div>
  );
}

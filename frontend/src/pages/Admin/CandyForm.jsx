import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dulcesService } from "../../../services/dulces.service";

export default function CandyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Si tenemos 'id' en los parámetros de la URL, estamos en modo Edición
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  
  // Estado base alineado al Schema de la BD Mongoose
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion_es: "",
    descripcion_en: "",
    precioBase: 0,
    pesoGramos: 0,
    stock: 0,
    imagenes: [""], // Usaremos el index 0 para la única URL pedida
    emoji: "🍬",
    categoria: "dulce",
    estadoOrigen: "",
    flavorTags: [],
    nivelPicor: 0,
    alergenos: [],
    disponibleParaEnvio: true
  });
  
  // Inputs temporales para los Arrays (tags)
  const [tagInput, setTagInput] = useState("");
  const [alergenoInput, setAlergenoInput] = useState("");

  // Si es modo Edit, cargamos el dulce del backend
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      dulcesService.getById(id)
        .then(data => setFormData({
          ...data,
          // Evitamos arrays vacíos en la UI
          imagenes: data.imagenes?.length ? data.imagenes : [""],
          flavorTags: data.flavorTags || [],
          alergenos: data.alergenos || []
        }))
        .catch(err => {
          console.error(err);
          alert("No se pudo cargar la información del dulce.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  // Manejo general de inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Sanitizamos los Inputs de tipo Number (String a Float/Int)
    let parsedValue = value;
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parsedValue
    }));
  };

  // Manejo especial de Imagen Principal
  const handleImageChange = (e) => {
    const newImgs = [...formData.imagenes];
    newImgs[0] = e.target.value;
    setFormData(prev => ({ ...prev, imagenes: newImgs }));
  }

  // Lógica Avanzada de Flavor Tags (Chips)
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.flavorTags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, flavorTags: [...prev.flavorTags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      flavorTags: prev.flavorTags.filter(t => t !== tagToRemove)
    }));
  };

  // Lógica de Alérgenos
  const handleAddAlergeno = (e) => {
    e.preventDefault();
    if (alergenoInput.trim() && !formData.alergenos.includes(alergenoInput.trim())) {
      setFormData(prev => ({ ...prev, alergenos: [...prev.alergenos, alergenoInput.trim()] }));
      setAlergenoInput("");
    }
  };
  const handleRemoveAlergeno = (alergenoToRemove) => {
    setFormData(prev => ({
      ...prev,
      alergenos: prev.alergenos.filter(a => a !== alergenoToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Limpieza de datos antes de enviar al backend
    const dataToSend = {
      ...formData,
      // Si el usuario no puso URL, que el arreglo vaya vacío al BD
      imagenes: formData.imagenes[0].trim() !== "" ? formData.imagenes : []
    };

    try {
      if (isEdit) {
        await dulcesService.updateDulce(id, dataToSend);
        alert("¡Dulce actualizado de manera exitosa! 🍬");
      } else {
        await dulcesService.createDulce(dataToSend);
        alert("¡Nuevo dulce inyectado al catálogo exitosamente! 🚀");
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error al intentar guardar el dulce en la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] mb-8 text-center">
          {isEdit ? "Editar Esencia de Dulce" : "Crear Nuevo Dulce Típico"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Nombre y Categoria */}
            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Nombre del Dulce</label>
              <input required name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Pulparindo" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>
            
            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 text-white/90 rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all">
                <option value="dulce">Dulce Convencional</option>
                <option value="picante">Picante / Enchilado</option>
                <option value="agridulce">Agridulce</option>
                <option value="tradicional">Tradicional Artesanal</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* 2. Descripciones */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Historia / Descripción en Español</label>
              <textarea required rows="3" name="descripcion_es" value={formData.descripcion_es} onChange={handleChange} placeholder="Cuéntanos el origen e historia de este dulce..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Story / English Description</label>
              <textarea required rows="3" name="descripcion_en" value={formData.descripcion_en} onChange={handleChange} placeholder="Translate the history..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>

            {/* 3. Precios y Pesos */}
            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Precio Base ($ MXN)</label>
              <input required type="number" min="0" step="0.5" name="precioBase" value={formData.precioBase} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Peso Físico (Gramos)</label>
              <input required type="number" min="0" name="pesoGramos" value={formData.pesoGramos} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Unidades en Stock</label>
              <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all" />
            </div>

            {/* 4. Origen y URL */}
            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Estado de Origen</label>
              <input required name="estadoOrigen" placeholder="Ej. Jalisco" value={formData.estadoOrigen} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">URL de la Fotografía Principal</label>
              <input type="url" placeholder="https://unsplash.com/foto-dulce.jpg" value={formData.imagenes[0] || ""} onChange={handleImageChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>

            {/* 5. Picor Slider Premium */}
            <div className="space-y-4 md:col-span-2 bg-gradient-to-r from-red-600/10 to-orange-500/10 p-6 rounded-2xl border border-red-500/20">
              <div className="flex justify-between items-center">
                <label className="text-white font-black text-lg">Intensidad de Picor:</label>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
                  {formData.nivelPicor} / 5 🌶️🔥
                </span>
              </div>
              <input type="range" name="nivelPicor" min="0" max="5" value={formData.nivelPicor} onChange={handleChange} className="w-full accent-[#FF006E] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              <p className="text-white/40 text-xs italic text-center">0 = Nada Picante | 5 = Extremadamente Picante</p>
            </div>

            {/* 6. Control Avanzado Arrays (FlavorTags y Alérgenos) */}
            <div className="space-y-3">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Etiquetas de Sabor (Tags)</label>
              <div className="flex gap-2 relative">
                <input value={tagInput} onChange={(e)=>setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(e); } } placeholder="Escribe y presiona Enter o +" className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 outline-none focus:border-[#FF006E] placeholder-white/30" />
                <button type="button" onClick={handleAddTag} className="bg-white/10 hover:bg-[#FF006E] text-white px-5 rounded-xl font-bold transition-colors shadow-md">+</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.flavorTags.map((tag, idx) => (
                  <span key={idx} className="bg-[#FF006E]/20 text-[#FF006E] border border-[#FF006E]/30 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#FF006E]/30 transition-colors">
                    #{tag} <button type="button" onClick={() => handleRemoveTag(tag)} className="text-white hover:text-red-400 font-bold rounded-full w-5 h-5 flex items-center justify-center">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Lista de Alérgenos</label>
              <div className="flex gap-2">
                <input value={alergenoInput} onChange={(e)=>setAlergenoInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddAlergeno(e); } } placeholder="Ej. Cacahuate, Lácteos" className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 outline-none focus:border-[#FB5607] placeholder-white/30" />
                <button type="button" onClick={handleAddAlergeno} className="bg-white/10 hover:bg-[#FB5607] text-white px-5 rounded-xl font-bold transition-colors shadow-md">+</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.alergenos.map((alergeno, idx) => (
                  <span key={idx} className="bg-[#FB5607]/20 text-[#FB5607] border border-[#FB5607]/30 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#FB5607]/30 transition-colors">
                    ⚠️ {alergeno} <button type="button" onClick={() => handleRemoveAlergeno(alergeno)} className="text-white hover:text-red-400 font-bold rounded-full w-5 h-5 flex items-center justify-center">×</button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          <button disabled={loading} type="submit" className={`w-full mt-10 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-4 font-black text-white text-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_20px_rgba(255,0,110,0.5)] hover:scale-[1.02] active:scale-95'}`}>
            {loading ? "Sincronizando con Servidor..." : (isEdit ? "Guardar Cambios del Dulce" : "Generar Nuevo Dulce")}
          </button>
        </form>
      </div>
    </div>
  );
}

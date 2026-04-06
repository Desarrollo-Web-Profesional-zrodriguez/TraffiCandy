import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dulcesService } from "../../services/dulces.service";
import toast from "react-hot-toast";

import CandyProgressBar from "../../components/CandyForm/CandyProgressBar";
import Step1Identity from "../../components/CandyForm/Step1Identity";
import Step2Media from "../../components/CandyForm/Step2Media";
import Step3Prices from "../../components/CandyForm/Step3Prices";

export default function CandyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "Artesanal",
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
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : parsedValue }));
  };

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

        <CandyProgressBar step={step} />

        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
          
          {step === 1 && <Step1Identity formData={formData} setFormData={setFormData} handleChange={handleChange} />}
          {step === 2 && <Step2Media formData={formData} setFormData={setFormData} handleChange={handleChange} />}
          {step === 3 && <Step3Prices formData={formData} handleChange={handleChange} loading={loading} isEdit={isEdit} />}

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

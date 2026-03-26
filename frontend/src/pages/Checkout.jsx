import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreReceptor: "",
    direccion: "",
    ciudad: "",
    estadoProvincia: "",
    pais: "MX",
    codigoPostal: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular un retraso en el servidor/pago
    setTimeout(() => {
      setLoading(false);
      alert("¡Pago simulado con éxito! Tu orden de dulces está en preparación. 🍬✈️");
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] mb-8 text-center flex items-center justify-center gap-3">
          Envío Internacional 🌐
        </h1>

        <form onSubmit={handleSimulatePayment} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Nombre de quien recibe</label>
              <input required name="nombreReceptor" value={formData.nombreReceptor} onChange={handleChange} placeholder="Ej. Juan Pérez" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Dirección completa</label>
              <textarea required rows="2" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, Número, Referencias..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Ciudad</label>
              <input required name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="Ej. Los Angeles" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Estado / Provincia</label>
              <input required name="estadoProvincia" value={formData.estadoProvincia} onChange={handleChange} placeholder="Ej. California" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">País</label>
              <select name="pais" value={formData.pais} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 text-white/90 rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all">
                <option value="MX">México 🇲🇽</option>
                <option value="US">Estados Unidos 🇺🇸</option>
                <option value="CA">Canadá 🇨🇦</option>
                <option value="CO">Colombia 🇨🇴</option>
                <option value="ES">España 🇪🇸</option>
                <option value="AR">Argentina 🇦🇷</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-white/80 font-bold ml-1 text-sm uppercase tracking-wider">Código Postal</label>
              <input required name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} placeholder="Ej. 90210" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-[#FF006E] outline-none transition-all placeholder-white/30" />
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20 text-center space-y-4">
              <h3 className="text-white font-bold text-lg">Resumen de Pago (Simulación)</h3>
              <p className="text-white/70 text-sm">El envío se calculará automáticamente según el peso de tus dulces y el país de destino.</p>
              
              <button disabled={loading} type="submit" className={`w-full mt-4 rounded-xl bg-gradient-to-r from-[#10a37f] to-[#0d8266] py-4 font-black text-white text-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-[0_0_20px_rgba(16,163,127,0.5)] hover:scale-[1.02] active:scale-95'}`}>
                {loading ? "Procesando el pago..." : "Simular Pago Mágico 💳✨"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

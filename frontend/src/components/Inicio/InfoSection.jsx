import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth.service";
import { useState } from "react";

export default function InfoSection() {
  const { usuario, isLoggedIn, updateUsuario } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Debes iniciar sesión para suscribirte.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.subscribe();
      if (res.ok) {
        toast.success(res.mensaje || '¡Gracias por suscribirte!');
        if (res.data?.token) {
          updateUsuario(res.data.token);
        }
      } else {
        toast.error(res.mensaje || "Error al suscribirse.");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // El boletín solo se muestra si el usuario está logueado y NO está suscrito
  const showNewsletter = isLoggedIn && !usuario?.suscrito;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8 py-16 mb-10 items-stretch">
      <div className={`flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500 ${!showNewsletter ? 'md:max-w-4xl mx-auto w-full' : ''}`}>
        <h3 className="text-3xl font-black text-white mb-4">Sobre Nosotros 🍬</h3>
        <p className="text-white/70 leading-relaxed text-lg mb-4">
          TraffiCandy nace con la misión de exportar alegría. Conocemos el valor nostálgico
          y la explosión de sabores que un verdadero dulce mexicano ofrece, y nos dedicamos
          a llevarlo hasta la puerta de tu hogar, sin importar dónde estés.
        </p>
        <ul className="text-white/80 space-y-2 font-medium">
          <li>✅ Envíos Internacionales Seguros</li>
          <li>✅ Auténtico 100% Mexicano</li>
          <li>✅ Empaques Ideales para Regalo</li>
        </ul>
      </div>

      {showNewsletter && (
        <div className="flex-1 bg-gradient-to-br from-[#FF006E]/20 to-[#8338EC]/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center animate-fade-in-right">
          <h3 className="text-3xl font-black text-white mb-4">¡Únete a la Familia! 💌</h3>
          <p className="text-white/80 leading-relaxed text-lg mb-6">
            Suscríbete a nuestro newsletter y recibe ofertas exclusivas, novedades y 
            un <span className="font-bold text-[#00F5D4]">10% de descuento</span> en tu primera compra.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              defaultValue={usuario?.email}
              readOnly
              className="flex-1 rounded-full px-6 py-4 bg-white/20 border border-white/30 text-white outline-none placeholder-white/50 cursor-not-allowed opacity-80" 
            />
            <button 
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-[#FFD60A] to-[#FB5607] px-8 py-4 font-bold text-[#1a0533] shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
            >
              {loading ? "Procesando..." : "Suscribirme"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

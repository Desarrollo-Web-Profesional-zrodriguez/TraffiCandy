import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden. Intenta de nuevo.");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.resetPassword(token, newPassword);
      alert(data.mensaje);

      if (data.ok) {
        // Redirigir al inicio de sesión si fue exitoso
        navigate("/login");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
            Establecer Nueva Contraseña
          </h2>
          <p className="text-white/60 text-sm mt-2">
            Por seguridad, tu nueva contraseña debe ser difícil de adivinar.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                       placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all"
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                       placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all"
          />

          <button
            type="submit"
            disabled={loading}
            className={`rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3 mt-2
                       font-bold text-white shadow-[0_0_15px_rgba(255,0,110,0.4)] transition-all
                       ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95'}`}
          >
            {loading ? "Actualizando..." : "Restablecer Contraseña"}
          </button>
        </form>
      </div>
    </section>
  );
}

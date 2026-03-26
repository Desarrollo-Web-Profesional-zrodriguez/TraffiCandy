import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Login() {
  const navigate = useNavigate();
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 2FA State
  const [is2FA, setIs2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  
  const [loading, setLoading] = useState(false);

  // --- Handlers para Login Básico ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      // Asumimos que si ok es true, pasamos al 2FA. En un sistema real, backend diría `requires2FA: true`
      if (data.ok || data.requires2FA) {
        setIs2FA(true); // Despliega la pantalla de OTP
      } else {
        alert(data.mensaje || "Credenciales incorrectas.");
      }
    } catch (error) {
      // Simulación de respuesta exitosa si el backend no está disponible para pasar a probar el UI
      alert("Simulando inicio de sesión exitoso hacia el chequeo 2FA...");
      setIs2FA(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers para 2FA OTP ---
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    let newCode = [...twoFactorCode];
    newCode[index] = element.value;
    setTwoFactorCode(newCode);

    // Focus siguiente input si escribió un número
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Regresar al input anterior al borrar
    if (e.key === "Backspace" && !twoFactorCode[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    const codeString = twoFactorCode.join("");
    if (codeString.length < 6) {
      alert("Por favor ingresa los 6 dígitos del código.");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.verify2FA(email, codeString);
      if (data.ok) {
        alert("¡Verificación exitosa! Bienvenido a TraffiCandy.");
        navigate("/");
      } else {
        alert(data.mensaje || "Código Incorrecto o Expirado.");
      }
    } catch (error) {
      // Simulación Frontend en caso de backend fallido
      alert("Simulación 2FA: ¡Código Aceptado! 🍬");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF006E]/30 rounded-full blur-3xl point-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FB5607]/30 rounded-full blur-3xl point-events-none"></div>

        {!is2FA ? (
          // ================= LOGIN CLÁSICO =================
          <div className="animate-fade-in z-10 relative">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-center mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-white/60 text-center text-sm mb-6">Ingresa al portal de TraffiCandy</p>
            
            <form className="flex flex-col gap-5" onSubmit={handleLoginSubmit}>
              <div className="space-y-1">
                <label className="text-white/80 font-bold text-xs uppercase ml-1">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  placeholder="admin@trafficandy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white
                            placeholder-white/30 outline-none focus:border-[#FF006E] transition-all"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-white/80 font-bold text-xs uppercase ml-1">Contraseña</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white
                            placeholder-white/30 outline-none focus:border-[#FF006E] transition-all"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className={`mt-2 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3.5
                          font-black text-white text-lg shadow-[0_0_15px_rgba(255,0,110,0.4)]
                          hover:scale-[1.02] active:scale-95 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? "Verificando..." : "Entrar →"}
              </button>
            </form>
          </div>
        ) : (
          // ================= 2FA VERIFICACIÓN =================
          <div className="animate-fade-in z-10 relative">
            <div className="flex justify-center mb-4">
              <div className="bg-[#FF006E]/20 p-4 rounded-full border border-[#FF006E]/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#FF006E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-white text-center mb-2">
              Doble Factor (2FA)
            </h1>
            <p className="text-white/70 text-center text-sm mb-6 leading-relaxed">
              Hemos enviado un código de seguridad a <strong className="text-white">{email}</strong>. Ingrésalo a continuación para continuar.
            </p>

            <form className="flex flex-col gap-6" onSubmit={handle2FASubmit}>
              {/* Contenedor de Inputs 6-Dígitos */}
              <div className="flex justify-center gap-2">
                {twoFactorCode.map((data, index) => {
                  return (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      className="w-12 h-14 text-center text-2xl font-black rounded-xl bg-white/5 border border-white/20 text-white
                                outline-none focus:border-[#FB5607] focus:bg-white/10 transition-all shadow-inner"
                    />
                  );
                })}
              </div>

              <div className="space-y-3">
                <button
                  disabled={loading || twoFactorCode.join("").length < 6}
                  type="submit"
                  className={`w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5
                            font-black text-white text-lg shadow-[0_0_15px_rgba(59,130,246,0.4)]
                            hover:scale-[1.02] active:scale-95 transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {loading ? "Validando..." : "Verificar Código"}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIs2FA(false)}
                  className="w-full text-center text-white/50 text-sm hover:text-white transition-colors"
                >
                  Regresar al Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

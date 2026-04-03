import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 'registro', 'login', o '2fa'
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);

  // ── Estados del formulario de registro ──
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── Estados del formulario de login ──
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  // ── Estados del 2FA ──
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  const [required2FAMethod, setRequired2FAMethod] = useState("");
  const [available2FAMethods, setAvailable2FAMethods] = useState([]);

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden. Intenta de nuevo.");
      return;
    }
    try {
      const data = await authService.register(nombre, email, password, "comprador");
      if (data.ok) {
        alert(`¡Cuenta creada! Ya puedes iniciar sesión.`);
        setView("login");
      } else {
        alert(data.mensaje || "Error al registrarse.");
      }
    } catch (error) {
      console.error("Error en register:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(loginEmail, loginPassword);

      if (data.ok && data.data?.token) {
        // Guardar JWT y actualizar contexto global
        login(data.data.token);

        const userRol = data.data.usuario?.rol;
        // Vendedor → panel admin; Comprador → inicio
        navigate(userRol === "vendedor" ? "/admin/dulce/nuevo" : "/");
      } else if (data.data?.requires2FA) {
        setRequired2FAMethod(data.data.requires2FA);
        setAvailable2FAMethods(data.data.methods || []);
        setView("2fa");
      } else {
        alert(data.mensaje || "Credenciales incorrectas.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.forgotPassword(loginEmail);
      alert(data.mensaje);
      if (data.ok) setShowForgot(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al conectar con el servidor para recuperar contraseña.");
    }
  };

  // ── Handlers para 2FA OTP ──
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newCode = [...twoFactorCode];
    newCode[index] = element.value;
    setTwoFactorCode(newCode);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  const handleOtpKeyDown = (e, index) => {
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
      const data = await authService.verify2FA(loginEmail, codeString);
      if (data.ok && data.data?.token) {
        login(data.data.token);
        navigate("/");
      } else {
        alert(data.mensaje || "Código Incorrecto o Expirado.");
      }
    } catch (error) {
      console.error("Error en 2FA:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailFallback = async () => {
    try {
      const res = await authService.sendEmail2FA(loginEmail, loginPassword);
      if (res.ok) {
        setRequired2FAMethod('email');
        alert("Código enviado a tu correo exitosamente.");
      } else {
        alert(res.mensaje || "Error al solicitar el código por correo.");
      }
    } catch (error) {
      alert("Error al contactar al servidor para enviar el correo.");
    }
  };

  // Helper para anchos del slide
  const slideMap = { login: "0%", registro: "-33.333%", "2fa": "-66.666%" };

  // Clases compartidas de inputs
  const inputCls =
    "rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white " +
    "placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all";

  const btnPrimary =
    "rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3 mt-2 " +
    "font-bold text-white shadow-[0_0_15px_rgba(255,0,110,0.4)] " +
    "hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95 transition-all";

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">

      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative">

        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF006E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FB5607]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header / Selector de Vistas (Oculto en 2FA) */}
        <AnimatePresence>
          {view !== "2fa" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex relative border-b border-white/10"
            >
              {["login", "registro"].map((v) => (
                <button
                  key={v}
                  className={`flex-1 py-4 text-center font-bold text-lg z-10 transition-colors capitalize ${
                    view === v ? "text-white" : "text-white/50 hover:text-white/80"
                  }`}
                  onClick={() => setView(v)}
                >
                  {v === "login" ? "Iniciar Sesión" : "Registrarse"}
                </button>
              ))}
              <motion.div
                className="absolute bottom-0 h-1 bg-gradient-to-r from-[#FF006E] to-[#FB5607] rounded-full"
                initial={false}
                animate={{ left: view === "login" ? "0%" : "50%", width: "50%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zona de Formularios con Animación de Deslizamiento */}
        <div className="relative w-full h-[440px] overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-[300%] h-full flex"
            initial={false}
            animate={{ x: slideMap[view] }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >

            {/* ──────────── 1. Vista de Login ──────────── */}
            <div className="w-1/3 h-full p-8">
              <div className="mb-5 text-center">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
                  {showForgot ? "Recupera tu cuenta" : "Bienvenido de vuelta"}
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  {showForgot ? "Te enviaremos un enlace de contraseña" : "Ingresa para acceder a tu cuenta"}
                </p>
              </div>

              {showForgot ? (
                <form className="flex flex-col gap-4" onSubmit={handleForgotSubmit}>
                  <input type="email" placeholder="Correo electrónico" value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} required className={inputCls} />
                  <div className="flex justify-end text-sm">
                    <button type="button" onClick={() => setShowForgot(false)} className="text-white/50 hover:text-white transition-colors">
                      Volver al Login
                    </button>
                  </div>
                  <button type="submit" className={btnPrimary}>Enviar Enlace</button>
                </form>
              ) : (
                <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit}>
                  <input type="email" placeholder="Correo electrónico" value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} required className={inputCls} />
                  <input type="password" placeholder="Contraseña" value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)} required className={inputCls} />
                  <div className="flex justify-end text-sm">
                    <button type="button" onClick={() => setShowForgot(true)} className="text-white/50 hover:text-white transition-colors">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <button disabled={loading} type="submit"
                    className={`${btnPrimary} ${loading ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}`}>
                    {loading ? "Verificando..." : "Entrar →"}
                  </button>
                </form>
              )}
            </div>

            {/* ──────────── 2. Vista de Registro ──────────── */}
            <div className="w-1/3 h-full p-8">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
                  Crea tu cuenta
                </h2>
                <p className="text-white/60 text-sm mt-1">Elige cómo quieres participar</p>
              </div>

              <form className="flex flex-col gap-3" onSubmit={handleRegisterSubmit}>
                <input type="text" placeholder="Nombre completo" value={nombre}
                  onChange={(e) => setNombre(e.target.value)} className={inputCls} />
                <input type="email" placeholder="Correo electrónico" value={email}
                  onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
                <input type="password" placeholder="Contraseña" value={password}
                  onChange={(e) => setPassword(e.target.value)} required className={inputCls} />
                <input type="password" placeholder="Confirmar Contraseña" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} required className={inputCls} />

                <button type="submit" className={btnPrimary}>Registrarme</button>
              </form>
            </div>

            {/* ──────────── 3. Vista de 2FA ──────────── */}
            <div className="w-1/3 h-full p-8 flex flex-col justify-center relative">
              <div className="flex justify-center mb-2 mt-4">
                <div className={`p-3 rounded-full border ${required2FAMethod === 'app' ? 'bg-green-500/20 border-green-500/30' : 'bg-[#FF006E]/20 border-[#FF006E]/30'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${required2FAMethod === 'app' ? 'text-green-500' : 'text-[#FF006E]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <h2 className={`text-xl font-black text-transparent bg-clip-text text-center mb-1 ${required2FAMethod === 'app' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}>
                Seguridad ({required2FAMethod === 'app' ? 'App' : 'Correo'})
              </h2>
              <p className="text-white/60 text-center text-xs mb-6 px-1">
                {required2FAMethod === 'app' 
                  ? "Abre tu aplicación autenticadora y coloca el código temporal."
                  : "Enviamos un código de 6 dígitos a tu bandeja de correo."}
              </p>

              <form className="flex flex-col gap-4" onSubmit={handle2FASubmit}>
                <div className="flex justify-center gap-2">
                  {twoFactorCode.map((data, index) => (
                    <input key={index} type="text" maxLength="1" value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      className={`w-10 h-12 text-center text-xl font-black rounded-xl bg-white/5 border border-white/20 text-white outline-none transition-all shadow-inner ${required2FAMethod === 'app' ? 'focus:border-green-500' : 'focus:border-blue-500'} focus:bg-white/10`}
                    />
                  ))}
                </div>

                <div className="space-y-3 mt-1">
                  <button disabled={loading || twoFactorCode.join("").length < 6} type="submit"
                    className={`w-full rounded-xl py-3 font-black text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      required2FAMethod === 'app' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    }`}>
                    {loading ? "Validando..." : "Verificar y Entrar"}
                  </button>
                  
                  <div className="flex flex-col items-center gap-2 mt-4">
                    {available2FAMethods.includes("email") && required2FAMethod === 'app' && (
                      <button type="button" onClick={handleSendEmailFallback} className="text-sm font-semibold text-[#FFD60A] hover:text-[#FB5607] transition-colors underline">
                        ¿No tienes la app? Usa tu correo
                      </button>
                    )}
                    
                    <button type="button"
                      onClick={() => { setView("login"); setTwoFactorCode(["","","","","",""]); }}
                      className="text-white/50 text-xs hover:text-white transition-colors uppercase tracking-wider font-bold">
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

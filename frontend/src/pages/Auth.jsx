import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { authService } from "../services/auth.service";

export default function Auth() {
  // 'registro' o 'login'
  const [view, setView] = useState("registro");

  // Estados del formulario de registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados del formulario de login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleRegisterSubmit = async (e) => {
  e.preventDefault()
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden. Intenta de nuevo.')
    return
  }

  try {
    const data = await authService.register(email, password)
    if (data.ok) {
      alert('¡Cuenta creada! Ya puedes iniciar sesión.')
      setView('login')
    } else {
      alert(data.mensaje || 'Error al registrarse.')
    }
  } catch (error) {
    console.error('Error en register:', error)
    alert('Error al conectar con el servidor.')
  }
}

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(loginEmail, loginPassword);
      
      if (data.ok) {
        alert("¡Bienvenido de vuelta!");
        // TODO: Redirect o set state global
      } else {
        alert(data.mensaje || "Error al iniciar sesión.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.forgotPassword(loginEmail);
      alert(data.mensaje); // Mensaje devuelto por el backend
      if (data.ok) setShowForgot(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
      
      {/* Contenedor Principal con Glassmorphism */}
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* Header / Selector de Vistas */}
        <div className="flex relative border-b border-white/10">
          <button
            className={`flex-1 py-4 text-center font-bold text-lg z-10 transition-colors ${
              view === "login" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => setView("login")}
          >
            Iniciar Sesión
          </button>
          <button
            className={`flex-1 py-4 text-center font-bold text-lg z-10 transition-colors ${
              view === "registro" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => setView("registro")}
          >
            Registrarse
          </button>
          
          {/* Indicador animado debajo del botón activo */}
          <motion.div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-[#FF006E] to-[#FB5607] rounded-full"
            initial={false}
            animate={{
              left: view === "login" ? "0%" : "50%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Zona de Formularios con Animación de Deslizamiento (Slide) */}
        <div className="relative w-full h-[380px] overflow-hidden">
          
          <motion.div
            className="absolute top-0 left-0 w-[200%] h-full flex"
            initial={false}
            animate={{
              x: view === "login" ? "0%" : "-50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            
            {/* 1. Vista de Login */}
            <div className="w-1/2 h-full p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
                  {showForgot ? "Recupera tu cuenta" : "Bienvenido de vuelta"}
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  {showForgot 
                    ? "Te enviaremos un enlace para cambiar tu contraseña" 
                    : "Ingresa para acceder a tu cuenta"}
                </p>
              </div>

              {showForgot ? (
                <form className="flex flex-col gap-4" onSubmit={handleForgotSubmit}>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                               placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all"
                  />
                  <div className="flex justify-end text-sm">
                    <button type="button" onClick={() => setShowForgot(false)} className="text-white/50 hover:text-white transition-colors">Volver al Login</button>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3 mt-2
                               font-bold text-white shadow-[0_0_15px_rgba(255,0,110,0.4)] hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Enviar Enlace
                  </button>
                </form>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                               placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all"
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                               placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all"
                  />
                  
                  <div className="flex justify-end text-sm">
                    <button type="button" onClick={() => setShowForgot(true)} className="text-white/50 hover:text-white transition-colors">¿Olvidaste tu contraseña?</button>
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3 mt-2
                               font-bold text-white shadow-[0_0_15px_rgba(255,0,110,0.4)] hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Entrar
                  </button>
                </form>
              )}
            </div>

            {/* 2. Vista de Registro */}
            <div className="w-1/2 h-full p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
                  Crea tu cuenta
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  Únete para guardar tus dulces favoritos
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleRegisterSubmit}>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                             placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                             placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all"
                />
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white
                             placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3 mt-2
                             font-bold text-white shadow-[0_0_15px_rgba(255,0,110,0.4)] hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Registrarme
                </button>
              </form>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}

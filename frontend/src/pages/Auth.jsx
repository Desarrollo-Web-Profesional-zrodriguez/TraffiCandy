import { useState } from "react";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden. Intenta de nuevo.");
      return;
    }
    
    // Aquí iría el fetch de registro (POST a /api/auth/register, etc.)
    // Como backend solo pide email y password:
    alert("Formulario de registro enviado (Falta endpoint en backend):\nEmail: " + email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      
      if (data.ok) {
        alert("¡Bienvenido de vuelta!");
        // TODO: Redirect o set state global
      } else {
        alert(data.mensaje || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error("Error en login:", error);
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
                  Bienvenido de vuelta
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  Ingresa para acceder a tu cuenta
                </p>
              </div>

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
                  <a href="#" className="text-white/50 hover:text-white transition-colors">¿Olvidaste tu contraseña?</a>
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3 mt-2
                             font-bold text-white shadow-[0_0_15px_rgba(255,0,110,0.4)] hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Entrar
                </button>
              </form>
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

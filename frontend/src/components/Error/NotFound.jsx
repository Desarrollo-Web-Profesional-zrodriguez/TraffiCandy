import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo1 from "../../assets/logo1.png";

export default function NotFound() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds <= 0) {
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, navigate]);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FF006E]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#FB5607]/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 text-center"
      >
        {/* logo1 Asset with floating animation */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75" />
          <img
            src={logo1}
            alt="TraffiCandy Logo"
            className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto drop-shadow-[0_0_30px_rgba(255,0,110,0.5)]"
          />
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#FF006E] via-[#FB5607] to-[#FFD60A] drop-shadow-2xl">
          404
        </h1>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="mt-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            ¡Ups! Este dulce no existe.
          </h2>
          <p className="text-white/60 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Parece que te has perdido en nuestra fábrica. No te preocupes,
            estamos preparándote una ruta de regreso.
          </p>
        </motion.div>

        {/* Auto-redirect indicator */}
        <div className="mt-8 mb-10">
          <div className="flex items-center justify-center gap-3 text-[#FFD60A] font-bold text-sm uppercase tracking-widest">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD60A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD60A]"></span>
            </span>
            Regresando al inicio en {seconds}s
          </div>
          
          {/* Progress bar timer */}
          <div className="w-48 h-1 background-white/10 mx-auto mt-3 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-gradient-to-r from-[#FF006E] to-[#FB5607]"
               initial={{ width: "100%" }}
               animate={{ width: "0%" }}
               transition={{ duration: 10, ease: "linear" }}
             />
          </div>
        </div>

        {/* Action Button */}
        <Link
          to="/"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-200 bg-gradient-to-r from-[#FF006E] to-[#FB5607] rounded-2xl hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,110,0.6)]"
        >
          <span className="mr-2">🏠</span>
          REGRESAR AHORA
          
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </motion.div>

      {/* Floating Sparkles */}
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-20" />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-40 delay-300" />
    </section>
  );
}
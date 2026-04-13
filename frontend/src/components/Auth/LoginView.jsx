import React from "react";
import PasswordChecklist from "./PasswordChecklist";

export default function LoginView({
  view,
  loading,
  showForgot,
  setShowForgot,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLoginSubmit,
  handleForgotSubmit,
  inputCls,
  btnPrimary,
}) {
  return (
    <div className="w-1/3 h-full p-8 overflow-y-auto custom-scrollbar">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
          {showForgot ? "Recupera tu cuenta" : "Bienvenido de vuelta"}
        </h2>
        <p className="text-white/60 text-sm mt-1">
          {showForgot
            ? "Te enviaremos un enlace de contraseña"
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
            className={inputCls}
            tabIndex={view === "login" ? 0 : -1}
          />
          <div className="flex justify-end text-sm">
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="text-white/50 hover:text-white transition-colors"
              tabIndex={view === "login" ? 0 : -1}
            >
              Volver al login
            </button>
          </div>
          <button
            disabled={loading}
            type="submit"
            className={`${btnPrimary} ${loading ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}`}
            tabIndex={view === "login" ? 0 : -1}
          >
            {loading ? "Enviando..." : "Enviar Enlace"}
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            className={inputCls}
            tabIndex={view === "login" ? 0 : -1}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            className={inputCls}
            tabIndex={view === "login" ? 0 : -1}
          />
          <PasswordChecklist password={loginPassword} />
          <div className="flex justify-end text-sm">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-white/50 hover:text-white transition-colors"
              tabIndex={view === "login" ? 0 : -1}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <button
            disabled={loading}
            type="submit"
            className={`${btnPrimary} ${loading ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}`}
            tabIndex={view === "login" ? 0 : -1}
          >
            {loading ? "Verificando..." : "Entrar →"}
          </button>
        </form>
      )}
    </div>
  );
}

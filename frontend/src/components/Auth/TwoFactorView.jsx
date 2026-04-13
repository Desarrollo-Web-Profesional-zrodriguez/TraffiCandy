import React from "react";

export default function TwoFactorView({
  view,
  loading,
  required2FAMethod,
  available2FAMethods,
  twoFactorCode,
  handleOtpChange,
  handleOtpKeyDown,
  handle2FASubmit,
  handleSendEmailFallback,
  setView,
  setTwoFactorCode,
}) {
  return (
    <div className="w-1/3 h-full p-8 flex flex-col justify-center relative overflow-y-auto custom-scrollbar">
      <div className="flex justify-center mb-2 mt-4">
        <div
          className={`p-3 rounded-full border ${required2FAMethod === "app" ? "bg-green-500/20 border-green-500/30" : "bg-[#FF006E]/20 border-[#FF006E]/30"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 ${required2FAMethod === "app" ? "text-green-500" : "text-[#FF006E]"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      <h2
        className={`text-xl font-black text-transparent bg-clip-text text-center mb-1 ${required2FAMethod === "app" ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-blue-400 to-indigo-500"}`}
      >
        Seguridad ({required2FAMethod === "app" ? "App" : "Correo"})
      </h2>
      <p className="text-white/60 text-center text-xs mb-6 px-1">
        {required2FAMethod === "app"
          ? "Ingresa el código de 6 dígitos de tu App o un Código de Respaldo."
          : "Enviamos un código de 6 dígitos a tu bandeja de correo."}
      </p>

      <form className="flex flex-col gap-4" onSubmit={handle2FASubmit}>
        <div className="flex justify-center gap-2">
          {twoFactorCode.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleOtpChange(e.target, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className={`w-10 h-12 text-center text-xl font-black rounded-xl bg-white/5 border border-white/20 text-white outline-none transition-all shadow-inner ${required2FAMethod === "app" ? "focus:border-green-500" : "focus:border-blue-500"} focus:bg-white/10`}
              tabIndex={view === "2fa" ? 0 : -1}
            />
          ))}
        </div>

        <div className="space-y-3 mt-1">
          <button
            disabled={loading || twoFactorCode.join("").length < 6}
            type="submit"
            className={`w-full rounded-xl py-3 font-black text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              required2FAMethod === "app"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            }`}
            tabIndex={view === "2fa" ? 0 : -1}
          >
            {loading ? "Validando..." : "Verificar y Entrar"}
          </button>

          <div className="flex flex-col items-center gap-2 mt-4">
            {available2FAMethods.includes("email") &&
              required2FAMethod === "app" && (
                <button
                  disabled={loading}
                  type="button"
                  onClick={handleSendEmailFallback}
                  className="text-sm font-semibold text-[#FFD60A] hover:text-[#FB5607] transition-colors underline disabled:opacity-50 disabled:cursor-wait"
                  tabIndex={view === "2fa" ? 0 : -1}
                >
                  ¿No tienes la app? Usa tu correo
                </button>
              )}

            <button
              type="button"
              onClick={() => {
                setView("login");
                setTwoFactorCode(["", "", "", "", "", ""]);
              }}
              className="text-white/50 text-xs hover:text-white transition-colors uppercase tracking-wider font-bold"
              tabIndex={view === "2fa" ? 0 : -1}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

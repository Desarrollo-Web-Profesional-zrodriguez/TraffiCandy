import React from "react";

export default function RegisterView({
  view,
  nombre,
  setNombre,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleRegisterSubmit,
  passwordCriteria,
  inputCls,
  btnPrimary,
}) {
  return (
    <div className="w-1/3 h-full p-8">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607]">
          Crea tu cuenta
        </h2>
        <p className="text-white/60 text-sm mt-1">
          Elige cómo quieres participar
        </p>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleRegisterSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputCls}
          tabIndex={view === "registro" ? 0 : -1}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputCls}
          tabIndex={view === "registro" ? 0 : -1}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputCls}
          tabIndex={view === "registro" ? 0 : -1}
        />

        {password.length > 0 && (
          <div className="bg-black/20 p-3 rounded-xl border border-white/10 text-xs space-y-1">
            <p className="text-white/80 font-bold mb-2">
              Tu contraseña debe tener:
            </p>

            <div
              className={`flex items-center gap-2 ${passwordCriteria.length ? "text-green-400" : "text-white/50"}`}
            >
              <span>{passwordCriteria.length ? "✓" : "○"}</span> Mínimo 8
              caracteres
            </div>
            <div
              className={`flex items-center gap-2 ${passwordCriteria.upper ? "text-green-400" : "text-white/50"}`}
            >
              <span>{passwordCriteria.upper ? "✓" : "○"}</span> Una letra
              mayúscula
            </div>
            <div
              className={`flex items-center gap-2 ${passwordCriteria.lower ? "text-green-400" : "text-white/50"}`}
            >
              <span>{passwordCriteria.lower ? "✓" : "○"}</span> Una letra
              minúscula
            </div>
            <div
              className={`flex items-center gap-2 ${passwordCriteria.number ? "text-green-400" : "text-white/50"}`}
            >
              <span>{passwordCriteria.number ? "✓" : "○"}</span> Un número
            </div>
            <div
              className={`flex items-center gap-2 ${passwordCriteria.special ? "text-green-400" : "text-white/50"}`}
            >
              <span>{passwordCriteria.special ? "✓" : "○"}</span> Un carácter
              especial (!@#$...)
            </div>
          </div>
        )}
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={inputCls}
          tabIndex={view === "registro" ? 0 : -1}
        />

        <button
          type="submit"
          className={btnPrimary}
          tabIndex={view === "registro" ? 0 : -1}
        >
          Registrarme
        </button>
      </form>
    </div>
  );
}

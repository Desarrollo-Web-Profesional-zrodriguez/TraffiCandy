import React from "react";
import PasswordChecklist from "./PasswordChecklist";

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
  inputCls,
  btnPrimary,
}) {
  return (
    <div className="w-1/3 h-full p-8 overflow-y-auto custom-scrollbar">
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

        <PasswordChecklist password={password} />

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

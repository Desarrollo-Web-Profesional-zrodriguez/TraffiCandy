import React from "react";

export default function PasswordChecklist({ password }) {
  if (!password) return null;

  const criteria = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Una mayúscula", met: /[A-Z]/.test(password) },
    { label: "Una minúscula", met: /[a-z]/.test(password) },
    { label: "Un número", met: /[0-9]/.test(password) },
    { label: "Un signo", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  return (
    <div className="bg-black/20 p-3 rounded-xl border border-white/10 text-[10px] space-y-1">
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        {criteria.map((c, i) => (
          <div key={i} className={`flex items-center gap-1.5 ${c.met ? "text-green-400" : "text-white/40"}`}>
            <span className="text-xs">{c.met ? "✓" : "○"}</span>
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

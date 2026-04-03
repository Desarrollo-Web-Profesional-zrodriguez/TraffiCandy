import toast from "react-hot-toast";

/**
 * Muestra un diálogo estandarizado flotante de confirmación (glassmorphism) usando react-hot-toast.
 * @param {string} message El mensaje principal a mostrar al usuario.
 * @param {string} title (Opcional) El encabezado/título de la acción.
 * @returns {Promise<boolean>} Retorna true si el usuario aceptó, false si canceló.
 */
export const customConfirm = (message, title = "CONFIRMAR ACCIÓN") => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-[220px]">
          <div>
            <h4 className="font-black text-white/90 text-[10px] tracking-widest uppercase mb-1 flex items-center gap-1">
              <span>⚠️</span> {title}
            </h4>
            <p className="text-white/80 text-sm font-medium leading-tight">
              {message}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="flex-1 bg-gradient-to-r from-red-600 to-[#FF006E] hover:scale-105 active:scale-95 text-white shadow-md text-xs font-bold py-2 rounded-lg transition-all"
            >
              Sí, proceder
            </button>

            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 hover:text-white border border-white/20 text-white/70 text-xs font-bold py-2 rounded-lg transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // No desaparece solo, el usuario tiene que elegir
        style: {
          background: "rgba(20, 5, 30, 0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 0, 110, 0.4)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 0, 110, 0.15)",
          color: "#fff",
        },
      }
    );
  });
};

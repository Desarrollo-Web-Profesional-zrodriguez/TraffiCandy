export default function Login() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-8 shadow-xl">
        <h1 className="text-3xl font-black text-white text-center mb-6">
          Iniciar sesión
        </h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Correo electrónico"
            className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white
                       placeholder-white/50 outline-none focus:border-[#FF006E] transition-colors"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white
                       placeholder-white/50 outline-none focus:border-[#FF006E] transition-colors"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3
                       font-bold text-white shadow-md hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}

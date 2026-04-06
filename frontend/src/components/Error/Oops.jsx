export default function Oops({ error }) {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-fade-in">
      <span className="text-7xl mb-4">💥</span>
      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] mb-4">¡Ups! Algo se rompió</h1>
      <p className="text-white/70 text-lg max-w-lg mb-6">Encontramos un problema inesperado mientras preparábamos tus dulces. Nuestro equipo de oompa loompas ya está revisándolo.</p>
      
      {error && (
        <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-left max-w-xl overflow-auto text-sm text-red-400 font-mono break-words">
          {error.toString()}
        </div>
      )}

      <button onClick={() => window.location.href = '/'} className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">
        Volver al Inicio a Salvo
      </button>
    </section>
  )
}

export default function Catalogo() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <span className="text-7xl mb-4" role="img" aria-label="catálogo">
        🍭
      </span>
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
        Catálogo
      </h1>
      <p className="text-white/70 text-lg">
        Aquí irán los productos disponibles para exportación.
      </p>
    </section>
  );
}

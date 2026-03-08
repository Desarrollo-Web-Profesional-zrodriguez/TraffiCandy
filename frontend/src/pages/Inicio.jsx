export default function Inicio() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <span
        className="text-7xl mb-4 animate-bounce"
        role="img"
        aria-label="dulces"
      >
        🍬
      </span>
      <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
        Bienvenido a{" "}
        <span className="bg-gradient-to-r from-[#FF006E] to-[#FFD60A] bg-clip-text text-transparent">
          TrafiCandy
        </span>
      </h1>
      <p className="text-white/70 text-lg max-w-xl">
        La plataforma de exportación de dulces mexicanos más dulce del mundo. 🌮
      </p>
    </section>
  );
}

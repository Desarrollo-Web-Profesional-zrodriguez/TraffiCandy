import { motion } from "framer-motion";
import heroCandy from '../../assets/logo1.png';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[75vh] flex flex-col items-center justify-center px-4 text-center mt-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <img 
          src={heroCandy} 
          alt="Dulce Mexicano Estrella" 
          className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-[3rem] shadow-[0_0_50px_rgba(255,0,110,0.5)] border-4 border-white/10" 
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-xl"
      >
        El paraíso de los dulces a un <br className="hidden md:block"/> clic de tu puerta
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-white/80 text-xl md:text-2xl max-w-3xl mb-10 font-medium leading-relaxed"
      >
        Exportamos la magia y el sabor auténtico de los dulces mexicanos a
        cualquier rincón del mundo.
      </motion.p>
    </section>
  );
}

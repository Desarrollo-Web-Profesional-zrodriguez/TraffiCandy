import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTAButtons() {
  return (
    <section className="w-full flex justify-center py-10 pb-20">
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5 }}
      >
        <Link
          to="/catalogo"
          className="rounded-full inline-block bg-gradient-to-r from-[#FF006E] to-[#FB5607] px-10 py-5 text-xl font-bold text-white shadow-[0_0_30px_rgba(255,0,110,0.4)] hover:shadow-[0_0_40px_rgba(255,0,110,0.6)] hover:scale-105 transition-all duration-300"
        >
          Ver Catálogo de Productos
        </Link>
      </motion.div>
    </section>
  );
}

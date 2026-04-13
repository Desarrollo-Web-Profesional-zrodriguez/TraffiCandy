import toast from "react-hot-toast";

// Hooks & Context
import { useDulces } from "../hooks/useDulces";
import { useCart } from "../context/CartContext";

// Components
import DulceBot from '../components/DulceBot/DulceBot';
import Hero from "../components/Inicio/Hero";
import MapSection from "../components/Inicio/MapSection";
import CTAButtons from "../components/Inicio/CTAButtons";
import ProductSliders from "../components/Inicio/ProductSliders";
import InfoSection from "../components/Inicio/InfoSection";

export default function Inicio() {
  const { dulces, loading } = useDulces();
  const { agregarAlCarrito } = useCart();

  const handleAddToCart = (dulce) => {
    agregarAlCarrito(dulce, 1);
    toast.success(`${dulce.nombre || 'Producto'} agregado al carrito`);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen overflow-hidden pb-10">
      
      {/* ── 1. Mapa Interactivo (Ahora Prioridad #1) ── */}
      <MapSection />

      {/* ── 2. Botones (Call to action) ── */}
      <CTAButtons />

      {/* ── 3. Sliders (Top Dulces & Más Comprados) ── */}
      <ProductSliders 
        dulces={dulces} 
        loading={loading} 
        onAddToCart={handleAddToCart} 
      />

      {/* ── 4. Información de Apoyo y Newsletter ── */}
      <InfoSection />

      <DulceBot />
    </div>
  );
}



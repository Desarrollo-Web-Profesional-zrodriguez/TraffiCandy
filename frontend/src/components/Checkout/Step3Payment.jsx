import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Step3Payment({ formData }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-2">💳 Paso 3: Confirmación de Pago</h2>
      
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-white space-y-3">
        <h3 className="font-bold text-[#FB5607] border-b border-white/10 pb-2 mb-4">Resumen de Envío</h3>
        <p><strong>Receptor:</strong> {formData.nombreReceptor || 'N/A'}</p>
        <p><strong>Destino:</strong> {formData.direccion || 'N/A'}</p>
        <p><strong>Referencias:</strong> {formData.referencias || 'N/A'}</p>
        <p><strong>Ubicación:</strong> {formData.ciudad}, {formData.estadoProvincia}, {formData.codigoPostal} - {formData.pais}</p>
      </div>

      <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 p-6 rounded-2xl border border-blue-500/20 text-center space-y-4">
        <h3 className="text-white font-bold text-xl">Pagar con PayPal Seguramente</h3>
        <p className="text-white/70 text-sm mb-4">Usa tu cuenta de PayPal o Tarjeta de Crédito/Débito.</p>
        
        <div className="max-w-md mx-auto relative z-0">
          <PayPalScriptProvider options={{ clientId: "Af8sjYN_QIXasRJIJdofe8cuN0PL6SaXDgOd5wncvyffpdVAP9DTD4zggIo8AdGIKcV3ah0SNwM2214v", currency: "MXN" }}>
            <PayPalButtons 
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: { value: "500.00" } // Simulación (MXN 500)
                  }]
                });
              }}
              onApprove={async (data, actions) => {
                try {
                  const details = await actions.order.capture();
                  toast.success(`¡Pago completado con éxito por ${details.payer.name.given_name}! 🍬✈️`);
                  navigate("/");
                } catch (error) {
                  console.error("Error capturando pago:", error);
                  toast.error("Hubo un error procesando el pago con PayPal.");
                }
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}

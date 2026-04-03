import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Step3Payment({ formData, totalOverride }) {
  const navigate = useNavigate()
  const { carrito, total, vaciarCarrito } = useCart()
  const totalFinal = totalOverride || total

  const procesarOrden = async () => {
    try {
      const token = localStorage.getItem('tc_token')
      await fetch(`${API_URL}/api/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items: carrito.map(item => ({ productoId: item._id, cantidad: item.cantidad })),
          direccionEnvio: formData
        })
      })
      vaciarCarrito()
      toast.success('¡Orden confirmada! Tus dulces están en camino 🍬✈️')
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error('Error al procesar la orden')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-2">💳 Paso 3: Confirmación de Pago</h2>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-white space-y-3">
        <h3 className="font-bold text-[#FB5607] border-b border-white/10 pb-2 mb-4">Resumen de Envío</h3>
        <p><strong>Receptor:</strong> {formData.nombreReceptor || 'N/A'}</p>
        <p><strong>Destino:</strong> {formData.direccion || 'N/A'}</p>
        <p><strong>Referencias:</strong> {formData.referencias || 'N/A'}</p>
        <p><strong>Ubicación:</strong> {formData.ciudad}, {formData.estadoProvincia}, {formData.codigoPostal} - {formData.pais}</p>
        <div className="pt-3 border-t border-white/10 flex justify-between">
          <span className="font-bold">Total a pagar:</span>
          <span className="text-[#FF006E] font-black text-xl">${totalFinal.toFixed(2)} MXN</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 p-6 rounded-2xl border border-blue-500/20 text-center space-y-4">
        <h3 className="text-white font-bold text-xl">Pagar con PayPal</h3>
        <p className="text-white/70 text-sm">Usa tu cuenta de PayPal o Tarjeta de Crédito/Débito.</p>
        <div className="max-w-md mx-auto relative z-0">
          <PayPalScriptProvider options={{ clientId: "Af8sjYN_QIXasRJIJdofe8cuN0PL6SaXDgOd5wncvyffpdVAP9DTD4zggIo8AdGIKcV3ah0SNwM2214v", currency: "MXN" }}>
            <PayPalButtons
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
              createOrder={(data, actions) => actions.order.create({
                purchase_units: [{ amount: { value: totalFinal.toFixed(2) } }]
              })}
              onApprove={async (data, actions) => {
                try {
                  await actions.order.capture()
                  await procesarOrden()
                } catch (error) {
                  toast.error('Error capturando el pago')
                }
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  )
}
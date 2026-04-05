import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import CheckoutProgressBar from '../components/Checkout/CheckoutProgressBar'
import Step1Delivery from '../components/Checkout/Step1Delivery'
import Step2CartSummary from '../components/Checkout/Step2CartSummary'
import Step3Payment from '../components/Checkout/Step3Payment'

export default function Checkout() {
  const [step, setStep] = useState(1)
  const [totalConPromo, setTotalConPromo] = useState(0)
  const { carrito } = useCart()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nombreReceptor: '',
    direccion: '',
    referencias: '',
    ciudad: '',
    estadoProvincia: '',
    pais: 'MX',
    codigoPostal: ''
  })

  useEffect(() => {
    if (carrito.length === 0) {
      toast.error('Tu carrito está vacío 🍬')
      navigate('/catalogo')
    }
  }, [carrito])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.nombreReceptor.trim()) {
        toast.error('El nombre del receptor es requerido')
        return
      }
      if (!formData.direccion.trim()) {
        toast.error('La dirección es requerida')
        return
      }
      if (!formData.ciudad.trim()) {
        toast.error('La ciudad es requerida')
        return
      }
      if (formData.codigoPostal && !/^\d{4,6}$/.test(formData.codigoPostal)) {
        toast.error('El código postal debe tener entre 4 y 6 dígitos')
        return
      }
    }

    if (step === 2 && carrito.length === 0) {
      toast.error('Agrega al menos un producto al carrito 🍬')
      return
    }

    setStep(s => s + 1)
  }

  const handlePrevStep = () => setStep(s => s - 1)

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
      <div className="w-full max-w-[1200px] bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl mx-auto transition-all duration-500">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FB5607] mb-4 text-center">
          Envío Internacional 🌐
        </h1>

        <CheckoutProgressBar step={step} />

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {step === 1 && <Step1Delivery formData={formData} setFormData={setFormData} handleChange={handleChange} />}
          {step === 2 && <Step2CartSummary onTotalChange={setTotalConPromo} />}
          {step === 3 && <Step3Payment formData={formData} totalOverride={totalConPromo} />}

          <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
            {step > 1 ? (
              <button type="button" onClick={handlePrevStep} className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">
                ← Volver
              </button>
            ) : <div></div>}
            {step < 3 ? (
              <button type="button" onClick={handleNextStep} className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white font-bold shadow-lg hover:scale-105 transition-all">
                Continuar →
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}
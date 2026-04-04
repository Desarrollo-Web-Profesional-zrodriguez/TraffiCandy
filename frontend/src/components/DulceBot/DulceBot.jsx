import { useState, useRef, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function DulceBot({ contextoProducto = null }) {
  const [abierto, setAbierto]       = useState(false)
  const [mensaje, setMensaje]       = useState('')
  const [historial, setHistorial]   = useState([])
  const [cargando, setCargando]     = useState(false)
  const bottomRef                   = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [historial, cargando])

  // Resetear chat si cambia el producto
  useEffect(() => {
    setHistorial([])
  }, [contextoProducto?._id])

  const enviar = async (e) => {
    e.preventDefault()
    if (!mensaje.trim() || cargando) return

    const nuevoMensaje = { rol: 'user', texto: mensaje }
    setHistorial(prev => [...prev, nuevoMensaje])
    setMensaje('')
    setCargando(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje,
          contextoProducto,
          historial: historial.map(m => ({ rol: m.rol, texto: m.texto }))
        })
      })
      const data = await res.json()
      setHistorial(prev => [...prev, { rol: 'model', texto: data.respuesta || 'Error al responder' }])
    } catch {
      setHistorial(prev => [...prev, { rol: 'model', texto: 'Error al conectar con DulceBot 😕' }])
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Ventana del chat */}
      {abierto && (
        <div className="w-80 sm:w-96 rounded-3xl border border-white/20 bg-[#1a0533]/95 backdrop-blur-xl shadow-2xl shadow-[#FF006E]/20 overflow-hidden flex flex-col" style={{ height: '480px' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF006E] to-[#FB5607] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍬</span>
              <div>
                <p className="text-white font-black text-sm">DulceBot</p>
                <p className="text-white/70 text-xs">
                  {contextoProducto ? `Hablando de: ${contextoProducto.nombre}` : 'Experto en dulces mexicanos'}
                </p>
              </div>
            </div>
            <button onClick={() => setAbierto(false)} className="text-white/70 hover:text-white transition-colors text-xl">✕</button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {historial.length === 0 && (
              <div className="text-center py-6">
                <span className="text-4xl mb-3 block">🍭</span>
                <p className="text-white/60 text-sm">
                  {contextoProducto
                    ? `¡Hola! Puedo contarte todo sobre ${contextoProducto.nombre}. ¿Qué quieres saber? 🍬`
                    : '¡Hola! Soy DulceBot. Pregúntame sobre dulces mexicanos 🍬'
                  }
                </p>
              </div>
            )}

            {historial.map((msg, i) => (
              <div key={i} className={`flex ${msg.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.rol === 'user'
                    ? 'bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white rounded-br-sm'
                    : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/10'
                  }`}>
                  {msg.texto}
                </div>
              </div>
            ))}

            {cargando && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-[#FF006E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#FB5607] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#FFD60A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={enviar} className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              placeholder="Pregunta sobre dulces..."
              disabled={cargando}
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm
                         placeholder-white/30 outline-none focus:border-[#FF006E] transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={cargando || !mensaje.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] text-white
                         flex items-center justify-center font-bold hover:scale-105 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Burbuja flotante */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF006E] to-[#FB5607]
                   flex items-center justify-center text-2xl shadow-lg shadow-[#FF006E]/40
                   hover:scale-110 active:scale-95 transition-all
                   animate-bounce hover:animate-none"
      >
        {abierto ? '✕' : '🍬'}
      </button>
    </div>
  )
}
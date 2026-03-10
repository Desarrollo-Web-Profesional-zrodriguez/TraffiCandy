import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if (data.ok) {
      alert('Bienvenido!')
    } else {
      alert(data.mensaje)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-8 shadow-xl">
        <h1 className="text-3xl font-black text-white text-center mb-6">
          Iniciar sesión
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white
                       placeholder-white/50 outline-none focus:border-[#FF006E] transition-colors"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white
                       placeholder-white/50 outline-none focus:border-[#FF006E] transition-colors"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3
                       font-bold text-white shadow-md hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  )
}
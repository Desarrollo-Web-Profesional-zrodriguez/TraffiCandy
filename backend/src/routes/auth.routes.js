import { Router } from 'express'
import bcrypt from 'bcryptjs'
import Usuario from '../models/Usuario.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // 1. Buscar usuario en MongoDB
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' })
    }

    // 2. Comparar contraseña
    const passwordOk = await bcrypt.compare(password, usuario.password)
    if (!passwordOk) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' })
    }

    res.json({ ok: true, mensaje: 'Login exitoso', usuario: { email: usuario.email } })

  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor' })
  }
})

export default router
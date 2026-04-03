import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { enviarCorreo2FA, enviarCorreoRecuperacion } from '../utils/mailer.js'
import Usuario from '../models/Usuario.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import {
  ok,
  created,
  badRequest,
  unauthorized,
  conflict,
  serverError
} from '../utils/httpResponse.js'

const router = Router()
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

/**
 * Genera un JWT firmado con { id, email, rol, twoFactorEnabled }.
 * Expira en 7 días.
 */
const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario._id, email: usuario.email, rol: usuario.rol, twoFactorEnabled: usuario.twoFactorEnabled },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

// ──────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { nombre = '', email, password, rol = 'comprador' } = req.body

  // Validar que el rol sea válido
  const rolesPermitidos = ['comprador', 'vendedor']
  if (!rolesPermitidos.includes(rol)) {
    return badRequest(res, `Rol inválido. Usa: ${rolesPermitidos.join(' o ')}`)
  }

  try {
    const existe = await Usuario.findOne({ email })
    if (existe) {
      return conflict(res, 'El correo ya está registrado')
    }

    const hash = await bcrypt.hash(password, 10)
    const nuevoUsuario = await Usuario.create({ nombre, email, password: hash, rol })

    return created(res, {
      usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol }
    }, 'Usuario registrado correctamente')
  } catch (error) {
    return serverError(res, 'Error al registrar usuario', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return unauthorized(res, 'Credenciales incorrectas')
    }

    const passwordOk = await bcrypt.compare(password, usuario.password)
    if (!passwordOk) {
      return unauthorized(res, 'Credenciales incorrectas')
    }

    // Verificar si el 2FA está activo
    if (usuario.twoFactorEnabled) {
      // Generar código de 6 dígitos
      const codigo = Math.floor(100000 + Math.random() * 900000).toString()
      
      usuario.twoFactorCode = codigo
      usuario.twoFactorExpire = Date.now() + 10 * 60 * 1000 // 10 minutos
      await usuario.save()

      // Enviar por correo
      try {
        await enviarCorreo2FA(usuario.email, codigo)
      } catch (err) {
        console.error('Error enviando email de 2FA:', err)
        return serverError(res, 'Error enviando código de seguridad')
      }

      return ok(res, { requires2FA: true }, 'Código 2FA enviado al correo')
    }

    // 2FA no está activo -> devolver JWT directamente
    const token = generarToken(usuario)

    return ok(res, {
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    }, 'Login exitoso')
  } catch (error) {
    return serverError(res, 'Error en el servidor', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/verify-2fa
// ──────────────────────────────────────────
router.post('/verify-2fa', async (req, res) => {
  const { email, code } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return badRequest(res, 'Usuario no encontrado')
    }

    if (!usuario.twoFactorCode || usuario.twoFactorCode !== code || usuario.twoFactorExpire < Date.now()) {
      return unauthorized(res, 'Código incorrecto o ha expirado')
    }

    // Código válido, limpiar campos 2FA
    usuario.twoFactorCode = undefined
    usuario.twoFactorExpire = undefined
    await usuario.save()

    const token = generarToken(usuario)

    return ok(res, {
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    }, 'Verificación 2FA exitosa')
  } catch (error) {
    return serverError(res, 'Error al verificar 2FA', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/toggle-2fa
// ──────────────────────────────────────────
router.post('/toggle-2fa', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) return badRequest(res, 'Usuario no encontrado')

    usuario.twoFactorEnabled = !usuario.twoFactorEnabled
    await usuario.save()

    return ok(res, { twoFactorEnabled: usuario.twoFactorEnabled }, `2FA ${usuario.twoFactorEnabled ? 'activado' : 'desactivado'}`)
  } catch (error) {
    return serverError(res, 'Error al cambiar estado de 2FA', error)
  }
})

// ──────────────────────────────────────────
// GET /api/auth/me  (ruta protegida)
// ──────────────────────────────────────────
router.get('/me', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password -resetPasswordToken -resetPasswordExpires -twoFactorCode -twoFactorExpire')
    if (!usuario) {
      return badRequest(res, 'Usuario no encontrado')
    }

    return ok(res, { usuario }, 'Datos del usuario autenticado')
  } catch (error) {
    return serverError(res, 'Error al obtener datos del usuario', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/forgot-password
// ──────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  try {
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
      // Por seguridad no revelamos si el correo existe
      return ok(res, null, 'Si el correo existe, se enviará un enlace.')
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    usuario.resetPasswordToken = resetToken
    usuario.resetPasswordExpires = Date.now() + 3600000 // 1 hora
    await usuario.save()

    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`

    await enviarCorreoRecuperacion(usuario.email, resetUrl)

    return ok(res, null, 'Si el correo existe, se enviará un enlace de recuperación.')
  } catch (error) {
    return serverError(res, 'Hubo un error al procesar la solicitud', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/reset-password
// ──────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body

  try {
    const usuario = await Usuario.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!usuario) {
      return badRequest(res, 'El enlace de recuperación es inválido o ha expirado.')
    }

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(newPassword, salt)
    usuario.resetPasswordToken = undefined
    usuario.resetPasswordExpires = undefined
    await usuario.save()

    return ok(res, null, 'La contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión.')
  } catch (error) {
    return serverError(res, 'Hubo un error al actualizar la contraseña.', error)
  }
})

export default router
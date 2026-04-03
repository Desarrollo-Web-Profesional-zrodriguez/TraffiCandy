import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'
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
 * Genera un JWT firmado con { id, email, rol }.
 * Expira en 7 días.
 */
const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario._id, email: usuario.email, rol: usuario.rol },
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
    const resend = new Resend(process.env.RESEND_API_KEY)
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

    await resend.emails.send({
      from: 'TraffiCandy Soporte <onboarding@resend.dev>',
      to: usuario.email,
      subject: 'Recuperación de Contraseña - TraffiCandy',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #FF006E;">Recuperación de contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
          <a href="${resetUrl}" style="background-color: #FF006E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 20px 0;">Restablecer mi contraseña</a>
          <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
          <p style="color: #999; font-size: 12px;">Si no solicitaste este cambio, ignora este correo.</p>
        </div>
      `
    })

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
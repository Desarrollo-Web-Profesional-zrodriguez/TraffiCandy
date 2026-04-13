import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import rateLimit from 'express-rate-limit'
import { enviarCorreo2FA, enviarCorreoRecuperacion } from '../utils/mailer.js'
import Usuario from '../models/Usuario.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { ok, created, badRequest, unauthorized, conflict, serverError } from '../utils/httpResponse.js'

const router = Router()
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const COUNT_LIMITER = process.env.COUNT_LIMITER

// ──────────────────────────────────────────
// Limitadores de Velocidad (Fuerza Bruta)
// ──────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, 
  message: { ok: false, mensaje: 'Demasiados intentos fallidos. Por favor, intenta de nuevo en 15 minutos.' }
})

const sendEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  message: { ok: false, mensaje: 'Límite de envío de correos excedido. Espera un momento.' }
})

const generarToken = (usuario) =>
  jwt.sign(
    { 
      id: usuario._id, 
      email: usuario.email, 
      rol: usuario.rol, 
      suscrito: usuario.suscrito,
      tokenVersion: usuario.tokenVersion 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

// ──────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────
router.post('/register', async (req, res) => {
  console.log('📩 Register hit:', req.body)
  const { nombre = '', email, password, rol = 'comprador' } = req.body

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return badRequest(res, 'La contraseña no cumple con los criterios de seguridad mínimos.');
  }

  const rolesPermitidos = ['comprador', 'vendedor']
  if (!rolesPermitidos.includes(rol)) return badRequest(res, `Rol inválido. Usa: ${rolesPermitidos.join(' o ')}`)

  try {
    const existe = await Usuario.findOne({ email })
    if (existe) return conflict(res, 'El correo ya está registrado')

    const hash = await bcrypt.hash(password, 10)
    const nuevoUsuario = await Usuario.create({ nombre, email, password: hash, rol })

    return created(res, {
      usuario: { 
        id: nuevoUsuario._id, 
        nombre: nuevoUsuario.nombre, 
        email: nuevoUsuario.email, 
        rol: nuevoUsuario.rol,
        suscrito: nuevoUsuario.suscrito
      }
    }, 'Usuario registrado correctamente')
  } catch (error) {
    return serverError(res, 'Error al registrar usuario', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) return unauthorized(res, 'Credenciales incorrectas')

    const passwordOk = await bcrypt.compare(password, usuario.password)
    if (!passwordOk) return unauthorized(res, 'Credenciales incorrectas')

    const methods = []
    if (usuario.twoFactorApp) methods.push('app')
    if (usuario.twoFactorEmail) methods.push('email')

    if (methods.length > 0) {
      // Prioridad a 'app', no mandamos correo de inmediato si tiene app
      if (usuario.twoFactorApp) {
        return ok(res, { requires2FA: 'app', methods }, 'Requiere código de App Autenticadora')
      }

      // Solo tiene correo
      if (usuario.twoFactorEmail) {
        const codigo = Math.floor(100000 + Math.random() * 900000).toString()
        usuario.twoFactorCode = codigo
        usuario.twoFactorExpire = Date.now() + 10 * 60 * 1000 // 10 mins
        await usuario.save()

        try {
          await enviarCorreo2FA(usuario.email, codigo)
        } catch (err) {
          console.error(err)
          return serverError(res, 'Error enviando código de seguridad al correo')
        }
        return ok(res, { requires2FA: 'email', methods }, 'Código 2FA enviado al correo')
      }
    }

    // Sin 2FA
    const token = generarToken(usuario)
    return ok(res, {
      token,
      usuario: { 
        id: usuario._id, 
        nombre: usuario.nombre, 
        email: usuario.email, 
        rol: usuario.rol,
        suscrito: usuario.suscrito
      }
    }, 'Login exitoso')
  } catch (error) {
    return serverError(res, 'Error en el servidor', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/send-2fa-email
// Envía un código si el usuario tiene twoFactorEmail encendido (para fallback del App)
// ──────────────────────────────────────────
router.post('/send-2fa-email', sendEmailLimiter, async (req, res) => {
  const { email, password } = req.body
  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario || !usuario.twoFactorEmail) return badRequest(res, 'No disponible')

    const passwordOk = await bcrypt.compare(password, usuario.password)
    if (!passwordOk) return unauthorized(res, 'Credenciales incorrectas')

    const codigo = Math.floor(100000 + Math.random() * 900000).toString()
    usuario.twoFactorCode = codigo
    usuario.twoFactorExpire = Date.now() + 10 * 60 * 1000
    await usuario.save()

    await enviarCorreo2FA(usuario.email, codigo)
    return ok(res, null, 'Código 2FA enviado al correo')
  } catch (error) {
    return serverError(res, 'Error enviando correo', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/verify-2fa
// ──────────────────────────────────────────
router.post('/verify-2fa', loginLimiter, async (req, res) => {
  const { email, code } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) return badRequest(res, 'Usuario no encontrado')

    let isValid = false

    // 1. Checar TOTP App o Backup Codes
    if (usuario.twoFactorAppSecret) {
      if (code && usuario.backupCodes && usuario.backupCodes.includes(code.toUpperCase().trim())) {
        isValid = true
        // Quemar el código de respaldo usado
        usuario.backupCodes = usuario.backupCodes.filter(c => c !== code.toUpperCase().trim())
      } else {
        const isValidTotp = speakeasy.totp.verify({
          secret: usuario.twoFactorAppSecret,
          encoding: 'base32',
          token: code,
          window: 2
        })
        if (isValidTotp) {
          isValid = true
        }
      }
    }

    // 2. Checar Email
    if (!isValid && usuario.twoFactorEmail && usuario.twoFactorCode) {
      if (usuario.twoFactorCode === code && usuario.twoFactorExpire > Date.now()) {
        isValid = true
        usuario.twoFactorCode = undefined
        usuario.twoFactorExpire = undefined
      }
    }

    if (!isValid) return unauthorized(res, 'Código incorrecto o expirado')

    await usuario.save()
    const token = generarToken(usuario)

    return ok(res, {
      token,
      usuario: { 
        id: usuario._id, 
        nombre: usuario.nombre, 
        email: usuario.email, 
        rol: usuario.rol,
        suscrito: usuario.suscrito
      }
    }, 'Verificación 2FA exitosa')
  } catch (error) {
    return serverError(res, 'Error al verificar 2FA', error)
  }
})

// ──────────────────────────────────────────
// GET /api/auth/setup-app-2fa
// ──────────────────────────────────────────
router.get('/setup-app-2fa', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) return badRequest(res, 'Usuario no encontrado')

    const secretObj = speakeasy.generateSecret({ name: `TraffiCandy (${usuario.email})` })
    usuario.twoFactorAppSecret = secretObj.base32
    
    // Generar códigos de respaldo
    const backupCodes = Array.from({ length: 5 }, () => crypto.randomBytes(3).toString('hex').toUpperCase())
    usuario.backupCodes = backupCodes
    
    await usuario.save() // Guarda el secreto antes de habilitarlo

    const otpauth = secretObj.otpauth_url
    const qrImage = await qrcode.toDataURL(otpauth)

    return ok(res, { secret: secretObj.base32, qrImage, backupCodes }, 'Datos para vincular app generados')
  } catch (error) {
    return serverError(res, 'Error al generar setup', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/confirm-app-2fa
// ──────────────────────────────────────────
router.post('/confirm-app-2fa', verificarToken, async (req, res) => {
  const { code } = req.body
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario || !usuario.twoFactorAppSecret) return badRequest(res, 'Falta generar setup')

    const isValidTotp = speakeasy.totp.verify({
      secret: usuario.twoFactorAppSecret,
      encoding: 'base32',
      token: code,
      window: 2
    })
    
    if (!isValidTotp) {
      return unauthorized(res, 'El código no coincide con la aplicación')
    }

    usuario.twoFactorApp = true
    await usuario.save()
    return ok(res, { twoFactorApp: true }, 'Autenticador activado con éxito')
  } catch (error) {
    return serverError(res, 'Error al confirmar app', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/disable-app-2fa
// ──────────────────────────────────────────
router.post('/disable-app-2fa', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) return badRequest(res, 'Usuario no encontrado')

    usuario.twoFactorApp = false
    usuario.twoFactorAppSecret = undefined
    await usuario.save()

    return ok(res, { twoFactorApp: false }, 'Autenticador desactivado')
  } catch (error) {
    return serverError(res, 'Error al desactivar app', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/toggle-email-2fa
// ──────────────────────────────────────────
router.post('/toggle-email-2fa', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) return badRequest(res, 'Usuario no encontrado')

    usuario.twoFactorEmail = !usuario.twoFactorEmail
    await usuario.save()

    return ok(res, { twoFactorEmail: usuario.twoFactorEmail }, `2FA por correo ${usuario.twoFactorEmail ? 'activado' : 'desactivado'}`)
  } catch (error) {
    return serverError(res, 'Error al cambiar estado de correo 2FA', error)
  }
})

// ──────────────────────────────────────────
// POST /api/auth/subscribe
// ──────────────────────────────────────────
router.post('/subscribe', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) return badRequest(res, 'Usuario no encontrado')

    usuario.suscrito = true
    await usuario.save()

    // Generamos un nuevo token para que el frontend tenga la bandera actualizada
    const token = generarToken(usuario)

    return ok(res, { 
      token,
      usuario: { 
        id: usuario._id, 
        nombre: usuario.nombre, 
        email: usuario.email, 
        rol: usuario.rol,
        suscrito: usuario.suscrito
      }
    }, 'Te has suscrito correctamente al newsletter')
  } catch (error) {
    return serverError(res, 'Error al procesar suscripción', error)
  }
})

// ──────────────────────────────────────────
// GET /api/auth/me
// ──────────────────────────────────────────
router.get('/me', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password -resetPasswordToken -resetPasswordExpires -twoFactorCode -twoFactorExpire -twoFactorAppSecret')
    if (!usuario) return badRequest(res, 'Usuario no encontrado')
    return ok(res, { usuario }, 'Datos del usuario autenticado')
  } catch (error) {
    return serverError(res, 'Error al obtener datos del usuario', error)
  }
})

// ──────────────────────────────────────────
// Recuperación de Contraseña (sin cambios lógicos)
// ──────────────────────────────────────────
router.post('/forgot-password', sendEmailLimiter, async (req, res) => {
  const { email } = req.body
  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) return ok(res, null, 'Si el correo existe, se enviará un enlace.')

    const resetToken = crypto.randomBytes(32).toString('hex')
    usuario.resetPasswordToken = resetToken
    usuario.resetPasswordExpires = Date.now() + 3600000
    await usuario.save()

    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`
    await enviarCorreoRecuperacion(usuario.email, resetUrl)
    return ok(res, null, 'Si el correo existe, se enviará un enlace de recuperación.')
  } catch (error) {
    return serverError(res, 'Error al procesar solicitud', error)
  }
})

router.post('/reset-password', loginLimiter, async (req, res) => {
  const { token, newPassword } = req.body
  try {
    const usuario = await Usuario.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    if (!usuario) return badRequest(res, 'Enlace de recuperación inválido o expirado.')

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(newPassword, salt)
    
    // Limpiar tokens de recuperación
    usuario.resetPasswordToken = undefined
    usuario.resetPasswordExpires = undefined
    
    // Revocar sesiones masivas a través del TokenVersion
    usuario.tokenVersion = (usuario.tokenVersion || 0) + 1
    
    // Por seguridad extrema, apagar métodos 2FA al restablecer credenciales críticas
    usuario.twoFactorEmail = false
    usuario.twoFactorApp = false
    usuario.twoFactorAppSecret = undefined

    await usuario.save()
    return ok(res, null, 'Contraseña actualizada con éxito.')
  } catch (error) {
    return serverError(res, 'Error al actualizar contraseña.', error)
  }
})

export default router
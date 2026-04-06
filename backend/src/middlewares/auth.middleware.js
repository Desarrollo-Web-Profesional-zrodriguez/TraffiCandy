import jwt from 'jsonwebtoken'
import { unauthorized, forbidden } from '../utils/httpResponse.js'
import Usuario from '../models/Usuario.js'

/**
 * Middleware: verificarToken
 * ─────────────────────────
 * Lee el header Authorization: Bearer <token>,
 * verifica la firma JWT y adjunta el payload a req.usuario.
 *
 * req.usuario = { id, email, rol }
 */
export const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'Se requiere un token de autenticación')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    
    // Validar Sesión Activa contra Base de Datos
    const usuarioDB = await Usuario.findById(payload.id).select('tokenVersion')
    if (!usuarioDB) return unauthorized(res, 'Usuario no encontrado')
    
    if (payload.tokenVersion !== undefined && payload.tokenVersion !== usuarioDB.tokenVersion) {
      return forbidden(res, 'Esta sesión fue revocada (posible cambio de contraseña o cierre global de sesión). Por favor, ingresa de nuevo.')
    }

    req.usuario = { id: payload.id, email: payload.email, rol: payload.rol }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return forbidden(res, 'El token ha expirado. Vuelve a iniciar sesión')
    }
    return forbidden(res, 'Token inválido o manipulado')
  }
}

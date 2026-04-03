import jwt from 'jsonwebtoken'
import { unauthorized, forbidden } from '../utils/httpResponse.js'

/**
 * Middleware: verificarToken
 * ─────────────────────────
 * Lee el header Authorization: Bearer <token>,
 * verifica la firma JWT y adjunta el payload a req.usuario.
 *
 * req.usuario = { id, email, rol }
 */
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'Se requiere un token de autenticación')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = { id: payload.id, email: payload.email, rol: payload.rol }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return forbidden(res, 'El token ha expirado. Vuelve a iniciar sesión')
    }
    return forbidden(res, 'Token inválido o manipulado')
  }
}

import { forbidden } from '../utils/httpResponse.js'

/**
 * Middleware factory: requireRol
 * ──────────────────────────────
 * Retorna un middleware que comprueba si req.usuario.rol
 * está incluido en la lista de roles permitidos.
 *
 * Uso:
 *   router.post('/nuevo', verificarToken, requireRol('vendedor'), handler)
 *   router.delete('/:id', verificarToken, requireRol('vendedor', 'admin'), handler)
 *
 * @param {...string} roles - Roles permitidos para la ruta
 */
export const requireRol = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return forbidden(res, 'Acceso denegado: usuario no autenticado')
    }

    if (!roles.includes(req.usuario.rol)) {
      return forbidden(
        res,
        `Acceso denegado: se requiere rol ${roles.join(' o ')}. Tu rol es "${req.usuario.rol}"`
      )
    }

    next()
  }
}

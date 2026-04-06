/**
 * @file httpResponse.js
 * @description Helper centralizado para enviar respuestas HTTP estandarizadas.
 * Todos los controladores y middlewares deben usar estas funciones
 * en lugar de res.status(...).json(...) directamente.
 */

/**
 * 200 OK — Operación exitosa
 * @param {import('express').Response} res
 * @param {*} data  - payload a enviar (objeto, array, etc.)
 * @param {string} [mensaje='Éxito']
 */
export const ok = (res, data = null, mensaje = 'Éxito') => {
  res.status(200).json({ ok: true, mensaje, data })
}

/**
 * 201 Created — Recurso creado exitosamente
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} [mensaje='Recurso creado']
 */
export const created = (res, data = null, mensaje = 'Recurso creado') => {
  res.status(201).json({ ok: true, mensaje, data })
}

/**
 * 400 Bad Request — Datos de entrada inválidos o faltantes
 * @param {import('express').Response} res
 * @param {string} [mensaje='Solicitud inválida']
 */
export const badRequest = (res, mensaje = 'Solicitud inválida') => {
  res.status(400).json({ ok: false, mensaje })
}

/**
 * 401 Unauthorized — Sin autenticación o credenciales incorrectas
 * @param {import('express').Response} res
 * @param {string} [mensaje='No autorizado']
 */
export const unauthorized = (res, mensaje = 'No autorizado') => {
  res.status(401).json({ ok: false, mensaje })
}

/**
 * 403 Forbidden — Autenticado pero sin permisos suficientes
 * @param {import('express').Response} res
 * @param {string} [mensaje='Acceso denegado']
 */
export const forbidden = (res, mensaje = 'Acceso denegado') => {
  res.status(403).json({ ok: false, mensaje })
}

/**
 * 404 Not Found — Recurso no encontrado
 * @param {import('express').Response} res
 * @param {string} [mensaje='Recurso no encontrado']
 */
export const notFound = (res, mensaje = 'Recurso no encontrado') => {
  res.status(404).json({ ok: false, mensaje })
}

/**
 * 409 Conflict — El recurso ya existe (e.g. email duplicado)
 * @param {import('express').Response} res
 * @param {string} [mensaje='Conflicto: el recurso ya existe']
 */
export const conflict = (res, mensaje = 'Conflicto: el recurso ya existe') => {
  res.status(409).json({ ok: false, mensaje })
}

/**
 * 500 Internal Server Error — Error inesperado del servidor
 * @param {import('express').Response} res
 * @param {string} [mensaje='Error interno del servidor']
 * @param {Error} [error] - Error original para logging (NO se envía al cliente)
 */
export const serverError = (res, mensaje = 'Error interno del servidor', error = null) => {
  if (error) console.error('[ServerError]', error.message ?? error)
  res.status(500).json({ ok: false, mensaje })
}

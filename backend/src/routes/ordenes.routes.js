import { Router } from 'express'
import mongoose from 'mongoose'
import Producto from '../models/Producto.js'
import Usuario from '../models/Usuario.js'
import { ok, serverError } from '../utils/httpResponse.js'
import { enviarCorreoUsuario, enviarCorreoAdmin, enviarCorreoInvitado } from '../utils/mailer.js'

const router = Router()

router.post('/', async (req, res) => {
  const { items, direccionEnvio, emailInvitado } = req.body

  try {
    // Intentar obtener usuario si hay token
    let usuario = null
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = await import('jsonwebtoken')
        const token = authHeader.split(' ')[1]
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET)
        usuario = await Usuario.findById(decoded.id)
      } catch {
        // Token inválido o expirado, continuar como invitado
      }
    }

    // Procesar productos y actualizar stock
    const productosComprados = []
    let totalOrden = 0

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productoId)) {
        const subtotal = (item.precio || 0) * item.cantidad
        totalOrden += subtotal
        productosComprados.push({
          nombre:   item.nombre || item.productoId,
          cantidad: item.cantidad,
          precio:   item.precio || 0,
          subtotal,
          emoji:    item.emoji || '🍬'
        })
        continue
      }

      const producto = await Producto.findById(item.productoId)
      if (!producto) continue

      const nuevoStock = Math.max(0, producto.stock - item.cantidad)
      await Producto.findByIdAndUpdate(item.productoId, { stock: nuevoStock })

      const subtotal = producto.precioBase * item.cantidad
      totalOrden += subtotal

      productosComprados.push({
        nombre:   producto.nombre,
        cantidad: item.cantidad,
        precio:   producto.precioBase,
        subtotal,
        emoji:    producto.emoji || '🍬'
      })
    }

    // Enviar correos según si está logueado o es invitado
    if (usuario) {
      await enviarCorreoUsuario(usuario, productosComprados, totalOrden, direccionEnvio)
    } else if (emailInvitado && emailInvitado.includes('@')) {
      await enviarCorreoInvitado(emailInvitado, productosComprados, totalOrden, direccionEnvio)
    }

    await enviarCorreoAdmin(
      usuario || { nombre: 'Invitado', email: emailInvitado || 'Sin correo', rol: 'invitado' },
      productosComprados,
      totalOrden,
      direccionEnvio
    )

    return ok(res, {}, 'Orden procesada y correos enviados')

  } catch (error) {
    return serverError(res, 'Error procesando la orden', error)
  }
})

export default router
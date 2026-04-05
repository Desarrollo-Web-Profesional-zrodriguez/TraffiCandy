import { Router } from 'express'
import mongoose from 'mongoose'
import Producto from '../models/Producto.js'
import Usuario from '../models/Usuario.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { ok, serverError } from '../utils/httpResponse.js'
import { enviarCorreoUsuario, enviarCorreoAdmin } from '../utils/mailer.js'

const router = Router()

router.post('/', verificarToken, async (req, res) => {
  const { items, direccionEnvio } = req.body

  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Usuario no encontrado' })
    }

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

    // Enviar ambos correos con nodemailer
    await enviarCorreoUsuario(usuario, productosComprados, totalOrden, direccionEnvio)
    await enviarCorreoAdmin(usuario, productosComprados, totalOrden, direccionEnvio)

    return ok(res, {}, 'Orden procesada y correos enviados')

  } catch (error) {
    return serverError(res, 'Error procesando la orden', error)
  }
})

export default router
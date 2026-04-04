import { Router } from 'express'
import Producto from '../models/Producto.js'
import { ok, serverError } from '../utils/httpResponse.js'

const router = Router()

// POST /api/ordenes
router.post('/', async (req, res) => {
  const { items } = req.body

  try {
    for (const item of items) {
      const producto = await Producto.findById(item.productoId)
      if (!producto) continue
      const nuevoStock = Math.max(0, producto.stock - item.cantidad)
      await Producto.findByIdAndUpdate(item.productoId, { stock: nuevoStock })
    }

    return ok(res, {}, 'Orden procesada y stock actualizado')
  } catch (error) {
    return serverError(res, 'Error procesando la orden', error)
  }
})

export default router
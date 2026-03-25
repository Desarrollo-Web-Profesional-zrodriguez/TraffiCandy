import { Router } from 'express'
import Producto from '../models/Producto.js'

const router = Router()

// GET /api/productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find({ disponible: true })
    res.json(productos)
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener productos' })
  }
})

// GET /api/productos/:slug
router.get('/:slug', async (req, res) => {
  try {
    const producto = await Producto.findOne({ slug: req.params.slug })
    if (!producto) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' })
    res.json(producto)
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener el producto' })
  }
})

export default router
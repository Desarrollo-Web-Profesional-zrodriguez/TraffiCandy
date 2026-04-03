import { Router } from 'express'
import Producto from '../models/Producto.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { requireRol } from '../middlewares/roles.middleware.js'
import { ok, notFound, serverError } from '../utils/httpResponse.js'

const router = Router()

// ──────────────────────────────────────────
// GET /api/productos  — Pública
// ──────────────────────────────────────────
// ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find({ disponibleParaEnvio: true })
    return ok(res, productos, 'Productos obtenidos')
  } catch (error) {
    return serverError(res, 'Error al obtener productos', error)
  }
})

// ──────────────────────────────────────────
// ──────────────────────────────────────────
// GET /api/productos/:identifier  — Pública (Id o Slug)
// ──────────────────────────────────────────
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let producto;
    // Si parece un Object_Id de mongo
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      producto = await Producto.findById(identifier);
    } else {
      producto = await Producto.findOne({ slug: identifier });
    }
    
    if (!producto) return notFound(res, 'Producto no encontrado')
    return ok(res, producto, 'Producto obtenido')
  } catch (error) {
    return serverError(res, 'Error al obtener el producto', error)
  }
})

// ──────────────────────────────────────────
// POST /api/productos  — Solo Vendedor
// ──────────────────────────────────────────
router.post('/', verificarToken, requireRol('vendedor'), async (req, res) => {
  try {
    const producto = await Producto.create(req.body)
    return ok(res, producto, 'Producto creado exitosamente')
  } catch (error) {
    return serverError(res, 'Error al crear el producto', error)
  }
})

// ──────────────────────────────────────────
// PUT /api/productos/:id  — Solo Vendedor
// ──────────────────────────────────────────
router.put('/:id', verificarToken, requireRol('vendedor'), async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!producto) return notFound(res, 'Producto no encontrado')
    return ok(res, producto, 'Producto actualizado exitosamente')
  } catch (error) {
    return serverError(res, 'Error al actualizar el producto', error)
  }
})

// ──────────────────────────────────────────
// DELETE /api/productos/:id  — Solo Vendedor
// ──────────────────────────────────────────
router.delete('/:id', verificarToken, requireRol('vendedor'), async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id)
    if (!producto) return notFound(res, 'Producto no encontrado')
    return ok(res, { id: req.params.id }, 'Producto eliminado exitosamente')
  } catch (error) {
    return serverError(res, 'Error al eliminar el producto', error)
  }
})

export default router
import { Router } from 'express'

const router = Router()

// GET /api/productos
router.get('/', (req, res) => {
  const productos = [
    { id: 1, nombre: 'Pulparindo', precio: 10 },
    { id: 2, nombre: 'Mazapán', precio: 8 },
    { id: 3, nombre: 'Glorias', precio: 15 },
  ]

  res.json(productos)
})

export default router
import { Router } from 'express';
import Dulce from '../models/Dulce.js';

const router = Router();

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { categoria, disponible } = req.query;
    const filtros = {};
    if (categoria) filtros.categoria = categoria;
    if (disponible !== undefined) filtros.disponibleParaEnvio = disponible === 'true';

    const productos = await Dulce.find(filtros).sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos.' });
  }
});

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Dulce.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado.' });
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto.' });
  }
});

// POST /api/productos - Crear un producto
router.post('/', async (req, res) => {
  try {
    const nuevo = new Dulce(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Dulce.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!actualizado) return res.status(404).json({ message: 'Producto no encontrado.' });
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Dulce.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Producto no encontrado.' });
    res.json({ message: 'Producto eliminado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto.' });
  }
});

export default router;
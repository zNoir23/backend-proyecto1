const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos'); // Asegúrate de que este middleware exista
const Producto = require('../models/productos'); // Asegúrate de que el nombre y ruta sean correctos
const {validarJWT} = require ('../middlewares/validar-jwt')


const router = Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los productos' });
  }
});

// Crear un nuevo producto
router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'La categoría es obligatoria').not().isEmpty(),
  check('precio', 'El precio es obligatorio').isNumeric(),
  check('stock', 'El stock es obligatorio').isNumeric(),
  validarCampos,
], async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el producto', error: error.message });
  }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByIdAndUpdate(id, req.body, { new: true });
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json({ msg: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el producto' });
  }
});

module.exports = router;

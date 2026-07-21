const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
} = require('../controllers/categoriasController');

router.use(authMiddleware);

router.route('/')
    .get(obtenerCategorias)
    .post(crearCategoria);

router.route('/:id')
    .get(obtenerCategoriaPorId)
    .put(editarCategoria)
    .delete(eliminarCategoria);

module.exports = router;
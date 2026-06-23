const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    getAllTransacciones,
    getTransaccionById,
    createTransaccion,
    updateTransaccion,
    deleteTransaccion,
    getStats
} = require('../controllers/transaccionController');


// 🔐 Todas las rutas requieren login
router.use(authMiddleware);


// 📊 estadísticas
router.get('/stats', getStats);


// 📄 CRUD principal
router.route('/')
    .get(getAllTransacciones)
    .post(createTransaccion);


// 📄 CRUD por ID
router.route('/:id')
    .get(getTransaccionById)
    .put(updateTransaccion)
    .delete(deleteTransaccion);


module.exports = router;
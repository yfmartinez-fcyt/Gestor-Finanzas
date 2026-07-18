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


router.use(authMiddleware);


router.get('/stats', getStats);


router.route('/')
    .get(getAllTransacciones)
    .post(createTransaccion);


router.route('/:id')
    .get(getTransaccionById)
    .put(updateTransaccion)
    .delete(deleteTransaccion);


module.exports = router;
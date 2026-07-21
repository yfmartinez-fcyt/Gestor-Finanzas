const express = require('express');
const router = express.Router();

const movimientosMetaController = require('../controllers/movimientosMetaController');

const authMiddleware = require('../middlewares/authMiddleware');


// Obtener movimientos de una meta
router.get(
    '/meta/:meta_id',
    authMiddleware,
    movimientosMetaController.getMovimientosByMeta
);

// Obtener movimiento por ID
router.get(
    '/:id',
    authMiddleware,
    movimientosMetaController.getMovimientoMetaById
);

// Crear movimiento
router.post(
    '/',
    authMiddleware,
    movimientosMetaController.createMovimientoMeta
);


// Anular movimiento
router.patch(
    '/:id/anular',
    authMiddleware,
    movimientosMetaController.anularMovimientoMeta
);


module.exports = router;
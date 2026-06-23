const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/rolMiddleware');

// Todas las rutas de usuarios requieren estar autenticado
router.use(authMiddleware);

// Obtener todos los usuarios (Solo Admin)
router.get('/', authorize('admin'), usuarioController.getAllUsers);

// Todas las sesiones del sistema (Solo Admin) — antes de /:id
router.get('/sessions', authorize('admin'), usuarioController.getAllSessions);

// Obtener sesiones de un usuario (Solo Admin)
router.get('/:id/sessions', authorize('admin'), usuarioController.getUserSessions);

// Revocar una sesión (Solo Admin)
router.delete('/sessions/:sessionId', authorize('admin'), usuarioController.deleteSession);

// Actualizar un usuario (Admin puede actualizar a cualquiera, Usuario solo a sí mismo)
router.put('/:id', usuarioController.updateUser);

module.exports = router;

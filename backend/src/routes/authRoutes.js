const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Endpoint de refresco de token - Manejo robusto de métodos
router.route('/refresh')
    .post(authController.refresh)
    .all((req, res) => {
        res.status(405).json({
            success: false,
            message: `Método ${req.method} no permitido para /refresh. Use POST.`
        });
    });

router.post('/logout', authController.logout);

// Ruta privada
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;

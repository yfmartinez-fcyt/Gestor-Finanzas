const { pool } = require('../config/db');
const { isValidId, validateUpdateUser } = require('../utils/validators');

/**
 * Obtener todos los usuarios (Solo para Administradores)
 */
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nombre, apellido, email, avatar, rol, created_at FROM usuarios ORDER BY created_at DESC'
        );
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al recuperar usuarios'
        });
    }
};

/**
 * Actualizar rol o datos de un usuario
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
        }

        const isAdmin = req.user.rol === 'admin';
        const validation = validateUpdateUser(req.body, { allowRol: isAdmin });

        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        const { nombre, apellido, email, rol, avatar } = validation.data;

        // Seguridad: Si no es admin, solo puede actualizarse a sí mismo
        if (!isAdmin && req.user.id !== parseInt(id, 10)) {
            return res.status(403).json({ 
                success: false, 
                message: 'No tienes permiso para actualizar este perfil' 
            });
        }

        // Verificar si el usuario existe
        const userExists = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const current = userExists.rows[0];
        const finalEmail = email ?? current.email;

        if (email !== undefined) {
            const emailTaken = await pool.query(
                'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
                [finalEmail, id]
            );
            if (emailTaken.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
            }
        }

        // Seguridad: Si no es admin, no puede cambiarse el rol
        const finalRol = isAdmin ? (rol ?? current.rol) : current.rol;

        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, apellido = $2, email = $3, rol = $4, avatar = $5 WHERE id = $6 RETURNING id, nombre, apellido, email, rol, avatar',
            [
                nombre ?? current.nombre,
                apellido ?? current.apellido,
                finalEmail,
                finalRol,
                avatar !== undefined ? avatar : current.avatar,
                id
            ]
        );

        res.json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

/**
 * Obtener todas las sesiones del sistema (Solo Admin)
 */
const getAllSessions = async (req, res) => {
    try {
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ success: false, message: 'No autorizado' });
        }

        const result = await pool.query(`
            SELECT
                rt.id,
                rt.usuario_id,
                rt.created_at,
                rt.expires_at,
                u.nombre,
                u.apellido,
                u.email,
                (rt.expires_at > CURRENT_TIMESTAMP) AS activa
            FROM refresh_tokens rt
            INNER JOIN usuarios u ON u.id = rt.usuario_id
            ORDER BY rt.created_at DESC
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener sesiones:', error);
        res.status(500).json({ success: false, message: 'Error al recuperar sesiones' });
    }
};

/**
 * Obtener las sesiones activas de un usuario (Solo Admin)
 */
const getUserSessions = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
        }

        // Solo administradores pueden ver sesiones de otros
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ success: false, message: 'No autorizado' });
        }

        const result = await pool.query(
            'SELECT id, created_at, expires_at FROM refresh_tokens WHERE usuario_id = $1 ORDER BY created_at DESC',
            [id]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener sesiones:', error);
        res.status(500).json({ success: false, message: 'Error al recuperar sesiones' });
    }
};

/**
 * Eliminar (revocar) una sesión específica (Solo Admin)
 */
const deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!isValidId(sessionId)) {
            return res.status(400).json({ success: false, message: 'ID de sesión inválido' });
        }

        // Solo administradores pueden revocar sesiones de otros de esta forma
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ success: false, message: 'No autorizado' });
        }

        await pool.query('DELETE FROM refresh_tokens WHERE id = $1', [sessionId]);

        res.json({
            success: true,
            message: 'Sesión cerrada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar sesión:', error);
        res.status(500).json({ success: false, message: 'Error al cerrar la sesión' });
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    getAllSessions,
    getUserSessions,
    deleteSession
};

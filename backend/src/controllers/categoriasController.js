const { pool } = require("../config/db");
const { isValidId } = require("../utils/validators");

// Obtener todas las categorías del usuario
const obtenerCategorias = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const { rows } = await pool.query(
            `SELECT *
             FROM categorias
             WHERE usuario_id = $1
             ORDER BY nombre`,
            [usuarioId]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener las categorías"
        });
    }
};

// Obtener una categoría por ID
const obtenerCategoriaPorId = async (req, res) => {

    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "ID inválido"
        });
    }

    try {

        const usuarioId = req.user.id;

        const { rows } = await pool.query(
            `SELECT *
             FROM categorias
             WHERE id = $1
             AND usuario_id = $2`,
            [id, usuarioId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Categoría no encontrada"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al obtener la categoría"
        });

    }

};

// Crear categoría
const crearCategoria = async (req, res) => {

    try {

        const usuarioId = req.user.id;

        const { nombre, tipo } = req.body;

        if (!nombre || !tipo) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        if (tipo !== "ingreso" && tipo !== "gasto") {
            return res.status(400).json({
                message: "Tipo inválido"
            });
        }

        const { rows } = await pool.query(
            `INSERT INTO categorias
            (nombre, tipo, usuario_id)
            VALUES ($1,$2,$3)
            RETURNING *`,
            [nombre, tipo, usuarioId]
        );

        res.status(201).json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al crear la categoría"
        });

    }

};

// Editar categoría
const editarCategoria = async (req, res) => {

    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "ID inválido"
        });
    }

    try {

        const usuarioId = req.user.id;

        const { nombre, tipo } = req.body;

        const { rows } = await pool.query(
            `UPDATE categorias
             SET nombre = $1,
                 tipo = $2
             WHERE id = $3
             AND usuario_id = $4
             RETURNING *`,
            [nombre, tipo, id, usuarioId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Categoría no encontrada"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al actualizar la categoría"
        });

    }

};

// Eliminar categoría
const eliminarCategoria = async (req, res) => {

    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            message: "ID inválido"
        });
    }

    try {

        const usuarioId = req.user.id;

        const { rowCount } = await pool.query(
            `DELETE FROM categorias
             WHERE id = $1
             AND usuario_id = $2`,
            [id, usuarioId]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                message: "Categoría no encontrada"
            });
        }

        res.json({
            message: "Categoría eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al eliminar la categoría"
        });

    }

};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    editarCategoria,
    eliminarCategoria
};
const { pool } = require('../config/db');

const {
    validateCreateMovimientoMeta,
    isValidId,
} = require("../utils/validators");

// Obtener movimientos de una meta
const getMovimientosByMeta = async (req, res) => {
    const { meta_id } = req.params;
    const usuario_id = req.user.id;

    if (!isValidId(meta_id)) {
        return res.status(400).json({
            success: false,
            message: "ID de meta inválido"
        });
    }

    const meta = await pool.query(
        `
    SELECT id
    FROM metas
    WHERE id = $1
    AND usuario_id = $2
    `,
        [meta_id, usuario_id]
    );

    if (meta.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Meta no encontrada o sin permisos"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT 
                mm.id,
                mm.tipo,
                mm.monto,
                mm.descripcion,
                mm.created_at,
                mm.anulado
            FROM movimientos_meta mm
            WHERE mm.meta_id = $1
            AND mm.usuario_id = $2
            ORDER BY mm.created_at DESC
            `,
            [meta_id, usuario_id]
        );

        res.json({
            success: true,
            message: 'Movimientos obtenidos correctamente',
            data: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener movimientos de la meta'
        });
    }
};

// Obtener un movimiento específico por ID (En desarrollo)
const getMovimientoMetaById = async (req, res) => {
    try {

        const { id } = req.params;
        const usuario_id = req.user.id;


        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de movimiento inválido"
            });
        }


        const result = await pool.query(
            `
            SELECT
                mm.id,
                mm.meta_id,
                mm.usuario_id,
                mm.tipo,
                mm.monto,
                mm.descripcion,
                mm.created_at
            FROM movimientos_meta mm
            INNER JOIN metas m
            ON m.id = mm.meta_id
            WHERE mm.id = $1
            AND mm.usuario_id = $2
            `,
            [
                id,
                usuario_id
            ]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Movimiento no encontrado o sin permisos para acceder"
            });
        }


        return res.json({
            success: true,
            data: result.rows[0]
        });


    } catch (error) {

        console.error("Error en getMovimientoMetaById:", error);

        return res.status(500).json({
            success: false,
            message: "Error al obtener el movimiento"
        });
    }
};

// Crear movimiento (aporte o retiro)
const createMovimientoMeta = async (req, res) => {
    try {

        const { valid, message, data } = validateCreateMovimientoMeta(req.body);

        if (!valid) {
            return res.status(400).json({
                success: false,
                message,
            });
        }

        const {
            meta_id,
            tipo,
            monto,
            descripcion,
        } = data;

        const usuario_id = req.user.id;


        // Validar ID de la meta
        if (!isValidId(meta_id)) {
            return res.status(400).json({
                success: false,
                message: "ID de meta inválido"
            });
        }


        // Verificar que la meta pertenece al usuario
        const meta = await pool.query(
            `
            SELECT id
            FROM metas
            WHERE id = $1
            AND usuario_id = $2
            `,
            [meta_id, usuario_id]
        );


        if (meta.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "La meta no existe o no pertenece al usuario"
            });
        }


        // Verificar saldo disponible si es un retiro
        if (tipo === "retiro") {

            const saldo = await pool.query(
                `
                SELECT 
                    COALESCE(
                        SUM(
                            CASE
                                WHEN tipo = 'aporte' THEN monto
                                WHEN tipo = 'retiro' THEN -monto
                            END
                        )WHERE anulado = false, 
                    0) AS saldo
                FROM movimientos_meta
                WHERE meta_id = $1
                AND usuario_id = $2
                AND anulado = FALSE
                `,
                [
                    meta_id,
                    usuario_id
                ]
            );


            const saldoActual = Number(saldo.rows[0].saldo);


            if (monto > saldoActual) {
                return res.status(400).json({
                    success: false,
                    message: "El retiro supera el saldo disponible de la meta"
                });
            }
        }



        // Crear movimiento
        const result = await pool.query(
            `
            INSERT INTO movimientos_meta
            (
                meta_id,
                usuario_id,
                tipo,
                monto,
                descripcion
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                meta_id,
                usuario_id,
                tipo,
                monto,
                descripcion
            ]
        );


        return res.status(201).json({
            success: true,
            message: "Movimiento creado correctamente",
            data: result.rows[0]
        });


    } catch (error) {

        console.error("Error en createMovimientoMeta:", error);

        return res.status(500).json({
            success: false,
            message: "Error al crear movimiento"
        });
    }
};


// Anular movimiento
const anularMovimientoMeta = async (req, res) => {

    try {

        const { id } = req.params;
        const usuario_id = req.user.id;


        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de movimiento inválido"
            });
        }


        const result = await pool.query(
            `
            UPDATE movimientos_meta
            SET anulado = TRUE
            WHERE id = $1
            AND usuario_id = $2
            AND anulado = FALSE
            RETURNING *
            `,
            [
                id,
                usuario_id
            ]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Movimiento no encontrado o ya estaba anulado"
            });
        }


        return res.json({
            success: true,
            message: "Movimiento anulado correctamente",
            data: result.rows[0]
        });


    } catch (error) {

        console.error("Error en anularMovimientoMeta:", error);

        return res.status(500).json({
            success: false,
            message: "Error al anular movimiento"
        });
    }
};

module.exports = {
    getMovimientosByMeta,
    getMovimientoMetaById,
    createMovimientoMeta,
    anularMovimientoMeta
};
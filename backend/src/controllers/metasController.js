const { pool } = require("../config/db"); const {
  isValidId,
  validateCreateMeta,
  validateUpdateMeta,
} = require("../utils/validators");

const getAllMetas = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const result = await pool.query(
      `SELECT 
                m.id,
                m.nombre,
                m.descripcion,
                m.monto_objetivo,
                m.fecha_limite,
                m.created_at,

                COALESCE(
                    SUM(
                        CASE
                            WHEN mm.tipo = 'aporte' THEN mm.monto
                            WHEN mm.tipo = 'retiro' THEN -mm.monto
                        END
                    ), 
                    0
                ) AS monto_actual

            FROM metas m

            LEFT JOIN movimientos_meta mm
                ON m.id = mm.meta_id
                AND mm.anulado = FALSE

            WHERE m.usuario_id = $1

            GROUP BY m.id

            ORDER BY m.created_at DESC
            `,
      [usuario_id]
    );

    const metas = result.rows.map(meta => {

      const montoActual = Number(meta.monto_actual);
      const objetivo = Number(meta.monto_objetivo);


      return {
        ...meta,

        monto_actual: montoActual,

        porcentaje: objetivo > 0
          ? Math.min(
            Math.round((montoActual / objetivo) * 100),
            100
          )
          : 0,

        restante: Math.max(
          objetivo - montoActual,
          0
        )
      };

    });

    res.json({
      success: true,
      message: "Metas obtenidas correctamente",
      data: metas,
    });
  } catch (error) {
    console.error("Error al obtener metas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const getMetaById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;


    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const result = await pool.query(
      `SELECT 
          m.id,
          m.nombre,
          m.descripcion,
          m.monto_objetivo,
          m.fecha_limite,
          m.created_at,

          COALESCE(
              SUM(
                  CASE
                      WHEN mm.tipo = 'aporte' THEN mm.monto
                      WHEN mm.tipo = 'retiro' THEN -mm.monto
                  END
              ),
              0
          ) AS monto_actual

      FROM metas m

      LEFT JOIN movimientos_meta mm
          ON m.id = mm.meta_id
          AND mm.anulado = FALSE

      WHERE m.id = $1
      AND m.usuario_id = $2

      GROUP BY m.id
`,
      [id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meta no encontrada",
      });
    }

    const meta = result.rows[0];

    const montoActual = Number(meta.monto_actual);
    const objetivo = Number(meta.monto_objetivo);

    res.json({
      success: true,
      data: {
        ...meta,
        monto_actual: montoActual,
        porcentaje: objetivo > 0
          ? Math.min(
            Math.round((montoActual / objetivo) * 100),
            100
          )
          : 0,
        restante: Math.max(
          objetivo - montoActual,
          0
        )
      }
    });

  } catch (error) {
    console.error("Error al obtener meta:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const createMeta = async (req, res) => {
  try {
    const validation = validateCreateMeta(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const usuario_id = req.user.id;

    const {
      nombre,
      descripcion,
      monto_objetivo,
      fecha_limite
    } = validation.data;

    const result = await pool.query(
      `INSERT INTO metas
      (
      usuario_id,
      nombre,
      descripcion,
      monto_objetivo,
      fecha_limite
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        usuario_id,
        nombre,
        descripcion,
        monto_objetivo,
        fecha_limite,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Meta creada correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear meta:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const updateMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const validation = validateUpdateMeta(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const existe = await pool.query(
      `SELECT *
       FROM metas
       WHERE id = $1
       AND usuario_id = $2`,
      [id, usuario_id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meta no encontrada",
      });
    }

    const metaActual = existe.rows[0];

    const nombre =
      validation.data.nombre ?? metaActual.nombre;

    const descripcion =
      validation.data.descripcion ?? metaActual.descripcion;

    const monto_objetivo =
      validation.data.monto_objetivo ?? Number(metaActual.monto_objetivo);

    const fecha_limite =
      validation.data.fecha_limite ?? metaActual.fecha_limite;

    const result = await pool.query(
      `UPDATE metas
      SET
        nombre=$1,
        descripcion=$2,
        monto_objetivo=$3,
        fecha_limite=$4
       WHERE id = $5 
       AND usuario_id = $6
       RETURNING *`,
      [
        nombre,
        descripcion,
        monto_objetivo,
        fecha_limite,
        id,
        usuario_id
      ]
    );

    res.json({
      success: true,
      message: "Meta actualizada correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar meta:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const deleteMeta = async (req, res) => {
  try {

    const { id } = req.params;
    const { confirm } = req.query;
    const usuario_id = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    // Verificar que la meta existe y pertenece al usuario
    const meta = await pool.query(
      `
      SELECT id, nombre
      FROM metas
      WHERE id = $1
      AND usuario_id = $2
      `,
      [
        id,
        usuario_id
      ]
    );

    if (meta.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meta no encontrada",
      });
    }

    // Obtener saldo actual de la meta
    const saldo = await pool.query(
      `
      SELECT 
        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'aporte' THEN monto
              WHEN tipo = 'retiro' THEN -monto
            END
          ),
          0
        ) AS saldo
      FROM movimientos_meta
      WHERE meta_id = $1
      AND usuario_id = $2
      AND anulado = FALSE
      `,
      [
        id,
        usuario_id
      ]
    );

    const saldoActual = Number(saldo.rows[0].saldo);

    // Si tiene dinero reservado, pedir confirmación
    if (saldoActual > 0 && confirm !== "true") {

      return res.status(409).json({
        success: false,
        requiresConfirmation: true,
        message:
          "La meta tiene dinero reservado. Si la elimina, el saldo volverá a estar disponible.",
        saldo_a_liberar: saldoActual
      });

    }

    // Eliminar meta
    // Los movimientos se eliminan automáticamente por ON DELETE CASCADE
    const result = await pool.query(
      `
      DELETE FROM metas
      WHERE id = $1
      AND usuario_id = $2
      RETURNING *
      `,
      [
        id,
        usuario_id
      ]
    );

    return res.json({
      success: true,
      message: "Meta eliminada correctamente",
      data: result.rows[0]
    });

  } catch (error) {

    console.error("Error al eliminar meta:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  getAllMetas,
  getMetaById,
  createMeta,
  updateMeta,
  deleteMeta,
};
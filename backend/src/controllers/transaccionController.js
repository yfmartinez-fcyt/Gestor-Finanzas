// Importamos el pool de conexiones a la base de datos
const { pool } = require('../config/db');
const {
  isValidId,
  parseImporte,
  validateCreateTransaccion,
  validateUpdateTransaccion,
  validateTipoQuery,
} = require('../utils/validators');

// ─────────────────────────────────────────────────────────────
// GET /api/transaccion — TODAS las transacciones del usuario
// ─────────────────────────────────────────────────────────────
const getAllTransacciones = async (req, res) => {
  try {
    const { tipo, categoria, desde, hasta } = req.query;
    const usuario_id = req.user.id;

    if (tipo) {
      const tipoError = validateTipoQuery(tipo);
      if (tipoError) {
        return res.status(400).json({ success: false, message: tipoError });
      }
    }

    if (desde && isNaN(Date.parse(desde))) {
      return res.status(400).json({ success: false, message: 'La fecha "desde" no es válida' });
    }

    if (hasta && isNaN(Date.parse(hasta))) {
      return res.status(400).json({ success: false, message: 'La fecha "hasta" no es válida' });
    }

    let query = `
SELECT
    t.id,
    t.usuario_id,
    t.tipo,
    t.importe,
    t.descripcion,
    t.categoria_id,
    c.nombre AS categoria,
    t.fecha,
    t.created_at
FROM transacciones t
LEFT JOIN categorias c
ON c.id = t.categoria_id
WHERE t.usuario_id = $1
`;
    const params = [usuario_id];
    let idx = 2;

    if (tipo) {
      query += ` AND t.tipo = $${idx}`;
      params.push(tipo);
      idx++;
    }

    if (categoria) {
      query += ` AND t.categoria_id = $${idx}`;
      params.push(categoria);
      idx++;
    }

    if (desde) {
      query += ` AND t.fecha >= $${idx}`;
      params.push(desde);
      idx++;
    }

    if (hasta) {
      query += ` AND t.fecha <= $${idx}`;
      params.push(hasta);
      idx++;
    }

    query += ` ORDER BY t.fecha DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Error en getAllTransacciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las transacciones' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/transaccion/:id — Obtener una transacción específica por ID
// ─────────────────────────────────────────────────────────────
const getTransaccionById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de transacción inválido",
      });
    }

    const result = await pool.query(
      `SELECT
          t.id,
          t.usuario_id,
          t.tipo,
          t.importe,
          t.descripcion,
          t.categoria_id,
          c.nombre AS categoria,
          t.fecha,
          t.created_at
       FROM transacciones t
       LEFT JOIN categorias c
         ON c.id = t.categoria_id
       WHERE t.id = $1
         AND t.usuario_id = $2`,
      [id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transacción no encontrada o sin permisos para acceder",
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error en getTransaccionById:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener la transacción",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/transaccion — Crear una NUEVA transacción
// ─────────────────────────────────────────────────────────────
const createTransaccion = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const validation = validateCreateTransaccion(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const {
      tipo,
      importe,
      descripcion,
      categoria_id,
      fecha,
    } = validation.data;

    // Verificar que la categoría exista y pertenezca al usuario
    const categoria = await pool.query(
      `SELECT id
       FROM categorias
       WHERE id = $1
         AND usuario_id = $2`,
      [categoria_id, usuario_id]
    );

    if (categoria.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La categoría seleccionada no existe.",
      });
    }

    const result = await pool.query(
      `INSERT INTO transacciones
        (usuario_id, tipo, importe, descripcion, categoria_id, fecha)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        usuario_id,
        tipo,
        importe,
        descripcion,
        categoria_id,
        fecha,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Transacción creada exitosamente",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error en createTransaccion:", error);

    return res.status(500).json({
      success: false,
      message: "Error al crear la transacción",
    });
  }
};
// ─────────────────────────────────────────────────────────────
// PUT /api/transaccion/:id — Actualizar una transacción existente
// ─────────────────────────────────────────────────────────────
const updateTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, importe, descripcion, categoria_id, fecha } = req.body;
    const usuario_id = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de transacción inválido",
      });
    }

    const validation = validateUpdateTransaccion(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const exists = await pool.query(
      `SELECT id
       FROM transacciones
       WHERE id = $1
         AND usuario_id = $2`,
      [id, usuario_id]
    );

    if (exists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transacción no encontrada o sin permiso",
      });
    }

    // Verificar que la categoría exista y pertenezca al usuario
    if (categoria_id !== undefined) {
      const categoria = await pool.query(
        `SELECT id
         FROM categorias
         WHERE id = $1
           AND usuario_id = $2`,
        [categoria_id, usuario_id]
      );

      if (categoria.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "La categoría seleccionada no existe.",
        });
      }
    }

    const result = await pool.query(
      `UPDATE transacciones
       SET
         tipo = COALESCE($1, tipo),
         importe = COALESCE($2, importe),
         descripcion = COALESCE($3, descripcion),
         categoria_id = COALESCE($4, categoria_id),
         fecha = COALESCE($5, fecha)
       WHERE id = $6
         AND usuario_id = $7
       RETURNING *`,
      [
        tipo ?? null,
        importe !== undefined ? parseImporte(importe) : null,
        descripcion !== undefined ? (descripcion?.trim() || null) : null,
        categoria_id ?? null,
        fecha ?? null,
        id,
        usuario_id,
      ]
    );

    return res.json({
      success: true,
      message: "Transacción actualizada",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Error en updateTransaccion:", error);

    return res.status(500).json({
      success: false,
      message: "Error al actualizar la transacción",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/transaccion/:id — Eliminar una transacción
// ─────────────────────────────────────────────────────────────
const deleteTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'ID de transacción inválido' });
    }

    const result = await pool.query(
      `DELETE FROM transacciones 
       WHERE id = $1 AND usuario_id = $2
       RETURNING id`,
      [id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Transacción no encontrada o sin permiso`
      });
    }

    res.json({
      success: true,
      message: `Transacción eliminada exitosamente`
    });

  } catch (error) {
    console.error('Error en deleteTransaccion:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar transacción' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/transaccion/stats — Estadísticas generales por usuario
// ─────────────────────────────────────────────────────────────
/**
 * Calcula el resumen de transacciones agrupadas por tipo para el dashboard.
 * Utiliza agregación directamente en SQL para mayor eficiencia.
 */
const getStats = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN tipo = 'ingreso' THEN importe ELSE 0 END) AS ingresos,
        SUM(CASE WHEN tipo = 'gasto' THEN importe ELSE 0 END) AS gastos
      FROM transacciones
      WHERE usuario_id = $1
    `, [usuario_id]);

    const data = result.rows[0];

    res.json({
      success: true,
      data: {
        total: Number(data.total) || 0,
        ingresos: Number(data.ingresos) || 0,
        gastos: Number(data.gastos) || 0,
        balance: (Number(data.ingresos) || 0) - (Number(data.gastos) || 0)
      }
    });

  } catch (error) {
    console.error('Error en getStats:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
};

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────
module.exports = {
  getAllTransacciones,
  getTransaccionById,
  createTransaccion,
  updateTransaccion,
  deleteTransaccion,
  getStats
};
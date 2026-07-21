const { pool } = require("../config/db");const {
  isValidId,
  validateCreateMeta,
  validateUpdateMeta,
} = require("../utils/validators");

const getAllMetas = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const result = await pool.query(
      `SELECT *
       FROM metas
       WHERE usuario_id = $1
       ORDER BY created_at DESC`,
      [usuario_id]
    );

    res.json({
      success: true,
      message: "Metas obtenidas correctamente",
      data: result.rows,
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
      `SELECT *
       FROM metas
       WHERE id = $1
       AND usuario_id = $2`,
      [id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meta no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Meta obtenida correctamente",
      data: result.rows[0],
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

    let {
      nombre,
      descripcion,
      monto_objetivo,
      monto_actual,
      fecha_limite,
      estado,
    } = validation.data;

    if (monto_actual >= monto_objetivo) {
      estado = "completada";
    } else {
      estado = "activa";
    }

    const result = await pool.query(
      `INSERT INTO metas
      (
        usuario_id,
        nombre,
        descripcion,
        monto_objetivo,
        monto_actual,
        fecha_limite,
        estado
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        usuario_id,
        nombre,
        descripcion,
        monto_objetivo,
        monto_actual,
        fecha_limite,
        estado,
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
      req.body.nombre !== undefined ? req.body.nombre : metaActual.nombre;

    const descripcion =
      req.body.descripcion !== undefined
        ? req.body.descripcion
        : metaActual.descripcion;

    const monto_objetivo =
      req.body.monto_objetivo !== undefined
        ? Number(req.body.monto_objetivo)
        : Number(metaActual.monto_objetivo);

    const monto_actual =
      req.body.monto_actual !== undefined
        ? Number(req.body.monto_actual)
        : Number(metaActual.monto_actual);

    const fecha_limite =
      req.body.fecha_limite !== undefined
        ? req.body.fecha_limite
        : metaActual.fecha_limite;

    let estado =
      req.body.estado !== undefined
        ? req.body.estado
        : metaActual.estado;

    // Actualizar automáticamente el estado
    if (monto_actual >= monto_objetivo) {
      estado = "completada";
    } else if (estado !== "cancelada") {
      estado = "activa";
    }

    const result = await pool.query(
      `UPDATE metas
       SET
          nombre = $1,
          descripcion = $2,
          monto_objetivo = $3,
          monto_actual = $4,
          fecha_limite = $5,
          estado = $6,
          updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        nombre,
        descripcion,
        monto_objetivo,
        monto_actual,
        fecha_limite,
        estado,
        id,
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
    const usuario_id = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const result = await pool.query(
      `DELETE FROM metas
       WHERE id = $1
       AND usuario_id = $2
       RETURNING *`,
      [id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meta no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Meta eliminada correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar meta:", error);
    res.status(500).json({
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
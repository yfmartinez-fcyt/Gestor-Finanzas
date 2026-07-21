export default function MetaCard({ meta, onEdit, onDelete }) {
  const porcentaje = Math.min(
    100,
    Math.round((Number(meta.monto_actual) / Number(meta.monto_objetivo)) * 100)
  );

  const restante = Math.max(
    0,
    Number(meta.monto_objetivo) - Number(meta.monto_actual)
  );

  const formatearMoneda = (valor) =>
    Number(valor).toLocaleString("es-PY");

  return (
    <div className="meta-card">
      <div className="meta-header">
        <h3>{meta.nombre}</h3>
        <span className={`estado ${meta.estado}`}>
          {meta.estado}
        </span>
      </div>

      {meta.descripcion && (
        <p className="descripcion">{meta.descripcion}</p>
      )}

      <div className="progress">
        <div
          className="progress-bar"
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>

      <p>
        <strong>{porcentaje}% completado</strong>
      </p>

      <p>
        <strong>Ahorrado:</strong> Gs.{" "}
        {formatearMoneda(meta.monto_actual)}
      </p>

      <p>
        <strong>Objetivo:</strong> Gs.{" "}
        {formatearMoneda(meta.monto_objetivo)}
      </p>

      <p>
        <strong>Faltan:</strong> Gs.{" "}
        {formatearMoneda(restante)}
      </p>

      {meta.fecha_limite && (
        <p>
          <strong>Fecha límite:</strong>{" "}
          {new Date(meta.fecha_limite).toLocaleDateString()}
        </p>
      )}

      <div className="meta-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onEdit}
        >
          Editar
        </button>

        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={onDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
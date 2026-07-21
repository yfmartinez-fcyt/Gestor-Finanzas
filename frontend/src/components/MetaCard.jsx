import { formatDate } from "../utils/format";

export default function MetaCard({ meta, onEdit, onDelete }) {

  const formatearMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-PY");

  const estados = {
    activa: "Activa",
    completada: "Completada",
    cancelada: "Cancelada",
  };

  const estadoTexto = estados[meta.estado] || meta.estado;

  return (
    <div className="meta-card">
      <div className="meta-header">
        <h3>{meta.nombre}</h3>
        <span className={`estado ${meta.estado}`}>
          {estadoTexto}
        </span>
      </div>

      {meta.descripcion && (
        <p className="descripcion">{meta.descripcion}</p>
      )}

      <p>
        <strong>Objetivo:</strong> Gs.{" "}
        {formatearMoneda(meta.monto_objetivo)}
      </p>

      {meta.fecha_limite && (
        <p>
          <strong>Fecha límite:</strong>{" "}
          {formatDate(meta.fecha_limite)}
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
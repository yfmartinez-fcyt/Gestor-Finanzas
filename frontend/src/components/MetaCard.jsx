import {
  Wallet,
  Target,
  CircleDollarSign,
  Calendar
} from "lucide-react";
import { useState } from "react";

export default function MetaCard({ meta, onEdit, onDelete }) {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
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
    <div className={`meta-card ${mostrarDetalle ? "modal-open" : ""}`}>
      <div className="meta-header">
        <h3>{meta.nombre}</h3>
        <span
          className={`estado estado-${meta.estado.toLowerCase()}`}
        >
          {meta.estado}
        </span>
      </div>

      {meta.descripcion && (
        <p className="descripcion">
          {meta.descripcion.length > 100
            ? `${meta.descripcion.substring(0, 100)}...`
            : meta.descripcion}
        </p>
      )}
      {meta.descripcion && meta.descripcion.length > 100 && (
        <button
          className="btn-link"
          onClick={() => setMostrarDetalle(true)}
        >
          Ver más...
        </button>
      )}

      <div className="progress-bar meta-progress">
        <div
          className="progress-fill"
          style={{
            width: `${porcentaje}%`,
            background:
              porcentaje >= 100
                ? "#22c55e"
                : porcentaje >= 70
                  ? "#3b82f6"
                  : porcentaje >= 40
                    ? "#f59e0b"
                    : "#ef4444",
          }}
        />
      </div>

      <p>
        <strong>{porcentaje}% completado</strong>
      </p>

      <div className="meta-info">
        <p>
          <Wallet size={18} />
          <strong>Ahorrado:</strong>
          <span>{formatearMoneda(meta.monto_actual)}</span>
        </p>

        <p>
          <Target size={18} />
          <strong>Objetivo:</strong>
          <span>{formatearMoneda(meta.monto_objetivo)}</span>
        </p>

        <p>
          <CircleDollarSign size={18} />
          <strong>Faltan:</strong>
          <span>{formatearMoneda(restante)}</span>
        </p>

        {meta.fecha_limite && (
          <p>
            <Calendar size={18} />
            <strong>Fecha límite:</strong>
            <span>{new Date(meta.fecha_limite).toLocaleDateString()}</span>
          </p>
        )}
      </div>

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
      {mostrarDetalle && (
        <div className="modal-overlay">

          <div className="modal-card">

            <div className="modal-header">
              <h2>{meta.nombre}</h2>
            </div>

            <p>
              {meta.descripcion}
            </p>

            <button
              className="btn btn-secondary"
              onClick={() => setMostrarDetalle(false)}
            >
              Cerrar
            </button>

          </div>

        </div>
      )}
    </div>
  );
}
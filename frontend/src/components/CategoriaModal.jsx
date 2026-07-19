import { useState } from "react";
import { categoriasApi } from "../services/api";

export default function CategoriaModal({
  onClose,
  onCreated,
}) {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const guardarCategoria = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) return;

    try {
      setLoading(true);

      const categoria = await categoriasApi.create({
        nombre,
      });

      onCreated(categoria);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Nueva categoría</h2>

        <form onSubmit={guardarCategoria}>

          <label>
            Nombre

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Universidad"
              autoFocus
            />

          </label>

          <div className="form-actions">

            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { categoriasApi } from "../services/api";
import CategoriaModal from "./CategoriaModal";

const EMPTY_FORM = {
  tipo: 'gasto',
  importe: '',
  descripcion: '',
  categoria_id: '',
  fecha: new Date().toISOString().slice(0, 10),
};

export default function TransactionForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const [categorias, setCategorias] = useState([]);

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (initial) {
      setForm(initial);
    }
  }, [initial]);

  const cargarCategorias = async () => {
    try {
      const data = await categoriasApi.list();
      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      importe: Number(form.importe),
      categoria_id: Number(form.categoria_id),
    });
  };

  return (
    <>
    <form className="form panel-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Tipo
          <select name="tipo" value={form.tipo} onChange={handleChange} required>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
        </label>

        <label>
          Importe
          <input
            type="number"
            name="importe"
            min="0.01"
            step="0.01"
            value={form.importe}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Descripción
        <input
          type="text"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Ej. Supermercado, nómina..."
        />
      </label>

      <div className="form-row">
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <label>Categoría</label>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCategoriaModal(true)}
            >
              + Nueva
            </button>
          </div>

          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>

            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <label>
          Fecha
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>

    {showCategoriaModal && (
      <CategoriaModal
        nombre={nuevaCategoria}
        setNombre={setNuevaCategoria}
        onClose={() => setShowCategoriaModal(false)}
        onCreated={async (categoria) => {
          await cargarCategorias();

          setForm((prev) => ({
            ...prev,
            categoria_id: categoria.id,
          }));

          setShowCategoriaModal(false);
        }}
      />
    )
  }
  </>
  );
}

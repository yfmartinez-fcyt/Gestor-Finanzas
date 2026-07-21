import { useEffect, useState } from "react";

const EMPTY_FORM = {
  nombre: "",
  descripcion: "",
  monto_objetivo: "",
  fecha_limite: new Date().toISOString().slice(0, 10),
};

export default function MetaForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  useEffect(() => {
    if (initial) {
      setForm(initial);
    }
  }, [initial]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      monto_objetivo: Number(form.monto_objetivo)
    });
  };

  return (
    <form className="form panel-form" onSubmit={handleSubmit}>

      <label>
        Nombre
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej. Comprar una notebook"
          required
        />
      </label>


      <label>
        Descripción
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Ej. Ahorrar para comprar una notebook nueva"
          rows="3"
        />
      </label>


      <div className="form-row">

        <label>
          Monto objetivo
          <input
            type="number"
            name="monto_objetivo"
            min="1"
            value={form.monto_objetivo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Fecha límite
          <input
            type="date"
            name="fecha_limite"
            value={form.fecha_limite}
            onChange={handleChange}
          />
        </label>

      </div>

      <div className="form-actions">

        {onCancel && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>

      </div>

    </form>
  );
}
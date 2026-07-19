import { useEffect, useState } from "react";

export default function CategoriaForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "gasto",
  });

  useEffect(() => {
    if (initial) {
      setForm(initial);
    }
  }, [initial]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Tipo
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
        >
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </select>
      </label>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}

        <button
          className="btn btn-primary"
          disabled={loading}
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
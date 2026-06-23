import { useState } from 'react';

const EMPTY_FORM = {
  tipo: 'gasto',
  importe: '',
  descripcion: '',
  categoria: '',
  fecha: new Date().toISOString().slice(0, 10),
};

export default function TransactionForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      importe: Number(form.importe),
    });
  };

  return (
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
        <label>
          Categoría
          <input
            type="text"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            placeholder="Alimentación, salario..."
          />
        </label>

        <label>
          Fecha
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
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
  );
}

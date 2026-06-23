import { useEffect, useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import { transaccionApi } from '../services/api';
import { formatCurrency, formatDate, toInputDate } from '../utils/format';

export default function Transaccion() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    tipo: '',
    categoria: '',
    desde: '',
    hasta: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await transaccionApi.list(filters);
      setItems(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [filters.tipo, filters.categoria, filters.desde, filters.hasta]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await transaccionApi.create(payload);
      setShowForm(false);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    setSaving(true);
    try {
      await transaccionApi.update(editing.id, payload);
      setEditing(null);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta transacción?')) return;

    try {
      await transaccionApi.remove(id);
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Transacciones</h1>
          <p>Gestiona tus ingresos y gastos.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? 'Cerrar formulario' : '+ Nueva transacción'}
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && !editing && (
        <section className="panel">
          <h2>Nueva transacción</h2>
          <TransactionForm onSubmit={handleCreate} loading={saving} />
        </section>
      )}

      {editing && (
        <section className="panel">
          <h2>Editar transacción</h2>
          <TransactionForm
            initial={{
              tipo: editing.tipo,
              importe: String(editing.importe),
              descripcion: editing.descripcion || '',
              categoria: editing.categoria || '',
              fecha: toInputDate(editing.fecha),
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            loading={saving}
          />
        </section>
      )}

      <section className="panel">
        <div className="filters">
          <label>
            Tipo
            <select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>
          </label>
          <label>
            Categoría
            <input
              type="text"
              name="categoria"
              value={filters.categoria}
              onChange={handleFilterChange}
              placeholder="Filtrar categoría"
            />
          </label>
          <label>
            Desde
            <input type="date" name="desde" value={filters.desde} onChange={handleFilterChange} />
          </label>
          <label>
            Hasta
            <input type="date" name="hasta" value={filters.hasta} onChange={handleFilterChange} />
          </label>
        </div>

        {loading ? (
          <div className="page-center compact">
            <div className="loader" />
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No hay transacciones con estos filtros.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th>Importe</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.fecha)}</td>
                    <td>{item.descripcion || '—'}</td>
                    <td>{item.categoria || '—'}</td>
                    <td>
                      <span className={`badge badge-${item.tipo}`}>{item.tipo}</span>
                    </td>
                    <td className={item.tipo === 'ingreso' ? 'positive' : 'negative'}>
                      {formatCurrency(item.importe)}
                    </td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setShowForm(false);
                          setEditing(item);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

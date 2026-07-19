import { useEffect, useState } from "react";
import CategoriaForm from "../components/CategoriaForm";
import CategoriaTable from "../components/CategoriaTable";
import { categoriasApi } from "../services/api";

export default function Categorias() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategorias = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await categoriasApi.list();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleCreate = async (payload) => {
    setSaving(true);

    try {
      await categoriasApi.create(payload);

      setShowForm(false);

      await loadCategorias();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    setSaving(true);

    try {
      await categoriasApi.update(editing.id, payload);

      setEditing(null);

      await loadCategorias();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;

    try {
      await categoriasApi.remove(id);

      await loadCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Categorías</h1>
          <p><p>Administra las categorías que utilizarás en tus transacciones.</p>.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? "Cerrar formulario" : "+ Nueva categoría"}
        </button>
      </header>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {showForm && !editing && (
        <section className="panel">
          <h2>Nueva categoría</h2>

          <CategoriaForm
            onSubmit={handleCreate}
            loading={saving}
          />
        </section>
      )}

      {editing && (
        <section className="panel">
          <h2>Editar categoría</h2>

          <CategoriaForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            loading={saving}
          />
        </section>
      )}

      <section className="panel">

        {loading ? (
          <div className="page-center compact">
            <div className="loader" />
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No existen categorías registradas.</p>
          </div>
        ) : (
          <CategoriaTable
            items={items}
            onEdit={(categoria) => {
              setShowForm(false);
              setEditing(categoria);
            }}
            onDelete={handleDelete}
          />
        )}

      </section>
    </div>
  );
}
import { useEffect, useState } from "react";
import { metasApi } from "../services/api";
import MetaCard from "../components/MetaCard";
import MetaForm from "../components/MetaForm";

export default function Metas() {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metaSeleccionada, setMetaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const cargarMetas = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await metasApi.list();
      setMetas(response.data || []);

    } catch (error) {
      console.error(error);
      setError(error.message || 'Error al obtener las metas');

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetas();
  }, []);

  const guardarMeta = async (datos) => {
    setError("");
    setSaving(true);

    try {

      if (metaSeleccionada) {
        await metasApi.update(metaSeleccionada.id, datos);
      } else {
        await metasApi.create(datos);
      }

      setMostrarFormulario(false);
      setMetaSeleccionada(null);

      await cargarMetas();

    } catch (error) {
      console.error(error);
      setError(error.message || 'Error al guardar la meta');

    } finally {
      setSaving(false);
    }
  };

  const eliminarMeta = async (id) => {
    setError("");
    if (!window.confirm("¿Eliminar esta meta?")) return;

    try {
      await metasApi.remove(id);
      await cargarMetas();
    } catch (error) {
      console.error(error);
      setError(error.message || 'Error al eliminar la meta');
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="page">

      <header className="page-header">
        <div>
          <h1>Metas de Ahorro</h1>
          <p>Define objetivos y controla tu progreso.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setMetaSeleccionada(null);
            setMostrarFormulario((prev) => !prev);
          }}
        >
          {mostrarFormulario ? "Cerrar formulario" : "+ Nueva meta"}
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {mostrarFormulario && (
        <section className="panel">
          <h2>
            {metaSeleccionada ? "Editar meta" : "Nueva meta"}
          </h2>

          <MetaForm
            initial={metaSeleccionada}
            onSubmit={guardarMeta}
            onCancel={() => {
              setMostrarFormulario(false);
              setMetaSeleccionada(null);
            }}
            loading={saving}
          />
        </section>
      )}

      <section className="panel">
        {metas.length === 0 ? (
          <div className="empty-state">
            <p>No tienes metas registradas.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {metas.map((meta) => (
              <MetaCard
                key={meta.id}
                meta={meta}
                onEdit={() => {
                  setMetaSeleccionada(meta);
                  setMostrarFormulario(true);
                }}
                onDelete={() => eliminarMeta(meta.id)}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { transaccionApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import { metasApi } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [metas, setMetas] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, listRes, metasRes] = await Promise.all([
          transaccionApi.stats(),
          transaccionApi.list(),
          metasApi.list(),
        ]);
        setStats(statsRes.data);
        setRecent(listRes.data.slice(0, 5));
        setMetas(metasRes.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
          <h1>Dashboard</h1>
          <p>Resumen de tu situación financiera.</p>
        </div>
        <Link to="/transaccion" className="btn btn-primary">
          + Nueva transacción
        </Link>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">Balance</span>
          <strong className={`stat-value ${stats?.balance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(stats?.balance)}
          </strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Ingresos</span>
          <strong className="stat-value positive">{formatCurrency(stats?.ingresos)}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Gastos</span>
          <strong className="stat-value negative">{formatCurrency(stats?.gastos)}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Transacciones</span>
          <strong className="stat-value">{stats?.total ?? 0}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Metas de ahorro</h2>
          <Link to="/metas">Ver todas</Link>
        </div>

        {metas.length === 0 ? (
          <div className="empty-state">
            <p>No tienes metas registradas.</p>
          </div>
        ) : (
          <div className="metas-dashboard">
            {metas.map((meta) => {
              const porcentaje = Math.min(
                (Number(meta.monto_actual) / Number(meta.monto_objetivo)) * 100,
                100
              );

              const restante = Number(meta.monto_objetivo) - Number(meta.monto_actual);

              return (
                <div key={meta.id} className="meta-dashboard-card">

                  <div className="meta-dashboard-header">
                    <strong>{meta.nombre}</strong>

                    <span className="meta-percent">
                      {porcentaje.toFixed(0)}%
                    </span>
                  </div>

                  <div className="progress-bar">
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

                  <div className="meta-dashboard-info">
                    <span>
                      Monto Actual: {formatCurrency(meta.monto_actual)}
                    </span>

                    <span>
                      Meta: {formatCurrency(meta.monto_objetivo)}
                    </span>
                  </div>

                  <small className="meta-restante">
                    {restante <= 0 ? (
                      <span className="badge-role">Completada</span>
                    ) : (
                      <span className="badge-role">Faltan {formatCurrency(restante)}</span>
                    )}
                  </small>

                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Últimas transacciones</h2>
          <Link to="/transaccion">Ver todas</Link>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <p>Aún no tienes transacciones.</p>
            <Link to="/transaccion" className="btn btn-secondary">
              Crear la primera
            </Link>
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
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
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

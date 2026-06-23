import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { transaccionApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, listRes] = await Promise.all([
          transaccionApi.stats(),
          transaccionApi.list(),
        ]);
        setStats(statsRes.data);
        setRecent(listRes.data.slice(0, 5));
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

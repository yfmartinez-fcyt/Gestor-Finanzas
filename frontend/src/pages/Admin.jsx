import { useCallback, useEffect, useState } from 'react';
import { usuariosApi } from '../services/api';
import { formatDate, formatDateTime } from '../utils/format';

const emptyForm = {
  nombre: '',
  apellido: '',
  email: '',
  avatar: '',
  rol: 'usuario',
};

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, sessionsRes] = await Promise.all([
        usuariosApi.list(),
        usuariosApi.getAllSessions(),
      ]);
      setUsers(usersRes.data);
      setSessions(sessionsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = (user) => {
    setEditing(user);
    setForm({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      avatar: user.avatar || '',
      rol: user.rol || 'usuario',
    });
    setMessage('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editing) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      await usuariosApi.update(editing.id, form);
      setMessage(`Usuario ${form.email} actualizado correctamente.`);
      setEditing(null);
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!window.confirm('¿Revocar esta sesión? El usuario deberá iniciar sesión de nuevo.')) return;

    setMessage('');
    setError('');

    try {
      await usuariosApi.revokeSession(sessionId);
      setMessage('Sesión revocada correctamente.');
      await loadData();
    } catch (err) {
      setError(err.message);
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
          <h1>Administración</h1>
          <p>Gestiona usuarios y sesiones del sistema.</p>
        </div>
      </header>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {editing && (
        <section className="panel">
          <div className="panel-header">
            <h2>Editar usuario #{editing.id}</h2>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleCancelEdit}>
              Cancelar
            </button>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Nombre
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
              </label>
              <label>
                Apellido
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Rol
                <select name="rol" value={form.rol} onChange={handleChange}>
                  <option value="usuario">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>

            <label>
              Avatar (URL)
              <input
                type="url"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h2>Usuarios ({users.length})</h2>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <p>No hay usuarios registrados.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {user.nombre} {user.apellido}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.rol === 'admin' ? 'badge-admin' : 'badge-role'}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Sesiones ({sessions.length})</h2>
        </div>

        {sessions.length === 0 ? (
          <div className="empty-state">
            <p>No hay sesiones registradas.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Creada</th>
                  <th>Expira</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.id}</td>
                    <td>
                      {session.nombre} {session.apellido}
                    </td>
                    <td>{session.email}</td>
                    <td>{formatDateTime(session.created_at)}</td>
                    <td>{formatDateTime(session.expires_at)}</td>
                    <td>
                      <span
                        className={`badge ${session.activa ? 'badge-ingreso' : 'badge-gasto'}`}
                      >
                        {session.activa ? 'Activa' : 'Expirada'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRevokeSession(session.id)}
                      >
                        Revocar
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

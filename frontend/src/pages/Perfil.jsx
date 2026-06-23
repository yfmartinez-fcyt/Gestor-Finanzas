import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usuariosApi } from '../services/api';

export default function Perfil() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    avatar: '',
    rol: 'usuario',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        avatar: user.avatar || '',
        rol: user.rol || 'usuario',
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const payload = { ...form };
      if (user.rol !== 'admin') {
        delete payload.rol;
      }
      await usuariosApi.update(user.id, payload);
      await refreshUser();
      setMessage('Perfil actualizado correctamente.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Mi perfil</h1>
          <p>Actualiza tu información personal.</p>
        </div>
      </header>

      <section className="panel profile-panel">
        <div className="profile-summary">
          <span className="avatar avatar-lg">{user?.nombre?.[0]?.toUpperCase() || 'U'}</span>
          <div>
            <h2>
              {user?.nombre} {user?.apellido}
            </h2>
            <p>{user?.email}</p>
            <span className="badge badge-role">{user?.rol || 'usuario'}</span>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

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

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

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

          {user?.rol === 'admin' && (
            <label>
              Rol
              <select name="rol" value={form.rol} onChange={handleChange}>
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </section>
    </div>
  );
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from "../context/ThemeContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">GF</span>
          <div>
            <strong>Gestor Finanzas</strong>
            <small>Control personal</small>
          </div>
        </div>


        <nav className="nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/transaccion">Transacciones</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
          <NavLink to="/perfil">Perfil</NavLink>
          {user?.rol === 'admin' && <NavLink to="/admin">Administración</NavLink>}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={toggleTheme}
          >
            {isDark ? "☀️ Modo claro" : "🌙 Modo oscuro"}
          </button>
          <div className="user-chip">
            <span className="avatar">{user?.nombre?.[0]?.toUpperCase() || 'U'}</span>
            <div>
              <strong>
                {user?.nombre} {user?.apellido}
              </strong>
              <small>{user?.email}</small>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-block" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

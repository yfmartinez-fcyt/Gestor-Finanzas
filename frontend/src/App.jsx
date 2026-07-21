import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute, { AdminRoute, GuestRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Register from './pages/Register';
import Transaccion from './pages/Transaccion';
import Admin from './pages/Admin';
import Categorias from './pages/Categorias';
import Metas from './pages/Metas';

export default function App() {
  return (
    <ThemeProvider>
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transaccion" element={<Transaccion />} />
            <Route path="transacciones" element={<Navigate to="/transaccion" replace />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="metas" element={<Metas />} />
            <Route path="categorias" element={<Categorias />} />
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<Admin />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
</ThemeProvider>
  );
}

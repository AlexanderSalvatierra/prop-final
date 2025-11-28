// src/components/ProtectedRoute.jsx
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PatientProvider } from '../context/PatientContext'; // 👈 Importar

export function ProtectedRoute({ allowedRoles, withProvider = true }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está logueado, redirigir a /login
    // 'state={{ from: location }}' guarda la página que intentaba visitar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar Roles (Si se especifica allowedRoles)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Si el rol del usuario no está permitido, redirigir al dashboard (o home)
    return <Navigate to="/dashboard" replace />;
  }

  // Si está logueado y autorizado:
  // Si withProvider es true, envolvemos con PatientProvider.
  // Si es false, solo renderizamos el Outlet (asumiendo que ya hay un Provider arriba).
  if (withProvider) {
    return (
      <PatientProvider>
        <Outlet />
      </PatientProvider>
    );
  }

  return <Outlet />;
}
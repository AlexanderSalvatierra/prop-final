// src/components/ProtectedRoute.jsx
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PatientProvider } from '../context/PatientContext'; // 👈 Importar

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Si no está logueado, redirigir a /login
    // 'state={{ from: location }}' guarda la página que intentaba visitar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está logueado, envolvemos las rutas hijas con el
  // PatientProvider y renderizamos la ruta (Outlet)
  return (
    <PatientProvider>
      <Outlet />
    </PatientProvider>
  );
}
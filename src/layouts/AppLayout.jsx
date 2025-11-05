// src/layouts/AppLayout.jsx

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente NavLink personalizado (ACTUALIZADO CON COLORES TEAL)
function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block w-full px-4 py-3 rounded-lg transition-colors duration-200 
         ${isActive 
           ? 'bg-white text-teal-600 font-semibold' // Link activo
           : 'text-teal-100 hover:bg-teal-700 hover:text-white' // Link inactivo
         }`
      }
    >
      {children}
    </NavLink>
  );
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (AHORA COLOR TEAL) */}
      <aside className="w-64 bg-teal-600 p-6 shadow-xl flex flex-col">
        {/* LOGO Y NOMBRE */}
        <h1 className="flex items-center space-x-2 text-2xl font-bold text-white mb-8">
          <img src="/propiel-logo.png" alt="Propiel Logo" className="h-8 w-auto" />
          <span>Propiel</span>
        </h1>
        
        {/* Menú principal (depende del rol) */}
        <nav className="space-y-4 flex-1">
          <SidebarLink to="/dashboard">Dashboard</SidebarLink>

          {user?.role === 'specialist' && (
            <>
              <SidebarLink to="/pacientes">Pacientes</SidebarLink>
              {/* <SidebarLink to="/calendario">Calendario</Link> */}
            </>
          )}

          {user?.role === 'patient' && (
            <>
              {/* <SidebarLink to="/mis-citas">Mis Citas</SidebarLink> */}
              {/* <SidebarLink to="/mi-perfil">Mi Perfil</SidebarLink> */}
            </>
          )}
        </nav>

        {/* Footer del Sidebar con Logout */}
        <div className="mt-6">
          <p className="text-sm text-teal-200 mb-2">Logueado como:</p>
          <p className="font-semibold text-white truncate mb-4">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
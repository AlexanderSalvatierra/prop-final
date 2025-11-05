// src/layouts/AppLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 Importar useAuth

// Componente NavLink personalizado (sin cambios)
function SidebarLink({ to, children }) {
  // ... (mismo código de antes)
}

export function AppLayout() {
  const { user, logout } = useAuth(); // 👈 Obtener el usuario y logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir al login después de salir
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-xl flex flex-col">
        <h1 className="text-2xl font-bold text-lime-600 mb-8">Propiel</h1>
        
        {/* Menú principal (depende del rol) */}
        <nav className="space-y-4 flex-1">
          <SidebarLink to="/dashboard">Dashboard</SidebarLink>

          {/* --- LINKS DE ESPECIALISTA --- */}
          {user?.role === 'specialist' && (
            <>
              <SidebarLink to="/pacientes">Pacientes</SidebarLink>
              {/* <SidebarLink to="/calendario">Calendario</SidebarLink> */}
            </>
          )}

          {/* --- LINKS DE PACIENTE --- */}
          {user?.role === 'patient' && (
            <>
              {/* <SidebarLink to="/mis-citas">Mis Citas</SidebarLink> */}
              {/* <SidebarLink to="/mi-perfil">Mi Perfil</SidebarLink> */}
            </>
          )}
        </nav>

        {/* Footer del Sidebar con Logout */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Logueado como:</p>
          <p className="font-semibold text-gray-700 truncate mb-4">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
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
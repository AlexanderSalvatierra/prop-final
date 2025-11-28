// src/layouts/AppLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Menu, Calendar, User, Activity, CreditCard } from 'lucide-react';

// Componente NavLink personalizado
function SidebarLink({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
         ${isActive
          ? 'bg-white text-teal-600 shadow-sm font-semibold'
          : 'text-teal-100 hover:bg-teal-700/50 hover:text-white'
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-teal-600 p-6 shadow-2xl flex flex-col hidden md:flex">
        {/* LOGO Y NOMBRE */}
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
            {/* Placeholder para logo */}
            <span className="text-teal-600 font-bold text-xl">P</span>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Propiel</span>
        </div>

        {/* Menú principal */}
        <nav className="space-y-2 flex-1">
          <SidebarLink to="/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>

          {user?.role === 'specialist' && (
            <>
              <SidebarLink to="/pacientes" icon={Users}>Pacientes</SidebarLink>
              {/* <SidebarLink to="/calendario" icon={Calendar}>Calendario</SidebarLink> */}
            </>
          )}

          {user?.role === 'patient' && (
            <>
              <SidebarLink to="/mis-citas" icon={Calendar}>Mis Citas</SidebarLink>
              <SidebarLink to="/mi-historial" icon={Activity}>Mi Historial</SidebarLink>
              <SidebarLink to="/mis-pagos" icon={CreditCard}>Mis Pagos</SidebarLink>
              {/* <SidebarLink to="/mi-perfil" icon={User}>Mi Perfil</SidebarLink> */}
            </>
          )}
        </nav>

        {/* Footer del Sidebar con Logout */}
        <div className="mt-auto pt-6 border-t border-teal-500">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-teal-200 font-medium uppercase tracking-wider">Cuenta</p>
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-100 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
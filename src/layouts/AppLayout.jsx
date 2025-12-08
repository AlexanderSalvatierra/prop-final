// src/layouts/AppLayout.jsx
import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Menu, Calendar, User, Activity, CreditCard, Pill, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

// Componente NavLink personalizado
function SidebarLink({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
         ${isActive
          ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm font-semibold'
          : 'text-teal-100 dark:text-slate-300 hover:bg-teal-700/50 dark:hover:bg-slate-800/50 hover:text-white dark:hover:text-white'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-teal-600 dark:bg-slate-950 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <img src="/propiel-logo.png" alt="Propiel" className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-tight">Propiel</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-teal-700 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-teal-600 dark:bg-slate-950 p-6 shadow-2xl flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:flex
      `}>
        {/* LOGO Y NOMBRE */}
        <div className="flex items-center space-x-3 mb-10 px-2">
          <img src="/propiel-logo.png" alt="Propiel" className="h-8 w-auto mr-2" />
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
              <SidebarLink to="/mis-recetas" icon={Pill}>Mis Recetas</SidebarLink>
              {/* <SidebarLink to="/mi-perfil" icon={User}>Mi Perfil</SidebarLink> */}
            </>
          )}
        </nav>

        {/* Footer del Sidebar con Logout */}
        <div className="mt-auto pt-6 border-t border-teal-500 dark:border-slate-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-teal-500 dark:bg-slate-700 flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-teal-400 dark:border-slate-600">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.email[0].toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-teal-200 dark:text-slate-400 font-medium uppercase tracking-wider">Cuenta</p>
              <Link to="/perfil" className="text-sm font-medium text-white dark:text-slate-200 truncate hover:underline block">
                {user?.email}
              </Link>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(colorTheme)}
            className="flex items-center justify-center w-full mb-3 text-teal-100 dark:text-slate-300 hover:text-white dark:hover:text-white text-sm font-medium transition-all hover:bg-teal-700/30 dark:hover:bg-slate-800/50 rounded-lg py-2"
            aria-label="Toggle Dark Mode"
          >
            {colorTheme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 mr-2 transition-transform duration-300 rotate-0 hover:rotate-12" />
                Modo Oscuro
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 mr-2 transition-transform duration-300 rotate-0 hover:rotate-90" />
                Modo Claro
              </>
            )}
          </button>

          <Link
            to="/perfil"
            className="flex items-center justify-center w-full mb-3 text-teal-100 dark:text-slate-300 hover:text-white dark:hover:text-white text-sm font-medium transition-colors"
          >
            <User className="w-4 h-4 mr-2" />
            Mi Perfil
          </Link>

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
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
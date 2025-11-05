// src/layouts/PublicLayout.jsx

import { NavLink, Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Público (AHORA COLOR TEAL) */}
      <header className="bg-teal-600 shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* LOGO Y NOMBRE */}
          <NavLink to="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
            <img src="/propiel-logo.png" alt="Propiel Logo" className="h-8 w-auto" /> 
            <span>Propiel</span>
          </NavLink>
          
          {/* Links del Navbar */}
          <div className="flex items-center space-x-6">
            <NavLink 
              to="/conocenos" 
              className="text-teal-100 hover:text-white font-medium transition-colors"
            >
              Conócenos
            </NavLink>
            <NavLink 
              to="/contacto" 
              className="text-teal-100 hover:text-white font-medium transition-colors"
            >
              Contacto
            </NavLink>
            <NavLink 
              to="/login" 
              className="px-5 py-2 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Iniciar Sesión
            </NavLink>
          </div>
        </nav>
      </header>

      {/* Contenido de la página pública (Landing, Login, etc.) */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer (Opcional) */}
      <footer className="bg-white p-6 text-center text-gray-500 border-t">
        © {new Date().getFullYear()} Propiel. Todos los derechos reservados.
      </footer>
    </div>
  );
}
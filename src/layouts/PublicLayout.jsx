// src/layouts/PublicLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Público */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <NavLink to="/" className="text-2xl font-bold text-lime-600">
            Propiel
          </NavLink>
          <div className="flex space-x-6">
            <NavLink to="/conocenos" className="text-gray-600 hover:text-lime-600">
              Conócenos
            </NavLink>
            <NavLink to="/contacto" className="text-gray-600 hover:text-lime-600">
              Contacto
            </NavLink>
            <NavLink 
              to="/login" 
              className="px-5 py-2 bg-lime-600 text-white font-semibold rounded-lg hover:bg-lime-700"
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
// src/layouts/PublicLayout.jsx

import { Link, Outlet } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Blanco y Limpio - Sticky */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/propiel-logo.png" alt="Propiel Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gray-900">Propiel</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                Inicio
              </Link>
              <a
                href="#servicios"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                Servicios
              </a>
              <a
                href="#testimonios"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                Testimonios
              </a>
              <a
                href="#contacto"
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
              >
                Contacto
              </a>
              <Link
                to="/login"
                className="px-6 py-2 border-2 border-teal-600 text-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-colors"
              >
                Iniciar Sesión
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3 pt-4">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <a
                  href="#servicios"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Servicios
                </a>
                <a
                  href="#testimonios"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonios
                </a>
                <a
                  href="#contacto"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </a>
                <Link
                  to="/login"
                  className="text-center px-6 py-2 border-2 border-teal-600 text-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Contenido de la página pública (Landing, Login, etc.) */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer Completo */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo y Descripción */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/propiel-logo.png" alt="Propiel Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold text-gray-900">Propiel</span>
              </div>
              <p className="text-gray-600 text-sm text-center md:text-left">
                Cuidado experto para tu piel. Conectamos pacientes con los mejores dermatólogos.
              </p>
            </div>

            {/* Enlaces Rápidos */}
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-gray-900 mb-4">Enlaces Rápidos</h3>
              <div className="flex flex-col space-y-2 text-center">
                <a href="#servicios" className="text-gray-600 hover:text-teal-600 transition-colors">Servicios</a>
                <a href="#testimonios" className="text-gray-600 hover:text-teal-600 transition-colors">Testimonios</a>
                <a href="#contacto" className="text-gray-600 hover:text-teal-600 transition-colors">Contacto</a>
                <Link to="/login" className="text-gray-600 hover:text-teal-600 transition-colors">Iniciar Sesión</Link>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="flex flex-col items-center md:items-end">
              <h3 className="font-semibold text-gray-900 mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-teal-600 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-teal-600 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-teal-600 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Propiel. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
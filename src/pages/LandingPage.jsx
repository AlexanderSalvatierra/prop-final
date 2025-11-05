// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="container mx-auto px-6 py-24 text-center">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
        Bienvenido a Propiel
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Tu plataforma integral para la gestión dermatológica. Conecta con especialistas y maneja tu historial médico en un solo lugar.
      </p>
      <div className="space-x-4">
        <Link 
          to="/login" 
          className="px-8 py-3 bg-teal-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105"
        >
          Acceder
        </Link>
        <Link 
          to="/conocenos" 
          className="px-8 py-3 bg-gray-200 text-gray-800 text-lg font-semibold rounded-lg hover:bg-gray-300"
        >
          Saber Más
        </Link>
      </div>
    </div>
  );
}
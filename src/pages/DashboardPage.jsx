// src/pages/DashboardPage.jsx
import { useAuth } from '../context/AuthContext';

// Un componente "Widget" de ejemplo
function DashboardWidget({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Bienvenido de nuevo, {user?.email.split('@')[0]}
      </h1>

      {/* --- DASHBOARD DE ESPECIALISTA --- */}
      {user?.role === 'specialist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardWidget title="Próximas Citas">
            <p>Aquí irá una lista de citas...</p>
          </DashboardWidget>
          <DashboardWidget title="Pacientes Recientes">
            <p>Aquí irá una lista de pacientes...</p>
          </DashboardWidget>
          <DashboardWidget title="Resumen General">
            <p>Stats: 15 Pacientes Activos, 3 Citas Hoy.</p>
          </DashboardWidget>
        </div>
      )}

      {/* --- DASHBOARD DE PACIENTE --- */}
      {user?.role === 'patient' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardWidget title="Tu Próxima Cita">
            <p>Dr. Especialista - 25 de Diciembre, 2025</p>
          </DashboardWidget>
          <DashboardWidget title="Tu Historial">
            <p>Aquí irá tu historial de consultas...</p>
          </DashboardWidget>
        </div>
      )}
    </div>
  );
}
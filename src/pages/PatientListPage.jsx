// src/pages/PatientListPage.jsx
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { PatientCard } from '../components/PatientCard';

export function PatientListPage() {
  const { patients } = usePatients(); // Obtenemos los pacientes del contexto

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Pacientes</h1>
        <Link
          to="/pacientes/nuevo"
          className="px-5 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors"
        >
          Agregar Paciente
        </Link>
      </div>

      {patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No hay pacientes registrados.</p>
      )}
    </div>
  );
}
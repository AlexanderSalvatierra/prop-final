// src/components/PatientCard.jsx
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';

export function PatientCard({ patient }) {
  const { deletePatient } = usePatients(); // Obtenemos la función de borrar

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-teal-700 mb-3">{patient.nombre}</h3>
        <div className="space-y-2 text-gray-700">
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Teléfono:</strong> {patient.telefono}</p>
          <p><strong>Próxima Cita:</strong> {patient.proximaCita}</p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Notas:</strong> {patient.notas || 'N/A'}
          </p>
        </div>
      </div>
      
      {/* Footer de la tarjeta con acciones */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
        <Link
          to={`/pacientes/editar/${patient.id}`}
          className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-100 rounded-md hover:bg-teal-200"
        >
          Editar
        </Link>
        <button
          onClick={() => deletePatient(patient.id)}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
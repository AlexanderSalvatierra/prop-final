// src/components/PatientCard.jsx
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { Calendar, Phone, Mail, FileText, Pencil, Trash2 } from 'lucide-react';

export function PatientCard({ patient }) {
  const { deletePatient } = usePatients();

  // Helper para obtener iniciales
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="p-6">
        {/* Header con Avatar y Nombre */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shadow-inner">
            {getInitials(patient.nombre)}
          </div>
          <div>
            <Link to={`/pacientes/${patient.id}`} className="hover:underline">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                {patient.nombre}
              </h3>
            </Link>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Paciente
            </span>
          </div>
        </div>

        {/* Información con Iconos */}
        <div className="space-y-3">
          <div className="flex items-center text-gray-600 text-sm">
            <Mail className="w-4 h-4 mr-3 text-teal-500" />
            <span className="truncate">{patient.email}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Phone className="w-4 h-4 mr-3 text-teal-500" />
            <span>{patient.telefono}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-3 text-teal-500" />
            <span>Próxima: {patient.proximaCita || 'Sin agendar'}</span>
          </div>
          {patient.notas && (
            <div className="flex items-start text-gray-600 text-sm mt-3 pt-3 border-t border-gray-50">
              <FileText className="w-4 h-4 mr-3 text-teal-500 mt-0.5" />
              <p className="line-clamp-2 italic text-gray-500">{patient.notas}</p>
            </div>
          )}
        </div>

        {/* Botón Ver Expediente */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to={`/pacientes/${patient.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
          >
            <FileText className="w-4 h-4" />
            Ver Expediente
          </Link>
        </div>
      </div>

      {/* Footer con Acciones (Iconos discretos) */}
      <div className="bg-gray-50/50 px-6 py-3 flex justify-end space-x-2 border-t border-gray-100">
        <Link
          to={`/pacientes/editar/${patient.id}`}
          className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
          title="Editar Paciente"
        >
          <Pencil className="w-5 h-5" />
        </Link>
        <button
          onClick={() => deletePatient(patient.id)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Eliminar Paciente"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { PatientCard } from '../components/PatientCard';
import { Spinner } from '../components/ui/Spinner';
import { Search } from 'lucide-react';

export function PatientListPage() {
  const { patients, loading } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return <Spinner />;
  }

  const filteredPatients = patients.filter(patient => {
    const term = searchTerm.toLowerCase();
    return (
      patient.nombre.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Pacientes</h1>

        <div className="flex-1 w-full md:max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Link
          to="/pacientes/nuevo"
          className="px-5 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors whitespace-nowrap"
        >
          Agregar Paciente
        </Link>
      </div>

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xl text-gray-600 font-medium">
            {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados aún'}
          </p>
          <p className="text-gray-500 mt-2">
            {searchTerm ? 'Intenta con otro término de búsqueda.' : 'Comienza agregando un nuevo paciente al sistema.'}
          </p>
        </div>
      )}
    </div>
  );
}
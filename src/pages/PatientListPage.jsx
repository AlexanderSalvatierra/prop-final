import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import { PatientCard } from '../components/PatientCard';
import Skeleton from '../components/ui/Skeleton';
import { Search, Users, UserX } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function PatientListPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar "Mis Pacientes" usando relación con citas
  useEffect(() => {
    const fetchMyPatients = async () => {
      if (!user || user.role !== 'specialist') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Query relacional: traer citas del especialista con datos del paciente
        const { data, error } = await supabase
          .from('citas')
          .select('id_paciente, pacientes(*)')
          .eq('id_especialista', user.id);

        if (error) throw error;

        // Eliminar duplicados: Un paciente puede tener múltiples citas
        const uniquePatients = [];
        const seenIds = new Set();

        data.forEach(appointment => {
          const patient = appointment.pacientes;
          if (patient && !seenIds.has(patient.id)) {
            seenIds.add(patient.id);
            uniquePatients.push(patient);
          }
        });

        setPatients(uniquePatients);
      } catch (err) {
        console.error('Error fetching my patients:', err);
        toast.error('Error al cargar tus pacientes');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPatients();
  }, [user]);

  // Filtrado en tiempo real (case insensitive)
  const filteredPatients = patients.filter(patient => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      patient.nombre?.toLowerCase().includes(term) ||
      patient.email?.toLowerCase().includes(term)
    );
  });

  // Loading State
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-full md:max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header con Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Mis Pacientes</h1>

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
      </div>

      {/* Lista de Pacientes o Empty States */}
      {patients.length === 0 ? (
        // Empty State: Sin pacientes asignados
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="p-4 bg-teal-50 rounded-full mb-4">
            <Users className="w-12 h-12 text-teal-400" />
          </div>
          <p className="text-xl text-gray-700 font-semibold">
            Aún no tienes pacientes asignados
          </p>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Los pacientes aparecerán aquí automáticamente cuando agenden una cita contigo.
          </p>
        </div>
      ) : filteredPatients.length > 0 ? (
        // Mostrar pacientes filtrados
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        // Empty State: Búsqueda sin resultados
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <UserX className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl text-gray-600 font-medium">
            No se encontraron resultados para "{searchTerm}"
          </p>
          <p className="text-gray-500 mt-2">
            Intenta con otro término de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
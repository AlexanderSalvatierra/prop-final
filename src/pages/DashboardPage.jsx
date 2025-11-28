// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../context/PatientContext';
import { supabase } from '../supabase/client';
import { Calendar, Users, Activity, Clock, Sun, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { toast } from 'react-hot-toast';

// Componente Widget Mejorado
function DashboardWidget({ title, children, icon: Icon, color = "teal" }) {
  const colorClasses = {
    teal: "bg-teal-50 text-teal-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="relative z-10">
        {children}
      </div>
      {/* Icono decorativo de fondo */}
      {Icon && (
        <Icon className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-50 opacity-50 transform rotate-12 pointer-events-none" />
      )}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { patients } = usePatients();
  const [nextAppointment, setNextAppointment] = useState(null);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];

        if (user?.role === 'patient') {
          // Buscar próxima cita para el paciente
          const { data, error } = await supabase
            .from('citas')
            .select('*')
            .eq('id_paciente', user.id)
            .gte('fecha', today)
            .order('fecha', { ascending: true })
            .order('hora', { ascending: true })
            .limit(1)
            .single();

          if (!error && data) {
            setNextAppointment(data);
            // SIMULACIÓN DE RECORDATORIO (RF18)
            if (data.fecha === today) {
              toast(`🔔 Recordatorio: Tienes una cita hoy a las ${data.hora.slice(0, 5)}`, {
                duration: 6000, // Persistente por 6 segundos
                position: 'top-center',
                style: {
                  background: '#f0fdfa', // teal-50
                  border: '1px solid #14b8a6', // teal-500
                  color: '#0f766e', // teal-700
                  fontWeight: 'bold',
                },
              });
            }
          }
        } else if (user?.role === 'specialist') {
          // Contar citas de hoy para el especialista
          const { count, error } = await supabase
            .from('citas')
            .select('*', { count: 'exact', head: true })
            .eq('fecha', today);

          if (!error) {
            setTodayAppointmentsCount(count || 0);
          }

          // Buscar citas pendientes
          const { data: pendingData, error: pendingError } = await supabase
            .from('citas')
            .select('*, pacientes(nombre, email)')
            .eq('estado', 'Pendiente')
            .order('fecha', { ascending: true });

          if (!pendingError) {
            setPendingAppointments(pendingData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('citas')
        .update({ estado: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Cita ${newStatus === 'Confirmada' ? 'confirmada' : 'rechazada'} correctamente`);

      // Actualizar estado local
      setPendingAppointments(prev => prev.filter(app => app.id !== id));

      // Si confirmamos una cita de hoy, actualizar el contador
      if (newStatus === 'Confirmada') {
        // Opcional: Recargar contador o incrementar manualmente si es de hoy
        // Por simplicidad, solo quitamos de pendientes
      }

    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar la cita');
    }
  };

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          {getGreeting()}, <span className="text-teal-600">{user?.email.split('@')[0]}</span>
        </h1>
        <p className="text-gray-500 mt-2">Aquí tienes un resumen de tu actividad hoy.</p>
      </header>

      {/* --- DASHBOARD DE ESPECIALISTA --- */}
      {user?.role === 'specialist' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardWidget title="Pacientes Totales" icon={Users} color="teal">
              <p className="text-4xl font-bold text-gray-800">{patients.length}</p>
              <p className="text-sm text-gray-500 mt-1">+2 registrados esta semana</p>
            </DashboardWidget>

            <DashboardWidget title="Citas Hoy" icon={Calendar} color="blue">
              <p className="text-4xl font-bold text-gray-800">
                {loading ? "..." : todayAppointmentsCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {todayAppointmentsCount > 0 ? "Revisa tu agenda" : "No hay citas programadas"}
              </p>
            </DashboardWidget>

            <DashboardWidget title="Actividad Reciente" icon={Activity} color="purple">
              <ul className="space-y-2 mt-1">
                <li className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Consulta finalizada
                </li>
                <li className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Nuevo paciente registrado
                </li>
              </ul>
            </DashboardWidget>
          </div>

          {/* Sección de Solicitudes Pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Solicitudes de Citas Pendientes
              </h3>
            </div>

            {pendingAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay solicitudes pendientes en este momento.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="p-4 font-medium">Paciente</th>
                      <th className="p-4 font-medium">Fecha y Hora</th>
                      <th className="p-4 font-medium">Tipo</th>
                      <th className="p-4 font-medium">Consentimiento</th>
                      <th className="p-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-gray-800">{app.pacientes?.nombre || 'Desconocido'}</p>
                          <p className="text-xs text-gray-500">{app.pacientes?.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-800 font-medium">
                            {new Date(app.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </p>
                          <p className="text-xs text-gray-500">{app.hora.slice(0, 5)} hrs</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium">
                          </span>
                        </td>
                        <td className="p-4">
                          {app.consentimiento_url ? (
                            <a
                              href={app.consentimiento_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 hover:underline text-sm font-medium"
                            >
                              <FileText className="w-4 h-4" />
                              Ver PDF
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs italic">No firmado</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Confirmada')}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="Aceptar"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Rechazada')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Rechazar"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- DASHBOARD DE PACIENTE --- */}
      {user?.role === 'patient' && (
        <div className="space-y-8">
          {/* Widgets Superiores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Próxima Cita */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Próxima Cita</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {nextAppointment ? nextAppointment.tipo : "Sin citas programadas"}
                  </p>
                </div>
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-teal-600" />
                </div>
              </div>

              {nextAppointment ? (
                <>
                  <div className="flex items-center gap-3 mt-2">
                    <Clock className="w-5 h-5 text-teal-500" />
                    <span className="text-2xl font-bold text-gray-800">
                      {nextAppointment.hora?.slice(0, 5)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 font-medium">
                    {new Date(nextAppointment.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-400 mt-4">Dr. Especialista</p>
                </>
              ) : (
                <div className="mt-4">
                  <Link
                    to="/agendar"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    Agendar ahora
                  </Link>
                </div>
              )}
            </div>

            {/* Recomendación del Día */}
            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-teal-800">Tip del Día</h3>
              </div>
              <p className="text-teal-700 italic text-lg leading-relaxed">
                "Recuerda usar bloqueador solar cada 4 horas, incluso si está nublado. Tu piel te lo agradecerá."
              </p>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Accesos Rápidos</h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/agendar" className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 hover:shadow-lg transition-all font-medium">
                <Calendar className="w-5 h-5" />
                Agendar Cita
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 border border-teal-200 rounded-lg shadow-sm hover:bg-teal-50 hover:border-teal-300 transition-all font-medium">
                <FileText className="w-5 h-5" />
                Ver Historial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
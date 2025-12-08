// src/pages/DashboardPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../context/PatientContext';
import { supabase } from '../supabase/client';
import { Calendar, Users, Activity, Clock, Sun, FileText, CheckCircle, XCircle, DollarSign, TrendingUp, Download, Eye } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatDateForDisplay } from '../utils/dateUtils';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import SpecialistCalendar from '../components/dashboard/SpecialistCalendar';

// Componente Widget Mejorado
function DashboardWidget({ title, children, icon: Icon, color = "teal" }) {
  const colorClasses = {
    teal: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 p-4 lg:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{title}</h3>
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
        <Icon className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-50 dark:text-slate-700 opacity-50 transform rotate-12 pointer-events-none" />
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
  const [totalMyPatients, setTotalMyPatients] = useState(0); // Nuevo estado para contador de pacientes propios
  const [paymentsData, setPaymentsData] = useState([]); // Datos de pagos para gráficas
  const [appointmentsData, setAppointmentsData] = useState([]); // Datos de citas para gráficas
  const [allAppointmentsWithPatients, setAllAppointmentsWithPatients] = useState([]); // Todas las citas con datos de pacientes para el calendario
  const [loading, setLoading] = useState(true);

  // Patient prescriptions state
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  // Tips Rotativos
  const HEALTH_TIPS = [
    "Recuerda usar bloqueador solar cada 4 horas, incluso si está nublado. Tu piel te lo agradecerá.",
    "Hidrata tu piel diariamente después de bañarte para mantener su elasticidad y barrera protectora.",
    "Revisa tus pies regularmente en busca de cortes, ampollas o cambios en las uñas, especialmente si tienes diabetes.",
    "Usa calzado cómodo y transpirable para prevenir infecciones por hongos y problemas de postura.",
    "Evita la exposición directa al sol entre las 10 a.m. y las 4 p.m., cuando los rayos UV son más fuertes.",
    "Bebe suficiente agua durante el día; una piel hidratada comienza desde adentro.",
    "Si notas un lunar que cambia de forma, color o tamaño, consulta a tu dermatólogo de inmediato.",
    "Seca bien tus pies después de lavarlos, especialmente entre los dedos, para evitar el pie de atleta."
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % HEALTH_TIPS.length);
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, []);

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
            .neq('estado', 'Cancelada')
            .neq('estado', 'Rechazada')
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

          // Fetch prescriptions for patient
          const { data: prescriptionsData, error: prescriptionsError } = await supabase
            .from('recetas')
            .select('*')
            .eq('id_paciente', user.id)
            .order('fecha', { ascending: false });

          if (!prescriptionsError) {
            setPrescriptions(prescriptionsData || []);
          }
        } else if (user?.role === 'specialist') {
          // 1. Contar citas de hoy para ESTE especialista
          const { count, error } = await supabase
            .from('citas')
            .select('*', { count: 'exact', head: true })
            .eq('fecha', today)
            .eq('id_especialista', user.id); // FILTRO AGREGADO

          if (!error) {
            setTodayAppointmentsCount(count || 0);
          }

          // 2. Buscar citas pendientes para ESTE especialista
          const { data: pendingData, error: pendingError } = await supabase
            .from('citas')
            .select('*, pacientes(nombre, email)')
            .eq('estado', 'Pendiente')
            .eq('id_especialista', user.id) // FILTRO AGREGADO
            .order('fecha', { ascending: true });

          if (!pendingError) {
            setPendingAppointments(pendingData || []);
          }

          // 3. Calcular Total de Pacientes Únicos para ESTE especialista
          // (Pacientes que han tenido al menos una cita con este especialista)
          const { data: myPatientsData, error: myPatientsError } = await supabase
            .from('citas')
            .select('id_paciente')
            .eq('id_especialista', user.id);

          if (!myPatientsError && myPatientsData) {
            // Extraer IDs únicos
            const uniquePatientIds = [...new Set(myPatientsData.map(item => item.id_paciente))];
            // Actualizamos un estado local para mostrar este número. 
            // NOTA: Reutilizaremos la variable 'patients' del contexto global para la UI por ahora, 
            // pero idealmente deberíamos tener un estado local 'totalMyPatients'.
            // Como el requerimiento pide "Actualiza los contadores", vamos a crear un estado local para esto.
            setTotalMyPatients(uniquePatientIds.length);
          }

          // 4. Obtener datos de PAGOS para gráficas (todos los pagos, no filtrados por especialista)
          // Nota: La tabla pagos no tiene id_especialista, así que obtenemos todos
          const { data: paymentsRawData, error: paymentsError } = await supabase
            .from('pagos')
            .select('monto, created_at, fecha')
            .order('created_at', { ascending: true });

          if (!paymentsError && paymentsRawData) {
            setPaymentsData(paymentsRawData);
          }

          // 5. Obtener TODAS las citas del especialista para gráfica de estados
          const { data: allAppointmentsData, error: allAppointmentsError } = await supabase
            .from('citas')
            .select('estado, fecha')
            .eq('id_especialista', user.id);

          if (!allAppointmentsError && allAppointmentsData) {
            setAppointmentsData(allAppointmentsData);
          } else {
            setAppointmentsData([]);
          }

          // 6. Obtener TODAS las citas del especialista con datos de pacientes para el calendario
          const { data: calendarAppointmentsData, error: calendarAppointmentsError } = await supabase
            .from('citas')
            .select('*, pacientes(nombre, email)')
            .eq('id_especialista', user.id)
            .order('fecha', { ascending: true });

          if (!calendarAppointmentsError && calendarAppointmentsData) {
            setAllAppointmentsWithPatients(calendarAppointmentsData);
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

  // PASO 1: Procesamiento de Datos para Gráficas
  // Calcular Ingresos Mensuales
  const monthlyIncomeData = useMemo(() => {
    if (!paymentsData.length) return [];

    const monthlyTotals = {};
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    paymentsData.forEach(payment => {
      const date = new Date(payment.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = {
          mes: monthLabel,
          ingresos: 0,
          sortKey: monthKey
        };
      }

      monthlyTotals[monthKey].ingresos += parseFloat(payment.monto);
    });

    // Convertir a array y ordenar por fecha
    return Object.values(monthlyTotals)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .slice(-6); // Últimos 6 meses
  }, [paymentsData]);

  // Calcular Distribución de Estados de Citas
  const appointmentStatusData = useMemo(() => {
    if (!appointmentsData.length) return [];

    const statusCounts = {
      'Confirmada': 0,
      'Pendiente': 0,
      'Cancelada': 0,
      'Completada': 0,
      'No Asistió': 0
    };

    appointmentsData.forEach(appointment => {
      if (statusCounts.hasOwnProperty(appointment.estado)) {
        statusCounts[appointment.estado]++;
      }
    });

    return [
      { name: 'Confirmadas', value: statusCounts['Confirmada'], color: '#0d9488' }, // teal-600
      { name: 'Pendientes', value: statusCounts['Pendiente'], color: '#f59e0b' }, // amber-500
      { name: 'Canceladas', value: statusCounts['Cancelada'], color: '#ef4444' }, // red-500
      { name: 'Completadas', value: statusCounts['Completada'], color: '#10b981' }, // green-500
      { name: 'No Asistió', value: statusCounts['No Asistió'], color: '#6b7280' } // gray-500
    ].filter(item => item.value > 0); // Solo mostrar estados con datos
  }, [appointmentsData]);

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
    <PageTransition>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          {getGreeting()}, <span className="text-teal-600 dark:text-teal-400">{user?.nombre || user?.email.split('@')[0]}</span>
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Aquí tienes un resumen de tu actividad hoy.</p>
      </header>

      {/* --- DASHBOARD DE ESPECIALISTA --- */}
      {user?.role === 'specialist' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 * 0.1 }}
                >
                  <DashboardWidget title="Pacientes Totales" icon={Users} color="teal">
                    <p className="text-4xl font-bold text-gray-800 dark:text-white">{totalMyPatients}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Asignados a ti</p>
                  </DashboardWidget>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 * 0.1 }}
                >
                  <DashboardWidget title="Citas Hoy" icon={Calendar} color="blue">
                    <p className="text-4xl font-bold text-gray-800 dark:text-white">
                      {todayAppointmentsCount}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {todayAppointmentsCount > 0 ? "Revisa tu agenda" : "No hay citas programadas"}
                    </p>
                  </DashboardWidget>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 * 0.1 }}
                >
                  <DashboardWidget title="Actividad Reciente" icon={Activity} color="purple">
                    <ul className="space-y-2 mt-1">
                      <li className="text-sm text-gray-600 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Consulta finalizada
                      </li>
                      <li className="text-sm text-gray-600 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Nuevo paciente registrado
                      </li>
                    </ul>
                  </DashboardWidget>
                </motion.div>
              </>
            )}
          </div>

          {/* Sección de Solicitudes Pendientes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 lg:p-8 border-b border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                Solicitudes de Citas Pendientes
              </h3>
            </div>

            {pendingAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                No hay solicitudes pendientes en este momento.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-300 text-sm">
                    <tr>
                      <th className="p-4 font-medium">Paciente</th>
                      <th className="p-4 font-medium">Fecha y Hora</th>
                      <th className="p-4 font-medium">Tipo</th>
                      <th className="p-4 font-medium">Consentimiento</th>
                      <th className="p-4 font-medium">Comprobante Pago</th>
                      <th className="p-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {pendingAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-gray-800 dark:text-white">{app.pacientes?.nombre || 'Desconocido'}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{app.pacientes?.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-800 dark:text-white font-medium">
                            {new Date(app.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{app.hora.slice(0, 5)} hrs</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded text-xs font-medium">
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
                        <td className="p-4">
                          {app.comprobante_url ? (
                            <a
                              href={app.comprobante_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                              title="Ver comprobante de pago"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Pago
                            </a>
                          ) : (
                            <span className="text-orange-500 text-xs font-medium flex items-center gap-1">
                              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                              No enviado
                            </span>
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

          {/* PASO 3: Sección de Gráficas Estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Gráfica 1: Ingresos por Mes (Barras) */}
            <motion.div
              className="bg-white dark:bg-slate-800 p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Ingresos por Mes</h3>
              </div>

              {monthlyIncomeData.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-400 text-sm italic">No hay datos suficientes para graficar</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="mes"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                    />
                    <Bar
                      dataKey="ingresos"
                      fill="#0d9488"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Gráfica 2: Distribución de Citas (Pastel/Donut) */}
            <motion.div
              className="bg-white dark:bg-slate-800 p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Distribución de Citas</h3>
              </div>

              {appointmentStatusData.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-400 text-sm italic">No hay datos suficientes para graficar</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value, entry) => (
                        <span style={{ color: '#374151', fontSize: '14px' }}>
                          {value} ({entry.payload.value})
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* PASO 2: Sección de Calendario Médico */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                Mi Agenda
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Visualiza todas tus citas en un calendario interactivo
              </p>
            </div>
            <SpecialistCalendar citas={allAppointmentsWithPatients} />
          </motion.div>
        </div>
      )}

      {/* --- DASHBOARD DE PACIENTE --- */}
      {user?.role === 'patient' && (
        <div className="space-y-8">
          {/* Widgets Superiores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </>
            ) : (
              <>
                {/* Próxima Cita */}
                <div className="bg-white dark:bg-slate-800 p-4 lg:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 dark:bg-teal-400"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Próxima Cita</h3>
                      {nextAppointment && (
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                          {nextAppointment.tipo}
                        </p>
                      )}
                    </div>
                    <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                  </div>

                  {nextAppointment ? (
                    <>
                      <div className="flex items-center gap-3 mt-2">
                        <Clock className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">
                          {nextAppointment.hora?.slice(0, 5)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-slate-300 mt-1 font-medium">
                        {formatDateForDisplay(nextAppointment.fecha)}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-slate-500 mt-4">Dr. Especialista</p>
                    </>
                  ) : (
                    <div className="mt-4 flex flex-col items-center text-center">
                      <Calendar className="w-12 h-12 text-gray-300 dark:text-slate-600 mb-2" />
                      <p className="text-gray-600 dark:text-slate-300 font-medium mb-3">No tienes citas programadas. ¡Cuida tu salud hoy!</p>
                      <Link
                        to="/agendar"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar Cita
                      </Link>
                    </div>
                  )}
                </div>

                {/* Recomendación del Día (Rotativa) */}
                <div className="bg-gradient-to-br from-teal-50 to-white dark:from-slate-800 dark:to-slate-800 p-4 lg:p-8 rounded-xl border border-teal-100 dark:border-slate-700 flex flex-col justify-center relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <Sun className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-400">Tip del Día</h3>
                  </div>

                  <div className="relative h-24">
                    {HEALTH_TIPS.map((tip, index) => (
                      <p
                        key={index}
                        className={`text-teal-700 dark:text-teal-300 italic text-lg leading-relaxed absolute top-0 left-0 w-full transition-opacity duration-1000 ${index === currentTipIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                      >
                        "{tip}"
                      </p>
                    ))}
                  </div>

                  {/* Indicadores de progreso (opcional, puntos simples) */}
                  <div className="flex gap-1 mt-2 justify-center">
                    {HEALTH_TIPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentTipIndex ? 'w-4 bg-teal-400' : 'w-1.5 bg-teal-200'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Accesos Rápidos */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Accesos Rápidos</h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/agendar" className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 hover:shadow-lg transition-all font-medium">
                <Calendar className="w-5 h-5" />
                Agendar Cita
              </Link>
              <Link to="/mi-historial" className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 border border-teal-200 rounded-lg shadow-sm hover:bg-teal-50 hover:border-teal-300 transition-all font-medium">
                <FileText className="w-5 h-5" />
                Ver Historial
              </Link>
            </div>
          </div>

          {/* Mis Recetas Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              Mis Recetas
            </h3>
            {loadingPrescriptions ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : prescriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prescriptions.map((prescription) => {
                  const medications = Array.isArray(prescription.medicamentos)
                    ? prescription.medicamentos
                    : JSON.parse(prescription.medicamentos || '[]');

                  return (
                    <div key={prescription.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Receta Médica</h4>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {new Date(prescription.fecha).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                          <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                          Medicamentos ({medications.length}):
                        </p>
                        <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-1">
                          {medications.slice(0, 2).map((med, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                              <span className="truncate">{med.nombre}</span>
                            </li>
                          ))}
                          {medications.length > 2 && (
                            <li className="text-gray-400 dark:text-slate-500 text-xs italic ml-4">
                              +{medications.length - 2} más...
                            </li>
                          )}
                        </ul>
                      </div>

                      {prescription.pdf_url ? (
                        <a
                          href={prescription.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                          <Download className="w-4 h-4" />
                          Descargar PDF
                        </a>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                          <FileText className="w-4 h-4" />
                          PDF no disponible
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                <p className="text-gray-600 dark:text-slate-300 font-medium mb-2">No tienes recetas registradas</p>
                <p className="text-gray-500 dark:text-slate-400 text-sm">Las recetas generadas por tu médico aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      )}
    </PageTransition>
  );
}
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import { toast } from 'react-hot-toast';
import { Calendar } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import { AppointmentItem } from '../components/AppointmentItem';

export function MyAppointmentsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('citas')
                .select('*')
                .eq('id_paciente', user.id)
                .order('fecha', { ascending: false })
                .order('hora', { ascending: false });

            if (error) throw error;
            setAppointments(data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error('Error al cargar tus citas');
        } finally {
            setLoading(false);
        }
    };

    // Filter appointments based on tab
    const filteredAppointments = appointments.filter(app => {
        const isCancelled = app.estado === 'Cancelada';
        const isCompleted = app.estado === 'Completada'; // Assuming 'Completada' is a valid state
        const appDate = new Date(`${app.fecha}T${app.hora}`);
        const now = new Date();

        // History includes: Cancelled, Completed, or Past dates (even if 'Pendiente')
        const isPast = appDate < now && app.estado !== 'Cancelada';

        if (activeTab === 'history') {
            return isCancelled || isCompleted || isPast;
        } else {
            // Upcoming: Not cancelled, not completed, and in the future
            return !isCancelled && !isCompleted && !isPast;
        }
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Mis Citas Médicas</h1>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upcoming'
                            ? 'bg-white text-teal-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Próximas
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history'
                            ? 'bg-white text-teal-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Historial
                    </button>
                </div>
            </div>

            {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                        <Calendar className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {activeTab === 'upcoming' ? 'No tienes citas programadas' : 'Aún no tienes historial médico'}
                    </h3>
                    <p className="text-gray-500 mt-1 max-w-sm">
                        {activeTab === 'upcoming'
                            ? 'Agenda una nueva cita para comenzar tu tratamiento.'
                            : 'Aquí aparecerán tus citas pasadas o canceladas.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAppointments.map((appointment) => (
                        <AppointmentItem
                            key={appointment.id}
                            appointment={appointment}
                            user={user}
                            onUpdate={fetchAppointments}
                            activeTab={activeTab}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, CalendarDays, Edit2, X, Download } from 'lucide-react';
import { generateAppointmentPDF } from '../utils/generateAppointmentPDF';

export function MyAppointmentsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'

    // State for Rescheduling Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [updating, setUpdating] = useState(false);

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

    const handleCancel = async (appointmentId) => {
        if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

        try {
            const { error } = await supabase
                .from('citas')
                .update({ estado: 'Cancelada' })
                .eq('id', appointmentId);

            if (error) throw error;

            toast.success('Cita cancelada correctamente');
            // Update local state
            setAppointments(prev => prev.map(app =>
                app.id === appointmentId ? { ...app, estado: 'Cancelada' } : app
            ));
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error('No se pudo cancelar la cita');
        }
    };

    const openRescheduleModal = (appointment) => {
        setSelectedAppointment(appointment);
        setNewDate(appointment.fecha);
        setNewTime(appointment.hora);
        setIsModalOpen(true);
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAppointment) return;

        try {
            setUpdating(true);
            const { error } = await supabase
                .from('citas')
                .update({
                    fecha: newDate,
                    hora: newTime
                })
                .eq('id', selectedAppointment.id);

            if (error) throw error;

            toast.success('Cita reagendada con éxito');

            // Update local state
            setAppointments(prev => prev.map(app =>
                app.id === selectedAppointment.id
                    ? { ...app, fecha: newDate, hora: newTime }
                    : app
            ));

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            toast.error('Error al reagendar la cita');
        } finally {
            setUpdating(false);
        }
    };

    const handleDownloadPDF = (appointment) => {
        try {
            generateAppointmentPDF(appointment, user);
            toast.success('PDF generado correctamente');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error al generar el PDF');
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmada':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmada</span>;
            case 'Cancelada':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelada</span>;
            case 'Completada':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completada</span>;
            default: // Pendiente
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pendiente</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
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
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No tienes citas {activeTab === 'upcoming' ? 'próximas' : 'en el historial'}</h3>
                    <p className="text-gray-500 mt-1">
                        {activeTab === 'upcoming'
                            ? 'Agenda una nueva cita para comenzar tu tratamiento.'
                            : 'Aquí aparecerán tus citas pasadas o canceladas.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{appointment.tipo || 'Consulta General'}</span>
                                    <h3 className="text-lg font-bold text-gray-800 mt-1">{new Date(appointment.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                                </div>
                                {getStatusBadge(appointment.estado)}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600">
                                    <Clock className="w-4 h-4 mr-2 text-teal-500" />
                                    <span>{appointment.hora.slice(0, 5)} hrs</span>
                                </div>
                                <div className="flex items-start text-gray-600">
                                    <AlertCircle className="w-4 h-4 mr-2 text-teal-500 mt-1" />
                                    <p className="text-sm line-clamp-2">{appointment.motivo || 'Sin motivo especificado'}</p>
                                </div>
                            </div>

                            {activeTab === 'upcoming' && (
                                <div className="flex gap-2 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => openRescheduleModal(appointment)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors"
                                    >
                                        <CalendarDays className="w-4 h-4" />
                                        Reagendar
                                    </button>
                                    <button
                                        onClick={() => handleCancel(appointment.id)}
                                        className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                        title="Cancelar Cita"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                    {appointment.estado === 'Confirmada' && (
                                        <button
                                            onClick={() => handleDownloadPDF(appointment)}
                                            className="flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                            title="Descargar Comprobante"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )
            }

            {/* Reschedule Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Reagendar Cita</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Hora</label>
                                    <input
                                        type="time"
                                        required
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                    >
                                        {updating ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Guardar Cambios'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

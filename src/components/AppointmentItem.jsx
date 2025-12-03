import { useState } from 'react';
import { supabase } from '../supabase/client';
import { toast } from 'react-hot-toast';
import { Clock, AlertCircle, CheckCircle2, XCircle, CalendarDays, X, Download } from 'lucide-react';
import { generateAppointmentPDF } from '../utils/generateAppointmentPDF';
import { formatDateForDisplay } from '../utils/dateUtils';

export function AppointmentItem({ appointment, user, onUpdate, activeTab }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDate, setNewDate] = useState(appointment.fecha);
    const [newTime, setNewTime] = useState(appointment.hora);
    const [updating, setUpdating] = useState(false);

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

    const handleCancel = async () => {
        if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

        try {
            const { error } = await supabase
                .from('citas')
                .update({ estado: 'Cancelada' })
                .eq('id', appointment.id);

            if (error) throw error;

            toast.success('Cita cancelada correctamente');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error('No se pudo cancelar la cita');
        }
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            const { error } = await supabase
                .from('citas')
                .update({
                    fecha: newDate,
                    hora: newTime
                })
                .eq('id', appointment.id);

            if (error) throw error;

            toast.success('Cita reagendada con éxito');
            setIsModalOpen(false);

            // Call update callback and wait for it
            if (onUpdate) {
                await onUpdate();
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            toast.error('Error al reagendar la cita');
        } finally {
            setUpdating(false);
        }
    };

    const handleDownloadPDF = () => {
        try {
            generateAppointmentPDF(appointment, user);
            toast.success('PDF generado correctamente');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error al generar el PDF');
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{appointment.tipo || 'Consulta General'}</span>
                        <h3 className="text-lg font-bold text-gray-800 mt-1">
                            {formatDateForDisplay(appointment.fecha)}
                        </h3>
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
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors"
                        >
                            <CalendarDays className="w-4 h-4" />
                            Reagendar
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                            title="Cancelar Cita"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                        {appointment.estado === 'Confirmada' && (
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                title="Descargar Comprobante"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Reschedule Modal */}
            {isModalOpen && (
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
            )}
        </>
    );
}

import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, Clock, Activity, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function MyMedicalHistoryPage() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('historial_medico')
                .select(`
                    *,
                    especialistas (
                        nombre,
                        especialidad
                    )
                `)
                .eq('id_paciente', user.id)
                .order('fecha', { ascending: false });

            if (error) throw error;
            setHistory(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Error al cargar tu historial médico');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Activity className="w-8 h-8 text-teal-600" />
                    Mi Historial Médico
                </h1>
                <p className="text-gray-500 mt-2">
                    Consulta tus diagnósticos, tratamientos y la evolución de tu salud.
                </p>
            </div>

            {history.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes registros médicos</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Tu historial médico aparecerá aquí una vez que hayas tenido tu primera consulta con nuestros especialistas.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {history.map((record) => (
                        <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                            {/* Header de la tarjeta */}
                            <div className="bg-teal-600 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
                                <div>
                                    <h2 className="text-xl font-bold">{record.diagnostico}</h2>
                                    <div className="flex items-center gap-2 text-teal-100 text-sm mt-1">
                                        <User className="w-4 h-4" />
                                        <span>Dr. {record.especialistas?.nombre || 'Especialista'}</span>
                                        {record.especialistas?.especialidad && (
                                            <span className="bg-teal-700/50 px-2 py-0.5 rounded text-xs">
                                                {record.especialistas.especialidad}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center bg-teal-700/50 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(record.fecha).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Cuerpo de la tarjeta */}
                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        Tratamiento
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed whitespace-pre-line border border-gray-100">
                                        {record.tratamiento}
                                    </div>
                                </div>

                                {record.observaciones && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Observaciones
                                        </h3>
                                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                                            {record.observaciones}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

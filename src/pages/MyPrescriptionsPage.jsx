import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Calendar, User, Pill } from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePrescriptionPDF } from '../utils/generatePrescriptionPDF';

export function MyPrescriptionsPage() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrescriptions();
    }, [user]);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);

            // Fetch prescriptions with doctor information via join
            const { data, error } = await supabase
                .from('recetas')
                .select(`
                    *,
                    especialistas (
                        nombre,
                        especialidad,
                        cedula
                    )
                `)
                .eq('id_paciente', user.id)
                .order('fecha', { ascending: false });

            if (error) throw error;
            setPrescriptions(data || []);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            toast.error('Error al cargar las recetas');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = (prescription) => {
        try {
            const doctorData = {
                nombre: prescription.especialistas?.nombre || 'Doctor',
                especialidad: prescription.especialistas?.especialidad || 'Dermatología',
                cedula: prescription.especialistas?.cedula || 'N/A'
            };

            const patientData = {
                nombre: user.nombre || user.email
            };

            generatePrescriptionPDF(prescription, patientData, doctorData);
            toast.success('Receta descargada correctamente');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error al generar el PDF');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-teal-600" />
                    Mis Recetas Médicas
                </h1>
                <p className="text-gray-500 mt-2">
                    Historial completo de tus recetas médicas
                </p>
            </div>

            {/* Prescriptions List */}
            {prescriptions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No tienes recetas médicas
                    </h3>
                    <p className="text-gray-500">
                        Cuando tu médico te prescriba medicamentos, aparecerán aquí.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {prescriptions.map((prescription) => {
                        const medications = Array.isArray(prescription.medicamentos)
                            ? prescription.medicamentos
                            : JSON.parse(prescription.medicamentos || '[]');

                        return (
                            <div
                                key={prescription.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Left: Prescription Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Pill className="w-6 h-6 text-teal-600" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Receta Médica
                                                    </h3>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                                        {medications.length} medicamento{medications.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span>
                                                            Dr(a). {prescription.especialistas?.nombre || 'Doctor'}
                                                        </span>
                                                        {prescription.especialistas?.especialidad && (
                                                            <span className="text-gray-400">
                                                                • {prescription.especialistas.especialidad}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span>
                                                            {new Date(prescription.fecha).toLocaleDateString('es-MX', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Medications Preview */}
                                                {medications.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                                            Medicamentos:
                                                        </p>
                                                        <ul className="text-sm text-gray-700 space-y-1">
                                                            {medications.slice(0, 3).map((med, idx) => (
                                                                <li key={idx} className="flex items-start">
                                                                    <span className="text-teal-600 mr-2">•</span>
                                                                    <span className="font-medium">{med.nombre}</span>
                                                                    {med.dosis && (
                                                                        <span className="text-gray-500 ml-2">
                                                                            - {med.dosis}
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                            {medications.length > 3 && (
                                                                <li className="text-gray-400 italic">
                                                                    +{medications.length - 3} más...
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Download Button */}
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handleDownloadPDF(prescription)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                                        >
                                            <Download className="w-4 h-4" />
                                            Descargar Receta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

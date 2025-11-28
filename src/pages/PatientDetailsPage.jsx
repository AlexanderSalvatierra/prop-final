import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    User,
    Calendar,
    FileText,
    Plus,
    X,
    Save,
    Clock,
    Activity,
    ChevronLeft,
    CreditCard,
    DollarSign
} from 'lucide-react';

export function PatientDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [newNote, setNewNote] = useState({
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
    });

    // Payment State
    const [activeTab, setActiveTab] = useState('history'); // 'history' | 'payments'
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [newPayment, setNewPayment] = useState({
        monto: '',
        metodo: 'Efectivo',
        concepto: 'Consulta'
    });
    const [submittingPayment, setSubmittingPayment] = useState(false);

    useEffect(() => {
        fetchPatientData();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'payments' && patient) {
            fetchPayments();
        }
    }, [activeTab, patient]);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            // Fetch patient details
            const { data: patientData, error: patientError } = await supabase
                .from('pacientes')
                .select('*')
                .eq('id', id)
                .single();

            if (patientError) throw patientError;
            setPatient(patientData);

            // Fetch medical history
            const { data: historyData, error: historyError } = await supabase
                .from('historial_medico')
                .select('*')
                .eq('id_paciente', id)
                .order('fecha', { ascending: false });

            if (historyError) throw historyError;
            setHistory(historyData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error al cargar la información del paciente');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNote(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitNote = async (e) => {
        e.preventDefault();
        if (!newNote.diagnostico || !newNote.tratamiento) {
            toast.error('Diagnóstico y Tratamiento son obligatorios');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('historial_medico')
                .insert([
                    {
                        id_paciente: id,
                        id_especialista: user.id, // Assuming the logged in user is the specialist
                        fecha: new Date().toISOString(),
                        diagnostico: newNote.diagnostico,
                        tratamiento: newNote.tratamiento,
                        observaciones: newNote.observaciones
                    }
                ]);

            if (error) throw error;

            toast.success('Nota médica agregada correctamente');
            setShowModal(false);
            setNewNote({ diagnostico: '', tratamiento: '', observaciones: '' });
            fetchPatientData(); // Refresh list
        } catch (error) {
            console.error('Error adding note:', error);
            toast.error('Error al guardar la nota médica');
        } finally {
            setSubmitting(false);
        }
    };

    const fetchPayments = async () => {
        try {
            setLoadingPayments(true);
            const { data, error } = await supabase
                .from('pagos')
                .select('*')
                .eq('id_paciente', id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPayments(data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Error al cargar pagos');
        } finally {
            setLoadingPayments(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!newPayment.monto || !newPayment.concepto) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        try {
            setSubmittingPayment(true);
            const { data, error } = await supabase
                .from('pagos')
                .insert([{
                    id_paciente: id,
                    monto: newPayment.monto,
                    metodo: newPayment.metodo,
                    concepto: newPayment.concepto
                }])
                .select();

            if (error) throw error;

            toast.success('Pago registrado correctamente');
            setPayments([data[0], ...payments]);
            setNewPayment({
                monto: '',
                metodo: 'Efectivo',
                concepto: 'Consulta'
            });
        } catch (error) {
            console.error('Error registering payment:', error);
            toast.error('Error al registrar pago');
        } finally {
            setSubmittingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-700">Paciente no encontrado</h2>
                <button
                    onClick={() => navigate('/pacientes')}
                    className="mt-4 text-teal-600 hover:underline"
                >
                    Volver a la lista
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header / Breadcrumb */}
            <button
                onClick={() => navigate('/pacientes')}
                className="flex items-center text-gray-500 hover:text-teal-600 mb-6 transition-colors"
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Volver a Pacientes
            </button>

            {/* Patient Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-2xl font-bold">
                        {patient.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{patient.nombre}</h1>
                        <div className="flex items-center gap-4 text-gray-500 mt-1 text-sm">
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {patient.edad ? `${patient.edad} años` : 'Edad no registrada'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Activity className="w-4 h-4" />
                                {patient.genero || 'Género no especificado'}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Nota Médica
                </button>
            </div>

            {/* Tabs / Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 bg-gray-50 flex space-x-4">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        Historial Clínico
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <CreditCard className="w-5 h-5" />
                        Pagos
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'history' ? (
                        history.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No hay registros médicos para este paciente.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {history.map((record) => (
                                    <div key={record.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg text-gray-800">{record.diagnostico}</h3>
                                            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                                <Calendar className="w-4 h-4 mr-1.5" />
                                                {new Date(record.fecha).toLocaleDateString()}
                                                <Clock className="w-4 h-4 ml-3 mr-1.5" />
                                                {new Date(record.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tratamiento</h4>
                                                <p className="text-gray-700 whitespace-pre-line bg-teal-50/50 p-3 rounded-lg border border-teal-100/50">
                                                    {record.tratamiento}
                                                </p>
                                            </div>
                                            {record.observaciones && (
                                                <div>
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Observaciones</h4>
                                                    <p className="text-gray-600 whitespace-pre-line p-3">
                                                        {record.observaciones}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Payment History */}
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-teal-600" />
                                    Historial de Pagos
                                </h2>

                                {loadingPayments ? (
                                    <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
                                ) : payments.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {payments.map((payment) => (
                                                    <tr key={payment.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(payment.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {payment.concepto}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.metodo === 'Efectivo' ? 'bg-green-100 text-green-800' :
                                                                payment.metodo === 'Tarjeta' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-purple-100 text-purple-800'
                                                                }`}>
                                                                {payment.metodo}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
                                                            ${payment.monto}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500">No hay pagos registrados</p>
                                    </div>
                                )}
                            </div>

                            {/* New Payment Form */}
                            <div className="w-full lg:w-80">
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Registrar Pago
                                    </h3>
                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                                    placeholder="0.00"
                                                    value={newPayment.monto}
                                                    onChange={(e) => setNewPayment({ ...newPayment, monto: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
                                            <select
                                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-lg"
                                                value={newPayment.concepto}
                                                onChange={(e) => setNewPayment({ ...newPayment, concepto: e.target.value })}
                                            >
                                                <option value="Consulta">Consulta</option>
                                                <option value="Procedimiento">Procedimiento</option>
                                                <option value="Medicamento">Medicamento</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                                            <select
                                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-lg"
                                                value={newPayment.metodo}
                                                onChange={(e) => setNewPayment({ ...newPayment, metodo: e.target.value })}
                                            >
                                                <option value="Efectivo">Efectivo</option>
                                                <option value="Tarjeta">Tarjeta</option>
                                                <option value="Transferencia">Transferencia</option>
                                            </select>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingPayment}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {submittingPayment ? 'Registrando...' : 'Guardar Pago'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Nueva Nota */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Nueva Nota Médica</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitNote} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
                                <input
                                    type="text"
                                    name="diagnostico"
                                    value={newNote.diagnostico}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ej. Dermatitis Atópica"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento</label>
                                <textarea
                                    name="tratamiento"
                                    value={newNote.tratamiento}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Descripción del tratamiento recetado..."
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (Opcional)</label>
                                <textarea
                                    name="observaciones"
                                    value={newNote.observaciones}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Notas adicionales, evolución, etc."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Guardar Nota
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

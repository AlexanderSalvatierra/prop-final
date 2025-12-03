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
    DollarSign,
    Pill,
    Trash2,
    Download,
    Printer,
    CheckCircle,
    UserX
} from 'lucide-react';
import { generatePrescriptionPDF } from '../utils/generatePrescriptionPDF';

export function PatientDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Current Appointment State
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [loadingCurrentAppointment, setLoadingCurrentAppointment] = useState(false);
    const [completingAppointment, setCompletingAppointment] = useState(false);
    const [markingAbsent, setMarkingAbsent] = useState(false);

    // Appointments History State
    const [appointmentsHistory, setAppointmentsHistory] = useState([]);
    const [loadingAppointmentsHistory, setLoadingAppointmentsHistory] = useState(false);

    const [newNote, setNewNote] = useState({
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
    });

    // Payment State
    const [activeTab, setActiveTab] = useState('current'); // 'current' | 'history' | 'payments' | 'prescriptions' | 'appointments'
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [newPayment, setNewPayment] = useState({
        monto: '',
        metodo: 'Efectivo',
        concepto: 'Consulta'
    });
    const [submittingPayment, setSubmittingPayment] = useState(false);

    // Prescriptions State
    const [prescriptions, setPrescriptions] = useState([]);
    const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
    const [newPrescription, setNewPrescription] = useState({
        medicamentos: [{ nombre: '', dosis: '', frecuencia: '', duracion: '' }],
        observaciones_generales: ''
    });
    const [submittingPrescription, setSubmittingPrescription] = useState(false);

    useEffect(() => {
        fetchPatientData();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'current' && patient) {
            fetchCurrentAppointment();
        } else if (activeTab === 'payments' && patient) {
            fetchPayments();
        } else if (activeTab === 'prescriptions' && patient) {
            fetchPrescriptions();
        } else if (activeTab === 'appointments' && patient) {
            fetchAppointmentsHistory();
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

    // ===== PRESCRIPTIONS FUNCTIONS =====
    const fetchPrescriptions = async () => {
        try {
            setLoadingPrescriptions(true);
            const { data, error } = await supabase
                .from('recetas')
                .select('*')
                .eq('id_paciente', id)
                .order('fecha', { ascending: false });

            if (error) throw error;
            setPrescriptions(data || []);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            toast.error('Error al cargar recetas');
        } finally {
            setLoadingPrescriptions(false);
        }
    };

    const handleAddMedication = () => {
        setNewPrescription(prev => ({
            ...prev,
            medicamentos: [...prev.medicamentos, { nombre: '', dosis: '', frecuencia: '', duracion: '' }]
        }));
    };

    const handleRemoveMedication = (index) => {
        setNewPrescription(prev => ({
            ...prev,
            medicamentos: prev.medicamentos.filter((_, i) => i !== index)
        }));
    };

    const handleMedicationChange = (index, field, value) => {
        setNewPrescription(prev => ({
            ...prev,
            medicamentos: prev.medicamentos.map((med, i) =>
                i === index ? { ...med, [field]: value } : med
            )
        }));
    };

    const handleSavePrescription = async (uploadPDF = false) => {
        // Validate at least one medication with name
        const validMedications = newPrescription.medicamentos.filter(m => m.nombre.trim());
        if (validMedications.length === 0) {
            toast.error('Debes agregar al menos un medicamento');
            return;
        }

        try {
            setSubmittingPrescription(true);
            let pdfUrl = null;

            // Generate and upload PDF if requested
            if (uploadPDF) {
                const pdfBlob = await generatePrescriptionPDFBlob(validMedications, patient, user, newPrescription.observaciones_generales);

                // Upload to Supabase Storage
                const fileName = `${user.id}/${Date.now()}_receta_${patient.nombre.replace(/\s+/g, '_')}.pdf`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('recetas')
                    .upload(fileName, pdfBlob, {
                        contentType: 'application/pdf',
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('recetas')
                    .getPublicUrl(fileName);

                pdfUrl = publicUrl;
            }

            // Save to database
            const { data, error } = await supabase
                .from('recetas')
                .insert([{
                    id_paciente: id,
                    id_especialista: user.id,
                    fecha: new Date().toISOString().split('T')[0],
                    medicamentos: JSON.stringify(validMedications),
                    observaciones_generales: newPrescription.observaciones_generales,
                    pdf_url: pdfUrl
                }])
                .select()
                .single();

            if (error) throw error;

            toast.success(uploadPDF ? 'Receta guardada y PDF generado' : 'Receta guardada correctamente');
            setPrescriptions([data, ...prescriptions]);
            setNewPrescription({
                medicamentos: [{ nombre: '', dosis: '', frecuencia: '', duracion: '' }],
                observaciones_generales: ''
            });

            // Download PDF if generated
            if (uploadPDF && pdfUrl) {
                window.open(pdfUrl, '_blank');
            }
        } catch (error) {
            console.error('Error saving prescription:', error);
            toast.error('Error al guardar la receta');
        } finally {
            setSubmittingPrescription(false);
        }
    };

    const handleDownloadPrescriptionPDF = (prescription) => {
        try {
            generatePrescriptionPDF(prescription, patient, user);
            toast.success('Receta descargada correctamente');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error al generar el PDF');
        }
    };

    // ===== CURRENT APPOINTMENT FUNCTIONS =====
    const fetchCurrentAppointment = async () => {
        try {
            setLoadingCurrentAppointment(true);
            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('citas')
                .select('*')
                .eq('id_paciente', id)
                .eq('fecha', today)
                .eq('estado', 'Confirmada')
                .order('hora', { ascending: true })
                .limit(1)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error;
            setCurrentAppointment(data);
        } catch (error) {
            console.error('Error fetching current appointment:', error);
            toast.error('Error al cargar la cita actual');
        } finally {
            setLoadingCurrentAppointment(false);
        }
    };

    const handleCompleteAppointment = async () => {
        if (!currentAppointment) return;

        // Validation: Check if it's actually today and time has passed
        const now = new Date();
        const today = new Date().toISOString().split('T')[0];
        const appointmentDate = currentAppointment.fecha;
        const appointmentTime = currentAppointment.hora;

        if (appointmentDate !== today) {
            toast.error('Solo puedes finalizar citas de hoy');
            return;
        }

        // Check if appointment time has passed (with 30min grace period before)
        const [hours, minutes] = appointmentTime.split(':').map(Number);
        const appointmentDateTime = new Date();
        appointmentDateTime.setHours(hours, minutes - 30, 0, 0);

        if (now < appointmentDateTime) {
            toast.error('No puedes finalizar una cita que aún no ha comenzado');
            return;
        }

        try {
            setCompletingAppointment(true);
            const { error } = await supabase
                .from('citas')
                .update({ estado: 'Completada' })
                .eq('id', currentAppointment.id);

            if (error) throw error;

            toast.success('Consulta finalizada correctamente');
            setCurrentAppointment(null);
            fetchCurrentAppointment(); // Refresh
        } catch (error) {
            console.error('Error completing appointment:', error);
            toast.error('Error al finalizar la consulta');
        } finally {
            setCompletingAppointment(false);
        }
    };

    const handleMarkAbsent = async () => {
        if (!currentAppointment) return;

        if (!window.confirm('¿Seguro que el paciente no se presentó? Esta acción marcará la cita como "No Asistió".')) {
            return;
        }

        try {
            setMarkingAbsent(true);
            const { error } = await supabase
                .from('citas')
                .update({ estado: 'No Asistió' })
                .eq('id', currentAppointment.id);

            if (error) throw error;

            toast.success('Cita marcada como "No Asistió"');
            setCurrentAppointment(null);
            fetchCurrentAppointment(); // Refresh
        } catch (error) {
            console.error('Error marking appointment as absent:', error);
            toast.error('Error al actualizar la cita');
        } finally {
            setMarkingAbsent(false);
        }
    };

    // ===== APPOINTMENTS HISTORY FUNCTIONS =====
    const fetchAppointmentsHistory = async () => {
        try {
            setLoadingAppointmentsHistory(true);
            const { data, error } = await supabase
                .from('citas')
                .select('*')
                .eq('id_paciente', id)
                .order('fecha', { ascending: false })
                .order('hora', { ascending: false });

            if (error) throw error;
            setAppointmentsHistory(data || []);
        } catch (error) {
            console.error('Error fetching appointments history:', error);
            toast.error('Error al cargar historial de citas');
        } finally {
            setLoadingAppointmentsHistory(false);
        }
    };

    // Helper function to generate PDF as Blob
    const generatePrescriptionPDFBlob = async (medications, patientData, doctorData, observations) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(13, 148, 136); // teal-600
        doc.text('PROPIEL - Receta Médica', 105, 20, { align: 'center' });

        // Date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 30, { align: 'center' });

        // Patient Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Datos del Paciente:', 20, 45);
        doc.setFontSize(10);
        doc.text(`Nombre: ${patientData.nombre}`, 20, 52);
        doc.text(`Email: ${patientData.email}`, 20, 58);

        // Doctor Info
        doc.setFontSize(12);
        doc.text('Médico:', 20, 70);
        doc.setFontSize(10);
        doc.text(`Dr(a). ${doctorData.nombre || doctorData.email}`, 20, 77);

        // Medications
        doc.setFontSize(14);
        doc.setTextColor(13, 148, 136);
        doc.text('Medicamentos Prescritos:', 20, 92);

        let yPos = 100;
        doc.setFontSize(10);
        doc.setTextColor(0);

        medications.forEach((med, index) => {
            doc.setFont(undefined, 'bold');
            doc.text(`${index + 1}. ${med.nombre}`, 25, yPos);
            doc.setFont(undefined, 'normal');
            yPos += 6;

            if (med.dosis) {
                doc.text(`   Dosis: ${med.dosis}`, 25, yPos);
                yPos += 5;
            }
            if (med.frecuencia) {
                doc.text(`   Frecuencia: ${med.frecuencia}`, 25, yPos);
                yPos += 5;
            }
            if (med.duracion) {
                doc.text(`   Duración: ${med.duracion}`, 25, yPos);
                yPos += 5;
            }
            yPos += 3;
        });

        // Observations
        if (observations) {
            yPos += 5;
            doc.setFontSize(12);
            doc.setTextColor(13, 148, 136);
            doc.text('Indicaciones Generales:', 20, yPos);
            yPos += 7;
            doc.setFontSize(10);
            doc.setTextColor(0);
            const splitObservations = doc.splitTextToSize(observations, 170);
            doc.text(splitObservations, 20, yPos);
        }

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Este documento es una receta médica oficial.', 105, 280, { align: 'center' });
        doc.text('PROPIEL - Sistema de Gestión Médica', 105, 285, { align: 'center' });

        return doc.output('blob');
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
                <div className="border-b border-gray-100 px-6 py-4 bg-gray-50 flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'current' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Clock className="w-5 h-5" />
                        Cita en Curso
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        Historial Clínico
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'appointments' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Calendar className="w-5 h-5" />
                        Historial de Citas
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <CreditCard className="w-5 h-5" />
                        Pagos
                    </button>
                    <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={`font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'prescriptions' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Pill className="w-5 h-5" />
                        Recetas
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'current' ? (
                        loadingCurrentAppointment ? (
                            <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
                        ) : currentAppointment ? (
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-teal-600" />
                                        Cita de Hoy
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-600 font-medium">Hora:</span>
                                            <span className="text-2xl font-bold text-teal-700">{currentAppointment.hora?.slice(0, 5)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-600 font-medium">Tipo:</span>
                                            <span className="text-gray-800">{currentAppointment.tipo || 'Consulta General'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-600 font-medium">Estado:</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                {currentAppointment.estado}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleMarkAbsent}
                                            disabled={completingAppointment || markingAbsent}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-semibold transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {markingAbsent ? (
                                                <div className="w-5 h-5 border-2 border-orange-700 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <UserX className="w-5 h-5" />
                                                    No Asistió
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleCompleteAppointment}
                                            disabled={completingAppointment || markingAbsent}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {completingAppointment ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Finalizando...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Finalizar Consulta
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No hay citas confirmadas para hoy</p>
                                <p className="text-sm mt-2">Las citas confirmadas para hoy aparecerán aquí</p>
                            </div>
                        )
                    ) : activeTab === 'appointments' ? (
                        loadingAppointmentsHistory ? (
                            <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
                        ) : appointmentsHistory.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Citas</h3>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {appointmentsHistory.map((appointment) => (
                                                <tr key={appointment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(appointment.fecha).toLocaleDateString('es-MX', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                        {appointment.hora?.slice(0, 5)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {appointment.tipo || 'Consulta'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
                                                            appointment.estado === 'Completada' ? 'bg-blue-100 text-blue-800' :
                                                                appointment.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                                    appointment.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                                                                        appointment.estado === 'No Asistió' ? 'bg-orange-100 text-orange-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {appointment.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500">No hay citas registradas para este paciente</p>
                            </div>
                        )
                    ) : activeTab === 'history' ? (
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
                    ) : activeTab === 'payments' ? (
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
                    ) : (
                        <div className="space-y-6">
                            {/* New Prescription Form */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Plus className="w-5 h-5 mr-2 text-teal-600" />
                                    Nueva Receta Médica
                                </h3>

                                {/* Medications */}
                                <div className="space-y-4 mb-6">
                                    {newPrescription.medicamentos.map((med, index) => (
                                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 relative">
                                            {newPrescription.medicamentos.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMedication(index)}
                                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Medicamento #{index + 1}</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nombre del Medicamento *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={med.nombre}
                                                        onChange={(e) => handleMedicationChange(index, 'nombre', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm"
                                                        placeholder="Ej: Paracetamol 500mg"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosis</label>
                                                    <input
                                                        type="text"
                                                        value={med.dosis}
                                                        onChange={(e) => handleMedicationChange(index, 'dosis', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm"
                                                        placeholder="Ej: 500mg"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                                                    <input
                                                        type="text"
                                                        value={med.frecuencia}
                                                        onChange={(e) => handleMedicationChange(index, 'frecuencia', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm"
                                                        placeholder="Ej: Cada 8 horas"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                                                    <input
                                                        type="text"
                                                        value={med.duracion}
                                                        onChange={(e) => handleMedicationChange(index, 'duracion', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm"
                                                        placeholder="Ej: 5 días"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddMedication}
                                    className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors border border-teal-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar otro medicamento
                                </button>

                                {/* General Observations */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Indicaciones Generales
                                    </label>
                                    <textarea
                                        value={newPrescription.observaciones_generales}
                                        onChange={(e) => setNewPrescription({ ...newPrescription, observaciones_generales: e.target.value })}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm resize-none"
                                        placeholder="Instrucciones adicionales, recomendaciones, etc."
                                    ></textarea>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => handleSavePrescription(false)}
                                        disabled={submittingPrescription}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        {submittingPrescription ? 'Guardando...' : 'Guardar'}
                                    </button>
                                    <button
                                        onClick={() => handleSavePrescription(true)}
                                        disabled={submittingPrescription}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Printer className="w-4 h-4" />
                                        {submittingPrescription ? 'Guardando...' : 'Guardar e Imprimir'}
                                    </button>
                                </div>
                            </div>

                            {/* Prescriptions History */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-teal-600" />
                                    Historial de Recetas
                                </h3>

                                {loadingPrescriptions ? (
                                    <div className="py-8 flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                                    </div>
                                ) : prescriptions.length > 0 ? (
                                    <div className="space-y-4">
                                        {prescriptions.map((prescription) => {
                                            const medications = Array.isArray(prescription.medicamentos)
                                                ? prescription.medicamentos
                                                : JSON.parse(prescription.medicamentos || '[]');

                                            return (
                                                <div key={prescription.id} className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">Receta Médica</h4>
                                                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(prescription.fecha).toLocaleDateString('es-MX', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDownloadPrescriptionPDF(prescription)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Descargar PDF
                                                        </button>
                                                    </div>

                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                            Medicamentos ({medications.length}):
                                                        </p>
                                                        <ul className="text-sm text-gray-700 space-y-1">
                                                            {medications.map((med, idx) => (
                                                                <li key={idx} className="flex items-start">
                                                                    <span className="text-teal-600 mr-2">•</span>
                                                                    <span>
                                                                        <strong>{med.nombre}</strong>
                                                                        {(med.dosis || med.frecuencia || med.duracion) && (
                                                                            <span className="text-gray-500">
                                                                                {' '}- {[med.dosis, med.frecuencia, med.duracion].filter(Boolean).join(', ')}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {prescription.observaciones_generales && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                                                Indicaciones:
                                                            </p>
                                                            <p className="text-sm text-gray-600">{prescription.observaciones_generales}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500">No hay recetas registradas para este paciente</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Nueva Nota */}
            {
                showModal && (
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
                )
            }
        </div >
    );
}

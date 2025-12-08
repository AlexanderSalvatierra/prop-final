import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, Eraser, User, Stethoscope, Info, CreditCard, Upload, MessageCircle, Eye } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { generateConsentPDF } from '../utils/generateConsentPDF';
import { sendAppointmentConfirmation } from '../utils/emailService';

export function AppointmentBookingPage() {
    const COSTS = {
        'Dermatólogo': 800,
        'Podólogo': 600,
        'Tamizólogo': 1200
    };

    const APPOINTMENT_INSTRUCTIONS = {
        'Tamiz': '⚠️ IMPORTANTE: Para el Tamiz Neonatal, el paciente no debe haber ingerido alimentos 2 horas antes y no se deben aplicar cremas ni lociones en la piel 24 horas antes.',
        'Dermatología': 'Recuerda traer tu lista de medicamentos actuales.',
        'Procedimiento': 'Por favor, acude con ropa cómoda y evita el uso de maquillaje en la zona a tratar.'
    };

    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchingSpecialists, setFetchingSpecialists] = useState(true);

    // Data from DB
    const [specialists, setSpecialists] = useState([]);
    const [specialties, setSpecialties] = useState([]);

    // Selection State
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [filteredSpecialists, setFilteredSpecialists] = useState([]);
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);
    const [takenSlots, setTakenSlots] = useState([]); // NEW: State for taken slots

    // Payment Receipt State
    const [paymentReceipt, setPaymentReceipt] = useState(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);

    const [formData, setFormData] = useState({
        tipo: 'Primera Vez',
        fecha: '',
        hora: '',
        motivo: ''
    });

    // Fetch Specialists on Mount
    useEffect(() => {
        const fetchSpecialists = async () => {
            try {
                const { data, error } = await supabase
                    .from('especialistas')
                    .select('id, nombre, especialidad');

                if (error) throw error;

                setSpecialists(data || []);

                // Extract unique specialties
                const uniqueSpecialties = [...new Set(data.map(s => s.especialidad))].filter(Boolean);
                if (!uniqueSpecialties.includes('Tamizólogo')) {
                    uniqueSpecialties.push('Tamizólogo');
                }
                setSpecialties(uniqueSpecialties);

            } catch (error) {
                console.error('Error fetching specialists:', error);
                toast.error('Error al cargar especialistas.');
            } finally {
                setFetchingSpecialists(false);
            }
        };

        fetchSpecialists();
    }, []);

    // Filter specialists when specialty changes
    useEffect(() => {
        if (selectedSpecialty) {
            const filtered = specialists.filter(s => s.especialidad === selectedSpecialty);
            setFilteredSpecialists(filtered);
            setSelectedSpecialist(null); // Reset specialist selection
        } else {
            setFilteredSpecialists([]);
        }
    }, [selectedSpecialty, specialists]);

    // NEW: Fetch taken slots when specialist or date changes
    useEffect(() => {
        const fetchTakenSlots = async () => {
            if (selectedSpecialist && formData.fecha) {
                try {
                    const { data, error } = await supabase
                        .from('citas')
                        .select('hora')
                        .eq('id_especialista', selectedSpecialist.id)
                        .eq('fecha', formData.fecha)
                        .neq('estado', 'Cancelada')
                        .neq('estado', 'Rechazada');

                    if (error) throw error;

                    // Normalize times to HH:MM format (remove seconds if present)
                    const slots = data.map(item => item.hora.substring(0, 5));
                    setTakenSlots(slots);
                } catch (error) {
                    console.error('Error fetching taken slots:', error);
                    // Don't block the user, but maybe warn? For now just log.
                }
            } else {
                setTakenSlots([]);
            }
        };

        fetchTakenSlots();
    }, [selectedSpecialist, formData.fecha]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimeSelect = (time) => {
        setFormData(prev => ({ ...prev, hora: time }));
    };

    // Generate Time Slots
    const generateTimeSlots = () => {
        const slots = [];
        // Block 1: 08:00 - 14:00
        for (let hour = 8; hour < 14; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        // Block 2: 15:00 - 17:00
        for (let hour = 15; hour < 17; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Obtener fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0];

    // Ref para el canvas de firma
    const sigCanvas = useRef({});

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                toast.error('Solo se permiten archivos JPG, PNG o PDF');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('El archivo no debe superar 5MB');
                return;
            }
            setPaymentReceipt(file);
        }
    };

    const getWhatsAppLink = () => {
        const message = encodeURIComponent(
            `Hola, adjunto mi comprobante de pago para la cita en Propiel.`
        );
        return `https://wa.me/527551426210?text=${message}`;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSpecialty || !selectedSpecialist) {
            toast.error('Por favor selecciona una especialidad y un especialista');
            return;
        }

        if (!formData.fecha || !formData.hora || !formData.motivo) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        if (sigCanvas.current.isEmpty()) {
            toast.error('Por favor firma el consentimiento para continuar');
            return;
        }

        if (!paymentReceipt) {
            toast.error('Por favor sube el comprobante de pago para continuar');
            return;
        }

        setLoading(true);

        try {
            // NEW: Final validation check for availability
            const { data: existingAppointments, error: checkError } = await supabase
                .from('citas')
                .select('id')
                .eq('id_especialista', selectedSpecialist.id)
                .eq('fecha', formData.fecha)
                .eq('hora', formData.hora) // Check exact time match (assuming DB stores HH:MM:00, might need casting if strict)
                // Note: If DB stores '09:00:00' and we send '09:00', Supabase usually handles it, but let's be safe.
                // Actually, let's rely on the previous fetch logic but do a quick check here.
                // A better way is to check if ANY appointment exists with that time, excluding Cancelled/Rejected
                .neq('estado', 'Cancelada')
                .neq('estado', 'Rechazada');

            if (checkError) throw checkError;

            if (existingAppointments && existingAppointments.length > 0) {
                toast.error('Lo sentimos, este horario acaba de ser ocupado. Por favor selecciona otro.');
                setLoading(false);
                // Refresh slots
                const { data } = await supabase
                    .from('citas')
                    .select('hora')
                    .eq('id_especialista', selectedSpecialist.id)
                    .eq('fecha', formData.fecha)
                    .neq('estado', 'Cancelada')
                    .neq('estado', 'Rechazada');
                if (data) setTakenSlots(data.map(item => item.hora.substring(0, 5)));
                return;
            }


            // 1. Upload Payment Receipt
            setUploadingReceipt(true);
            const receiptFileName = `receipts/${user.id}_${Date.now()}_${paymentReceipt.name}`;

            const { data: receiptUploadData, error: receiptUploadError } = await supabase.storage
                .from('comprobantes')
                .upload(receiptFileName, paymentReceipt, {
                    contentType: paymentReceipt.type
                });

            if (receiptUploadError) {
                console.error('Receipt upload error:', receiptUploadError);
                throw new Error('Error al subir el comprobante de pago');
            }

            // Get public URL for receipt
            const { data: { publicUrl: receiptPublicUrl } } = supabase.storage
                .from('comprobantes')
                .getPublicUrl(receiptFileName);

            setUploadingReceipt(false);

            // 2. Generar PDF usando la utilidad profesional
            const signatureData = sigCanvas.current.toDataURL();

            const consentData = {
                patientName: user.nombre || user.email,
                appointmentType: formData.tipo,
                signatureDataURL: signatureData,
                date: new Date()
            };

            const pdfBlob = generateConsentPDF(consentData);
            const fileName = `consents/${user.id}_${Date.now()}.pdf`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('consentimiento') // Ensure this bucket exists and is public/accessible
                .upload(fileName, pdfBlob, {
                    contentType: 'application/pdf'
                });

            if (uploadError) throw uploadError;

            // 3. Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('consentimiento')
                .getPublicUrl(fileName);

            // 4. Guardar cita
            const { error } = await supabase
                .from('citas')
                .insert([
                    {
                        id_paciente: user.id,
                        id_especialista: selectedSpecialist.id, // NEW FIELD
                        fecha: formData.fecha,
                        hora: formData.hora,
                        tipo: formData.tipo,
                        motivo: formData.motivo,
                        estado: 'Pendiente',
                        consentimiento_url: publicUrl,
                        comprobante_url: receiptPublicUrl // NEW: Payment receipt URL
                    }
                ]);

            if (error) throw error;

            // Send appointment confirmation email asynchronously (non-blocking)
            const appointmentDetails = {
                fecha: formData.fecha,
                hora: formData.hora,
                doctor: selectedSpecialist.nombre,
                especialidad: selectedSpecialty
            };

            sendAppointmentConfirmation(user.email, user.nombre || user.email, appointmentDetails)
                .then(() => {
                    console.log('Appointment confirmation email sent successfully');
                })
                .catch((error) => {
                    console.error('Failed to send appointment confirmation email:', error);
                    // Silent failure - don't show error to user
                });

            toast.success('¡Cita agendada con éxito!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al agendar cita:', error);
            toast.error('Error al agendar la cita. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-teal-600 p-6 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Agendar Nueva Cita
                    </h1>
                    <p className="text-teal-100 mt-2">
                        Sigue los pasos para reservar tu atención con nuestros especialistas.
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Paso 1: Selección de Especialidad */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <span className="bg-teal-100 text-teal-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                            Selecciona Especialidad
                        </h2>

                        {fetchingSpecialists ? (
                            <div className="text-gray-500 text-sm animate-pulse">Cargando especialidades...</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {specialties.map(spec => (
                                    <button
                                        key={spec}
                                        type="button"
                                        onClick={() => setSelectedSpecialty(spec)}
                                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1
                                            ${selectedSpecialty === spec
                                                ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-500'
                                                : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>{spec}</span>
                                        <span className="text-xs font-normal opacity-80">
                                            ${COSTS[spec] || '---'} MXN
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Paso 2: Selección de Especialista */}
                    {selectedSpecialty && (
                        <div className="space-y-4 animate-fadeIn">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <span className="bg-teal-100 text-teal-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                Selecciona Especialista
                            </h2>

                            {filteredSpecialists.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No hay especialistas disponibles para esta área.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredSpecialists.map(doc => (
                                        <div
                                            key={doc.id}
                                            onClick={() => setSelectedSpecialist(doc)}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-3
                                                ${selectedSpecialist?.id === doc.id
                                                    ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500'
                                                    : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{doc.nombre}</p>
                                                <p className="text-xs text-gray-500">{doc.especialidad}</p>
                                            </div>
                                            {selectedSpecialist?.id === doc.id && (
                                                <CheckCircle className="w-5 h-5 text-teal-600 ml-auto" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Paso 3: Fecha y Hora */}
                    {selectedSpecialist && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <span className="bg-teal-100 text-teal-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                Fecha y Hora
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Fecha */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="date"
                                            name="fecha"
                                            min={today}
                                            value={formData.fecha}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-gray-50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Tipo de Cita */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Cita
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Stethoscope className="w-5 h-5" />
                                        </div>
                                        <select
                                            name="tipo"
                                            value={formData.tipo}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-gray-50 transition-all"
                                        >
                                            <option value="Primera Vez">Primera Vez</option>
                                            <option value="Subsecuente">Subsecuente</option>
                                            <option value="Tamiz">Tamiz</option>
                                            <option value="Revision">Revisión</option>
                                        </select>
                                    </div>

                                    {/* Alerta de Instrucciones */}
                                    {APPOINTMENT_INSTRUCTIONS[formData.tipo] && (
                                        <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md flex items-start gap-3 animate-fadeIn">
                                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-blue-800">
                                                {APPOINTMENT_INSTRUCTIONS[formData.tipo]}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Horarios (Slots) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Horarios Disponibles
                                </label>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {timeSlots.map(time => {
                                        const isTaken = takenSlots.includes(time);
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                disabled={isTaken}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`py-2 px-1 text-sm rounded-lg border transition-all text-center flex flex-col items-center justify-center
                                                    ${isTaken
                                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                        : formData.hora === time
                                                            ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600'
                                                    }`}
                                            >
                                                <span>{time}</span>
                                                {isTaken && <span className="text-[10px] leading-none">Ocupado</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                                {!formData.hora && (
                                    <p className="text-xs text-gray-400 mt-2">Selecciona un horario para continuar.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Paso 4: Motivo y Consentimiento */}
                    {formData.hora && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <span className="bg-teal-100 text-teal-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                                Detalles Finales
                            </h2>

                            {/* Motivo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motivo de Consulta
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-4 text-gray-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <textarea
                                        name="motivo"
                                        value={formData.motivo}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        placeholder="Describe brevemente tus síntomas..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-gray-50 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Consentimiento */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-700">Firma de Consentimiento</h3>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-500 space-y-1 max-h-32 overflow-y-auto">
                                    <p>Autorizo a PROPIEL a realizar diagnósticos y tratamientos.</p>
                                    <p>Entiendo que mi información es confidencial.</p>
                                    <p>Acepto los riesgos mínimos de los procedimientos.</p>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white">
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        penColor='black'
                                        canvasProps={{
                                            width: 500,
                                            height: 150,
                                            className: 'sigCanvas w-full h-32 bg-white cursor-crosshair'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <Eraser className="w-3 h-3" />
                                        Limpiar firma
                                    </button>
                                </div>
                            </div>

                            {/* Paso 5: Pago de Anticipo */}
                            <div className="space-y-4 mt-8">
                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <span className="bg-teal-100 text-teal-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
                                    Pago de Anticipo
                                </h3>

                                {/* Bank Details Card */}
                                <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-6 rounded-xl text-white shadow-lg">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CreditCard className="w-6 h-6" />
                                        <h4 className="font-bold text-lg">Datos Bancarios</h4>
                                    </div>
                                    <div className="space-y-2 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                        <div className="flex justify-between">
                                            <span className="text-teal-100">Banco:</span>
                                            <span className="font-semibold">BBVA (Ficticio)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-teal-100">Cuenta:</span>
                                            <span className="font-mono font-semibold">1234 5678 9012</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-teal-100">CLABE:</span>
                                            <span className="font-mono font-semibold">012345678901234567</span>
                                        </div>
                                        <div className="flex justify-between border-t border-white/20 pt-2 mt-2">
                                            <span className="text-teal-100">Monto a depositar:</span>
                                            <span className="font-bold text-xl">
                                                ${selectedSpecialty && COSTS[selectedSpecialty]
                                                    ? `${(COSTS[selectedSpecialty] * 0.2).toFixed(0)} MXN`
                                                    : '--- MXN'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-teal-100 mt-2">
                                            (20% del costo total de la consulta: ${selectedSpecialty && COSTS[selectedSpecialty] ? COSTS[selectedSpecialty] : '---'} MXN)
                                        </p>
                                    </div>
                                </div>

                                {/* File Upload Section */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Subir Comprobante de Pago
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:border-teal-400 transition-colors">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-3 bg-teal-50 rounded-full">
                                                <Upload className="w-6 h-6 text-teal-600" />
                                            </div>
                                            <div className="text-center">
                                                <label htmlFor="receipt-upload" className="cursor-pointer">
                                                    <span className="text-teal-600 hover:text-teal-700 font-medium">
                                                        Seleccionar archivo
                                                    </span>
                                                    <input
                                                        id="receipt-upload"
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                        onChange={handleReceiptChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    JPG, PNG o PDF (máx. 5MB)
                                                </p>
                                            </div>
                                            {paymentReceipt && (
                                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-teal-200">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-gray-700 font-medium">
                                                        {paymentReceipt.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentReceipt(null)}
                                                        className="text-red-500 hover:text-red-700 ml-2"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* WhatsApp Alternative */}
                                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Opción alternativa:</span> También puedes enviar tu comprobante por WhatsApp
                                        </p>
                                    </div>
                                    <a
                                        href={getWhatsAppLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Enviar
                                    </a>
                                </div>
                            </div>

                            {/* Botón Submit */}
                            <button
                                type="submit"
                                disabled={loading || uploadingReceipt}
                                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-md transition-all flex items-center justify-center gap-2
                                    ${loading || uploadingReceipt
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                            >
                                {loading || uploadingReceipt ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {uploadingReceipt ? 'Subiendo comprobante...' : 'Procesando...'}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Confirmar Cita
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                </form>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    Nota: Tu cita quedará registrada como "Pendiente" hasta que sea confirmada por el especialista.
                </p>
            </div>
        </div>
    );
}

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, Eraser } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { jsPDF } from 'jspdf';

export function AppointmentBookingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        tipo: 'Primera Vez',
        fecha: '',
        hora: '',
        motivo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Obtener fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0];

    // Ref para el canvas de firma
    const sigCanvas = useRef({});

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fecha || !formData.hora || !formData.motivo) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        if (sigCanvas.current.isEmpty()) {
            toast.error('Por favor firma el consentimiento para continuar');
            return;
        }

        setLoading(true);

        try {
            // 1. Generar PDF
            const doc = new jsPDF();
            const signatureData = sigCanvas.current.toDataURL();

            // Configuración del PDF
            doc.setFontSize(20);
            doc.text('Consentimiento Informado', 105, 20, { align: 'center' });

            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 40);
            doc.text(`Paciente: ${user.email}`, 20, 50); // Usamos email porque no tenemos nombre en user context a veces, ojalá sí.

            doc.setFontSize(10);
            const legalText = `
Yo, como paciente, autorizo al equipo de especialistas de PROPIEL a realizar las evaluaciones, 
diagnósticos y tratamientos dermatológicos necesarios para mi salud.

Entiendo que toda mi información médica será tratada con estricta confidencialidad.

He sido informado de que todo procedimiento médico conlleva ciertos riesgos, aunque mínimos, 
y acepto proceder bajo mi propia voluntad.

Me comprometo a proporcionar información veraz sobre mi estado de salud.
            `;
            doc.text(legalText, 20, 70);

            // Agregar firma
            doc.text('Firma del Paciente:', 20, 140);
            doc.addImage(signatureData, 'PNG', 20, 150, 100, 40);

            // 2. Subir PDF a Supabase
            const pdfBlob = doc.output('blob');
            const fileName = `consents/${user.id}_${Date.now()}.pdf`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('consentimiento')
                .upload(fileName, pdfBlob, {
                    contentType: 'application/pdf'
                });

            if (uploadError) throw uploadError;

            // 3. Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('consentimientos')
                .getPublicUrl(fileName);

            // 4. Guardar cita
            const { error } = await supabase
                .from('citas')
                .insert([
                    {
                        id_paciente: user.id,
                        fecha: formData.fecha,
                        hora: formData.hora,
                        tipo: formData.tipo,
                        motivo: formData.motivo,
                        estado: 'Pendiente',
                        consentimiento_url: publicUrl
                    }
                ]);

            if (error) throw error;

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
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-teal-600 p-6 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Agendar Nueva Cita
                    </h1>
                    <p className="text-teal-100 mt-2">
                        Completa el formulario para solicitar tu atención con nuestros especialistas.
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* Tipo de Cita */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Cita
                        </label>
                        <div className="relative">
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-gray-50 transition-all"
                            >
                                <option value="Primera Vez">Primera Vez</option>
                                <option value="Subsecuente">Subsecuente</option>
                                <option value="Tamiz">Tamiz</option>
                                <option value="Revision">Revisión</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

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

                        {/* Hora */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hora Preferida
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <input
                                    type="time"
                                    name="hora"
                                    value={formData.hora}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-gray-50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

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
                                rows="4"
                                placeholder="Describe brevemente tus síntomas o la razón de tu visita..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-gray-50 transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Consentimiento Informado con Firma */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Consentimiento Informado</h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-600 space-y-2 max-h-40 overflow-y-auto">
                            <p>Yo, como paciente, autorizo al equipo de especialistas de PROPIEL a realizar las evaluaciones, diagnósticos y tratamientos dermatológicos necesarios para mi salud.</p>
                            <p>Entiendo que toda mi información médica será tratada con estricta confidencialidad.</p>
                            <p>He sido informado de que todo procedimiento médico conlleva ciertos riesgos, aunque mínimos, y acepto proceder bajo mi propia voluntad.</p>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white">
                            <p className="text-sm text-gray-500 mb-2">Firma aquí usando tu mouse o dedo:</p>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor='black'
                                    canvasProps={{
                                        width: 500,
                                        height: 200,
                                        className: 'sigCanvas w-full h-48 bg-white cursor-crosshair'
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={clearSignature}
                                className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                <Eraser className="w-4 h-4" />
                                Borrar firma
                            </button>
                        </div>
                    </div>

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-md transition-all flex items-center justify-center gap-2
              ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Confirmar Cita
                            </>
                        )}
                    </button>

                </form>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    Nota: Tu cita quedará registrada como "Pendiente" hasta que sea confirmada por el especialista. Recibirás una notificación cuando esto suceda.
                </p>
            </div>


        </div>
    );
}

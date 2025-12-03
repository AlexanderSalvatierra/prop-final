import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import { Spinner } from '../components/ui/Spinner';
import { CreditCard, DollarSign, Calendar, FileText, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generatePaymentReceipt } from '../utils/generatePaymentReceipt';

export function MyPaymentsPage() {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchPayments();
        }
    }, [user]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('pagos')
                .select('*')
                .eq('id_paciente', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPayments(data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Error al cargar tus pagos');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async (payment) => {
        try {
            await generatePaymentReceipt(payment, user);
            toast.success('Recibo descargado correctamente');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast.error('Error al generar el recibo');
        }
    };

    const totalSpent = payments.reduce((sum, p) => sum + Number(p.monto), 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-teal-600" />
                    Mis Pagos
                </h1>
                <p className="text-gray-500 mt-2">Historial de tus pagos y transacciones.</p>
            </div>

            {/* Total Card */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg mb-8 flex items-center justify-between">
                <div>
                    <p className="text-teal-100 font-medium mb-1">Total Gastado</p>
                    <h2 className="text-4xl font-bold">${totalSpent.toFixed(2)}</h2>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                    <DollarSign className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {payments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Concepto
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Método
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm font-medium text-gray-900">
                                                <FileText className="w-4 h-4 mr-2 text-teal-500" />
                                                {payment.concepto}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.metodo === 'Efectivo' ? 'bg-green-100 text-green-800' :
                                                payment.metodo === 'Tarjeta' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                {payment.metodo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                            ${payment.monto}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDownloadReceipt(payment)}
                                                className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-1 transition-colors"
                                                title="Descargar Recibo"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span className="hidden sm:inline">Descargar</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No hay pagos registrados</h3>
                        <p className="text-gray-500 mt-1">Aún no tienes historial de pagos.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

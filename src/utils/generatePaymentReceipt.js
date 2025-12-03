import jsPDF from 'jspdf';

export const generatePaymentReceipt = async (payment, patientData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Configuración de Estilos ---
    const primaryColor = [13, 148, 136]; // Teal-600
    const grayColor = [107, 114, 128];   // Gray-500
    const darkColor = [31, 41, 55];      // Gray-800

    // --- Helper para cargar imagen ---
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };

    try {
        // --- 1. Encabezado ---
        // Logo
        try {
            const logo = await loadImage('/propiel-logo.png');
            doc.addImage(logo, 'PNG', 20, 15, 40, 15); // x, y, w, h
        } catch (e) {
            console.warn("No se pudo cargar el logo", e);
            // Fallback texto si falla logo
            doc.setFontSize(20);
            doc.setTextColor(...primaryColor);
            doc.text("PROPIEL", 20, 25);
        }

        // Datos de la Clínica (Derecha)
        doc.setFontSize(10);
        doc.setTextColor(...grayColor);
        doc.text("Clínica Dermatológica Propiel", pageWidth - 20, 20, { align: 'right' });
        doc.text("Av. Zihuatanejo Pte. 12, Centro", pageWidth - 20, 25, { align: 'right' });
        doc.text("Zihuatanejo, Guerrero", pageWidth - 20, 30, { align: 'right' });
        doc.text("RFC: PRO-123456-ABC", pageWidth - 20, 35, { align: 'right' });

        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 45, pageWidth - 20, 45);

        // --- 2. Título y Folio ---
        doc.setFontSize(16);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("RECIBO DE HONORARIOS", 20, 60);

        doc.setFontSize(10);
        doc.setTextColor(...grayColor);
        doc.setFont("helvetica", "normal");
        const folio = String(payment.id).substring(0, 8).toUpperCase();
        doc.text(`Folio: #${folio}`, pageWidth - 20, 60, { align: 'right' });

        // --- 3. Datos del Cliente ---
        doc.setFillColor(249, 250, 251); // Gray-50
        doc.rect(20, 70, pageWidth - 40, 25, 'F');

        doc.setFontSize(10);
        doc.setTextColor(...darkColor);
        doc.setFont("helvetica", "bold");
        doc.text("Recibí de:", 25, 80);
        doc.text("Fecha de Emisión:", 120, 80);

        doc.setFont("helvetica", "normal");
        doc.text(patientData.nombre || patientData.email || "Paciente", 25, 87);
        doc.text(new Date(payment.created_at).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric'
        }), 120, 87);

        // --- 4. Tabla de Detalles ---
        const startY = 110;

        // Encabezados de tabla
        doc.setFillColor(...primaryColor);
        doc.rect(20, startY, pageWidth - 40, 10, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("CONCEPTO", 25, startY + 7);
        doc.text("MÉTODO DE PAGO", 120, startY + 7);
        doc.text("IMPORTE", pageWidth - 25, startY + 7, { align: 'right' });

        // Fila de datos
        doc.setTextColor(...darkColor);
        doc.setFont("helvetica", "normal");

        // Concepto
        doc.text(payment.concepto || "Servicios Médicos", 25, startY + 20);

        // Método
        doc.text(payment.metodo || "No especificado", 120, startY + 20);

        // Importe
        const amount = parseFloat(payment.monto).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
        doc.text(amount, pageWidth - 25, startY + 20, { align: 'right' });

        // Línea inferior de la fila
        doc.setDrawColor(229, 231, 235); // Gray-200
        doc.line(20, startY + 28, pageWidth - 20, startY + 28);

        // --- 5. Total ---
        const totalY = startY + 40;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...darkColor);
        doc.text("TOTAL:", 140, totalY);

        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text(amount, pageWidth - 25, totalY, { align: 'right' });

        // --- 6. Pie de Página ---
        const footerY = pageHeight - 30;
        doc.setFontSize(8);
        doc.setTextColor(...grayColor);
        doc.setFont("helvetica", "normal");
        doc.text("Gracias por su preferencia.", pageWidth / 2, footerY, { align: 'center' });
        doc.text("Este documento es un comprobante interno y no tiene validez fiscal oficial.", pageWidth / 2, footerY + 5, { align: 'center' });

        // Guardar PDF
        doc.save(`Recibo_Propiel_${folio}.pdf`);

    } catch (error) {
        console.error("Error generando recibo PDF:", error);
        throw error;
    }
};

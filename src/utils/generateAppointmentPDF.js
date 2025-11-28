import jsPDF from 'jspdf';

export const generateAppointmentPDF = (appointment, user) => {
    const doc = new jsPDF();

    // Configuración de colores y fuentes
    const primaryColor = [13, 148, 136]; // teal-600
    const secondaryColor = [75, 85, 99]; // gray-600
    const lightGray = [243, 244, 246]; // gray-100

    // --- ENCABEZADO ---
    // Fondo del encabezado
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Comprobante de Cita', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Propiel - Dermatología Avanzada', 105, 30, { align: 'center' });

    // --- DETALLES DE LA CITA ---
    let yPos = 60;
    const leftMargin = 20;
    const valueX = 80;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles de la Cita', leftMargin, yPos);

    // Línea separadora
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos + 3, 190, yPos + 3);

    yPos += 20;

    // Función auxiliar para filas
    const addRow = (label, value) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...secondaryColor);
        doc.text(label, leftMargin, yPos);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(value || 'N/A', valueX, yPos);

        yPos += 12;
    };

    // Datos
    addRow('Paciente:', user?.email || 'Paciente'); // Usamos email si no hay nombre en user context
    // Si appointment tiene info del paciente (caso especialista), úsala
    if (appointment.pacientes?.nombre) {
        // Sobreescribir la línea anterior si tenemos el nombre real
        yPos -= 12;
        doc.setFillColor(255, 255, 255);
        doc.rect(valueX - 2, yPos - 10, 100, 14, 'F'); // Borrar lo anterior
        addRow('Paciente:', appointment.pacientes.nombre);
    }

    addRow('Fecha:', new Date(appointment.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    addRow('Hora:', `${appointment.hora.slice(0, 5)} hrs`);
    addRow('Tipo de Cita:', appointment.tipo);
    addRow('Estado:', appointment.estado);

    if (appointment.motivo) {
        addRow('Motivo:', appointment.motivo);
    }

    // --- CUADRO DE INFORMACIÓN ---
    yPos += 10;
    doc.setFillColor(...lightGray);
    doc.roundedRect(leftMargin, yPos, 170, 30, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text('Este documento sirve como comprobante de tu cita programada.', leftMargin + 5, yPos + 10);
    doc.text('Por favor, preséntalo al llegar a la recepción.', leftMargin + 5, yPos + 18);

    // --- PIE DE PÁGINA ---
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Recuerda llegar 15 minutos antes de tu hora programada.', 105, pageHeight - 20, { align: 'center' });
    doc.text('Propiel © 2024', 105, pageHeight - 15, { align: 'center' });

    // Guardar PDF
    doc.save(`cita_propiel_${appointment.fecha}_${appointment.id}.pdf`);
};

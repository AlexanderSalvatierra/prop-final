// src/utils/generateAppointmentPDF.js
import jsPDF from 'jspdf';

/**
 * Generates a professional appointment confirmation PDF (Boarding Pass Style)
 * @param {Object} appointment - The appointment data
 * @param {Object} user - The user/patient information
 */
export const generateAppointmentPDF = (appointment, user) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Corporate colors
    const tealColor = [13, 148, 136];
    const darkGray = [60, 60, 60];
    const lightGray = [243, 244, 246];

    // --- HEADER ---
    doc.setFontSize(24);
    doc.setTextColor(...tealColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Confirmación de Cita', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text('Propiel - Clínica Dermatológica', pageWidth / 2, 40, { align: 'center' });

    // --- FECHA Y HORA DESTACADAS (Boarding Pass Style) ---
    let yPos = 60;

    // Fecha grande y centrada
    const appointmentDate = new Date(appointment.fecha);
    doc.setFontSize(28);
    doc.setTextColor(...tealColor);
    doc.setFont('helvetica', 'bold');
    doc.text(appointmentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }), pageWidth / 2, yPos, { align: 'center' });

    yPos += 15;

    // Hora grande y centrada
    doc.setFontSize(32);
    doc.text(`${appointment.hora.slice(0, 5)} hrs`, pageWidth / 2, yPos, { align: 'center' });

    yPos += 25;

    // Línea separadora
    doc.setDrawColor(...tealColor);
    doc.setLineWidth(0.5);
    doc.line(30, yPos, pageWidth - 30, yPos);

    yPos += 20;

    // --- INFORMACIÓN DE LA CITA (Sin emojis, usando bullets) ---
    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');

    // Paciente
    doc.text('• Paciente:', 30, yPos);
    doc.setFont('helvetica', 'normal');
    const patientName = appointment.pacientes?.nombre || user?.nombre || user?.email || 'Paciente';
    doc.text(patientName, 70, yPos);
    yPos += 12;

    // Doctor (si está disponible)
    if (appointment.especialistas?.nombre) {
        doc.setFont('helvetica', 'bold');
        doc.text('• Doctor:', 30, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`Dr(a). ${appointment.especialistas.nombre}`, 70, yPos);
        yPos += 12;
    }

    // Especialidad (si está disponible)
    if (appointment.especialistas?.especialidad) {
        doc.setFont('helvetica', 'bold');
        doc.text('• Especialidad:', 30, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(appointment.especialistas.especialidad, 70, yPos);
        yPos += 12;
    }

    // Tipo de Cita
    doc.setFont('helvetica', 'bold');
    doc.text('• Tipo de Cita:', 30, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(appointment.tipo || 'Consulta General', 70, yPos);
    yPos += 12;

    // Ubicación
    doc.setFont('helvetica', 'bold');
    doc.text('• Ubicación:', 30, yPos);
    doc.setFont('helvetica', 'normal');
    const locationText = doc.splitTextToSize('Av. Zihuatanejo Pte. 12, Centro, Zihuatanejo', pageWidth - 80);
    doc.text(locationText, 70, yPos);
    yPos += 12;

    // Estado
    doc.setFont('helvetica', 'bold');
    doc.text('• Estado:', 30, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(appointment.estado || 'Confirmada', 70, yPos);
    yPos += 15;

    // Motivo (si existe)
    if (appointment.motivo && appointment.motivo.trim()) {
        doc.setFont('helvetica', 'bold');
        doc.text('• Motivo:', 30, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const splitMotivo = doc.splitTextToSize(appointment.motivo, pageWidth - 60);
        doc.text(splitMotivo, 35, yPos);
        yPos += (splitMotivo.length * 5) + 10;
        doc.setFontSize(11);
    }

    // --- RECORDATORIO (Caja gris claro) ---
    yPos += 10;
    doc.setFillColor(...lightGray);
    doc.roundedRect(30, yPos, pageWidth - 60, 35, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('RECORDATORIO IMPORTANTE', 35, yPos + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('• Por favor, llega 15 minutos antes de tu hora programada.', 35, yPos + 18);
    doc.text('• Presenta este comprobante en la recepción.', 35, yPos + 25);

    // --- FOOTER ---
    const footerY = pageHeight - 25;
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text('Propiel - Clínica Dermatológica', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Tel: (755) 554-1234 | contacto@propiel.com', pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text(`Folio: ${appointment.id || 'N/A'}`, pageWidth / 2, footerY + 10, { align: 'center' });

    // --- SAVE PDF ---
    const fileName = `Cita_${patientName.replace(/\s+/g, '_')}_${appointment.fecha}.pdf`;
    doc.save(fileName);
};

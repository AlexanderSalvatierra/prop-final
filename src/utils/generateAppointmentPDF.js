// src/utils/generateAppointmentPDF.js
import jsPDF from 'jspdf';

/**
 * Generates a professional appointment confirmation PDF
 * @param {Object} appointment - The appointment data
 * @param {Object} user - The user/patient information
 */
export const generateAppointmentPDF = (appointment, user) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Professional color palette
    const primaryTeal = [13, 148, 136];      // #0D9488
    const lightTeal = [204, 251, 241];       // #CCFBF1
    const darkGray = [31, 41, 55];           // #1F2937
    const mediumGray = [107, 114, 128];      // #6B7280
    const lightGray = [249, 250, 251];       // #F9FAFB
    const white = [255, 255, 255];

    let yPos = 20;

    // ===== ELEGANT HEADER WITH LOGO AREA =====
    // Top colored bar
    doc.setFillColor(...primaryTeal);
    doc.rect(0, 0, pageWidth, 8, 'F');

    yPos = 25;

    // Logo/Brand area (left side)
    doc.setFontSize(22);
    doc.setTextColor(...primaryTeal);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPIEL', 20, yPos);

    // Clinic info (right side)
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Clínica Dermatológica', pageWidth - 20, yPos - 4, { align: 'right' });
    doc.text('Av. Zihuatanejo Pte. 12, Centro', pageWidth - 20, yPos + 1, { align: 'right' });
    doc.text('Zihuatanejo, Guerrero', pageWidth - 20, yPos + 6, { align: 'right' });

    yPos = 45;

    // Elegant separator line
    doc.setDrawColor(...primaryTeal);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);

    yPos = 58;

    // ===== DOCUMENT TITLE =====
    doc.setFontSize(20);
    doc.setTextColor(...primaryTeal);
    doc.setFont('helvetica', 'bold');
    doc.text('Confirmación de Cita', pageWidth / 2, yPos, { align: 'center' });

    yPos = 66;
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Propiel - Clínica Dermatológica', pageWidth / 2, yPos, { align: 'center' });

    yPos = 80;

    // ===== DATE & TIME HIGHLIGHT BOX =====
    const appointmentDate = new Date(appointment.fecha);

    // Create a beautiful gradient-like box effect with borders
    doc.setFillColor(...lightTeal);
    doc.setDrawColor(...primaryTeal);
    doc.setLineWidth(0.8);
    doc.roundedRect(30, yPos, pageWidth - 60, 45, 4, 4, 'FD');

    // Date and time inside the box
    yPos += 15;

    doc.setFontSize(18);
    doc.setTextColor(...primaryTeal);
    doc.setFont('helvetica', 'bold');
    const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    doc.text(formattedDate, pageWidth / 2, yPos, { align: 'center' });

    yPos += 14;
    doc.setFontSize(26);
    doc.text(`${appointment.hora.slice(0, 5)} hrs`, pageWidth / 2, yPos, { align: 'center' });

    yPos += 25;

    // ===== APPOINTMENT DETAILS SECTION =====
    // Section header
    doc.setFillColor(...lightGray);
    doc.rect(20, yPos, pageWidth - 40, 10, 'F');

    doc.setFontSize(11);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLES DE LA CITA', 25, yPos + 7);

    yPos += 18;

    // Details in a clean two-column layout
    const leftCol = 25;
    const rightCol = 95;
    const lineHeight = 10;

    doc.setFontSize(10);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'bold');

    // Patient Name
    doc.text('Paciente:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    const patientName = appointment.pacientes?.nombre || user?.nombre || user?.email || 'Paciente';
    doc.text(patientName, rightCol, yPos);
    yPos += lineHeight;

    // Appointment Type
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...mediumGray);
    doc.text('Tipo de Cita:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    doc.text(appointment.tipo || 'Primera Vez', rightCol, yPos);
    yPos += lineHeight;

    // Location
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...mediumGray);
    doc.text('Ubicación:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    doc.text('Av. Zihuatanejo Pte. 12, Centro, Zihuatanejo', rightCol, yPos);
    yPos += lineHeight;

    // Status
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...mediumGray);
    doc.text('Estado:', leftCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...primaryTeal);
    doc.setFont('helvetica', 'bold');
    doc.text(appointment.estado || 'Confirmada', rightCol, yPos);
    yPos += lineHeight + 5;

    // Motivo (if exists)
    if (appointment.motivo && appointment.motivo.trim()) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...mediumGray);
        doc.text('Motivo:', leftCol, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...darkGray);
        const splitMotivo = doc.splitTextToSize(appointment.motivo, pageWidth - 50);
        doc.text(splitMotivo, leftCol, yPos);
        yPos += (splitMotivo.length * 4.5) + 8;
        doc.setFontSize(10);
    }

    yPos += 5;

    // ===== IMPORTANT REMINDER BOX =====
    doc.setFillColor(255, 251, 235); // Warm yellow tint
    doc.setDrawColor(251, 191, 36); // Amber border
    doc.setLineWidth(0.8);
    doc.roundedRect(20, yPos, pageWidth - 40, 42, 3, 3, 'FD');

    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(146, 64, 14); // Amber-900
    doc.setFont('helvetica', 'bold');
    doc.text('RECORDATORIO IMPORTANTE', 25, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(120, 53, 15); // Amber-800
    doc.setFont('helvetica', 'normal');
    doc.text('• Por favor, llega 15 minutos antes de tu hora programada.', 25, yPos);
    yPos += 6;
    doc.text('• Presenta este comprobante en la recepción.', 25, yPos);
    yPos += 6;
    doc.text('• Si necesitas cancelar o reprogramar, contactanos con 24 horas de anticipación.', 25, yPos);

    // ===== FOOTER WITH CONTACT INFO =====
    const footerY = pageHeight - 30;

    // Separator line
    doc.setDrawColor(...mediumGray);
    doc.setLineWidth(0.3);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

    // Contact information
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Propiel - Clínica Dermatológica', pageWidth / 2, footerY, { align: 'center' });

    doc.setFontSize(8);
    doc.text('Tel: (755) 554-1234 | contacto@propiel.com | www.propiel.com', pageWidth / 2, footerY + 5, { align: 'center' });

    // Folio number
    doc.setFontSize(7);
    doc.setTextColor(...mediumGray);
    doc.text(`Folio: ${appointment.id || 'N/A'}`, pageWidth / 2, footerY + 10, { align: 'center' });

    // Bottom colored bar
    doc.setFillColor(...primaryTeal);
    doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

    // ===== SAVE PDF =====
    const fileName = `Cita_${patientName.replace(/\s+/g, '_')}_${appointment.fecha}.pdf`;
    doc.save(fileName);
};

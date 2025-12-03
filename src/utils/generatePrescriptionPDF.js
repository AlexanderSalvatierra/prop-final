// src/utils/generatePrescriptionPDF.js
import jsPDF from 'jspdf';

/**
 * Generates a professional prescription PDF
 * @param {Object} prescription - The prescription data
 * @param {Object} patientData - The patient information
 * @param {Object} doctorData - The doctor/specialist information
 */
export function generatePrescriptionPDF(prescription, patientData, doctorData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // ===== HEADER =====
    // Logo/Title
    doc.setFillColor(13, 148, 136); // Teal-600
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPIEL', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Clínica Dermatológica', pageWidth / 2, 22, { align: 'center' });
    doc.text('Receta Médica', pageWidth / 2, 28, { align: 'center' });

    yPosition = 45;

    // ===== DOCTOR INFORMATION =====
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Dr(a). ${doctorData.nombre}`, 20, yPosition);

    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Especialidad: ${doctorData.especialidad || 'Dermatología'}`, 20, yPosition);

    yPosition += 5;
    doc.text(`Cédula Profesional: ${doctorData.cedula || 'N/A'}`, 20, yPosition);

    yPosition += 10;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // ===== PATIENT INFORMATION =====
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL PACIENTE', 20, yPosition);

    yPosition += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${patientData.nombre}`, 20, yPosition);

    yPosition += 6;
    const prescriptionDate = new Date(prescription.fecha);
    doc.text(`Fecha: ${prescriptionDate.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`, 20, yPosition);

    yPosition += 12;

    // ===== MEDICATIONS SECTION =====
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAMENTOS PRESCRITOS', 20, yPosition);

    yPosition += 8;

    // Parse medications from JSONB
    const medications = Array.isArray(prescription.medicamentos)
        ? prescription.medicamentos
        : JSON.parse(prescription.medicamentos || '[]');

    if (medications.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text('No se prescribieron medicamentos.', 20, yPosition);
        yPosition += 10;
    } else {
        medications.forEach((med, index) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = 20;
            }

            // Medication number
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`${index + 1}. ${med.nombre || 'Medicamento'}`, 20, yPosition);

            yPosition += 6;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            // Medication details
            const details = [];
            if (med.dosis) details.push(`Dosis: ${med.dosis}`);
            if (med.frecuencia) details.push(`Frecuencia: ${med.frecuencia}`);
            if (med.duracion) details.push(`Duración: ${med.duracion}`);

            doc.text(`   ${details.join(' | ')}`, 20, yPosition);
            yPosition += 8;
        });
    }

    yPosition += 5;

    // ===== GENERAL OBSERVATIONS =====
    if (prescription.observaciones_generales && prescription.observaciones_generales.trim()) {
        // Check if we need a new page
        if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('INDICACIONES GENERALES', 20, yPosition);

        yPosition += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        // Split long text into multiple lines
        const splitText = doc.splitTextToSize(prescription.observaciones_generales, pageWidth - 40);
        doc.text(splitText, 20, yPosition);
        yPosition += (splitText.length * 5) + 10;
    }

    // ===== FOOTER =====
    // Position footer at bottom of page
    const footerY = pageHeight - 30;

    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

    // Signature line
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const signatureX = pageWidth - 80;
    doc.line(signatureX, footerY + 10, pageWidth - 20, footerY + 10);
    doc.text('Firma del Médico', signatureX + 15, footerY + 15);

    // Clinic info
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Propiel - Clínica Dermatológica', pageWidth / 2, footerY + 20, { align: 'center' });
    doc.text('Tel: (123) 456-7890 | Email: contacto@propiel.com', pageWidth / 2, footerY + 25, { align: 'center' });

    // ===== SAVE PDF =====
    const fileName = `Receta_${patientData.nombre.replace(/\s+/g, '_')}_${prescriptionDate.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}

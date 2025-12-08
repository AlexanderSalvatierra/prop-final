// src/utils/generatePrescriptionPDF.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Importación correcta

/**
 * Generates a professional prescription PDF with corporate identity
 * @param {Object} prescription - The prescription data
 * @param {Object} patientData - The patient information
 * @param {Object} doctorData - The doctor/specialist information
 */
export function generatePrescriptionPDF(prescription, patientData, doctorData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Corporate colors
    const tealColor = [13, 148, 136];
    const darkGray = [60, 60, 60];

    let yPosition = 20;

    // ===== HEADER =====
    try {
        // Carga de logo (placeholder o real si tienes la lógica de imagen)
        doc.setFontSize(18);
        doc.setTextColor(...tealColor);
        doc.setFont('helvetica', 'bold');
        doc.text('PROPIEL', 20, 25);
    } catch (e) {
        // Fallback
    }

    // Doctor information (right side)
    doc.setFontSize(14);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text(`Dr(a). ${doctorData.nombre}`, pageWidth - 20, 18, { align: 'right' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(doctorData.especialidad || 'Dermatología', pageWidth - 20, 24, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Cédula: ${doctorData.cedula || 'N/A'}`, pageWidth - 20, 29, { align: 'right' });

    // Teal separator line
    yPosition = 35;
    doc.setDrawColor(...tealColor);
    doc.setLineWidth(1);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition = 45;

    // ===== PATIENT DATA BOX =====
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, yPosition, pageWidth - 40, 22, 2, 2, 'S');

    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text('Paciente:', 25, yPosition + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(patientData.nombre, 48, yPosition + 7);

    const prescriptionDate = new Date(prescription.fecha);
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', 25, yPosition + 14);
    doc.setFont('helvetica', 'normal');
    doc.text(prescriptionDate.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }), 43, yPosition + 14);

    // Optional: Age or Weight
    if (patientData.edad || patientData.peso) {
        doc.setFont('helvetica', 'bold');
        doc.text('Edad:', pageWidth - 80, yPosition + 7);
        doc.setFont('helvetica', 'normal');
        doc.text(patientData.edad || 'N/A', pageWidth - 65, yPosition + 7);
    }

    yPosition += 30;

    // ===== MEDICATIONS TABLE =====
    const medications = Array.isArray(prescription.medicamentos)
        ? prescription.medicamentos
        : JSON.parse(prescription.medicamentos || '[]');

    if (medications.length > 0) {
        const tableData = medications.map((med) => [
            med.nombre || 'Medicamento',
            `${med.dosis || 'N/A'} - ${med.frecuencia || 'N/A'}`,
            med.duracion || 'N/A'
        ]);

        // 👇 CAMBIO PRINCIPAL: Usar autoTable(doc, opciones) en lugar de doc.autoTable
        autoTable(doc, {
            startY: yPosition,
            head: [['Medicamento', 'Dosis / Frecuencia', 'Duración']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: tealColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10
            },
            bodyStyles: {
                textColor: darkGray,
                fontSize: 9
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            },
            margin: { left: 20, right: 20 }
        });

        // 👇 CAMBIO SECUNDARIO: Acceder a lastAutoTable correctamente
        yPosition = doc.lastAutoTable.finalY + 15;
    } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text('No se prescribieron medicamentos.', 20, yPosition);
        yPosition += 15;
    }

    // ===== GENERAL INDICATIONS =====
    if (prescription.observaciones_generales && prescription.observaciones_generales.trim()) {
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...tealColor);
        doc.text('INDICACIONES GENERALES', 20, yPosition);

        yPosition += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...darkGray);

        const splitText = doc.splitTextToSize(prescription.observaciones_generales, pageWidth - 40);
        doc.text(splitText, 20, yPosition);
        yPosition += (splitText.length * 5) + 10;
    }

    // ===== FOOTER =====
    const footerY = pageHeight - 35;

    // Signature line
    const signatureWidth = 60;
    const signatureX = (pageWidth - signatureWidth) / 2;
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(signatureX, footerY, signatureX + signatureWidth, footerY);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Firma del Médico', pageWidth / 2, footerY + 5, { align: 'center' });

    // Clinic address
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text('Propiel - Clínica Dermatológica', pageWidth / 2, footerY + 15, { align: 'center' });
    doc.text('Av. Zihuatanejo Pte. 12, Centro, Zihuatanejo, Guerrero', pageWidth / 2, footerY + 20, { align: 'center' });
    doc.text('Tel: (755) 554-1234 | contacto@propiel.com', pageWidth / 2, footerY + 25, { align: 'center' });

    // ===== SAVE PDF =====
    const fileName = `Receta_${patientData.nombre.replace(/\s+/g, '_')}_${prescriptionDate.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}
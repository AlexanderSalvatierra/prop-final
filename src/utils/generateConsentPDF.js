// src/utils/generateConsentPDF.js
import { jsPDF } from 'jspdf';

/**
 * Generates a professional informed consent PDF (Legal Document Style)
 * @param {Object} consentData - The consent data including patient info and signature
 * @param {string} consentData.patientName - Patient's full name
 * @param {string} consentData.appointmentType - Type of appointment/procedure
 * @param {string} consentData.signatureDataURL - Base64 signature image from canvas
 * @param {Date} consentData.date - Date of consent
 */
export function generateConsentPDF(consentData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Corporate colors
    const tealColor = [13, 148, 136];
    const darkGray = [60, 60, 60];
    const lightGray = [245, 245, 245];

    let yPos = 20;

    // ===== HEADER CON LOGO Y DATOS DE LA CLÍNICA =====
    // Logo/Nombre de la clínica (izquierda)
    doc.setFontSize(20);
    doc.setTextColor(...tealColor);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPIEL', 20, yPos);

    // Datos de la clínica (derecha)
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Clínica Dermatológica', pageWidth - 20, yPos - 2, { align: 'right' });
    doc.text('Av. Zihuatanejo Pte. 12, Centro', pageWidth - 20, yPos + 3, { align: 'right' });
    doc.text('Zihuatanejo, Guerrero', pageWidth - 20, yPos + 8, { align: 'right' });
    doc.text('Tel: (755) 554-1234', pageWidth - 20, yPos + 13, { align: 'right' });

    yPos = 40;

    // Línea separadora
    doc.setDrawColor(...tealColor);
    doc.setLineWidth(0.8);
    doc.line(20, yPos, pageWidth - 20, yPos);

    yPos = 50;

    // ===== TÍTULO DEL DOCUMENTO =====
    doc.setFontSize(18);
    doc.setTextColor(...tealColor);
    doc.setFont('helvetica', 'bold');
    doc.text('CONSENTIMIENTO INFORMADO', pageWidth / 2, yPos, { align: 'center' });

    // Subtítulo
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Autorización para Tratamiento Dermatológico', pageWidth / 2, yPos, { align: 'center' });

    yPos += 12;

    // ===== INFORMACIÓN DEL PACIENTE (Recuadro) =====
    doc.setFillColor(...lightGray);
    doc.roundedRect(20, yPos, pageWidth - 40, 28, 2, 2, 'F');

    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL PACIENTE', 25, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre Completo: ${consentData.patientName || '___________________'}`, 25, yPos);

    yPos += 5;
    const consentDate = consentData.date ? new Date(consentData.date) : new Date();
    doc.text(`Fecha: ${consentDate.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`, 25, yPos);

    yPos += 5;
    doc.text(`Tipo de Procedimiento: ${consentData.appointmentType || 'Consulta General'}`, 25, yPos);

    yPos += 15;

    // ===== TEXTO LEGAL (Bien espaciado y numerado) =====
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);

    const legalSections = [
        {
            title: 'DECLARACIÓN DE CONSENTIMIENTO',
            text: `Por medio del presente documento, yo, ${consentData.patientName || '___________________'}, en pleno uso de mis facultades mentales, declaro que:`
        },
        {
            number: '1.',
            text: 'He sido informado(a) de manera clara, completa y comprensible sobre la naturaleza del procedimiento dermatológico que se me realizará, sus objetivos, beneficios esperados, riesgos potenciales y alternativas disponibles.'
        },
        {
            number: '2.',
            text: 'He tenido la oportunidad de hacer todas las preguntas necesarias y todas mis dudas han sido resueltas de manera satisfactoria por el personal médico de Propiel.'
        },
        {
            number: '3.',
            text: 'Comprendo que, aunque se tomarán todas las precauciones necesarias y se aplicarán los más altos estándares de cuidado médico, ningún procedimiento está completamente exento de riesgos y que los resultados pueden variar según cada paciente.'
        },
        {
            number: '4.',
            text: 'Autorizo expresamente al Dr(a). y al personal médico de Propiel a realizar el procedimiento acordado, así como cualquier procedimiento adicional que resulte médicamente necesario durante el tratamiento.'
        },
        {
            number: '5.',
            text: 'Me comprometo a seguir estrictamente las indicaciones médicas antes, durante y después del procedimiento, y a informar de inmediato sobre cualquier cambio en mi estado de salud o reacción adversa.'
        },
        {
            number: '6.',
            text: 'Autorizo el uso de fotografías clínicas con fines médicos, de seguimiento y documentación, garantizando la confidencialidad de mi identidad conforme a la normativa de protección de datos personales.'
        },
        {
            number: '7.',
            text: 'Confirmo que he proporcionado información veraz y completa sobre mi historial médico, alergias, medicamentos actuales y cualquier condición de salud relevante.'
        }
    ];

    legalSections.forEach((section, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 50) {
            doc.addPage();
            yPos = 20;
        }

        if (section.title) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(section.title, 20, yPos);
            yPos += 6;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
        }

        const textLines = doc.splitTextToSize(
            section.number ? `${section.number} ${section.text}` : section.text,
            pageWidth - 40
        );

        doc.text(textLines, section.number ? 25 : 20, yPos);
        yPos += textLines.length * 4.5 + 4;
    });

    yPos += 5;

    // Declaración final
    if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const finalText = doc.splitTextToSize(
        'Este consentimiento es otorgado de manera libre, voluntaria e informada, sin ningún tipo de coacción.',
        pageWidth - 40
    );
    doc.text(finalText, 20, yPos);
    yPos += finalText.length * 4.5 + 10;

    // ===== SECCIÓN DE FIRMA (Profesional) =====
    if (yPos > pageHeight - 70) {
        doc.addPage();
        yPos = 20;
    }

    // Línea separadora antes de la firma
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...tealColor);
    doc.text('FIRMA DEL PACIENTE', 20, yPos);
    yPos += 8;

    // Recuadro para la firma
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, yPos, 80, 30, 2, 2, 'S');

    // Insertar firma si está disponible
    if (consentData.signatureDataURL) {
        try {
            doc.addImage(consentData.signatureDataURL, 'PNG', 25, yPos + 3, 70, 24);
        } catch (e) {
            console.warn("No se pudo insertar la firma", e);
        }
    }

    yPos += 35;

    // Línea para el nombre del paciente
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 100, yPos);

    yPos += 5;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Nombre y Firma del Paciente', 20, yPos);

    yPos += 3;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkGray);
    doc.text(consentData.patientName || '', 20, yPos);

    // Fecha de firma (derecha)
    yPos -= 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Fecha:', pageWidth - 70, yPos - 30);
    doc.line(pageWidth - 55, yPos - 25, pageWidth - 20, yPos - 25);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkGray);
    doc.text(consentDate.toLocaleDateString('es-MX'), pageWidth - 55, yPos - 22);

    // ===== FOOTER (Información legal y contacto) =====
    const footerY = pageHeight - 25;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'italic');
    doc.text('Este documento es confidencial y forma parte del expediente clínico del paciente.', pageWidth / 2, footerY, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Propiel - Clínica Dermatológica | Av. Zihuatanejo Pte. 12, Centro, Zihuatanejo, Guerrero', pageWidth / 2, footerY + 4, { align: 'center' });
    doc.text('Tel: (755) 554-1234 | contacto@propiel.com | www.propiel.com', pageWidth / 2, footerY + 8, { align: 'center' });

    // Número de página
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página 1 de 1`, pageWidth - 20, footerY + 12, { align: 'right' });

    // ===== RETURN BLOB =====
    return doc.output('blob');
}

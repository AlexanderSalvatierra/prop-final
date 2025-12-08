// src/utils/generatePaymentReceipt.js

// 1. CAMBIO IMPORTANTE: Usamos destructuración para jsPDF y importamos autoTable por nombre
import { jsPDF } from 'jspdf'; // 👈 Importar con llaves {}
import autoTable from 'jspdf-autotable'; // 👈 Importar la función directamente

/**
 * Generates a professional payment receipt PDF (Corporate Invoice Style)
 * @param {Object} payment - The payment data
 * @param {Object} patientData - The patient information
 */
export const generatePaymentReceipt = async (payment, patientData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Corporate colors
    const tealColor = [13, 148, 136];
    const darkGray = [60, 60, 60];
    const lightGray = [249, 250, 251];

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
        // --- 1. HEADER ---
        try {
            const logo = await loadImage('/propiel-logo.png');
            doc.addImage(logo, 'PNG', 20, 15, 40, 15);
        } catch (e) {
            console.warn("No se pudo cargar el logo", e);
            // Fallback: texto PROPIEL
            doc.setFontSize(18);
            doc.setTextColor(...tealColor);
            doc.setFont('helvetica', 'bold');
            doc.text("PROPIEL", 20, 25);
        }

        // Folio
        const folio = String(payment.id).substring(0, 8).toUpperCase();
        doc.setFontSize(14);
        doc.setTextColor(...tealColor);
        doc.setFont("helvetica", "bold");
        doc.text(`RECIBO #${folio}`, pageWidth - 20, 20, { align: 'right' });

        // Company info
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text("Clínica Dermatológica Propiel", pageWidth - 20, 27, { align: 'right' });
        doc.text("Av. Zihuatanejo Pte. 12, Centro", pageWidth - 20, 32, { align: 'right' });
        doc.text("Zihuatanejo, Guerrero", pageWidth - 20, 37, { align: 'right' });
        doc.text("RFC: PRO-123456-ABC", pageWidth - 20, 42, { align: 'right' });

        // Separator line
        let yPos = 50;
        doc.setDrawColor(...tealColor);
        doc.setLineWidth(1);
        doc.line(20, yPos, pageWidth - 20, yPos);

        yPos = 60;

        // --- 2. CLIENT DATA ---
        doc.setFillColor(...lightGray);
        doc.rect(20, yPos, pageWidth - 40, 25, 'F');

        doc.setFontSize(10);
        doc.setTextColor(...darkGray);
        doc.setFont("helvetica", "bold");
        doc.text("Recibí de:", 25, yPos + 8);
        doc.text("Fecha de Emisión:", 120, yPos + 8);

        doc.setFont("helvetica", "normal");
        doc.text(patientData.nombre || patientData.email || "Paciente", 25, yPos + 16);
        doc.text(new Date(payment.created_at || new Date()).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric'
        }), 120, yPos + 16);

        yPos += 35;

        // --- 3. CONCEPTS TABLE ---
        const amount = parseFloat(payment.monto);
        const tableData = [[
            '1',
            payment.concepto || 'Servicios Médicos',
            amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
            amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
        ]];

        // 2. CAMBIO IMPORTANTE: Ejecutar autoTable como función externa pasando 'doc'
        autoTable(doc, {  // 👈 En lugar de doc.autoTable(...)
            startY: yPos,
            head: [['Cant.', 'Descripción', 'Precio Unitario', 'Importe']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: tealColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10,
                halign: 'center'
            },
            bodyStyles: {
                textColor: darkGray,
                fontSize: 10
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 20 },
                1: { halign: 'left', cellWidth: 80 },
                2: { halign: 'right', cellWidth: 40 },
                3: { halign: 'right', cellWidth: 40 }
            },
            margin: { left: 20, right: 20 }
        });

        // 3. CAMBIO IMPORTANTE: Acceder a lastAutoTable desde la propiedad del objeto doc
        // (Esto suele seguir funcionando igual, pero verifica que autoTable lo inyecte)
        yPos = doc.lastAutoTable.finalY + 10;

        // --- 4. PAYMENT METHOD ---
        doc.setFontSize(10);
        doc.setTextColor(...darkGray);
        doc.setFont("helvetica", "bold");
        doc.text("Método de Pago:", 20, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(payment.metodo || "No especificado", 60, yPos);

        yPos += 15;

        // --- 5. TOTAL ---
        doc.setFillColor(240, 240, 240);
        doc.rect(pageWidth - 90, yPos - 5, 70, 12, 'F');

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...darkGray);
        doc.text("TOTAL:", pageWidth - 85, yPos + 3);

        doc.setFontSize(14);
        doc.setTextColor(...tealColor);
        doc.text(amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
            pageWidth - 25, yPos + 3, { align: 'right' });

        // --- 6. LEGAL NOTICE ---
        const footerY = pageHeight - 30;
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.setFont("helvetica", "italic");
        doc.text("Este documento no es un comprobante fiscal oficial.", pageWidth / 2, footerY, { align: 'center' });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Gracias por su preferencia.", pageWidth / 2, footerY + 5, { align: 'center' });
        doc.text("Propiel - Clínica Dermatológica | Tel: (755) 554-1234", pageWidth / 2, footerY + 10, { align: 'center' });

        // --- SAVE PDF ---
        doc.save(`Recibo_Propiel_${folio}.pdf`);

    } catch (error) {
        console.error("Error generando recibo PDF:", error);
        throw error;
    }
};
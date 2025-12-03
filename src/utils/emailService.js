import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

// Initialize EmailJS
if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

/**
 * Send a welcome email to a newly registered patient
 * @param {string} userEmail - The email address of the new user
 * @param {string} userName - The name of the new user
 * @returns {Promise} - EmailJS send promise
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const templateParams = {
            to_email: userEmail,
            to_name: userName,
            subject: '¡Bienvenido a Propiel!',
            message: `Hola ${userName},\n\n¡Bienvenido a Propiel! Tu cuenta ha sido creada exitosamente.\n\nAhora puedes acceder a nuestros servicios dermatológicos, agendar citas con nuestros especialistas y gestionar tu historial médico.\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\n¡Gracias por confiar en nosotros!\n\nEquipo Propiel`
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        console.log('Welcome email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

/**
 * Send an appointment confirmation email to a patient
 * @param {string} userEmail - The email address of the patient
 * @param {string} userName - The name of the patient
 * @param {Object} appointmentDetails - Details of the appointment
 * @param {string} appointmentDetails.fecha - Appointment date
 * @param {string} appointmentDetails.hora - Appointment time
 * @param {string} appointmentDetails.doctor - Doctor's name
 * @param {string} appointmentDetails.especialidad - Medical specialty
 * @returns {Promise} - EmailJS send promise
 */
export const sendAppointmentConfirmation = async (userEmail, userName, appointmentDetails) => {
    try {
        const { fecha, hora, doctor, especialidad } = appointmentDetails;

        // Format the date for better readability
        const formattedDate = new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const templateParams = {
            to_email: userEmail,
            to_name: userName,
            subject: 'Confirmación de Cita - Propiel',
            message: `Hola ${userName},\n\nTu cita ha sido agendada exitosamente.\n\n📋 Detalles de la cita:\n• Especialidad: ${especialidad}\n• Doctor: Dr. ${doctor}\n• Fecha: ${formattedDate}\n• Hora: ${hora}\n\nPor favor, llega 10 minutos antes de tu cita. Si necesitas cancelar o reprogramar, puedes hacerlo desde tu panel de citas.\n\n¡Te esperamos!\n\nEquipo Propiel`
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        console.log('Appointment confirmation email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending appointment confirmation email:', error);
        throw error;
    }
};

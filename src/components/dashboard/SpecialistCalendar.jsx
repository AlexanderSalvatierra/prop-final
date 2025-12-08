// src/components/dashboard/SpecialistCalendar.jsx
import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import { toast } from 'react-hot-toast';

// Configurar el localizador con date-fns en español
const locales = {
    es: es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Mensajes personalizados en español
const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Cita',
    noEventsInRange: 'No hay citas en este rango.',
    showMore: (total) => `+ Ver más (${total})`,
};

export default function SpecialistCalendar({ citas = [] }) {
    // Transformar las citas al formato del calendario
    const events = useMemo(() => {
        return citas.map((cita) => {
            // Combinar fecha + hora para crear el start
            const [year, month, day] = cita.fecha.split('-');
            const [hours, minutes] = cita.hora.split(':');

            const start = new Date(
                parseInt(year),
                parseInt(month) - 1, // Los meses en JS son 0-indexed
                parseInt(day),
                parseInt(hours),
                parseInt(minutes)
            );

            // Calcular end (start + 1 hora)
            const end = new Date(start);
            end.setHours(end.getHours() + 1);

            // Crear el título
            const pacienteNombre = cita.pacientes?.nombre || 'Paciente';
            const title = `${pacienteNombre} - ${cita.tipo || 'Consulta'}`;

            return {
                title,
                start,
                end,
                resource: cita, // Guardamos la cita completa para acceder a ella en el clic
            };
        });
    }, [citas]);

    // Función para personalizar los estilos de cada evento según su estado
    const eventPropGetter = (event) => {
        const estado = event.resource?.estado;

        let backgroundColor = '#6b7280'; // gray-500 por defecto
        let borderColor = '#6b7280';

        switch (estado) {
            case 'Confirmada':
                backgroundColor = '#0d9488'; // teal-600
                borderColor = '#0d9488';
                break;
            case 'Pendiente':
                backgroundColor = '#f59e0b'; // amber-500
                borderColor = '#f59e0b';
                break;
            case 'Cancelada':
                backgroundColor = '#ef4444'; // red-500
                borderColor = '#ef4444';
                break;
            case 'Rechazada':
                backgroundColor = '#9ca3af'; // gray-400
                borderColor = '#9ca3af';
                break;
            case 'Completada':
                backgroundColor = '#10b981'; // green-500
                borderColor = '#10b981';
                break;
            case 'No Asistió':
                backgroundColor = '#ea580c'; // orange-600
                borderColor = '#ea580c';
                break;
            default:
                break;
        }

        return {
            style: {
                backgroundColor,
                borderColor,
                borderRadius: '6px',
                opacity: estado === 'Cancelada' || estado === 'Rechazada' ? 0.5 : 1,
                color: 'white',
                border: `2px solid ${borderColor}`,
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '2px 6px',
            },
        };
    };

    // Manejar el clic en un evento
    const handleSelectEvent = (event) => {
        const cita = event.resource;
        const pacienteNombre = cita.pacientes?.nombre || 'Paciente';

        toast(
            <div className="text-sm">
                <p className="font-bold text-gray-900 mb-1">📋 Detalles de la Cita</p>
                <p className="text-gray-700"><strong>Paciente:</strong> {pacienteNombre}</p>
                <p className="text-gray-700"><strong>Tipo:</strong> {cita.tipo || 'Consulta'}</p>
                <p className="text-gray-700"><strong>Motivo:</strong> {cita.motivo || 'No especificado'}</p>
                <p className="text-gray-700"><strong>Estado:</strong> {cita.estado}</p>
                <p className="text-gray-700"><strong>Hora:</strong> {cita.hora?.slice(0, 5)}</p>
            </div>,
            {
                duration: 5000,
                position: 'top-center',
                style: {
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    maxWidth: '400px',
                },
            }
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 lg:p-6">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    messages={messages}
                    culture="es"
                    eventPropGetter={eventPropGetter}
                    onSelectEvent={handleSelectEvent}
                    views={['month', 'week', 'day', 'agenda']}
                    defaultView="month"
                    popup
                    selectable
                    tooltipAccessor={(event) => event.title}
                />
            </div>

            {/* Leyenda de colores */}
            <div className="px-4 lg:px-6 pb-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Leyenda de Estados:
                </p>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                        <span className="text-xs text-gray-600">Confirmada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-gray-600">Pendiente</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Completada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                        <span className="text-xs text-gray-600">No Asistió</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-50"></div>
                        <span className="text-xs text-gray-600">Cancelada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400 opacity-50"></div>
                        <span className="text-xs text-gray-600">Rechazada</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

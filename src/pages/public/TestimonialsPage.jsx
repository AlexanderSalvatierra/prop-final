import { Link } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';

export function TestimonialsPage() {
    const testimonials = [
        {
            name: 'María González',
            initials: 'MG',
            rating: 5,
            comment: 'Excelente atención y profesionalismo. El Dr. Ramírez me ayudó con mi problema de acné y los resultados han sido increíbles. La plataforma es muy fácil de usar y el seguimiento médico digital me permite ver mi historial en cualquier momento. Totalmente recomendado para cualquier persona que busque atención dermatológica de calidad.',
            date: 'Hace 2 semanas',
            bgColor: 'bg-teal-600'
        },
        {
            name: 'Carlos Méndez',
            initials: 'CM',
            rating: 5,
            comment: 'La plataforma es muy fácil de usar y agendar citas es súper rápido. El seguimiento médico digital me permite ver mi historial en cualquier momento. Los especialistas son muy profesionales y siempre están dispuestos a resolver todas mis dudas. Una experiencia completamente diferente a las clínicas tradicionales.',
            date: 'Hace 3 semanas',
            bgColor: 'bg-blue-600'
        },
        {
            name: 'Ana Martínez',
            initials: 'AM',
            rating: 5,
            comment: 'Me encanta la atención personalizada. Los especialistas son muy profesionales y siempre están dispuestos a resolver todas mis dudas. El tratamiento para mi psoriasis ha sido muy efectivo y he notado mejoras significativas en poco tiempo. Definitivamente seguiré confiando en Propiel.',
            date: 'Hace 1 mes',
            bgColor: 'bg-purple-600'
        },
        {
            name: 'Roberto Sánchez',
            initials: 'RS',
            rating: 5,
            comment: 'Llevé a mi bebé para el tamiz neonatal y todo el proceso fue muy profesional y rápido. El personal es muy amable y me explicaron todo con mucha paciencia. Los resultados llegaron en tiempo y forma. Excelente servicio, muy recomendable para padres primerizos.',
            date: 'Hace 1 mes',
            bgColor: 'bg-pink-600'
        },
        {
            name: 'Laura Fernández',
            initials: 'LF',
            rating: 5,
            comment: 'Los tratamientos estéticos que me realizaron superaron mis expectativas. Mi piel se ve mucho más radiante y las manchas han disminuido notablemente. La Dra. López es muy profesional y me explicó cada paso del tratamiento. El precio es muy justo para la calidad del servicio.',
            date: 'Hace 2 meses',
            bgColor: 'bg-amber-600'
        },
        {
            name: 'José Luis Ramírez',
            initials: 'JR',
            rating: 5,
            comment: 'Tenía un problema de hongos en los pies que me molestaba desde hace años. El tratamiento de podología fue muy efectivo y ahora puedo caminar sin dolor. El especialista fue muy atento y me dio recomendaciones para prevenir futuros problemas. Muy satisfecho con el servicio.',
            date: 'Hace 2 meses',
            bgColor: 'bg-indigo-600'
        },
        {
            name: 'Patricia Morales',
            initials: 'PM',
            rating: 5,
            comment: 'Me realizaron una cirugía dermatológica para remover un lunar sospechoso. Todo el procedimiento fue muy profesional, desde la consulta inicial hasta el seguimiento post-operatorio. El resultado es excelente y prácticamente no quedó cicatriz. Muy agradecida con todo el equipo.',
            date: 'Hace 3 meses',
            bgColor: 'bg-rose-600'
        },
        {
            name: 'Miguel Ángel Torres',
            initials: 'MT',
            rating: 5,
            comment: 'La atención al cliente es excepcional. Desde que agendé mi cita hasta la consulta, todo fue muy fluido. El doctor se tomó el tiempo necesario para explicarme mi diagnóstico y las opciones de tratamiento. Los precios son accesibles y la calidad del servicio es de primer nivel.',
            date: 'Hace 3 meses',
            bgColor: 'bg-cyan-600'
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Historias de Éxito
                    </h1>
                    <p className="text-xl md:text-2xl text-teal-50 max-w-3xl mx-auto">
                        Testimonios reales de personas que confiaron en nosotros para el cuidado de su piel y salud.
                    </p>
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100"
                        >
                            {/* Header with Avatar and Name */}
                            <div className="flex items-start mb-6">
                                {/* Avatar with Initials */}
                                <div className={`flex-shrink-0 h-14 w-14 rounded-full ${testimonial.bgColor} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                    {testimonial.initials}
                                </div>

                                {/* Name and Rating */}
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {testimonial.name}
                                    </h3>
                                    {/* Star Rating */}
                                    <div className="flex items-center mt-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 text-yellow-400 fill-current"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Date */}
                                <span className="text-sm text-gray-500">
                                    {testimonial.date}
                                </span>
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 leading-relaxed italic">
                                "{testimonial.comment}"
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                    <MessageSquare className="h-16 w-16 text-teal-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¿Ya nos visitaste?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Nos encantaría conocer tu experiencia. Comparte tu historia y ayuda a otros a tomar la mejor decisión para su salud.
                    </p>
                    <button
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-teal-600 text-lg font-semibold rounded-full text-teal-600 bg-white hover:bg-teal-50 transition-all shadow-md hover:shadow-lg"
                    >
                        <MessageSquare className="h-6 w-6 mr-2" />
                        Dejar mi opinión
                    </button>
                </div>
            </div>
        </div>
    );
}

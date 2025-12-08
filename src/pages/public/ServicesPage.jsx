import { Link } from 'react-router-dom';
import { Stethoscope, Footprints, Scissors, Baby, Sparkles, Calendar } from 'lucide-react';

export function ServicesPage() {
    const services = [
        {
            icon: Stethoscope,
            title: 'Dermatología Clínica',
            description: 'Diagnóstico y tratamiento especializado de enfermedades de la piel como acné, psoriasis, dermatitis, rosácea y otras afecciones cutáneas. Nuestros dermatólogos certificados utilizan las técnicas más avanzadas para garantizar tu salud dermatológica.',
            priceRange: 'Desde $800 MXN',
            color: 'teal'
        },
        {
            icon: Footprints,
            title: 'Podología',
            description: 'Cuidado integral y especializado de tus pies. Tratamiento de callos, uñas encarnadas, hongos, pie diabético y otras afecciones podológicas. Mejora tu calidad de vida con pies saludables y sin dolor.',
            priceRange: 'Desde $600 MXN',
            color: 'blue'
        },
        {
            icon: Scissors,
            title: 'Cirugía Dermatológica',
            description: 'Procedimientos quirúrgicos menores para la extirpación de lesiones cutáneas, lunares, verrugas, quistes y biopsias de piel. Realizados con técnicas mínimamente invasivas en un ambiente seguro y controlado.',
            priceRange: 'Consultar precio',
            color: 'purple'
        },
        {
            icon: Baby,
            title: 'Tamiz Neonatal',
            description: 'Detección temprana de enfermedades metabólicas y genéticas en recién nacidos mediante análisis de laboratorio especializado. Prevención y diagnóstico oportuno para garantizar el desarrollo saludable de tu bebé.',
            priceRange: 'Desde $1,200 MXN',
            color: 'pink'
        },
        {
            icon: Sparkles,
            title: 'Estética Dermatológica',
            description: 'Tratamientos de rejuvenecimiento facial, eliminación de manchas, tratamientos anti-edad, peelings químicos y procedimientos estéticos no invasivos. Luce una piel radiante y saludable con nuestros tratamientos personalizados.',
            priceRange: 'Desde $1,000 MXN',
            color: 'amber'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
            blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
            purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
            pink: 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white',
            amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
        };
        return colors[color] || colors.teal;
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Nuestros Servicios Especializados
                    </h1>
                    <p className="text-xl md:text-2xl text-teal-50 max-w-3xl mx-auto">
                        Soluciones dermatológicas completas adaptadas a tus necesidades con tecnología de vanguardia y atención personalizada.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 border border-gray-100"
                        >
                            {/* Icon */}
                            <div className={`flex items-center justify-center h-16 w-16 rounded-xl mb-6 transition-all duration-300 ${getColorClasses(service.color)}`}>
                                <service.icon className="h-8 w-8" aria-hidden="true" />
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {service.description}
                            </p>

                            {/* Price */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <span className="text-lg font-semibold text-teal-600">
                                    {service.priceRange}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¿Listo para cuidar tu piel?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Agenda tu consulta hoy mismo y comienza tu camino hacia una piel saludable y radiante.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Calendar className="h-6 w-6 mr-2" />
                        Agendar Consulta
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Dummy Data - Casos de Éxito
const CASES = [
    {
        id: 1,
        title: 'Tratamiento de Acné Severo',
        description: 'Paciente de 24 años con acné quístico. Después de 6 meses de tratamiento personalizado, los resultados son evidentes. Piel más clara, reducción del 90% de lesiones activas.',
        beforeImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80',
        treatment: 'Dermatología Clínica'
    },
    {
        id: 2,
        title: 'Rejuvenecimiento Facial',
        description: 'Tratamiento de manchas y signos de envejecimiento en paciente de 45 años. Combinación de peelings químicos y tratamientos despigmentantes. Piel más luminosa y uniforme.',
        beforeImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
        treatment: 'Estética Dermatológica'
    },
    {
        id: 3,
        title: 'Eliminación de Cicatrices',
        description: 'Tratamiento de cicatrices post-acné con técnicas de microdermoabrasión y láser. Paciente de 28 años con mejora notable en textura y apariencia de la piel en 4 meses.',
        beforeImage: 'https://images.unsplash.com/photo-1614859324818-9e8c9c4c5b5f?w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80',
        treatment: 'Cirugía Dermatológica'
    },
    {
        id: 4,
        title: 'Tratamiento Capilar - Alopecia',
        description: 'Paciente de 35 años con alopecia areata. Tratamiento con terapia regenerativa y medicación especializada. Recuperación del 80% del cabello en zonas afectadas tras 8 meses.',
        beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
        treatment: 'Dermatología Clínica'
    }
];

export function GalleryPage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? CASES.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === CASES.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const currentCase = CASES[currentIndex];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center mb-6">
                        <Sparkles className="h-12 w-12 mr-4" />
                        <h1 className="text-4xl md:text-5xl font-extrabold">
                            Transformaciones Reales
                        </h1>
                    </div>
                    <p className="text-xl md:text-2xl text-teal-50 max-w-3xl mx-auto">
                        La evidencia de nuestro compromiso con tu piel. Casos reales, resultados verificables.
                    </p>
                </div>
            </div>

            {/* Carousel Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Case Header */}
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="inline-block px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-full">
                                {currentCase.treatment}
                            </span>
                            <span className="text-sm text-gray-600 font-medium">
                                Caso {currentIndex + 1} de {CASES.length}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            {currentCase.title}
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {currentCase.description}
                        </p>
                    </div>

                    {/* Before/After Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* BEFORE */}
                        <div className="relative group">
                            <div className="absolute top-4 left-4 z-10">
                                <span className="inline-block px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg">
                                    ANTES
                                </span>
                            </div>
                            <img
                                src={currentCase.beforeImage}
                                alt={`Antes - ${currentCase.title}`}
                                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* AFTER */}
                        <div className="relative group">
                            <div className="absolute top-4 right-4 z-10">
                                <span className="inline-block px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg shadow-lg">
                                    DESPUÉS
                                </span>
                            </div>
                            <img
                                src={currentCase.afterImage}
                                alt={`Después - ${currentCase.title}`}
                                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>

                    {/* Carousel Controls */}
                    <div className="bg-gray-50 p-8">
                        <div className="flex items-center justify-between">
                            {/* Previous Button */}
                            <button
                                onClick={goToPrevious}
                                className="flex items-center justify-center h-12 w-12 rounded-full bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                                aria-label="Caso anterior"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>

                            {/* Dots Indicators */}
                            <div className="flex items-center space-x-3">
                                {CASES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentIndex
                                                ? 'bg-teal-600 w-8'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        aria-label={`Ir al caso ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={goToNext}
                                className="flex items-center justify-center h-12 w-12 rounded-full bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                                aria-label="Siguiente caso"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-12 bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg">
                    <p className="text-sm text-amber-800">
                        <strong>Nota importante:</strong> Los resultados pueden variar según cada paciente.
                        Las imágenes mostradas son casos reales tratados en nuestra clínica.
                        Consulta con nuestros especialistas para obtener un diagnóstico personalizado.
                    </p>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¿Listo para tu transformación?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Agenda tu consulta hoy mismo y comienza tu camino hacia una piel saludable y radiante.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/register"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Agendar Consulta
                        </a>
                        <a
                            href="/servicios"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-teal-600 text-lg font-semibold rounded-full text-teal-600 bg-white hover:bg-teal-50 transition-all shadow-md"
                        >
                            Ver Servicios
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

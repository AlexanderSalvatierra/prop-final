import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export function ContactPage() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Visual only - no backend integration
        alert('Gracias por tu mensaje. Te contactaremos pronto.');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Contáctanos
                    </h1>
                    <p className="text-xl md:text-2xl text-teal-50 max-w-3xl mx-auto">
                        ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
                    </p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column - Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                                Información de Contacto
                            </h2>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-teal-50 text-teal-600">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Dirección</h3>
                                        <p className="mt-2 text-gray-600 leading-relaxed">
                                            Av. Zihuatanejo Pte. 12, Centro<br />
                                            40880 Zihuatanejo, Gro., México
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-teal-50 text-teal-600">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Teléfono</h3>
                                        <p className="mt-2 text-gray-600">+52 55 1234 5678</p>
                                        <p className="text-sm text-gray-500 mt-1">Lun - Vie: 9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-teal-50 text-teal-600">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                                        <p className="mt-2 text-gray-600">contacto@propiel.com</p>
                                        <p className="text-sm text-gray-500 mt-1">Respuesta en 24 horas</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100">
                            <div className="flex items-center mb-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-teal-600 text-white">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 ml-4">
                                    Horario de Atención
                                </h3>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between items-center py-2 border-b border-teal-200">
                                    <span className="font-medium">Lunes - Viernes:</span>
                                    <span className="font-semibold text-teal-700">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-teal-200">
                                    <span className="font-medium">Sábado:</span>
                                    <span className="font-semibold text-teal-700">10:00 AM - 2:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium">Domingo:</span>
                                    <span className="text-gray-500">Cerrado</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Envíanos un Mensaje
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                    placeholder="+52 123 456 7890"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensaje
                                </label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                                    placeholder="¿En qué podemos ayudarte?"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center px-6 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <Send className="h-5 w-5 mr-2" />
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

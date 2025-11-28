import React from 'react';

export function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-teal-600 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Cuidamos tu piel, cuidamos de ti
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-teal-100">
                            En Propiel, combinamos tecnología avanzada con el toque humano de expertos dermatólogos para ofrecerte la mejor atención.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                            Nuestra Misión
                        </h2>
                        <p className="text-lg text-gray-600">
                            Brindar soluciones dermatológicas integrales y personalizadas, mejorando la calidad de vida de nuestros pacientes a través de diagnósticos precisos y tratamientos efectivos.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                            Nuestra Visión
                        </h2>
                        <p className="text-lg text-gray-600">
                            Ser la clínica dermatológica líder en innovación y atención al paciente, reconocida por nuestra excelencia médica y compromiso ético.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-teal-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Nuestros Expertos
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Conoce al equipo médico dedicado a tu salud.
                        </p>
                    </div>
                    <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {/* Expert 1 */}
                        <li>
                            <div className="flex flex-col items-center">
                                <div className="h-40 w-40 rounded-full bg-gray-300 mb-4 overflow-hidden">
                                    <img src="https://via.placeholder.com/160" alt="Dra. Ana García" className="h-full w-full object-cover" />
                                </div>
                                <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">Dra. Ana García</h3>
                                <p className="text-sm font-semibold leading-6 text-teal-600">Dermatóloga Clínica</p>
                            </div>
                        </li>
                        {/* Expert 2 */}
                        <li>
                            <div className="flex flex-col items-center">
                                <div className="h-40 w-40 rounded-full bg-gray-300 mb-4 overflow-hidden">
                                    <img src="https://via.placeholder.com/160" alt="Dr. Carlos Ruiz" className="h-full w-full object-cover" />
                                </div>
                                <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">Dr. Carlos Ruiz</h3>
                                <p className="text-sm font-semibold leading-6 text-teal-600">Cirujano Dermatológico</p>
                            </div>
                        </li>
                        {/* Expert 3 */}
                        <li>
                            <div className="flex flex-col items-center">
                                <div className="h-40 w-40 rounded-full bg-gray-300 mb-4 overflow-hidden">
                                    <img src="https://via.placeholder.com/160" alt="Dra. Elena Torres" className="h-full w-full object-cover" />
                                </div>
                                <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">Dra. Elena Torres</h3>
                                <p className="text-sm font-semibold leading-6 text-teal-600">Dermatología Estética</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

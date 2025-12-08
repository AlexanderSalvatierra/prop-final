import { Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Activity, Star, HeartPulse, MapPin, Phone, Mail } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">

      {/* --- HERO SECTION --- */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">

            {/* Diagonal Shape */}
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Propiel Dermatología</span>{' '}
                  <span className="block text-teal-600 xl:inline">Cuidado experto para tu piel</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Conectamos pacientes con los mejores dermatólogos. Agenda tu cita hoy mismo y comienza tu camino hacia una piel saludable y radiante con tecnología de vanguardia.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Agendar cita
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#nosotros"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 md:py-4 md:text-lg transition-colors"
                    >
                      Conoce más
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Doctor dermatologist checking patient skin"
          />
        </div>
      </div>

      {/* --- ABOUT US SECTION --- */}
      <section id="nosotros" className="py-16 bg-white overflow-hidden lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Medical team discussion"
                />
                <div className="absolute inset-0 bg-teal-600 mix-blend-multiply opacity-20"></div>
              </div>
            </div>

            <div className="relative mt-10 lg:mt-0">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                Sobre Nosotros
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                En Clínica Dermatológica Pro Piel, nos dedicamos a ofrecer un servicio integral y personalizado. Nuestro equipo de especialistas está altamente calificado para tratar cualquier afección de la piel, utilizando las técnicas más avanzadas y seguras.
              </p>

              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                      <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Seguridad y Confianza</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Todos nuestros especialistas están certificados y verificados para tu tranquilidad.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                      <HeartPulse className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Atención Humanizada</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Creemos en el trato cálido y cercano. Tu bienestar es nuestra prioridad.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION (Preview) --- */}
      <section id="servicios" className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative text-center">
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Nuestros Servicios
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              Soluciones dermatológicas completas adaptadas a tus necesidades.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-8">
            {[
              { title: 'Dermatología Clínica', desc: 'Diagnóstico y tratamiento de enfermedades de la piel.', icon: ShieldCheck },
              { title: 'Agenda Inteligente', desc: 'Gestiona tus citas médicas fácilmente, 24/7.', icon: Calendar },
              { title: 'Seguimiento Continuo', desc: 'Historial médico digital y recordatorios.', icon: Activity },
            ].map((item, index) => (
              <div key={index} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 mt-6 lg:mt-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-teal-50 text-teal-600 mx-auto mb-6">
                  <item.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-base text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA to Services Page */}
          <div className="mt-12 text-center">
            <Link
              to="/servicios"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS SECTION (Preview) --- */}
      <section id="testimonios" className="py-16 bg-white overflow-hidden lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Lo que dicen nuestros pacientes
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              Testimonios reales de personas que confiaron en nosotros para el cuidado de su piel.
            </p>
          </div>

          <div className="mt-12 lg:mt-16 grid gap-8 lg:grid-cols-3">
            {/* Testimonio 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                  alt="María González"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">María González</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Excelente atención y profesionalismo. El Dr. Ramírez me ayudó con mi problema de acné y los resultados han sido increíbles."
              </p>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                  alt="Carlos Méndez"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Carlos Méndez</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "La plataforma es muy fácil de usar y agendar citas es súper rápido. El seguimiento médico digital es excelente."
              </p>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                  alt="Ana Martínez"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Ana Martínez</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Me encanta la atención personalizada. Los especialistas son muy profesionales y siempre están dispuestos a ayudar."
              </p>
            </div>
          </div>

          {/* CTA to Testimonials Page */}
          <div className="mt-12 text-center">
            <Link
              to="/testimonios"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 transition-colors"
            >
              Ver más testimonios
            </Link>
          </div>
        </div>
      </section>

      {/* --- CONTACTO SECTION (Preview) --- */}
      <section id="contacto" className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Contáctanos
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Address */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-teal-50 text-teal-600 mx-auto mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Dirección</h4>
                <p className="text-sm text-gray-600">
                  Av. Zihuatanejo Pte. 12<br />
                  Zihuatanejo, Gro.
                </p>
              </div>

              {/* Phone */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-teal-50 text-teal-600 mx-auto mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Teléfono</h4>
                <p className="text-sm text-gray-600">+52 55 1234 5678</p>
              </div>

              {/* Email */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-teal-50 text-teal-600 mx-auto mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                <p className="text-sm text-gray-600">contacto@propiel.com</p>
              </div>
            </div>

            {/* CTA to Contact Page */}
            <div className="text-center">
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Ir a Contacto
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
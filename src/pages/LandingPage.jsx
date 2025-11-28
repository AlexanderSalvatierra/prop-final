import { Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Activity, Star, UserCheck, HeartPulse } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-teal-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Medical background"
          />
          <div className="absolute inset-0 bg-teal-900 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Cuidado Dermatológico <br className="hidden sm:block" />
            <span className="text-teal-200">Integral y Moderno</span>
          </h1>
          <p className="mt-6 text-xl text-teal-100 max-w-3xl">
            Propiel conecta pacientes con especialistas de primer nivel. Gestiona tus citas, historial médico y tratamientos en una plataforma segura y fácil de usar.
          </p>
          <div className="mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-start">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                to="/login"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-teal-900 bg-white hover:bg-teal-50 sm:px-8"
              >
                Comenzar Ahora
              </Link>
              <Link
                to="/conocenos"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
              >
                Saber Más
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- SERVICES SECTION --- */}
      <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Nuestros Servicios
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Tecnología y experiencia médica al servicio de tu piel.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mx-auto">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Dermatología Clínica</h3>
                <p className="mt-2 text-base text-gray-500">
                  Diagnóstico y tratamiento de enfermedades de la piel, pelo y uñas con los más altos estándares.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mx-auto">
                <Calendar className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Agenda Inteligente</h3>
                <p className="mt-2 text-base text-gray-500">
                  Reserva, reprograma y gestiona tus citas médicas desde cualquier dispositivo, 24/7.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mx-auto">
                <Activity className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Seguimiento Continuo</h3>
                <p className="mt-2 text-base text-gray-500">
                  Historial médico digital y recordatorios personalizados para asegurar el éxito de tu tratamiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-12 bg-white overflow-hidden md:py-20 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10">
              Lo que dicen nuestros pacientes
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

              {/* Testimonio 1 */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-600 italic mb-6">
                  "Increíble atención. Pude agendar mi cita en segundos y el recordatorio me salvó de olvidarla. ¡Muy recomendado!"
                </p>
                <div className="flex items-center justify-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 font-bold">
                      MC
                    </div>
                  </div>
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium text-gray-900">María C.</div>
                    <div className="text-sm text-gray-500">Paciente</div>
                  </div>
                </div>
              </div>

              {/* Testimonio 2 */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-gray-600 italic mb-6">
                  "La plataforma es muy intuitiva. Me encanta poder ver mi historial y recetas desde mi celular."
                </p>
                <div className="flex items-center justify-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                      JR
                    </div>
                  </div>
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium text-gray-900">Juan R.</div>
                    <div className="text-sm text-gray-500">Paciente</div>
                  </div>
                </div>
              </div>

              {/* Testimonio 3 */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-gray-300 fill-current" />
                </div>
                <p className="text-gray-600 italic mb-6">
                  "Excelente servicio de los especialistas. La app facilita mucho la comunicación y el seguimiento."
                </p>
                <div className="flex items-center justify-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
                      AL
                    </div>
                  </div>
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium text-gray-900">Ana L.</div>
                    <div className="text-sm text-gray-500">Paciente</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER SIMPLE --- */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; 2024 Propiel. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
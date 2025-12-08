// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout'; // El layout privado (con sidebar)

// Componente Guardián
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas Públicas
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage'; // Import RegisterPage
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { TestimonialsPage } from './pages/public/TestimonialsPage';
import { ContactPage } from './pages/public/ContactPage';

// Páginas Privadas (Dashboard y otras)
import { DashboardPage } from './pages/DashboardPage';
import { PatientListPage } from './pages/PatientListPage';
import { PatientFormPage } from './pages/PatientFormPage';
import { AppointmentBookingPage } from './pages/AppointmentBookingPage';
import { MyAppointmentsPage } from './pages/MyAppointmentsPage';
import { PatientDetailsPage } from './pages/PatientDetailsPage';
import { MyMedicalHistoryPage } from './pages/MyMedicalHistoryPage';
import { MyPaymentsPage } from './pages/MyPaymentsPage';
import { MyPrescriptionsPage } from './pages/MyPrescriptionsPage';
import { ProfilePage } from './pages/ProfilePage';
// (Puedes crear más páginas como 'ConocenosPage', 'ContactoPage', etc.)

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>

        {/* --- RUTAS PÚBLICAS --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/galeria" element={<GalleryPage />} />
          <Route path="/testimonios" element={<TestimonialsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* New Route */}
          <Route path="/conocenos" element={<AboutPage />} />
        </Route>

        {/* --- RUTAS PRIVADAS (Protegidas) --- */}
        <Route element={<ProtectedRoute />}> {/* 👈 El Guardián Principal (Auth + Provider) */}
          <Route element={<AppLayout />}> {/* 👈 El layout con Sidebar */}

            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Rutas (links) que solo verá el Especialista */}
            <Route element={<ProtectedRoute allowedRoles={['specialist']} withProvider={false} />}>
              <Route path="/pacientes" element={<PatientListPage />} />
              <Route path="/pacientes/nuevo" element={<PatientFormPage />} />
              <Route path="/pacientes/editar/:id" element={<PatientFormPage />} />
              <Route path="/pacientes/:id" element={<PatientDetailsPage />} />
            </Route>

            {/* Rutas (links) que solo verá el Paciente */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} withProvider={false} />}>
              <Route path="/agendar" element={<AppointmentBookingPage />} />
              <Route path="/mis-citas" element={<MyAppointmentsPage />} />
              <Route path="/mi-historial" element={<MyMedicalHistoryPage />} />
              <Route path="/mis-pagos" element={<MyPaymentsPage />} />
              <Route path="/mis-recetas" element={<MyPrescriptionsPage />} />
            </Route>
            <Route path="/mis-pagos" element={<MyPaymentsPage />} />
          </Route>

          <Route path="/perfil" element={<ProfilePage />} />

        </Route>


      </Routes >
    </>
  );
}


export default App;
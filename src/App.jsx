// src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout'; // El layout privado (con sidebar)

// Componente Guardián
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas Públicas
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

// Páginas Privadas (Dashboard y otras)
import { DashboardPage } from './pages/DashboardPage';
import { PatientListPage } from './pages/PatientListPage';
import { PatientFormPage } from './pages/PatientFormPage';
// (Puedes crear más páginas como 'ConocenosPage', 'ContactoPage', etc.)

function App() {
  return (
    <Routes>
      
      {/* --- RUTAS PÚBLICAS --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/conocenos" element={<ConocenosPage />} /> */}
        {/* <Route path="/contacto" element={<ContactoPage />} /> */}
      </Route>

      {/* --- RUTAS PRIVADAS (Protegidas) --- */}
      <Route element={<ProtectedRoute />}> {/* 👈 El Guardián */}
        <Route element={<AppLayout />}> {/* 👈 El layout con Sidebar */}
          
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Rutas (links) que solo verá el Especialista */}
          <Route path="/pacientes" element={<PatientListPage />} />
          <Route path="/pacientes/nuevo" element={<PatientFormPage />} />
          <Route path="/pacientes/editar/:id" element={<PatientFormPage />} />
          
          {/* Rutas (links) que solo verá el Paciente */}
          {/* <Route path="/mis-citas" element={<MisCitasPage />} /> */}
          {/* <Route path="/mi-perfil" element={<MiPerfilPage />} /> */}

        </Route>
      </Route>

    </Routes>
  );
}

export default App;
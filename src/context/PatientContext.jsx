// src/context/PatientContext.jsx

import { createContext, useContext, useState } from 'react';
import { mockPatients } from '../data/mockPatients'; // Los crearemos en el paso 3

// 1. Crear el Contexto
const PatientContext = createContext();

// 2. Crear el Proveedor (El que maneja el estado)
export function PatientProvider({ children }) {
  const [patients, setPatients] = useState(mockPatients);

  // --- Funciones CRUD ---

  const addPatient = (patient) => {
    // Generamos un ID simple (en un app real, lo haría el backend)
    const newPatient = { ...patient, id: crypto.randomUUID() };
    setPatients([...patients, newPatient]);
  };

  const deletePatient = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este paciente?")) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const updatePatient = (id, updatedPatient) => {
    setPatients(
      patients.map(p => (p.id === id ? { ...p, ...updatedPatient } : p))
    );
  };
  
  const getPatientById = (id) => {
    return patients.find(p => p.id === id);
  };

  // 3. Valor que compartiremos
  const value = {
    patients,
    addPatient,
    deletePatient,
    updatePatient,
    getPatientById,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}

// 4. Custom Hook (para consumir el contexto fácilmente)
export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients debe ser usado dentro de un PatientProvider');
  }
  return context;
}
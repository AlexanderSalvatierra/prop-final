// src/context/PatientContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { toast } from 'react-hot-toast';

// 1. Crear el Contexto
const PatientContext = createContext();

// 2. Crear el Proveedor (El que maneja el estado)
export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar pacientes al iniciar
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        setPatients(data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // --- Funciones CRUD ---

  const addPatient = async (patient) => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .insert([patient])
        .select();

      if (error) throw error;

      // Actualizamos el estado local con el nuevo paciente (que ya trae su ID)
      if (data) {
        setPatients([...patients, data[0]]);
        toast.success("Paciente agregado correctamente");
      }
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error adding patient:', err);
      setError(err.message);
      toast.error("Error al agregar paciente: " + err.message);
      return { success: false, error: err.message };
    }
  };

  const deletePatient = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este paciente?")) {
      try {
        const { error } = await supabase
          .from('pacientes')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Actualizamos estado local
        setPatients(patients.filter(p => p.id !== id));
        toast.success("Paciente eliminado correctamente");
        return { success: true };
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError(err.message);
        toast.error("Error al eliminar paciente: " + err.message);
        return { success: false, error: err.message };
      }
    }
  };

  const updatePatient = async (id, updatedPatient) => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .update(updatedPatient)
        .eq('id', id)
        .select();

      if (error) throw error;

      // Actualizamos estado local
      if (data) {
        setPatients(
          patients.map(p => (p.id === id ? data[0] : p))
        );
        toast.success("Paciente actualizado correctamente");
      }
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error updating patient:', err);
      setError(err.message);
      toast.error("Error al actualizar paciente: " + err.message);
      return { success: false, error: err.message };
    }
  };

  const getPatientById = (id) => {
    // Buscamos en el estado local que ya debería estar cargado
    // Nota: Si se navega directamente a una URL de detalle y no se han cargado,
    // esto podría ser undefined momentáneamente hasta que termine el useEffect.
    // Para una app más robusta, se podría hacer fetch individual si no existe.
    return patients.find(p => p.id === id || p.id === parseInt(id));
  };

  // 3. Valor que compartiremos
  const value = {
    patients,
    loading,
    error,
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
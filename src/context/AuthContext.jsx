// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. INICIALIZACIÓN "PEREZOSA":
  // En lugar de empezar en null, revisamos si ya hay algo guardado en el navegador.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('propiel_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Efecto para sincronizar el estado con LocalStorage automáticamente
  useEffect(() => {
    if (user) {
      localStorage.setItem('propiel_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('propiel_user');
    }
  }, [user]);

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      // 1. Buscar en Especialistas
      const { data: specData } = await supabase
        .from('especialistas')
        .select('*')
        .eq('email', email)
        .single();

      if (specData) {
        const isMatch = await bcrypt.compare(password, specData.password);
        if (isMatch) {
          const userData = { ...specData, role: 'specialist' };
          setUser(userData); // El useEffect lo guardará en localStorage
          return userData;
        }
      }

      // 2. Buscar en Pacientes
      const { data: patData } = await supabase
        .from('pacientes')
        .select('*')
        .eq('email', email)
        .single();

      if (patData) {
        const isMatch = await bcrypt.compare(password, patData.password);
        if (isMatch) {
          const userData = { ...patData, role: 'patient' };
          setUser(userData); // El useEffect lo guardará en localStorage
          return userData;
        }
      }

      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setUser(null);
    // El useEffect se encarga de borrar el localStorage automáticamente
    // pero si quieres ser explícito, la línea de abajo asegura limpieza inmediata:
    localStorage.removeItem('propiel_user');
  };

  // --- REGISTER ---
  const register = async ({ email, password, nombre, role, sexo, especialidad }) => {
    try {
      let resultData = null;
      const hashedPassword = await bcrypt.hash(password, 10);

      if (role === 'patient') {
        const { data, error } = await supabase
          .from('pacientes')
          .insert([{
            email,
            password: hashedPassword,
            nombre,
            sexo,
            telefono: 'Sin registrar',
            fecha_nacimiento: '2000-01-01'
          }])
          .select()
          .single();

        if (error) throw error;
        resultData = { ...data, role: 'patient' };

      } else if (role === 'specialist') {
        const { data, error } = await supabase
          .from('especialistas')
          .insert([{
            email,
            password: hashedPassword,
            nombre,
            especialidad,
            cedula: 'PENDIENTE'
          }])
          .select()
          .single();

        if (error) throw error;
        resultData = { ...data, role: 'specialist' };
      }

      if (resultData) {
        setUser(resultData); // Se guardará y persistirá
        return resultData;
      }

    } catch (error) {
      console.error("Register error:", error.message);
      return null;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
}
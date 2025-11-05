// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = no logueado

  // --- Funciones de Auth (Simuladas) ---

  // Esta función simula el login.
  // En el futuro, aquí llamarías a tu backend.
  const login = (email, password) => {
    // LÓGICA SIMULADA
    if (email === 'especialista@propiel.com' && password === '123') {
      const mockUser = { id: 1, email, role: 'specialist' };
      setUser(mockUser);
      return mockUser; // Retornamos el usuario en éxito
    }
    if (email === 'paciente@propiel.com' && password === '123') {
      const mockUser = { id: 2, email, role: 'patient' };
      setUser(mockUser);
      return mockUser; // Retornamos el usuario en éxito
    }
    
    // Si falla
    setUser(null);
    return null;
  };

  const logout = () => {
    setUser(null);
    // Aquí también podrías redirigir al login
  };

  // 3. Valor
  const value = {
    user, // El objeto de usuario { id, email, role }
    isAuthenticated: !!user, // Un booleano rápido para saber si está logueado
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
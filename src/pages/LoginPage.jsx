// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle para Login/Registro

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // De dónde venía el usuario (para redirigirlo allí después del login)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores

    // Simulación de Registro (en modo frontend, solo logueamos)
    if (!isLogin) {
      // Aquí iría tu lógica de 'register'
      // Por ahora, solo diremos que se registre y luego inicie sesión
      alert('Función de registro no implementada. Usa las credenciales de prueba.');
      setIsLogin(true); // Volver al login
      return;
    }

    // Lógica de Login
    try {
      const user = login(email, password); // Llama al login simulado
      
      if (user) {
        navigate(from, { replace: true }); // Redirigir al dashboard
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-lime-500 focus:border-lime-500"
                placeholder="Email (prueba: paciente@propiel.com)"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-lime-500 focus:border-lime-500"
                placeholder="Contraseña (prueba: 123)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
            >
              {isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-lime-600 hover:text-lime-500"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
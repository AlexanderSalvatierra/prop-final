import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [role, setRole] = useState('patient'); // 'patient' o 'specialist'

  // Estados para los campos obligatorios de ENUM
  const [sexo, setSexo] = useState('Masculino'); // Valor por defecto válido
  const [especialidad, setEspecialidad] = useState('Dermatologo'); // Valor por defecto válido

  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // --- Lógica de Login ---
        const user = await login(email, password);
        if (user) navigate(from, { replace: true });
        else setError('Credenciales incorrectas o usuario no encontrado.');
      } else {
        // --- Lógica de Registro (Sign Up) ---
        // Preparamos los datos extra dependiendo del rol
        const additionalData = role === 'patient'
          ? { sexo }
          : { especialidad };

        // 👇 AQUÍ ESTABA EL ERROR: Agregamos 'password' al objeto
        const user = await register({
          email,
          password, // <--- IMPORTANTE: Ahora enviamos la contraseña
          nombre,
          role,
          ...additionalData
        });

        if (user) navigate(from, { replace: true });
        else setError('Error al registrar. Verifica los datos.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error. ' + err.message);
    }
  };

  // Lógica del Modal "Olvidé mi contraseña"
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    // Simulación de envío
    import('react-hot-toast').then(({ toast }) => {
      toast.success("Se ha enviado un enlace de recuperación a tu correo.");
    });
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-teal-800">
            {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

          {/* --- CAMPOS DE REGISTRO --- */}
          {!isLogin && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Soy:</label>
                <div className="mt-1 flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="patient"
                      checked={role === 'patient'}
                      onChange={() => setRole('patient')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-gray-700">Paciente</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="specialist"
                      checked={role === 'specialist'}
                      onChange={() => setRole('specialist')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-gray-700">Especialista</span>
                  </label>
                </div>
              </div>

              {/* SELECTOR DINÁMICO SEGÚN ROL */}
              {role === 'patient' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexo</label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                  <select
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Dermatologo">Dermatólogo</option>
                    <option value="Podologo">Podólogo</option>
                    <option value="Tamizologo">Tamizólogo</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* --- CAMPOS COMUNES (LOGIN Y REGISTRO) --- */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* ENLACE OLVIDÉ CONTRASEÑA (SOLO LOGIN) */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm font-medium text-teal-600 hover:text-teal-500"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>

      {/* MODAL DE RECUPERACIÓN */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Recuperar Contraseña</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <form onSubmit={handleForgotSubmit}>
              <input
                type="email"
                required
                placeholder="ejemplo@correo.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-teal-500 focus:border-teal-500"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
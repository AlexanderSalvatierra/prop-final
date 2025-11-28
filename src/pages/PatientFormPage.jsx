// src/pages/PatientFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';

// Estado inicial del formulario
const initialState = {
  nombre: '',
  email: '',
  telefono: '',
  fecha_nacimiento: '',
  sexo: 'Masculino',
  proximaCita: '',
  notas: '',
};

export function PatientFormPage() {
  const { id } = useParams(); // Obtiene el 'id' de la URL si existe
  const navigate = useNavigate(); // Para redirigir después de guardar
  const { addPatient, updatePatient, getPatientById } = usePatients();

  const [formData, setFormData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      // Modo Edición
      const patient = getPatientById(id);
      if (patient) {
        setFormData(patient);
        setIsEditing(true);
      } else {
        // Si el ID es inválido, redirigir
        navigate('/pacientes');
      }
    } else {
      // Modo Creación
      setFormData(initialState);
      setIsEditing(false);
    }
  }, [id, getPatientById, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas de frontend
    if (!formData.nombre || !formData.email || !formData.fecha_nacimiento) {
      alert("Por favor completa los campos obligatorios (Nombre, Email, Fecha Nacimiento)");
      return;
    }

    // --- SANITIZACIÓN DE DATOS (EL FIX) ---
    // Creamos una copia de los datos para limpiarlos
    const dataToSend = { ...formData };

    // Regla de Oro: Si una fecha es un string vacío, conviértela a NULL
    if (dataToSend.proximaCita === '') {
      dataToSend.proximaCita = null;
    }

    // Nota: fecha_nacimiento es obligatoria en tu DB, así que no deberíamos
    // convertirla a null, sino obligar al usuario a llenarla (con el if de arriba).

    // --- ENVIAR ---
    if (isEditing) {
      updatePatient(id, dataToSend);
    } else {
      addPatient(dataToSend);
    }

    // Redirigir
    navigate('/pacientes');
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-teal-500 ${errors.nombre
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-teal-500'
                }`}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-teal-500 ${errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-teal-500'
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              id="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              id="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required // 👈 Hacemos que el navegador también lo exija
            />
          </div>
          <div>
            <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
              Sexo
            </label>
            <select
              name="sexo"
              id="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3 bg-white"
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <div>
            <label htmlFor="proximaCita" className="block text-sm font-medium text-gray-700">
              Próxima Cita
            </label>
            <input
              type="date"
              name="proximaCita"
              id="proximaCita"
              value={formData.proximaCita}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
              Notas Médicas
            </label>
            <textarea
              name="notas"
              id="notas"
              rows="4"
              value={formData.notas}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/pacientes')}
              className="px-6 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              {isEditing ? 'Actualizar Paciente' : 'Guardar Paciente'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
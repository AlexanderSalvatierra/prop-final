// src/pages/PatientFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';

// Estado inicial del formulario
const initialState = {
  nombre: '',
  email: '',
  telefono: '',
  proximaCita: '',
  notas: '',
};

export function PatientFormPage() {
  const { id } = useParams(); // Obtiene el 'id' de la URL si existe
  const navigate = useNavigate(); // Para redirigir después de guardar
  const { addPatient, updatePatient, getPatientById } = usePatients();

  const [formData, setFormData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí iría la validación de datos
    if (!formData.nombre || !formData.email) {
      alert("Nombre y Email son obligatorios.");
      return;
    }

    if (isEditing) {
      updatePatient(id, formData);
    } else {
      addPatient(formData);
    }

    // Redirigir a la lista de pacientes
    navigate('/pacientes');
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
        <form onSubmit={handleSubmit} className="space-y-6">
          
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
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
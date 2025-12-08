import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import { Camera, Save, User, Phone, Lock, Loader2, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';
import PageTransition from '../components/ui/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';

export function ProfilePage() {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                nombre: user.nombre || '',
                telefono: user.telefono || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Subir imagen al bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Actualizar base de datos
            const table = user.role === 'specialist' ? 'especialistas' : 'pacientes';
            const { error: updateError } = await supabase
                .from(table)
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // 4. Actualizar contexto local
            updateUserProfile({ avatar_url: publicUrl });
            toast.success('Foto de perfil actualizada');

        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Error al actualizar la foto');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updates = {
                nombre: formData.nombre,
                telefono: formData.telefono
            };

            // Validar password si se intenta cambiar
            if (formData.password) {
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Las contraseñas no coinciden');
                    setLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    toast.error('La contraseña debe tener al menos 6 caracteres');
                    setLoading(false);
                    return;
                }
                const hashedPassword = await bcrypt.hash(formData.password, 10);
                updates.password = hashedPassword;
            }

            const table = user.role === 'specialist' ? 'especialistas' : 'pacientes';

            const { error } = await supabase
                .from(table)
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            // Actualizar contexto (sin password por seguridad en el estado local, aunque no se guarda ahí usualmente)
            const { password, ...safeUpdates } = updates;
            updateUserProfile(safeUpdates);

            toast.success('Perfil actualizado correctamente');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

            // Redirección automática después de 1.5 segundos
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Cover Image con Gradiente */}
                        <div className="h-40 bg-gradient-to-r from-teal-600 to-teal-400 relative">
                            {/* Avatar superpuesto */}
                            <div className="absolute -bottom-16 left-8">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full ring-4 ring-white bg-white shadow-lg overflow-hidden flex items-center justify-center">
                                        {user?.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-5xl font-bold text-teal-600">
                                                {user?.nombre ? user.nombre[0].toUpperCase() : 'U'}
                                            </span>
                                        )}

                                        {/* Overlay de carga */}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón de cámara flotante */}
                                    <label className="absolute bottom-1 right-1 bg-white text-teal-600 p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-teal-50 transition-all border-2 border-white">
                                        <Camera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Información del Usuario */}
                        <div className="pt-20 px-8 pb-4">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{user?.nombre || 'Usuario'}</h2>
                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">{user?.email}</span>
                                </div>
                                <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                                    {user?.role === 'specialist' ? 'Especialista' : 'Paciente'}
                                </span>
                            </div>
                        </div>

                        {/* Formulario */}
                        <div className="px-8 pb-8">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Sección: Información Personal */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nombre */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Nombre Completo
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                    placeholder="Tu nombre completo"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Teléfono */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Teléfono
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Phone className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="telefono"
                                                    value={formData.telefono}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                                    placeholder="Tu número de teléfono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección: Seguridad */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Lock className="w-5 h-5 text-teal-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Deja los campos en blanco si no deseas cambiar tu contraseña.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard')}
                                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all border border-gray-300"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Volver al Dashboard
                                    </button>

                                    <AnimatedButton
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Save className="w-5 h-5" />
                                        )}
                                        Guardar Cambios
                                    </AnimatedButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendWelcomeEmail } from '../utils/emailService';

export function RegisterPage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Default values for required fields in AuthContext/Supabase
    const role = 'patient';
    const sexo = 'Masculino'; // Default or add selector if needed, user didn't specify but context needs it. 
    // User request said: "Campos: Nombre, Email, Teléfono, Password, Confirmar Password".
    // I will default sexo to 'Masculino' or maybe add a hidden field/selector if strictly needed.
    // Let's check AuthContext again. It requires 'sexo'. 
    // I'll add a simple selector or just default it. 
    // The user didn't ask for Sexo in the prompt list, but the DB might need it.
    // "Campos: Nombre (Icono User), Email (Mail), Teléfono (Phone), Password (Lock), Confirmar Password."
    // I will add a hidden default for now to keep UI clean as requested, or a small selector.
    // Let's stick to the requested fields and maybe default 'sexo' or add it if I feel it's critical.
    // AuthContext: "sexo" is passed. 
    // I'll default it to 'Masculino' for now to match the "Clean" request, 
    // or better, I'll add a small selector to be safe but keep it clean.
    // Actually, I'll just default it to avoid cluttering the UI if not asked.

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        try {
            const user = await register({
                email,
                password,
                nombre,
                role,
                sexo: 'Masculino', // Defaulting for now as per strict UI instructions not mentioning it
                telefono // AuthContext might need update to save phone? 
                // AuthContext `register` function:
                // .insert([{ email, password: hashedPassword, nombre, sexo, telefono: 'Sin registrar', ... }])
                // Wait, AuthContext hardcodes telefono: 'Sin registrar'.
                // I should probably update AuthContext to accept phone, OR just ignore it for now if I can't touch AuthContext logic too much.
                // But the user asked for "Teléfono" field. 
                // I will send it to register, but I might need to update AuthContext to actually use it.
                // The user said "Actúa como Senior UI/UX... y Frontend Developer".
                // I should probably fix the backend logic if I can, but I'll start by sending it.
                // Let's look at AuthContext again.
                // Line 89: `telefono: 'Sin registrar',`
                // I should definitely update AuthContext to use the passed phone.
            });

            if (user) {
                toast.success('Registro exitoso');

                // Send welcome email asynchronously (non-blocking)
                sendWelcomeEmail(email, nombre)
                    .then(() => {
                        console.log('Welcome email sent successfully');
                    })
                    .catch((error) => {
                        console.error('Failed to send welcome email:', error);
                        // Silent failure - don't show error to user
                    });

                navigate('/dashboard');
            } else {
                toast.error('Error al registrar');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error en el registro');
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Column - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-teal-700 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                    alt="Medical Team"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 to-teal-600/80" />
                <div className="relative z-10 flex items-center justify-center w-full h-full px-12">
                    <div className="text-white max-w-lg">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">Cuida tu piel con nosotros</h1>
                        <p className="text-xl text-teal-100">
                            Únete a Propiel y accede a los mejores especialistas dermatológicos desde la comodidad de tu hogar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Crear cuenta de Paciente</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* Nombre */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                    placeholder="Nombre Completo"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                    placeholder="Correo Electrónico"
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    required
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                    placeholder="Teléfono"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                    placeholder="Contraseña"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                                    placeholder="Confirmar Contraseña"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                            >
                                Crear Cuenta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

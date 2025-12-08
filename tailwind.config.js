/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // En Tailwind 4, para activar el modo oscuro por clase, se usa 'selector'
    // (En versiones anteriores era 'class', pero 'selector' es más preciso ahora)
    darkMode: 'selector',
    theme: {
        extend: {
            // Aquí puedes extender tus colores si quieres
            colors: {
                // Ejemplo: si quisieras un teal específico
                // teal: {
                //   600: '#0d9488',
                // }
            }
        },
    },
    plugins: [],
}
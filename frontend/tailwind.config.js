/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                }
            },
            animation: {
                marquee: 'marquee 50s linear infinite',
            },
            colors: {
                'gusli-bg': '#FFFFFF',
                'gusli-highlight-1': '#F3F4F6', // Lighter gray for pure white contrast
                'gusli-highlight-2': '#12271D', // Dark Green
            },
        },
    },
    plugins: [],
}
